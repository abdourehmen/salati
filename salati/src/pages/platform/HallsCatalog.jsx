import { useState, useEffect } from 'react';
import styles from './HallsCatalog.module.css';

// قائمة ولايات الجزائر (عربي / فرنسي)
const ALGERIAN_WILAYAS = [
  { code: '01', ar: '01 - أدرار', fr: '01 - Adrar' },
  { code: '02', ar: '02 - الشلف', fr: '02 - Chlef' },
  { code: '03', ar: '03 - الأغواط', fr: '03 - Laghouat' },
  { code: '04', ar: '04 - أم البواقي', fr: '04 - Oum El Bouaghi' },
  { code: '05', ar: '05 - باتنة', fr: '05 - Batna' },
  { code: '06', ar: '06 - بجاية', fr: '06 - Béjaïa' },
  { code: '07', ar: '07 - بسكرة', fr: '07 - Biskra' },
  { code: '08', ar: '08 - بشار', fr: '08 - Béchar' },
  { code: '09', ar: '09 - البليدة', fr: '09 - Blida' },
  { code: '10', ar: '10 - البويرة', fr: '10 - Bouira' },
  { code: '11', ar: '11 - تمنراست', fr: '11 - Tamanrasset' },
  { code: '12', ar: '12 - تبسة', fr: '12 - Tébessa' },
  { code: '13', ar: '13 - تلمسان', fr: '13 - Tlemcen' },
  { code: '14', ar: '14 - تيارت', fr: '14 - Tiaret' },
  { code: '15', ar: '15 - تيزي وزو', fr: '15 - Tizi Ouzou' },
  { code: '16', ar: '16 - الجزائر', fr: '16 - Alger' },
  { code: '17', ar: '17 - الجلفة', fr: '17 - Djelfa' },
  { code: '18', ar: '18 - جيجل', fr: '18 - Jijel' },
  { code: '19', ar: '19 - سطيف', fr: '19 - Sétif' },
  { code: '20', ar: '20 - سعيدة', fr: '20 - Saïda' },
  { code: '21', ar: '21 - سكيكدة', fr: '21 - Skikda' },
  { code: '22', ar: '22 - سيدي بلعباس', fr: '22 - Sidi Bel Abbès' },
  { code: '23', ar: '23 - عنابة', fr: '23 - Annaba' },
  { code: '24', ar: '24 - قالمة', fr: '24 - Guelma' },
  { code: '25', ar: '25 - قسنطينة', fr: '25 - Constantine' },
  { code: '26', ar: '26 - المدية', fr: '26 - Médéa' },
  { code: '27', ar: '27 - مستغانم', fr: '27 - Mostaganem' },
  { code: '28', ar: '28 - المسيلة', fr: "28 - M'Sila" },
  { code: '29', ar: '29 - معسكر', fr: '29 - Mascara' },
  { code: '30', ar: '30 - ورقلة', fr: '30 - Ouargla' },
  { code: '31', ar: '31 - وهران', fr: '31 - Oran' },
  { code: '32', ar: '32 - البيض', fr: '32 - El Bayadh' },
  { code: '33', ar: '33 - إليزي', fr: '33 - Illizi' },
  { code: '34', ar: '34 - برج بوعريريج', fr: '34 - Bordj Bou Arréridj' },
  { code: '35', ar: '35 - بومرداس', fr: '35 - Boumerdès' },
  { code: '36', ar: '36 - الطارف', fr: '36 - El Tarf' },
  { code: '37', ar: '37 - تندوف', fr: '37 - Tindouf' },
  { code: '38', ar: '38 - تسمسيلت', fr: '38 - Tissemsilt' },
  { code: '39', ar: '39 - الوادي', fr: '39 - El Oued' },
  { code: '40', ar: '40 - خنشلة', fr: '40 - Khenchela' },
  { code: '41', ar: '41 - سوق أهراس', fr: '41 - Souk Ahras' },
  { code: '42', ar: '42 - تيبازة', fr: '42 - Tipaza' },
  { code: '43', ar: '43 - ميلة', fr: '43 - Mila' },
  { code: '44', ar: '44 - عين الدفلى', fr: '44 - Aïn Defla' },
  { code: '45', ar: '45 - النعامة', fr: '45 - Naâma' },
  { code: '46', ar: '46 - عين تموشنت', fr: '46 - Aïn Témouchent' },
  { code: '47', ar: '47 - غرداية', fr: '47 - Ghardaïa' },
  { code: '48', ar: '48 - غليزان', fr: '48 - Relizane' },
  { code: '49', ar: '49 - المغير', fr: "49 - El M'Ghair" },
  { code: '50', ar: '50 - المنيعة', fr: '50 - El Meniaa' },
  { code: '51', ar: '51 - أولاد جلال', fr: '51 - Ouled Djellal' },
  { code: '52', ar: '52 - برج باجي مختار', fr: '52 - Bordj Badji Mokhtar' },
  { code: '53', ar: '53 - بني عباس', fr: '53 - Béni Abbès' },
  { code: '54', ar: '54 - تيميمون', fr: '54 - Timimoun' },
  { code: '55', ar: '55 - تقرت', fr: '55 - Touggourt' },
  { code: '56', ar: '56 - جانت', fr: '56 - Djanet' },
  { code: '57', ar: '57 - إن صالح', fr: '57 - In Salah' },
  { code: '58', ar: '58 - إن قزام', fr: '58 - In Guezzam' }
];

// بيانات تجريبية للصالات المسجلة
const MOCK_HALLS = [
  {
    id: 'el-malika',
    nameAr: 'قاعة الملكة للأفراح والمناسبات',
    nameFr: 'Salle El Malika',
    wilayaCode: '16',
    wilayaAr: '16 - الجزائر',
    wilayaFr: '16 - Alger',
    communeAr: 'الشراقة',
    communeFr: 'Chéraga',
    capacity: 500,
    priceValue: 250000,
    rating: 4.9,
    img: '/src/assets/home-pc.png'
  },
  {
    id: 'el-andalous',
    nameAr: 'قاعة الأندلس الكبرى',
    nameFr: 'Salle El Andalous',
    wilayaCode: '31',
    wilayaAr: '31 - وهران',
    wilayaFr: '31 - Oran',
    communeAr: 'عين الترك',
    communeFr: 'Aïn El Turck',
    capacity: 700,
    priceValue: 320000,
    rating: 4.8,
    img: '/src/assets/home-pc.png'
  },
  {
    id: 'el-djawhara',
    nameAr: 'قاعة الجوهرة الملكية',
    nameFr: 'Salle El Djawhara',
    wilayaCode: '25',
    wilayaAr: '25 - قسنطينة',
    wilayaFr: '25 - Constantine',
    communeAr: 'الخروب',
    communeFr: 'El Khroub',
    capacity: 400,
    priceValue: 200000,
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
    communeLabel: 'البلدية:',
    capacityLabel: 'شخص',
    currency: 'دج',
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
    communeLabel: 'Commune :',
    capacityLabel: 'personnes',
    currency: 'DA',
    noResults: 'Aucune salle ne correspond à vos critères.'
  }
};

export default function HallsCatalog({ isLoading = false }) {
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
  const localeStr = isAr ? 'ar-DZ' : 'fr-FR';

  const filteredHalls = MOCK_HALLS.filter((hall) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      hall.nameAr.toLowerCase().includes(q) ||
      hall.nameFr.toLowerCase().includes(q) ||
      hall.communeAr.toLowerCase().includes(q) ||
      hall.communeFr.toLowerCase().includes(q);
    const matchesWilaya = !selectedWilaya || hall.wilayaCode === selectedWilaya;
    return matchesSearch && matchesWilaya;
  });

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className={styles.wrapper}>
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
            {ALGERIAN_WILAYAS.map((w) => (
              <option key={w.code} value={w.code}>
                {isAr ? w.ar : w.fr}
              </option>
            ))}
          </select>
        </div>

        {/* شبكة عرض الصالات أو Shimmer Skeleton */}
        {isLoading ? (
          <div className={styles.grid} aria-busy="true">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className={styles.card}>
                <div className={`${styles.skeletonBase} ${styles.skeletonImg}`} />
                <div className={styles.cardBody}>
                  <div className={`${styles.skeletonBase} ${styles.skeletonTitle}`} />
                  <div className={`${styles.skeletonBase} ${styles.skeletonSub}`} />
                  <div className={styles.cardMeta}>
                    <div className={`${styles.skeletonBase} ${styles.skeletonMetaSm}`} />
                    <div className={`${styles.skeletonBase} ${styles.skeletonMetaSm}`} />
                  </div>
                  <div className={`${styles.skeletonBase} ${styles.skeletonBtn}`} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredHalls.length === 0 ? (
              <div className={styles.noResults}>{t.noResults}</div>
            ) : (
              filteredHalls.map((hall, index) => {
                const displayName = isAr ? hall.nameAr : hall.nameFr;
                const displayWilaya = isAr ? hall.wilayaAr : hall.wilayaFr;
                const displayCommune = isAr ? hall.communeAr : hall.communeFr;

                return (
                  <div
                    key={hall.id}
                    className={styles.card}
                    style={{ animationDelay: `${Math.min(index * 0.08, 0.4)}s` }}
                  >
                    <div className={styles.cardImgWrapper}>
                      <img src={hall.img} alt={displayName} className={styles.cardImg} />
                      <span className={styles.wilayaBadge}>📍 {displayWilaya}</span>
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.cardHeader}>
                        <h3>{displayName}</h3>
                        <span className={styles.rating} dir="ltr">
                          ★ {hall.rating}
                        </span>
                      </div>

                      <p className={styles.locationSub}>
                        {t.communeLabel} {displayCommune}
                      </p>

                      <div className={styles.cardMeta}>
                        <span>
                          👥 {hall.capacity.toLocaleString(localeStr)} {t.capacityLabel}
                        </span>
                        <strong className={styles.price} dir="ltr">
                          {hall.priceValue.toLocaleString(localeStr)} {t.currency}
                        </strong>
                      </div>

                      <a href="/hall/demo" className={styles.detailsBtn}>
                        {t.viewDetails}
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}