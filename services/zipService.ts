
import JSZip from 'jszip';
import { LinkItem } from '../types';

/**
 * إنشاء ملف ZIP يحتوي على ملفات TXT لكل عنصر محدد
 * كل ملف نصي يحتوي على التفاصيل الكاملة للرابط
 */
export const generateZipBlob = async (
  items: LinkItem[], 
  onProgress?: (current: number, total: number, errors: number) => void
): Promise<Blob> => {
  const zip = new JSZip();
  const folder = zip.folder("Morocco_Buildings_Links_Archive");

  if (!folder) throw new Error("تعذر إنشاء مجلد الأرشيف");

  const total = items.length;
  
  // توليد الملفات النصية محلياً (لا يوجد طلبات شبكة هنا، لذا لن يحدث خطأ Fetch)
  items.forEach((item, index) => {
    const fileContent = `
تفاصيل ملف بيانات المباني - المغرب
----------------------------------
المنطقة: ${item.region}
رمز المربع (Quadkey): ${item.quadkey}
رابط التحميل المباشر: ${item.url}
الحجم التقريبي: ${item.size}
تاريخ التحديث: ${item.date}

ملاحظة: يمكنك نسخ الرابط أعلاه ولصقه في المتصفح للتحميل المباشر في حال واجهت قيوداً.
    `.trim();

    folder.file(`${item.quadkey}.txt`, fileContent);
    
    if (onProgress) {
      onProgress(index + 1, total, 0);
    }
  });

  // توليد ملف الأرشيف
  return await zip.generateAsync({ 
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 9 }
  });
};

/**
 * تفعيل تحميل الملف في المتصفح
 */
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
