
import React from 'react';
import { LinkItem } from '../types';

interface LinkTableProps {
  links: LinkItem[];
  sortConfig: { key: string; direction: 'asc' | 'desc' | null };
  onSort: (key: any) => void;
}

const LinkTable: React.FC<LinkTableProps> = ({ 
  links, 
  sortConfig,
  onSort
}) => {
  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <i className="fa-solid fa-sort opacity-30 mr-2"></i>;
    if (sortConfig.direction === 'asc') return <i className="fa-solid fa-sort-up mr-2 text-emerald-600"></i>;
    if (sortConfig.direction === 'desc') return <i className="fa-solid fa-sort-down mr-2 text-emerald-600"></i>;
    return <i className="fa-solid fa-sort opacity-30 mr-2"></i>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100 select-none">
              <th className="px-4 py-5 font-bold text-gray-400 text-xs text-center w-16">
                #
              </th>
              <th 
                className="px-6 py-5 font-bold text-gray-700 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('sizeBytes')}
              >
                <div className="flex items-center">
                  حجم الملف
                  {getSortIcon('sizeBytes')}
                </div>
              </th>
              <th className="px-8 py-5 font-bold text-gray-700 text-sm text-center">
                التحميل المباشر
              </th>
              <th 
                className="px-8 py-5 font-bold text-gray-700 text-sm cursor-pointer hover:bg-gray-100 transition-colors text-left"
                onClick={() => onSort('date')}
              >
                <div className="flex items-center justify-end">
                  تاريخ التحديث
                  {getSortIcon('date')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {links.map((link, idx) => (
              <tr 
                key={`${link.quadkey}-${idx}`} 
                className="hover:bg-emerald-50/20 transition-colors group"
              >
                <td className="px-4 py-5 whitespace-nowrap text-center text-gray-400 font-mono text-xs">
                  {idx + 1}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-file-csv text-emerald-500"></i>
                    <span className={`font-bold text-lg ${parseFloat(link.size) > 10 ? 'text-amber-600' : 'text-gray-700'}`}>
                      {link.size}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    <i className="fa-solid fa-cloud-arrow-down"></i>
                    تحميل الملف (CSV.GZ)
                  </a>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-gray-500 text-sm text-left font-mono">
                  {link.date}
                </td>
              </tr>
            ))}
            {links.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-gray-400">
                  <div className="flex flex-col items-center">
                    <i className="fa-solid fa-inbox text-5xl mb-4 opacity-20"></i>
                    <p className="text-lg">لا توجد ملفات متوفرة حالياً</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LinkTable;
