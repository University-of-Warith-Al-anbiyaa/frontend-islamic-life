/**
 * إعدادات معرض الصور المشترك بين النسخ الرابعة والخامسة والسادسة.
 * الصور موجودة فعلياً داخل مجلد public باسم: معرض.jpg ثم معرض2.jpg حتى معرض21.jpg
 */

/**
 * مسار صفحة المعرض المشتركة.
 * لا نستخدم "/gallery" لأن public/gallery ملف فارغ يُنسخ إلى dist ويُقدَّم بدل التطبيق عند فتح الرابط مباشرة.
 */
export const GALLERY_PATH = "/photo-gallery";

/** فهارس النسخ السابقة (داخل t.nav.previousVersions) التي تحتوي على قائمة المعرض: الرابعة والخامسة والسادسة */
export const GALLERY_EDITION_INDEXES: readonly number[] = [3, 4, 5];

export const galleryPhotos = [
	"/معرض.jpg",
	...Array.from({ length: 20 }, (_, index) => `/معرض${index + 2}.jpg`),
];
