import { useState, useEffect } from 'react';
import styles from './HallsCatalog.module.css';

// قائمة ولايات الجزائر
const ALGERIAN_WILAYAS = [
  "01 - أدرار", "02 - الشلف", "03 - الأغواط", "04 - أم البواقي", "05 - باتنة", "06 - بجاية",
  "07 - بسكرة", "08 - بشار", "09 - البليدة", "10 - البويرة", "11 - تمنراست", "12 - تبسة",
  "13 - تلمسان", "14 - تيارت", "15 - تيزي وزو", "16 - الجزائر", "17 - الجلفة", "18 - جيجل",
  "19 - سطيف", "20 - سعيدة", "21 - سكيكدة", "22 - سيدي بلعباس", "23 - عنابة", "24 - قالمة",
  "25 - قسنطينة", "26 - المدية", "27 - مستغانم", "28 - المسيلة", "29 - معسكر", "30 - ورقلة",
  "31 - وهران", "32 - البيض", "33 - إليزي", "34 - برج بوعريريج", "35 - بومرداس", "36 - الطارف",
  "37 - تندوف", "38 - تسمسيلت", "39 - الوادي", "40 - خنشلة", "41 - سوق أهراس", "42 - تيبازة",
  "43 - ميلة", "44 - عين الدفلى", "45 - النعامة", "46 - عين تموشنت", "47 - غرداية", "48 - غليزان",
  "49 - المغير", "50 - المنيعة", "51 - أولاد جلال", "52 - برج باجي مختار", "53 - بني عباس",
  "54 - تيميمون", "55 - تقرت", "56 - جانت", "57 - إن صالح", "58 - إن قزام"
];

// بيانات تجريبية للصالات المسجلة
const MOCK_HALLS = [
  {
    id: 'el-malika',
    nameAr: 'قاعة الملكة للأفراح والمناسبات',
    nameFr: 'Salle El Malika',
    wilaya: '16 - الجزائر',
    commune: 'الشراقة',
    capacity: 500,
    price: '250,000 دج',
    rating: 4.9,
    img: '/src/assets/home-pc.png'
  },
  {
    id: 'el-andalous',
    nameAr: 'قاعة الأندلس الكبرى',
    nameFr: 'Salle El Andalous',
    wilaya: '31 - وهران',
    commune: 'عين الترك',
    capacity: 700,
    price: '320,000 دج',
    rating: 4.8,
    img: '/src/assets/home-pc.png'
  },
  {
    id: 'el-djawhara',
    nameAr: 'قاعة الجوهرة الملكية',
    nameFr: 'Salle El Djawhara',
    wilaya: '25 - قسنطينة',
    commune: 'الخروب',
    capacity: 400,
    price: '200,000 دج',
    rating: 4.7,
    img: '/src/assets/home-pc.png'
  }
];

const translations = {
  ar: {
    title: 'استكشف أفضل صالات الأفراح في الجزائر',
    subtitle: 'اعثر على القاعة المثالية لمناسبتك وقارن بين الأسعار والخدمات بسهولة.',
    searchPlaceholder: 'ابحث باسم الصالة أو البلدية...',
    selectWilaya: 'كل الولايات (58 ولاية)',
    capacityFilter: 'السعة الأقل من',
    capacityAll: 'جميع السعات',
    viewDetails: 'عرض التفاصيل والحجز',
    capacityLabel: 'الشخص',
    noResults: 'لم يتم العثور على صالات تطابق خيارات البحث الحالية.'
  },
  fr: {
    title: 'Découvrez les meilleures salles des fêtes en Algérie',
    subtitle: 'Trouvez la salle idéale pour votre événement et comparez les prix et services.',
    searchPlaceholder: 'Rechercher par nom ou commune...',
    selectWilaya: 'Toutes les wilayas (58)',
    capacityFilter: 'Capacité minimale',
    capacityAll: 'Toutes les capacités',
    viewDetails: 'Voir détails & réserver',
    capacityLabel: 'Personnes',
    noResults: 'Aucune salle ne correspond à vos critères.'
  }
};

export default function HallsCatalog() {
  const [lang, setLang] = useState(document.documentElement.lang || 'ar');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLang(document.documentElement.lang || 'ar');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  const t = translations[lang] || translations.ar;
  const isAr = lang === 'ar';

  const filteredHalls = MOCK_HALLS.filter((hall) => {
    const matchesSearch = hall.nameAr.includes(searchTerm) || hall.commune.includes(searchTerm);
    const matchesWilaya = !selectedWilaya || hall.wilaya === selectedWilaya;
    return matchesSearch && matchesWilaya;
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        
        {/* العنونة */}
        <header className={styles.header}>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </header>

        {/* شريط البحث والتصفية */}
        <div className={styles.filterBar}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className={styles.selectInput}
            value={selectedWilaya}
            onChange={(e) => setSelectedWilaya(e.target.value)}
          >
            <option value="">{t.selectWilaya}</option>
            {ALGERIAN_WILAYAS.map((w, index) => (
              <option key={index} value={w}>{w}</option>
            ))}
          </select>
        </div>

        {/* شبكة عرض الصالات */}
        <div className={styles.grid}>
          {filteredHalls.length === 0 ? (
            <div className={styles.noResults}>{t.noResults}</div>
          ) : (
            filteredHalls.map((hall) => (
              <div key={hall.id} className={styles.card}>
                <div className={styles.cardImgWrapper}>
                  <img src={hall.img} alt={hall.nameAr} className={styles.cardImg} />
                  <span className={styles.wilayaBadge}>📍 {hall.wilaya}</span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    <h3>{isAr ? hall.nameAr : hall.nameFr}</h3>
                    <span className={styles.rating}>★ {hall.rating}</span>
                  </div>

                  <p className={styles.locationSub}>البلدية: {hall.commune}</p>

                  <div className={styles.cardMeta}>
                    <span>👥 {hall.capacity} {t.capacityLabel}</span>
                    <strong className={styles.price}>{hall.price}</strong>
                  </div>

                  <a href="/hall/demo" className={styles.detailsBtn}>
                    {t.viewDetails}
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}