
import React, { useState, useMemo } from 'react';
import { LinkItem } from '../types';

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: LinkItem[];
  onConfirm: (selectedItems: LinkItem[]) => void;
  isDownloading: boolean;
  downloadProgress: { current: number; total: number; errors: number };
}

const SelectionModal: React.FC<SelectionModalProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onConfirm, 
  isDownloading,
  downloadProgress
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(items.map(i => i.quadkey)));
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(item => item.quadkey.includes(searchTerm));
  }, [items, searchTerm]);

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    if (isDownloading) return;
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (isDownloading) return;
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(i => i.quadkey)));
    }
  };

  const handleConfirm = () => {
    const selectedItems = items.filter(item => selectedIds.has(item.quadkey));
    onConfirm(selectedItems);
  };

  const progressPercentage = downloadProgress.total > 0 
    ? Math.round((downloadProgress.current / downloadProgress.total) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <i className="fa-solid fa-file-zipper"></i>
              تجهيز الأرشيف الموحد
            </h2>
            <p className="text-emerald-100 text-sm mt-1">
              تحميل ملفات CSV.GZ (مع روابط بديلة في حال تعذر الجلب المباشر)
            </p>
          </div>
          {!isDownloading && (
            <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
          )}
        </div>

        {isDownloading ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray={377}
                  strokeDashoffset={377 - (377 * progressPercentage) / 100}
                  className="text-emerald-600 transition-all duration-500 ease-out" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-black text-emerald-700">{progressPercentage}%</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">جاري معالجة الملفات...</h3>
              <p className="text-gray-500 mt-2">
                فحص وتحميل ملف {downloadProgress.current} من أصل {downloadProgress.total}
              </p>
              {downloadProgress.errors > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-blue-700 text-xs font-bold leading-relaxed">
                    ملاحظة: تعذر تحميل {downloadProgress.errors} ملفات مباشرة. سيتم تضمين روابط تحميلها اليدوية بدلاً من ذلك.
                  </p>
                </div>
              )}
            </div>
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-gray-100 bg-gray-50 space-y-4">
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  placeholder="ابحث برمز Quadkey..."
                  className="w-full pr-11 pl-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex justify-between items-center">
                <button 
                  onClick={toggleAll}
                  className="text-emerald-600 font-bold text-sm hover:underline flex items-center gap-2"
                >
                  <i className={selectedIds.size === items.length ? "fa-solid fa-square-minus" : "fa-solid fa-square-check"}></i>
                  {selectedIds.size === items.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
                </button>
                <span className="text-gray-500 text-sm font-medium">
                  المختار: <span className="text-emerald-600 font-bold">{selectedIds.size}</span> مربع بيانات
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50">
              {filteredItems.map(item => (
                <div 
                  key={item.quadkey}
                  onClick={() => toggleItem(item.quadkey)}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedIds.has(item.quadkey) 
                    ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                    : 'bg-white border-gray-100 hover:border-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${
                      selectedIds.has(item.quadkey) ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-gray-300'
                    }`}>
                      {selectedIds.has(item.quadkey) && <i className="fa-solid fa-check text-white text-xs"></i>}
                    </div>
                    <div>
                      <div className="font-mono font-bold text-gray-800">{item.quadkey}</div>
                      <div className="text-xs text-gray-500">حجم ملف CSV المتوقع: {item.size}</div>
                    </div>
                  </div>
                  <div className="text-emerald-600">
                    <i className="fa-solid fa-file-csv"></i>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-100 bg-white flex gap-4">
              <button 
                onClick={handleConfirm}
                disabled={selectedIds.size === 0}
                className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg transition-all ${
                  selectedIds.size > 0 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200/50' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <i className="fa-solid fa-cloud-arrow-down"></i>
                بدء تحميل المجموعة المختارة ({selectedIds.size})
              </button>
              <button 
                onClick={onClose}
                className="px-6 py-4 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all"
              >
                إلغاء
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SelectionModal;
