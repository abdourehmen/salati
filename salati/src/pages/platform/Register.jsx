import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import styles from './Register.module.css';

// دالة تنقل محلية لتفادي التداخل
const navigate = (to) => {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new Event('popstate'));
};

export default function Register() {
  const params = new URLSearchParams(window.location.search);
  const rawPlan = params.get('plan');
  const selectedPlan = ['basic', 'pro', 'enterprise'].includes(rawPlan) ? rawPlan : 'basic';
  const rawCycle = params.get('cycle');
  const selectedCycle = ['monthly', 'semi_annual', 'annual'].includes(rawCycle) ? rawCycle : 'monthly';

  const [oauthUser, setOauthUser] = useState(null);
  const [formData, setFormData] = useState({
    hallName: '',
    fullName: '',
    phone: '',
    wilaya: '16 - الجزائر',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // تعبئة البريد الإلكتروني والاسم تلقائياً إذا كان المستخدم قادماً من تسجيل الدخول عبر Google
  useEffect(() => {
    const fillUserFromSession = async (session) => {
      if (!session?.user) return;
      const userId = session.user.id;
      const userEmail = session.user.email?.trim().toLowerCase();

      // إذا كان يملك صالة مسجلة بالفعل أو موظفاً نشطاً، توجيهه مباشرة للوحة التحكم
      const { data: existingHall } = await supabase
        .from('halls')
        .select('id')
        .eq('owner_id', userId)
        .maybeSingle();

      if (existingHall) {
        navigate('/admin');
        return;
      }

      if (userEmail) {
        const { data: staffRecord } = await supabase
          .from('hall_staff')
          .select('is_active')
          .ilike('email', userEmail)
          .maybeSingle();

        if (staffRecord && staffRecord.is_active !== false) {
          navigate('/admin');
          return;
        }
      }

      setOauthUser(session.user);
      setFormData((prev) => ({
        ...prev,
        email: session.user.email || prev.email,
        fullName:
          prev.fullName ||
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          ''
      }));
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fillUserFromSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        fillUserFromSession(session);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    setErrorMessage('');

    try {
      const currentSearch = window.location.search || '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/register${currentSearch}`
        }
      });

      if (error) throw error;
    } catch (error) {
      setErrorMessage('تعذر المتابعة باستخدام Google: ' + error.message);
      setGoogleLoading(false);
    }
  };

  const generateSlug = (name, userId = '') => {
    const suffix = userId ? `-${String(userId).slice(0, 5)}` : `-${Date.now().toString().slice(-4)}`;
    if (!name) return `hall${suffix}`;
    
    const cleaned = name
      .trim()
      .toLowerCase()
      .replace(/[^\w\u0600-\u06FF\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return cleaned ? `${cleaned}${suffix}` : `hall${suffix}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      let user = oauthUser;

      if (user) {
        // المستخدم مسجل الدخول مسبقاً عبر Google: نُحدّث بياناته وكلمة المرور
        const updatePayload = {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            hall_name: formData.hallName
          }
        };
        if (formData.password && formData.password.length >= 6) {
          updatePayload.password = formData.password;
        }
        await supabase.auth.updateUser(updatePayload);
      } else {
        // 1. إنشاء الحساب العادي في Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              phone: formData.phone,
              hall_name: formData.hallName
            }
          }
        });

        if (authError) throw authError;
        user = authData.user;
      }

      if (user) {
        // جلب مدة الفترة التجريبية من إعدادات المنصة (الافتراضي 14 يوماً)
        let trialDays = 14;
        const { data: settingsData } = await supabase
          .from('platform_settings')
          .select('trial_days')
          .eq('id', 1)
          .maybeSingle();

        if (settingsData?.trial_days) {
          trialDays = Number(settingsData.trial_days) || 14;
        }

        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + trialDays);

        // 2. إنشاء سجل القاعة في جدول halls مربوطاً بمعرّف المالك owner_id
        const generatedSlug = generateSlug(formData.hallName, user.id);

        const { error: hallError } = await supabase
          .from('halls')
          .insert([
            {
              owner_id: user.id,
              name: formData.hallName.trim(),
              slug: generatedSlug,
              phone: formData.phone.trim(),
              address: formData.wilaya,
              wilaya: formData.wilaya,
              capacity: 500,
              plan_tier: selectedPlan,
              billing_cycle: selectedCycle,
              is_active: true,
              subscription_status: 'trial',
              subscription_ends_at: trialEnd.toISOString()
            }
          ]);

        if (hallError) {
          console.error('تنبيه: تم إنشاء الحساب ولكن فشل حفظ القاعة:', hallError.message);
        }

        // 3. التوجيه الفوري إلى لوحة التحكم
        navigate('/admin');
      }
    } catch (error) {
      setErrorMessage(error.message || 'حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.cardContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            أنشئ حساب صالتك على <span className={styles.brandName}>salati<span className={styles.dot}>.</span></span>
          </h2>
          <p className={styles.subtitle}>
            انضم إلى منصة salati وابدأ في استلام طلبات المعاينة والحجوزات أونلاين.
          </p>
        </div>

        {errorMessage && (
          <div className={styles.errorBanner}>
            {errorMessage}
          </div>
        )}

        {/* زر التسجيل السريع عبر Google (يظهر قبل الربط ويختفي بعد تعبئة البريد تلقائياً) */}
        {!oauthUser && (
          <>
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={loading || googleLoading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '0.8rem 1.25rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: googleLoading ? 'not-allowed' : 'pointer',
                opacity: googleLoading ? 0.65 : 1,
                transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z" />
              </svg>
              <span>{googleLoading ? 'جاري الاتصال بـ Google...' : 'المتابعة باستخدام Google'}</span>
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              textAlign: 'center',
              margin: '1.25rem 0',
              color: '#64748b',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              <span style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }} />
              <span style={{ padding: '0 0.75rem' }}>أو أكمل البيانات يدوياً</span>
              <span style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }} />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.gridRow}>
            <div className={styles.inputGroup}>
              <label>اسم الصالة</label>
              <input
                type="text"
                name="hallName"
                required
                value={formData.hallName}
                onChange={handleChange}
                placeholder="الأفراح"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>الاسم واللقب</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="عبدالرحمن"
              />
            </div>
          </div>

          <div className={styles.gridRow}>
            <div className={styles.inputGroup}>
              <label>رقم الهاتف</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="0562881397"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>الولاية</label>
              <select name="wilaya" value={formData.wilaya} onChange={handleChange}>
                <option value="16 - الجزائر">16 - الجزائر</option>
                <option value="35 - بومرداس">35 - بومرداس</option>
                <option value="09 - البليدة">09 - البليدة</option>
                <option value="15 - تيزي وزو">15 - تيزي وزو</option>
                <option value="31 - وهران">31 - وهران</option>
                <option value="25 - قسنطينة">25 - قسنطينة</option>
              </select>
            </div>
          </div>

          <div className={styles.gridRow}>
            <div className={styles.inputGroup}>
              <label>البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                required
                readOnly={Boolean(oauthUser)}
                value={formData.email}
                onChange={handleChange}
                placeholder="abdourehmen4@gmail.com"
                style={oauthUser ? { backgroundColor: '#f1f5f9', cursor: 'not-allowed' } : undefined}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>كلمة المرور</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading || googleLoading}>
            {loading ? 'جاري إنشاء الحساب وتفعيل الصالة...' : 'إنشاء الحساب وتفعيل الصالة'}
          </button>
        </form>

        <div className={styles.footer}>
          <span>لديك حساب بالفعل؟ </span>
          <button type="button" className={styles.link} onClick={() => navigate('/login')}>
            تسجيل الدخول
          </button>
        </div>
      </div>
    </div>
  );
}