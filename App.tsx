
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
  
  const sortedLinks = useMemo(() => {
    let result = [...allLinks];

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
  }, [allLinks, sortConfig]);

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
    <div className="min-h-screen flex flex-col pb-12 bg-slate-50 text-right" dir="rtl">
      <Header />
      
      <main className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="flex items-center gap-3 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl mb-8 text-emerald-900 shadow-sm">
          <i className="fa-solid fa-circle-info text-emerald-600 text-2xl"></i>
          <div>
            <h3 className="font-bold text-lg mb-1">تعليمات التحميل</h3>
            <p className="text-sm opacity-90">
              تفضل بتحميل ملفات بيانات المباني مباشرة من الجدول أدناه. يمكنك ترتيب الملفات حسب الحجم أو تاريخ التحديث.
            </p>
          </div>
        </div>

        <LinkTable 
          links={sortedLinks} 
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
