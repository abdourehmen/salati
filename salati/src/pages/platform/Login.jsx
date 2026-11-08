import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import styles from './Login.module.css';

// دالة تنقل محلية للتوجيه السلس
const navigate = (to) => {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new Event('popstate'));
};

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
    submittingBtn: 'جاري التحقق والتحويل...',
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
    submittingBtn: 'Connexion en cours...',
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
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // 1. تسجيل الدخول عبر Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data?.user) {
        // 2. التوجيه المباشر إلى لوحة التحكم عند نجاح الدخول
        navigate('/admin');
      }
    } catch (error) {
      setErrorMessage(
        lang === 'ar' 
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' 
          : 'E-mail ou mot de passe incorrect.'
      );
    } finally {
      setLoading(false);
    }
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

        {/* تنبيه الخطأ عند كتابة معلومات خاطئة */}
        {errorMessage && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#dc2626',
            padding: '0.75rem 1rem',
            borderRadius: '50px',
            fontSize: '0.875rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {errorMessage}
          </div>
        )}

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
              <a 
                href="/reset-password" 
                className={styles.forgotLink}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/reset-password');
                }}
              >
                {t.forgotPassword}
              </a>
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
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? t.submittingBtn : t.submitBtn}
          </button>

        </form>

        {/* رابط التسجيل */}
        <div className={styles.footer}>
          <span>{t.noAccount} </span>
          <button 
            type="button" 
            className={styles.link}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => navigate('/register')}
          >
            {t.registerLink}
          </button>
        </div>

      </div>
    </div>
  );
}