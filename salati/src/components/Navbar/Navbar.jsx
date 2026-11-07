import { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';

/* أيقونات الملاحة والقائمة */
const IconHome = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const IconSparkles = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 7.92c0 .13 0 .261 0 .391a7.5 7.5 0 0 0-7.92 7.92c-.13 0-.261 0-.391 0a7.5 7.5 0 0 0-7.92-7.92c0-.13 0-.261 0-.391A7.5 7.5 0 0 0 12 3z"></path>
  </svg>
);

const IconLayers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 17 12 22 22 17"></polyline>
    <polyline points="2 12 12 17 22 12"></polyline>
  </svg>
);

const IconTag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const IconHelp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const IconMenu = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const IconClose = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

/* أيقونات قائمة تغيير اللغة المنسدلة */
const IconGlobeLang = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"></path>
  </svg>
);

const IconChevronLang = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const IconCheckLang = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function Navbar() {
  const [lang, setLang] = useState(document.documentElement.lang || 'ar');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLang(document.documentElement.lang || 'ar');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang']
    });

    return () => observer.disconnect();
  }, []);

  /* إغلاق قائمة اللغات المنسدلة عند الضغط خارجها */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const changeLanguage = (newLang) => {
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    setLang(newLang);
    setLangDropdownOpen(false);
  };

  const navigateTo = (e, targetPath) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (targetPath === '/' || targetPath === '') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new Event('popstate'));
      }
      return;
    }

    if (targetPath.startsWith('#')) {
      const element = document.querySelector(targetPath);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/' + targetPath;
      }
      return;
    }

    window.history.pushState({}, '', targetPath);
    window.dispatchEvent(new Event('popstate'));
  };

  const isAr = lang === 'ar';

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* اللوجو */}
        <a href="/" onClick={(e) => navigateTo(e, '/')} className={styles.brandLogo}>
          salati<span>.work</span>
        </a>

        {/* الروابط لسطح المكتب والقائمة المنزلقة للجوال */}
        <div className={`${styles.navLinks} ${mobileMenuOpen ? styles.navLinksOpen : ''}`}>
          <div className={styles.mobileNavHeaderTitle}>
            {isAr ? 'التنقل السريع' : 'Navigation'}
          </div>

          <a href="/" onClick={(e) => navigateTo(e, '/')} className={styles.navLink}>
            <span className={styles.linkIcon}><IconHome /></span>
            <span>{isAr ? 'الرئيسية' : 'Accueil'}</span>
          </a>
          <a href="#why-us" onClick={(e) => navigateTo(e, '#why-us')} className={styles.navLink}>
            <span className={styles.linkIcon}><IconSparkles /></span>
            <span>{isAr ? 'لماذا salati' : 'Pourquoi salati'}</span>
          </a>
          <a href="#how-it-works" onClick={(e) => navigateTo(e, '#how-it-works')} className={styles.navLink}>
            <span className={styles.linkIcon}><IconLayers /></span>
            <span>{isAr ? 'كيف تعمل' : 'Comment ça marche'}</span>
          </a>
          <a href="#pricing" onClick={(e) => navigateTo(e, '#pricing')} className={styles.navLink}>
            <span className={styles.linkIcon}><IconTag /></span>
            <span>{isAr ? 'الأسعار' : 'Tarifs'}</span>
          </a>
          <a href="#faq" onClick={(e) => navigateTo(e, '#faq')} className={styles.navLink}>
            <span className={styles.linkIcon}><IconHelp /></span>
            <span>{isAr ? 'الأسئلة الشائعة' : 'FAQ'}</span>
          </a>
          <a href="#contact" onClick={(e) => navigateTo(e, '#contact')} className={styles.navLink}>
            <span className={styles.linkIcon}><IconMail /></span>
            <span>{isAr ? 'تواصل معنا' : 'Contact'}</span>
          </a>

          {/* أزرار الإجراءات في أسفل قائمة الجوال */}
          <div className={styles.mobileNavActions}>
            <a href="/login" onClick={(e) => navigateTo(e, '/login')} className={styles.loginBtn}>
              {isAr ? 'دخول الحساب' : 'Connexion'}
            </a>
            <a href="/register" onClick={(e) => navigateTo(e, '/register')} className={styles.registerBtn}>
              {isAr ? 'ابدأ تجربة مجانية' : 'Essai Gratuit'}
            </a>
          </div>
        </div>

        {/* أزرار الإجراءات وزر اللغة المنسدل والهامبرغر */}
        <div className={styles.navActions}>
          
          {/* مكون زر تغيير اللغة مع القائمة المنسدلة */}
          <div className={styles.langWrapper} ref={langDropdownRef}>
            <button 
              onClick={() => setLangDropdownOpen(!langDropdownOpen)} 
              className={`${styles.langBtn} ${langDropdownOpen ? styles.langBtnActive : ''}`}
              title={isAr ? 'اختر اللغة' : 'Choisir la langue'}
              aria-expanded={langDropdownOpen}
            >
              <IconGlobeLang />
              <span>{isAr ? 'AR' : 'FR'}</span>
              <span className={`${styles.langChevron} ${langDropdownOpen ? styles.langChevronOpen : ''}`}>
                <IconChevronLang />
              </span>
            </button>

            {langDropdownOpen && (
              <div className={styles.langDropdownMenu}>
                <button 
                  className={`${styles.langOption} ${lang === 'ar' ? styles.langOptionSelected : ''}`}
                  onClick={() => changeLanguage('ar')}
                >
                  <span>العربية (AR)</span>
                  {lang === 'ar' && <IconCheckLang />}
                </button>
                <button 
                  className={`${styles.langOption} ${lang === 'fr' ? styles.langOptionSelected : ''}`}
                  onClick={() => changeLanguage('fr')}
                >
                  <span>Français (FR)</span>
                  {lang === 'fr' && <IconCheckLang />}
                </button>
              </div>
            )}
          </div>

          <div className={styles.desktopNavActions}>
            <a href="/login" onClick={(e) => navigateTo(e, '/login')} className={styles.loginBtn}>
              {isAr ? 'دخول' : 'Connexion'}
            </a>
            <a href="/register" onClick={(e) => navigateTo(e, '/register')} className={styles.registerBtn}>
              {isAr ? 'تجربة مجانية' : 'Essai Gratuit'}
            </a>
          </div>

          {/* زر الهامبرغر للجوال */}
          <button 
            className={styles.hamburgerBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
}