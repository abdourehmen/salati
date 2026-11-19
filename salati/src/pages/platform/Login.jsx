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
    orDivider: 'أو',
    googleBtn: 'المتابعة باستخدام Google',
    noAccount: 'ليس لديك حساب بعد؟',
    registerLink: 'سجّل صالتك الآن',
    // نصوص استعادة كلمة المرور
    resetTitle: 'استعادة كلمة المرور',
    resetSubtitle: 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً آمناً لتعيين كلمة مرور جديدة.',
    sendResetBtn: 'إرسال رابط الاستعادة',
    sendingResetBtn: 'جاري الإرسال...',
    resetSentSuccess: 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح! تفقد صندوق الوارد أو الرسائل غير المرغوب فيها (Spam).',
    backToLogin: 'العودة لتسجيل الدخول',
    newPassTitle: 'تعيين كلمة مرور جديدة',
    newPassSubtitle: 'أدخل كلمة المرور الجديدة لحسابك (6 أحرف على الأقل).',
    newPassLabel: 'كلمة المرور الجديدة',
    confirmPassLabel: 'تأكيد كلمة المرور الجديدة',
    saveNewPassBtn: 'حفظ كلمة المرور والدخول',
    savingNewPassBtn: 'جاري الحفظ...',
    passMismatch: 'كلمتا المرور غير متطابقتين.',
    passTooShort: 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.',
    passUpdatedSuccess: 'تم تحديث كلمة المرور بنجاح! جاري توجيهك إلى لوحة التحكم...'
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
    orDivider: 'ou',
    googleBtn: 'Continuer avec Google',
    noAccount: 'Vous n’avez pas encore de compte ?',
    registerLink: 'Inscrivez votre salle',
    // Textes récupération mot de passe
    resetTitle: 'Récupération du mot de passe',
    resetSubtitle: 'Entrez votre adresse e-mail pour recevoir un lien de réinitialisation sécurisé.',
    sendResetBtn: 'Envoyer le lien de récupération',
    sendingResetBtn: 'Envoi en cours...',
    resetSentSuccess: 'Un lien de réinitialisation a été envoyé à votre adresse e-mail ! Vérifiez votre boîte de réception ou vos spams.',
    backToLogin: 'Retour à la connexion',
    newPassTitle: 'Nouveau mot de passe',
    newPassSubtitle: 'Saisissez votre nouveau mot de passe (minimum 6 caractères).',
    newPassLabel: 'Nouveau mot de passe',
    confirmPassLabel: 'Confirmer le mot de passe',
    saveNewPassBtn: 'Enregistrer et accéder',
    savingNewPassBtn: 'Enregistrement...',
    passMismatch: 'Les mots de passe ne correspondent pas.',
    passTooShort: 'Le mot de passe doit contenir au moins 6 caractères.',
    passUpdatedSuccess: 'Mot de passe mis à jour avec succès ! Redirection...'
  }
};

export default function Login() {
  const [lang, setLang] = useState(document.documentElement.lang || 'ar');
  // أوضاع العرض: 'login' | 'forgot' | 'update_password'
  const [viewMode, setViewMode] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLang(document.documentElement.lang || 'ar');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

    // الكشف التلقائي عن رابط استعادة كلمة المرور القادم من البريد الإلكتروني
    const isRecoveryLink =
      window.location.hash.includes('type=recovery') ||
      window.location.search.includes('type=recovery');

    if (isRecoveryLink) {
      setViewMode('update_password');
    }

    // التحقق من الجلسة بعد الدخول عبر Google وتوجيه المستخدم حسب حالته
    const handleOAuthSession = async (session) => {
      if (!session?.user || isRecoveryLink) return;
      if (session.user.app_metadata?.provider === 'google') {
        const userId = session.user.id;
        const userEmail = session.user.email?.trim().toLowerCase();

        // 1. التحقق إن كان موظفاً في صالة
        if (userEmail) {
          const { data: staffRecord } = await supabase
            .from('hall_staff')
            .select('is_active, hall_id')
            .ilike('email', userEmail)
            .maybeSingle();

          if (staffRecord) {
            if (staffRecord.is_active === false) {
              await supabase.auth.signOut();
              setErrorMessage(
                document.documentElement.lang === 'fr'
                  ? 'Votre compte a été suspendu par le propriétaire.'
                  : 'تم إيقاف حسابك مؤقتاً من طرف مالك القاعة.'
              );
              return;
            }
            navigate('/admin');
            return;
          }
        }

        // 2. التحقق إن كان يملك صالة مسجلة بالفعل
        const { data: existingHall } = await supabase
          .from('halls')
          .select('id')
          .eq('owner_id', userId)
          .maybeSingle();

        if (existingHall) {
          navigate('/admin');
        } else {
          // 3. مستخدم جديد بدون صالة: توجيهه لصفحة التسجيل لإكمال بيانات الصالة
          navigate('/register');
        }
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleOAuthSession(session);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setErrorMessage('');
        setSuccessMessage('');
        setViewMode('update_password');
        return;
      }

      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        await handleOAuthSession(session);
      }
    });

    return () => {
      observer.disconnect();
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
          queryParams: {
            prompt: 'select_account'
          }
        }
      });

      if (error) throw error;
    } catch (error) {
      setErrorMessage(
        lang === 'ar'
          ? 'تعذر بدء تسجيل الدخول عبر Google: ' + error.message
          : 'Erreur Google Auth : ' + error.message
      );
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // 1. تسجيل الدخول عبر Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) throw error;

      if (data?.user) {
        // 2. التحقق إن كان الداخل موظفاً وحسابه موقوف
        const { data: staffRecord } = await supabase
          .from('hall_staff')
          .select('is_active')
          .eq('email', formData.email.trim().toLowerCase())
          .maybeSingle();

        if (staffRecord && staffRecord.is_active === false) {
          await supabase.auth.signOut();
          setErrorMessage(
            lang === 'ar'
              ? 'تم إيقاف حسابك مؤقتاً من طرف مالك القاعة.'
              : 'Votre compte a été suspendu par le propriétaire.'
          );
          return;
        }

        // 3. التوجيه المباشر إلى لوحة التحكم
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

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const redirectUrl = `${window.location.origin}/login`;
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: redirectUrl
      });

      if (error) throw error;

      const tCurrent = translations[lang] || translations.ar;
      setSuccessMessage(tCurrent.resetSentSuccess);
    } catch (error) {
      setErrorMessage(
        lang === 'ar'
          ? 'تعذر إرسال رابط الاستعادة: ' + error.message
          : 'Erreur lors de l’envoi : ' + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNewPassword = async (e) => {
    e.preventDefault();
    const tCurrent = translations[lang] || translations.ar;
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword.length < 6) {
      setErrorMessage(tCurrent.passTooShort);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(tCurrent.passMismatch);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSuccessMessage(tCurrent.passUpdatedSuccess);
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (error) {
      setErrorMessage(
        lang === 'ar'
          ? 'حدث خطأ أثناء تحديث كلمة المرور: ' + error.message
          : 'Erreur : ' + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const t = translations[lang] || translations.ar;

  const renderEyeButton = (isVisible, toggleFn) => (
    <button
      type="button"
      onClick={toggleFn}
      aria-label={isVisible ? 'Hide password' : 'Show password'}
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        ...(lang === 'ar' ? { left: '0.85rem' } : { right: '0.85rem' }),
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {isVisible ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      )}
    </button>
  );

  const passwordInputPadding = lang === 'ar' ? { paddingLeft: '2.75rem' } : { paddingRight: '2.75rem' };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.cardContainer}>
        
        {/* الترويسة */}
        <div className={styles.header}>
          {viewMode === 'login' && (
            <>
              <h1 className={styles.title}>
                {t.title} <span className={styles.brandName}>salati<span className={styles.dot}>.</span></span>
              </h1>
              <p className={styles.subtitle}>{t.subtitle}</p>
            </>
          )}

          {viewMode === 'forgot' && (
            <>
              <h1 className={styles.title}>{t.resetTitle}</h1>
              <p className={styles.subtitle}>{t.resetSubtitle}</p>
            </>
          )}

          {viewMode === 'update_password' && (
            <>
              <h1 className={styles.title}>{t.newPassTitle}</h1>
              <p className={styles.subtitle}>{t.newPassSubtitle}</p>
            </>
          )}
        </div>

        {/* تنبيه الخطأ */}
        {errorMessage && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#dc2626',
            padding: '0.75rem 1rem',
            borderRadius: '16px',
            fontSize: '0.875rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {errorMessage}
          </div>
        )}

        {/* تنبيه النجاح */}
        {successMessage && (
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: '#059669',
            padding: '0.85rem 1rem',
            borderRadius: '16px',
            fontSize: '0.875rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            textAlign: 'center',
            lineHeight: '1.6'
          }}>
            {successMessage}
          </div>
        )}

        {/* 1. نموذج الدخول الأساسي */}
        {viewMode === 'login' && (
          <>
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
                    href="#forgot-password" 
                    className={styles.forgotLink}
                    onClick={(e) => {
                      e.preventDefault();
                      setErrorMessage('');
                      setSuccessMessage('');
                      setResetEmail(formData.email);
                      setViewMode('forgot');
                    }}
                  >
                    {t.forgotPassword}
                  </a>
                </div>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                    placeholder={t.passwordPlaceholder}
                    value={formData.password}
                    onChange={handleChange}
                    style={{ width: '100%', ...passwordInputPadding }}
                  />
                  {renderEyeButton(showPassword, () => setShowPassword((prev) => !prev))}
                </div>
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
              <button type="submit" className={styles.submitBtn} disabled={loading || googleLoading}>
                {loading ? t.submittingBtn : t.submitBtn}
              </button>

            </form>

            {/* فاصل وزر تسجيل الدخول عبر Google */}
            <div className={styles.divider}>
              <span>{t.orDivider}</span>
            </div>

            <button
              type="button"
              className={styles.googleBtn}
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z" />
              </svg>
              <span>{googleLoading ? t.submittingBtn : t.googleBtn}</span>
            </button>
          </>
        )}

        {/* 2. نموذج طلب رابط استعادة كلمة المرور */}
        {viewMode === 'forgot' && (
          <form onSubmit={handleSendResetLink} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="resetEmail">{t.emailLabel}</label>
              <input
                type="email"
                id="resetEmail"
                required
                placeholder={t.emailPlaceholder}
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? t.sendingResetBtn : t.sendResetBtn}
            </button>

            <button
              type="button"
              className={styles.link}
              style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: '0.25rem' }}
              onClick={() => {
                setErrorMessage('');
                setSuccessMessage('');
                setViewMode('login');
              }}
            >
              {t.backToLogin}
            </button>
          </form>
        )}

        {/* 3. نموذج تعيين كلمة المرور الجديدة بعد فتح رابط البريد */}
        {viewMode === 'update_password' && (
          <form onSubmit={handleUpdateNewPassword} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="newPassword">{t.newPassLabel}</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', ...passwordInputPadding }}
                />
                {renderEyeButton(showNewPassword, () => setShowNewPassword((prev) => !prev))}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">{t.confirmPassLabel}</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', ...passwordInputPadding }}
                />
                {renderEyeButton(showConfirmPassword, () => setShowConfirmPassword((prev) => !prev))}
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? t.savingNewPassBtn : t.saveNewPassBtn}
            </button>
          </form>
        )}

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