import { useState, useEffect } from 'react';
import styles from './PublicHall.module.css';
import hallImg1 from '../../assets/home-pc.png';

const HALL_DATA = {
  name: 'قاعة الملكة للأفراح والمناسبات',
  nameFr: 'Salle El Malika des Fêtes',
  wilaya: '16 - الجزائر (الشراقة)',
  wilayaFr: '16 - Alger (Chéraga)',
  capacity: '500 شخص',
  capacityFr: '500 Personnes',
  price: '250,000 دج / ليلة',
  priceFr: '250 000 DA / Nuit',
  rating: 4.9,
  reviewsCount: 128,
  features: [
    { icon: '❄️', titleAr: 'تكييف مركزي', titleFr: 'Climatisation centrale' },
    { icon: '🅿️', titleAr: 'موقف سيارات محروس', titleFr: 'Parking sécurisé' },
    { icon: '🍽️', titleAr: 'خدمة الإطعام والطهي', titleFr: 'Service Traiteur' },
    { icon: '🔊', titleAr: 'نظام صوت وإضاءة ضخم', titleFr: 'Sono & Éclairage Pro' },
    { icon: '👰', titleAr: 'غرفة خاصة للعروس', titleFr: 'Loge mariée privée' },
    { icon: '⚡', titleAr: 'مولد كهربائي احتياطي', titleFr: 'Groupe électrogène' }
  ]
};

const translations = {
  ar: {
    bookInspection: 'طلب معاينة الصالة',
    bookEvent: 'حجز مبدئي',
    specsTitle: 'مواصفات الصالة والخدمات',
    capacityLabel: 'الطاقة الاستيعابية',
    priceLabel: 'السعر الأولي',
    galleryTitle: 'معرض الصور',
    reviewsTitle: 'تقييمات الزبائن',
    modalTitle: 'حجز موعد أو معاينة',
    modalSubtitle: 'أدخل معلوماتك وسيصلك تأكيد الموعد عبر مكالمة من إدارة الصالة.',
    fullNameLabel: 'الاسم واللقب',
    phoneLabel: 'رقم الهاتف',
    dateLabel: 'الموعد المفضل',
    typeLabel: 'نوع الطلب',
    typeInspection: 'معاينة القاعة',
    typeBooking: 'حجز ليلة الزفاف',
    submitRequest: 'إرسال الطلب الآن',
    closeBtn: 'إغلاق',
    successMsg: 'تم إرسال طلبك بنجاح! ستتصل بك إدارة الصالة قريبًا.'
  },
  fr: {
    bookInspection: 'Demander une visite',
    bookEvent: 'Pré-réservation',
    specsTitle: 'Caractéristiques & Services',
    capacityLabel: 'Capacité d’accueil',
    priceLabel: 'Prix à partir de',
    galleryTitle: 'Galerie Photos',
    reviewsTitle: 'Avis des clients',
    modalTitle: 'Réserver une date ou une visite',
    modalSubtitle: 'Remplissez vos coordonnées, l’administration vous contactera pour confirmer.',
    fullNameLabel: 'Nom & Prénom',
    phoneLabel: 'Téléphone',
    dateLabel: 'Date souhaitée',
    typeLabel: 'Type de demande',
    typeInspection: 'Visite de la salle',
    typeBooking: 'Réservation du mariage',
    submitRequest: 'Envoyer la demande',
    closeBtn: 'Fermer',
    successMsg: 'Demande envoyée avec succès ! L’équipe vous contactera très bientôt.'
  }
};

export default function PublicHall() {
  const [lang, setLang] = useState(document.documentElement.lang || 'ar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestType, setRequestType] = useState('inspection');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '', date: '' });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLang(document.documentElement.lang || 'ar');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  const openModal = (type) => {
    setRequestType(type);
    setSubmitted(false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const t = translations[lang] || translations.ar;
  const isAr = lang === 'ar';

  return (
    <div className={styles.hallWrapper}>
      
      {/* الترويسة الرئيسية للصالة */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroHeader}>
            <div>
              <span className={styles.wilayaBadge}>📍 {isAr ? HALL_DATA.wilaya : HALL_DATA.wilayaFr}</span>
              <h1 className={styles.hallTitle}>{isAr ? HALL_DATA.name : HALL_DATA.nameFr}</h1>
              <div className={styles.ratingBox}>
                <span className={styles.star}>★</span>
                <strong>{HALL_DATA.rating}</strong>
                <span>({HALL_DATA.reviewsCount} {t.reviewsTitle})</span>
              </div>
            </div>

            <div className={styles.ctaBox}>
              <button className={styles.secondaryBtn} onClick={() => openModal('inspection')}>
                📅 {t.bookInspection}
              </button>
              <button className={styles.primaryBtn} onClick={() => openModal('booking')}>
                ✨ {t.bookEvent}
              </button>
            </div>
          </div>

          {/* معرض الصور الرئيسي */}
          <div className={styles.galleryGrid}>
            <div className={styles.mainImageCard}>
              <img src={hallImg1} alt="صالة الأفراح" className={styles.mainImg} />
            </div>
            <div className={styles.sideImages}>
              <div className={styles.subImgCard}><img src={hallImg1} alt="صورة الصالة 2" /></div>
              <div className={styles.subImgCard}><img src={hallImg1} alt="صورة الصالة 3" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* تفاصيل الصالة والخدمات */}
      <section className={styles.detailsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{t.specsTitle}</h2>

          <div className={styles.quickSpecsGrid}>
            <div className={styles.specCard}>
              <span className={styles.specIcon}>👥</span>
              <div>
                <small>{t.capacityLabel}</small>
                <strong>{isAr ? HALL_DATA.capacity : HALL_DATA.capacityFr}</strong>
              </div>
            </div>

            <div className={styles.specCard}>
              <span className={styles.specIcon}>🏷️</span>
              <div>
                <small>{t.priceLabel}</small>
                <strong>{isAr ? HALL_DATA.price : HALL_DATA.priceFr}</strong>
              </div>
            </div>
          </div>

          {/* شبكة مميزات الصالة */}
          <div className={styles.featuresGrid}>
            {HALL_DATA.features.map((feat, index) => (
              <div key={index} className={styles.featureItem}>
                <span className={styles.featIcon}>{feat.icon}</span>
                <span>{isAr ? feat.titleAr : feat.titleFr}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal نافذة طلب الحجز / المعاينة */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setIsModalOpen(false)}>×</button>

            {!submitted ? (
              <>
                <h3 className={styles.modalTitle}>{t.modalTitle}</h3>
                <p className={styles.modalSubtitle}>{t.modalSubtitle}</p>

                <form onSubmit={handleSubmit} className={styles.modalForm}>
                  <div className={styles.inputGroup}>
                    <label>{t.fullNameLabel}</label>
                    <input
                      type="text"
                      required
                      placeholder="أحمد علي"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>{t.phoneLabel}</label>
                    <input
                      type="tel"
                      required
                      placeholder="0661XX2233"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>{t.dateLabel}</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>{t.typeLabel}</label>
                    <select
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                    >
                      <option value="inspection">{t.typeInspection}</option>
                      <option value="booking">{t.typeBooking}</option>
                    </select>
                  </div>

                  <button type="submit" className={styles.submitBtn}>
                    {t.submitRequest}
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.successBox}>
                <div className={styles.successIcon}>🎉</div>
                <h3>{t.successMsg}</h3>
                <button className={styles.primaryBtn} onClick={() => setIsModalOpen(false)}>
                  {t.closeBtn}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}