import { useState } from 'react';
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

  const [formData, setFormData] = useState({
    hallName: '',
    fullName: '',
    phone: '',
    wilaya: '16 - الجزائر',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
      // 1. إنشاء الحساب في Supabase Auth
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

      const user = authData.user;

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
                value={formData.email}
                onChange={handleChange}
                placeholder="abdourehmen4@gmail.com"
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

          <button type="submit" className={styles.submitBtn} disabled={loading}>
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