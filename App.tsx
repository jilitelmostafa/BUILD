
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import LinkTable from './components/LinkTable';
import SelectionModal from './components/SelectionModal';
import { parseData } from './constants';
import { generateZipBlob, downloadBlob } from './services/zipService';
import { LinkItem } from './types';

type SortConfig = {
  key: keyof LinkItem | 'sizeBytes';
  direction: 'asc' | 'desc' | null;
};

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, errors: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'sizeBytes', direction: null });
  
  const [tableSelectedIds, setTableSelectedIds] = useState<Set<string>>(new Set());
  
  const allLinks = useMemo(() => parseData(), []);

  // دالة لتحويل النص (مثل 12.7MB) إلى أرقام (bytes) للترتيب الدقيق
  const parseSizeToBytes = (sizeStr: string): number => {
    const num = parseFloat(sizeStr);
    if (isNaN(num)) return 0;
    const unit = sizeStr.toUpperCase();
    if (unit.includes('GB')) return num * 1024 * 1024 * 1024;
    if (unit.includes('MB')) return num * 1024 * 1024;
    if (unit.includes('KB')) return num * 1024;
    return num;
  };
  
  const filteredLinks = useMemo(() => {
    let result = allLinks.filter(link => 
      link.quadkey.includes(searchTerm) || 
      link.region.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.direction !== null) {
      result.sort((a, b) => {
        if (sortConfig.key === 'sizeBytes') {
          const sizeA = parseSizeToBytes(a.size);
          const sizeB = parseSizeToBytes(b.size);
          return sortConfig.direction === 'asc' ? sizeA - sizeB : sizeB - sizeA;
        }
        
        const valA = a[sortConfig.key as keyof LinkItem];
        const valB = b[sortConfig.key as keyof LinkItem];
        
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [allLinks, searchTerm, sortConfig]);

  const requestSort = (key: keyof LinkItem | 'sizeBytes') => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const toggleTableSelection = (id: string) => {
    setTableSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllTableSelection = () => {
    if (filteredLinks.every(link => tableSelectedIds.has(link.quadkey))) {
      setTableSelectedIds(new Set());
    } else {
      const next = new Set(tableSelectedIds);
      filteredLinks.forEach(link => next.add(link.quadkey));
      setTableSelectedIds(next);
    }
  };

  const handleDownloadTableSelection = async () => {
    const selectedItems = filteredLinks.filter(link => tableSelectedIds.has(link.quadkey));
    if (selectedItems.length === 0) {
      alert("يرجى تحديد عنصر واحد على الأقل من الجدول.");
      return;
    }
    await processExport(selectedItems);
  };

  const handleDownloadAll = async () => {
    if (filteredLinks.length === 0) return;
    await processExport(filteredLinks);
  };

  const processExport = async (selectedItems: LinkItem[]) => {
    try {
      setIsGenerating(true);
      setProgress({ current: 0, total: selectedItems.length, errors: 0 });
      
      const blob = await generateZipBlob(selectedItems, (current, total) => {
        setProgress({ current, total, errors: 0 });
      });
      
      const dateStr = new Date().toISOString().split('T')[0];
      downloadBlob(blob, `Morocco_Links_Archive_${dateStr}.zip`);
      
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Export failed:", error);
      alert("حدث خطأ أثناء إنشاء الأرشيف.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-12 bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full lg:max-w-md">
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                placeholder="ابحث بواسطة الرمز (Quadkey)..."
                className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-gray-700 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="hidden sm:block bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl text-center min-w-[100px]">
                <span className="block text-[10px] text-emerald-600 font-bold uppercase">المحدد حالياً</span>
                <span className="text-xl font-black text-emerald-800">{tableSelectedIds.size}</span>
              </div>
              
              <button
                onClick={handleDownloadTableSelection}
                disabled={isGenerating || tableSelectedIds.size === 0}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all shadow-md active:scale-95 ${
                  isGenerating || tableSelectedIds.size === 0
                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                    : 'bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 shadow-emerald-100'
                }`}
              >
                <i className="fa-solid fa-file-export"></i>
                تحميل المحدد كـ TXT
              </button>

              <button
                onClick={handleDownloadAll}
                disabled={isGenerating || filteredLinks.length === 0}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${
                  isGenerating || filteredLinks.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200/50'
                }`}
              >
                {isGenerating ? (
                  <>
                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-file-zipper text-xl"></i>
                    تحميل أرشيف الروابط (ZIP)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl mb-6 text-emerald-900 text-sm">
          <i className="fa-solid fa-sort-amount-down text-emerald-600 text-lg"></i>
          <p>
            يمكنك الآن <strong>الترتيب حسب حجم الملف</strong> أو أي عمود آخر بالنقر على عنوان العمود في الجدول.
          </p>
        </div>

        <LinkTable 
          links={filteredLinks} 
          selectedIds={tableSelectedIds} 
          onToggle={toggleTableSelection}
          onToggleAll={toggleAllTableSelection}
          sortConfig={sortConfig}
          onSort={requestSort}
        />
        
        <footer className="mt-12 text-center text-gray-400 text-sm pb-8">
          <p>© {new Date().getFullYear()} بيانات مباني المغرب - نظام الإدارة المتقدم</p>
        </footer>
      </main>

      <SelectionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={filteredLinks}
        onConfirm={processExport}
        isDownloading={isGenerating}
        downloadProgress={progress}
      />
    </div>
  );
};

export default App;
