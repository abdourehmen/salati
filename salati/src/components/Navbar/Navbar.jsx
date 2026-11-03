import { useState } from 'react';
import styles from './Navbar.module.css';

// علم فرنسا SVG
const FlagFR = () => (
  <svg width="20" height="14" viewBox="0 0 3 2" className={styles.flagSvg}>
    <rect width="1" height="2" x="0" fill="#002395"/>
    <rect width="1" height="2" x="1" fill="#FFFFFF"/>
    <rect width="1" height="2" x="2" fill="#ED2939"/>
  </svg>
);

// علم الجزائر SVG
const FlagDZ = () => (
  <svg width="20" height="14" viewBox="0 0 900 600" className={styles.flagSvg}>
    <rect width="450" height="600" x="0" fill="#006633"/>
    <rect width="450" height="600" x="450" fill="#ffffff"/>
    <circle cx="450" cy="300" r="150" fill="#d21034"/>
    <circle cx="487.5" cy="300" r="120" fill="#ffffff"/>
    <polygon fill="#d21034" points="487.5,210 500.8,251 543.9,251 509.1,276.3 522.4,317.3 487.5,292 452.6,317.3 465.9,276.3 431.1,251 474.2,251"/>
  </svg>
);

export default function Navbar() {
  const [lang, setLang] = useState(document.documentElement.lang || 'ar');

  const toggleLanguage = () => {
    const nextLang = lang === 'ar' ? 'fr' : 'ar';
    setLang(nextLang);
    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* 1. الشعار في البداية */}
        <a href="/" className={styles.logo}>
          salati<span className={styles.dot}>.</span>
        </a>

        {/* 2. العناوين مثبتة في منتصف الشاشة تماماً */}
        <div className={styles.mainLinks}>
          <a href="/halls" className={styles.navLink}>
            {lang === 'ar' ? 'معرض الصالات' : 'Catalogue des salles'}
          </a>
          <a href="/#features" className={styles.navLink}>
            {lang === 'ar' ? 'كيفية الاستخدام' : 'Comment ça marche'}
          </a>
        </div>

        {/* 3. باقي الأزرار وزر اللغة في نهاية الشاشة */}
        <div className={styles.actionGroup}>
          <button 
            className={styles.langBtn} 
            onClick={toggleLanguage}
            title={lang === 'ar' ? 'Changer en Français' : 'التغيير إلى العربية'}
          >
            <span className={styles.flagContainer}>
              {lang === 'ar' ? <FlagFR /> : <FlagDZ />}
            </span>
            <span className={styles.langText}>
              {lang === 'ar' ? 'FR' : 'عربي'}
            </span>
          </button>

          <a href="/login" className={styles.loginLink}>
            {lang === 'ar' ? 'دخول أصحاب الصالات' : 'Connexion'}
          </a>

          <a href="/register" className={styles.registerBtn}>
            {lang === 'ar' ? 'سجّل صالتك' : 'Inscrire votre salle'}
          </a>
        </div>
      </div>
    </header>
  );
}