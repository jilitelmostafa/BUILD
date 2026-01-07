
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
    if (sortConfig.key !== key) return <i className="fa-solid fa-sort opacity-30 ml-2"></i>;
    if (sortConfig.direction === 'asc') return <i className="fa-solid fa-sort-up ml-2 text-emerald-600"></i>;
    if (sortConfig.direction === 'desc') return <i className="fa-solid fa-sort-down ml-2 text-emerald-600"></i>;
    return <i className="fa-solid fa-sort opacity-30 ml-2"></i>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100 select-none">
              <th 
                className="px-6 py-4 font-bold text-gray-700 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('region')}
              >
                <div className="flex items-center">
                  {getSortIcon('region')}
                  المنطقة
                </div>
              </th>
              <th 
                className="px-6 py-4 font-bold text-gray-700 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('quadkey')}
              >
                <div className="flex items-center">
                  {getSortIcon('quadkey')}
                  رمز Quadkey
                </div>
              </th>
              <th 
                className="px-6 py-4 font-bold text-gray-700 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('sizeBytes')}
              >
                <div className="flex items-center">
                  {getSortIcon('sizeBytes')}
                  حجم الملف
                </div>
              </th>
              <th className="px-6 py-4 font-bold text-gray-700 text-sm text-center">
                التحميل المباشر
              </th>
              <th 
                className="px-6 py-4 font-bold text-gray-700 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('date')}
              >
                <div className="flex items-center">
                  {getSortIcon('date')}
                  التحديث
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    <span className="text-gray-900 font-medium">{link.region}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs border border-gray-200">
                    {link.quadkey}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`font-bold ${parseFloat(link.size) > 10 ? 'text-red-600' : 'text-gray-600'}`}>
                    {link.size}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-bold text-[12px] transition-all shadow-sm active:scale-95"
                    >
                      <i className="fa-solid fa-cloud-arrow-down"></i>
                      تحميل CSV.GZ
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-[10px]">
                  {link.date}
                </td>
              </tr>
            ))}
            {links.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-gray-400">
                  <div className="flex flex-col items-center">
                    <i className="fa-solid fa-magnifying-glass text-5xl mb-4 opacity-20"></i>
                    <p className="text-lg">لا توجد بيانات تطابق بحثك حالياً</p>
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
