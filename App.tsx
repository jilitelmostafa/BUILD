
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import LinkTable from './components/LinkTable';
import { parseData } from './constants';
import { LinkItem } from './types';

type SortConfig = {
  key: keyof LinkItem | 'sizeBytes';
  direction: 'asc' | 'desc' | null;
};

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'sizeBytes', direction: null });
  
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

  return (
    <div className="min-h-screen flex flex-col pb-12 bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full">
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                placeholder="ابحث بواسطة الرمز (Quadkey) أو المنطقة..."
                className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-gray-700 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl mb-6 text-emerald-900 text-sm">
          <i className="fa-solid fa-circle-info text-emerald-600 text-lg"></i>
          <p>
            تفضل بتحميل ملفات بيانات المباني مباشرة من الجدول أدناه. يمكنك النقر على عناوين الأعمدة لترتيب النتائج.
          </p>
        </div>

        <LinkTable 
          links={filteredLinks} 
          sortConfig={sortConfig}
          onSort={requestSort}
        />
        
        <footer className="mt-12 text-center text-gray-400 text-sm pb-8">
          <p>© {new Date().getFullYear()} Global ML Building Footprints Data - Morocco</p>
        </footer>
      </main>
    </div>
  );
};

export default App;