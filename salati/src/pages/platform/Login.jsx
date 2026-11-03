import { useState, useEffect } from 'react';
import styles from './Login.module.css';

const translations = {
  ar: {
    title: 'تسجيل الدخول إلى',
    subtitle: 'مرحباً بعودتك! أدخل بياناتك للوصول إلى لوحة تحكم صالتك.',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'owner@salati.dz',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: '••••••••',
    rememberMe: 'تذكرني على هذا الجهاز',
    forgotPassword: 'نسيت كلمة المرور؟',
    submitBtn: 'دخول لوحة التحكم',
    noAccount: 'ليس لديك حساب بعد؟',
    registerLink: 'سجّل صالتك الآن'
  },
  fr: {
    title: 'Connexion à',
    subtitle: 'Bon retour ! Entrez vos identifiants pour accéder au tableau de bord de votre salle.',
    emailLabel: 'Adresse E-mail',
    emailPlaceholder: 'owner@salati.dz',
    passwordLabel: 'Mot de passe',
    passwordPlaceholder: '••••••••',
    rememberMe: 'Se souvenir de moi',
    forgotPassword: 'Mot de passe oublié ?',
    submitBtn: 'Accéder au tableau de bord',
    noAccount: 'Vous n’avez pas encore de compte ?',
    registerLink: 'Inscrivez votre salle'
  }
};

export default function Login() {
  const [lang, setLang] = useState(document.documentElement.lang || 'ar');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLang(document.documentElement.lang || 'ar');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('بيانات الدخول:', formData);
    // سيتم التوجيه إلى لوحة التحكم /dashboard بعد الربط بـ Supabase
  };

  const t = translations[lang] || translations.ar;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.cardContainer}>
        
        {/* الترويسة */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            {t.title} <span className={styles.brandName}>salati<span className={styles.dot}>.</span></span>
          </h1>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>

        {/* نموذج الدخول */}
        <form onSubmit={handleSubmit} className={styles.form}>
          
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
            <div className={styles.passwordHeader}>
              <label htmlFor="password">{t.passwordLabel}</label>
              <a href="/reset-password" className={styles.forgotLink}>{t.forgotPassword}</a>
            </div>
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

          {/* خيار تذكرني */}
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <label htmlFor="rememberMe">{t.rememberMe}</label>
          </div>

          {/* زر الدخول */}
          <button type="submit" className={styles.submitBtn}>
            {t.submitBtn}
          </button>

        </form>

        {/* رابط التسجيل */}
        <div className={styles.footer}>
          <span>{t.noAccount} </span>
          <a href="/register" className={styles.link}>{t.registerLink}</a>
        </div>

      </div>
    </div>
  );
}