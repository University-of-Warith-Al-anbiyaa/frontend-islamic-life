import shrineLogo from '../../شعار العتبة.png'
import universityLogo from '../../شعار وارث.png'

/**
 * الجهات الداعمة والجهة الأكاديمية المُقيِّمة في الصفحة الرئيسية.
 *
 * لإضافة شعار جديد:
 * 1) ضع ملف الصورة داخل: public/images/sponsors/
 *    (الأفضل PNG بخلفية شفافة، بحجم تقريبي 500×260)
 * 2) أضف عنصرًا جديدًا هنا واكتب اسم الملف في logo بهذا الشكل: '/images/sponsors/اسم-الملف.png'
 * 3) أضف url لموقع الجهة (اختياري) — إن تُرك فارغًا لن تكون الصورة قابلة للنقر.
 *
 * استخدم شعار الجهة الداعمة فقط؛ الجهة المُقيِّمة تُعرض ببطاقة أكاديمية مميزة.
 */
export interface Sponsor {
  nameAr: string
  nameEn: string
  url?: string
  logo?: string
}

export const supportingOrganizations: Sponsor[] = [
  {
    nameAr: 'العتبة الحسينية المقدسة',
    nameEn: 'Al-Hussainiya Holy Shrine',
    url: 'https://imamhussain.org/arabic',
    logo: shrineLogo,
  },
  {
    nameAr: 'جامعة وارث الأنبياء',
    nameEn: 'University of Warith Al-Anbiyaa',
    url: 'https://uowa-new.uowa.edu.iq/arabic',
    logo: universityLogo,
  },
]

export const evaluatingOrganization: Sponsor = {
  nameAr: 'كلية العلوم الإسلامية',
  nameEn: 'College of Islamic Sciences',
  url: 'https://uowa-new.uowa.edu.iq/arabic/islamic',
  logo: universityLogo,
}
