import { useState, useEffect } from 'react';
import styles from './Register.module.css';

// قائمة الـ 58 ولاية الجزائرية
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

const translations = {
  ar: {
    title: 'أنشئ حساب صالتك على',
    subtitle: 'انضم إلى منصة salati وابدأ في استلام طلبات المعاينة والحجوزات أونلاين.',
    hallNameLabel: 'اسم الصالة',
    hallNamePlaceholder: 'مثال: قاعة الملكة للأفراح',
    ownerNameLabel: 'الاسم واللقب',
    ownerNamePlaceholder: 'محمد بن علي',
    phoneLabel: 'رقم الهاتف',
    phonePlaceholder: '0661XX2233',
    wilayaLabel: 'الولاية',
    selectWilaya: 'اختر الولاية...',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'owner@salati.dz',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: '••••••••',
    submitBtn: 'إنشاء الحساب وتفعيل الصالة',
    hasAccount: 'لديك حساب بالفعل؟',
    loginLink: 'تسجيل الدخول'
  },
  fr: {
    title: 'Inscrivez votre salle sur',
    subtitle: 'Rejoignez salati et commencez à recevoir vos demandes de visite et réservations en ligne.',
    hallNameLabel: 'Nom de la salle',
    hallNamePlaceholder: 'Ex: Salle El Malika',
    ownerNameLabel: 'Nom & Prénom',
    ownerNamePlaceholder: 'Mohamed Benali',
    phoneLabel: 'Téléphone',
    phonePlaceholder: '0661XX2233',
    wilayaLabel: 'Wilaya',
    selectWilaya: 'Sélectionnez la wilaya...',
    emailLabel: 'Adresse E-mail',
    emailPlaceholder: 'owner@salati.dz',
    passwordLabel: 'Mot de passe',
    passwordPlaceholder: '••••••••',
    submitBtn: 'Créer le compte et activer la salle',
    hasAccount: 'Vous avez déjà un compte ?',
    loginLink: 'Se connecter'
  }
};

export default function Register() {
  const [lang, setLang] = useState(document.documentElement.lang || 'ar');
  const [formData, setFormData] = useState({
    hallName: '',
    ownerName: '',
    phone: '',
    wilaya: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLang(document.documentElement.lang || 'ar');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('بيانات التسجيل:', formData);
    // سيتم ربطه بـ Supabase Auth & DB
  };

  const t = translations[lang] || translations.ar;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.cardContainer}>
        
        {/* العنونة والترويسة */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            {t.title} <span className={styles.brandName}>salati<span className={styles.dot}>.</span></span>
          </h1>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>

        {/* نموذج التسجيل */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.gridRow}>
            
            {/* اسم الصالة */}
            <div className={styles.inputGroup}>
              <label htmlFor="hallName">{t.hallNameLabel}</label>
              <input
                type="text"
                id="hallName"
                name="hallName"
                required
                placeholder={t.hallNamePlaceholder}
                value={formData.hallName}
                onChange={handleChange}
              />
            </div>

            {/* اسم صاحب الصالة */}
            <div className={styles.inputGroup}>
              <label htmlFor="ownerName">{t.ownerNameLabel}</label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                required
                placeholder={t.ownerNamePlaceholder}
                value={formData.ownerName}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className={styles.gridRow}>
            
            {/* رقم الهاتف */}
            <div className={styles.inputGroup}>
              <label htmlFor="phone">{t.phoneLabel}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                placeholder={t.phonePlaceholder}
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* الولاية (58 ولاية) */}
            <div className={styles.inputGroup}>
              <label htmlFor="wilaya">{t.wilayaLabel}</label>
              <select
                id="wilaya"
                name="wilaya"
                required
                value={formData.wilaya}
                onChange={handleChange}
              >
                <option value="">{t.selectWilaya}</option>
                {ALGERIAN_WILAYAS.map((w, index) => (
                  <option key={index} value={w}>{w}</option>
                ))}
              </select>
            </div>

          </div>

          <div className={styles.gridRow}>
            
            {/* البريد الإلكتروني */}
            <div className={styles.inputGroup}>
              <label htmlFor="email">{t.emailLabel}</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder={t.emailPlaceholder}
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* كلمة المرور */}
            <div className={styles.inputGroup}>
              <label htmlFor="password">{t.passwordLabel}</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder={t.passwordPlaceholder}
                value={formData.password}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* زر التقديم */}
          <button type="submit" className={styles.submitBtn}>
            {t.submitBtn}
          </button>
        </form>

        {/* رابط الدخول */}
        <div className={styles.footer}>
          <span>{t.hasAccount} </span>
          <a href="/login" className={styles.link}>{t.loginLink}</a>
        </div>

      </div>
    </div>
  );
}