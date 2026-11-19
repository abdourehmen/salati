import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import styles from './SubscriptionTab.module.css';

export default function SubscriptionTab({
  isAr = true,
  isLoading = false,
  hallData,
  platformSettings
}) {
  const planTier = hallData?.plan_tier || 'basic';
  const currentBillingCycle = hallData?.billing_cycle || 'monthly';
  const subStatus = hallData?.subscription_status || 'trial';

  const localeStr = isAr ? 'ar-DZ' : 'fr-FR';
  const currencyLabel = isAr ? 'دج' : 'DA';

  const [selectedCycle, setSelectedCycle] = useState(currentBillingCycle);

  // حالة نافذة الدفع (BaridiMob / USDT / Visa)
  const [checkoutModal, setCheckoutModal] = useState(null); // { planKey, cycleKey, amountDzd, amountUsd }
  const [paymentMethod, setPaymentMethod] = useState('baridimob'); // 'baridimob' | 'usdt' | 'visa'
  const [transactionRef, setTransactionRef] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentFeedback, setPaymentFeedback] = useState({ type: '', text: '' });
  const [copiedField, setCopiedField] = useState('');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const basicMonthly = Number(platformSettings?.basic_monthly_price || 3500);
  const proMonthly = Number(platformSettings?.pro_monthly_price || 6500);
  const discount6 = Number(platformSettings?.semi_annual_discount || 10);
  const discount12 = Number(platformSettings?.annual_discount || 20);
  const dzdToUsdtRate = Number(platformSettings?.dzd_to_usdt_rate || 245);

  const calculatePrice = (monthlyBase, cycle) => {
    if (!monthlyBase) return 0;
    if (cycle === 'semi_annual') {
      return Math.round(monthlyBase * 6 * (1 - discount6 / 100));
    }
    if (cycle === 'annual') {
      return Math.round(monthlyBase * 12 * (1 - discount12 / 100));
    }
    return monthlyBase;
  };

  // جلب سجل مدفوعات الصالة السابقة
  const fetchPayments = async () => {
    if (!hallData?.id) return;
    setLoadingPayments(true);
    try {
      const { data } = await supabase
        .from('subscription_payments')
        .select('*')
        .eq('hall_id', hallData.id)
        .order('created_at', { ascending: false });

      if (data) setPaymentHistory(data);
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [hallData?.id]);

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const openPaymentModal = (targetPlanKey, cycleKey) => {
    const monthlyBase = targetPlanKey === 'pro' ? proMonthly : basicMonthly;
    const amountDzd = calculatePrice(monthlyBase, cycleKey);
    const amountUsd = Number((amountDzd / dzdToUsdtRate).toFixed(2));

    setPaymentFeedback({ type: '', text: '' });
    setTransactionRef('');
    setReceiptFile(null);
    setPaymentMethod('baridimob');
    setCheckoutModal({
      planKey: targetPlanKey,
      cycleKey,
      amountDzd,
      amountUsd
    });
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!hallData?.id || !checkoutModal) return;

    if (!receiptFile && !transactionRef.trim()) {
      setPaymentFeedback({
        type: 'error',
        text: isAr
          ? 'يرجى إرفاق صورة وصل الدفع أو إدخال رقم العملية للمراجعة.'
          : 'Veuillez joindre le reçu de paiement ou saisir la référence de transaction.'
      });
      return;
    }

    setSubmittingPayment(true);
    setPaymentFeedback({ type: '', text: '' });

    try {
      let publicReceiptUrl = null;

      if (receiptFile) {
        const ext = receiptFile.name.split('.').pop() || 'jpg';
        const filePath = `${hallData.id}/${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('payment-receipts')
          .upload(filePath, receiptFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('payment-receipts')
          .getPublicUrl(filePath);

        publicReceiptUrl = urlData?.publicUrl || null;
      }

      const { error: insertError } = await supabase
        .from('subscription_payments')
        .insert([
          {
            hall_id: hallData.id,
            hall_name: hallData.name || '',
            plan_tier: checkoutModal.planKey,
            billing_cycle: checkoutModal.cycleKey,
            amount_dzd: checkoutModal.amountDzd,
            amount_usd: checkoutModal.amountUsd,
            payment_method: paymentMethod,
            transaction_ref: transactionRef.trim() || null,
            receipt_url: publicReceiptUrl,
            status: 'pending'
          }
        ]);

      if (insertError) throw insertError;

      setPaymentFeedback({
        type: 'success',
        text: isAr
          ? '✅ تم إرسال إثبات الدفع بنجاح! سيتم التحقق وتفعيل اشتراك صالتك خلال دقائق.'
          : '✅ Preuve de paiement envoyée ! Votre abonnement sera activé sous quelques minutes.'
      });

      await fetchPayments();
      setTimeout(() => {
        setCheckoutModal(null);
      }, 1800);
    } catch (err) {
      setPaymentFeedback({
        type: 'error',
        text:
          (isAr ? 'حدث خطأ أثناء إرسال الوصل: ' : 'Erreur lors de l’envoi : ') +
          (err.message || '')
      });
    } finally {
      setSubmittingPayment(false);
    }
  };

  const planMeta = {
    basic: {
      name: isAr ? 'الباقة الأساسية (Essentielle)' : 'Offre Essentielle',
      tagline: isAr
        ? 'كل الأدوات الأساسية لإدارة حجوزات الصالة وتنظيم المواعيد'
        : 'Tous les outils essentiels pour gérer les réservations de votre salle',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
      monthlyPrice: basicMonthly
    },
    pro: {
      name: isAr ? 'الباقة الاحترافية (Pro)' : 'Offre Pro',
      tagline: isAr
        ? 'أدوات متقدمة لزيادة التقييمات، أرشفة المعاينات، ونمو حجوزاتك'
        : 'Outils avancés pour booster vos avis Google et développer vos réservations',
      gradient: 'linear-gradient(135deg, #0039a6 0%, #0052cc 55%, #1d4ed8 100%)',
      monthlyPrice: proMonthly
    },
    enterprise: {
      name: isAr ? 'باقة المؤسسات (Entreprise)' : 'Offre Entreprise',
      tagline: isAr
        ? 'حلول مخصصة للمجموعات والقاعات متعددة الفروع مع مرافقة خاصة'
        : 'Solutions sur mesure pour groupes et salles multi-espaces avec suivi dédié',
      gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)',
      monthlyPrice: 0
    }
  };

  const activePlan = planMeta[planTier] || planMeta.basic;

  const cycleLabels = {
    monthly: {
      title: isAr ? 'شهري' : 'Mensuel',
      unit: isAr ? '/ شهر' : '/ mois',
      badge: null
    },
    semi_annual: {
      title: isAr ? '6 أشهر' : '6 mois',
      unit: isAr ? '/ 6 أشهر' : '/ 6 mois',
      badge: isAr ? `وفّر ${discount6}%` : `-${discount6}%`
    },
    annual: {
      title: isAr ? 'سنوي' : 'Annuel',
      unit: isAr ? '/ سنة' : '/ an',
      badge: isAr ? `وفّر ${discount12}%` : `-${discount12}%`
    }
  };

  const statusMap = {
    trial: {
      label: isAr ? 'فترة تجريبية نشطة' : 'Période d’essai active',
      bg: 'rgba(254, 243, 199, 0.95)',
      color: '#92400e',
      dot: '#f59e0b'
    },
    active: {
      label: isAr ? 'اشتراك نشط ومفعّل' : 'Abonnement actif',
      bg: 'rgba(220, 252, 231, 0.95)',
      color: '#166534',
      dot: '#22c55e'
    },
    expired: {
      label: isAr ? 'منتهي الصلاحية' : 'Expiré',
      bg: 'rgba(254, 226, 226, 0.95)',
      color: '#991b1b',
      dot: '#ef4444'
    },
    suspended: {
      label: isAr ? 'موقوف مؤقتاً' : 'Suspendu',
      bg: 'rgba(254, 226, 226, 0.95)',
      color: '#991b1b',
      dot: '#ef4444'
    }
  };

  const currentStatus = statusMap[subStatus] || statusMap.trial;

  const now = new Date();
  const endDateObj = hallData?.subscription_ends_at
    ? new Date(hallData.subscription_ends_at)
    : null;

  const createdDateObj = hallData?.created_at ? new Date(hallData.created_at) : null;

  const diffMs = endDateObj ? endDateObj - now : null;
  const daysLeft = diffMs !== null ? Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24))) : null;
  const hoursLeft =
    diffMs !== null && diffMs > 0
      ? Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      : 0;

  const totalCycleDays =
    subStatus === 'trial'
      ? 14
      : currentBillingCycle === 'annual'
      ? 365
      : currentBillingCycle === 'semi_annual'
      ? 180
      : 30;

  const progressPercent =
    daysLeft === null
      ? 100
      : Math.min(100, Math.max(4, Math.round((daysLeft / totalCycleDays) * 100)));

  const formattedEndDate = endDateObj
    ? endDateObj.toLocaleDateString(localeStr, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : isAr
    ? 'غير محدد'
    : 'Non défini';

  const formattedStartDate = createdDateObj
    ? createdDateObj.toLocaleDateString(localeStr, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : '—';

  const supportPhone = (platformSettings?.support_whatsapp || '213550000000').replace(/\D/g, '');

  const buildWaLink = (targetPlanKey, cycleKey) => {
    const targetName = planMeta[targetPlanKey]?.name || activePlan.name;
    const cycleName = cycleLabels[cycleKey]?.title || '';
    const amount = calculatePrice(planMeta[targetPlanKey]?.monthlyPrice || 0, cycleKey);
    const priceStr = amount ? ` (${amount.toLocaleString(localeStr)} ${currencyLabel})` : '';

    const text = isAr
      ? `مرحباً فريق Salati، أرغب في تفعيل / تجديد اشتراك صالة "${
          hallData?.name || ''
        }" على باقة: ${targetName} - المدة: ${cycleName}${priceStr}.`
      : `Bonjour Salati, je souhaite renouveler/activer l'abonnement de "${
          hallData?.name || ''
        }" sur l'offre ${targetName} (${cycleName}${priceStr}).`;

    return `https://wa.me/${supportPhone}?text=${encodeURIComponent(text)}`;
  };

  const comparisonPlans = [
    {
      key: 'basic',
      title: isAr ? 'الباقة الأساسية' : 'Essentielle',
      subtitle: isAr ? 'للانطلاق وتنظيم الحجوزات' : 'Pour démarrer sereinement',
      monthlyPrice: basicMonthly,
      popular: false,
      features: [
        { text: isAr ? 'موقع إلكتروني خاص بالصالة ومعرض صور' : 'Site web dédié & galerie photos', ok: true },
        { text: isAr ? 'تقويم الحجوزات ومنع تضارب المواعيد' : 'Calendrier & anti-conflit', ok: true },
        { text: isAr ? 'إدارة الطلبيات والعربون والعقود الرقمية' : 'Demandes, acomptes & contrats', ok: true },
        { text: isAr ? 'إدارة فريق العمل والصلاحيات' : 'Gestion d’équipe & permissions', ok: true },
        { text: isAr ? 'كود QR الذكي لتقييمات Google Maps' : 'QR Code avis Google Maps', ok: false }
      ]
    },
    {
      key: 'pro',
      title: isAr ? 'الباقة الاحترافية Pro' : 'Offre Pro',
      subtitle: isAr ? 'الأكثر طلباً لزيادة التقييمات والمبيعات' : 'La plus choisie pour croître',
      monthlyPrice: proMonthly,
      popular: true,
      features: [
        { text: isAr ? 'جميع ميزات الباقة الأساسية بالكامل' : 'Toutes les fonctions Essentielle', ok: true },
        { text: isAr ? 'كود QR الذكي لزيادة تقييمات Google Maps' : 'QR Code intelligent avis Google', ok: true },
        { text: isAr ? 'بطاقة تقييم جاهزة للطباعة داخل الصالة' : 'Carte d’avis imprimable en salle', ok: true },
        { text: isAr ? 'أولوية قصوى في الدعم الفني والتحديثات' : 'Support prioritaire & nouveautés', ok: true },
        { text: isAr ? 'توثيق ومعاينة الصالة قبل التسليم' : 'Inspection complète avant remise', ok: true }
      ]
    }
  ];

  const isUrgent = daysLeft !== null && daysLeft <= 5;
  const hasPendingPayment = paymentHistory.some((p) => p.status === 'pending');

  if (isLoading) {
    return (
      <div dir={isAr ? 'rtl' : 'ltr'} className={styles.wrapper} aria-busy="true">
        <div className={styles.headerRow}>
          <div style={{ flex: 1 }}>
            <div className={`${styles.skeletonBase} ${styles.skeletonTitle}`} />
            <div className={`${styles.skeletonBase} ${styles.skeletonSub}`} />
          </div>
          <div className={`${styles.skeletonBase} ${styles.skeletonBtn}`} />
        </div>

        <div className={`${styles.skeletonBase} ${styles.skeletonHero}`} />

        <div className={styles.infoGrid}>
          {[0, 1, 2].map((idx) => (
            <div key={idx} className={styles.infoCard}>
              <div className={`${styles.skeletonBase} ${styles.skeletonInfoLineSm}`} />
              <div className={`${styles.skeletonBase} ${styles.skeletonInfoLineLg}`} />
              <div className={`${styles.skeletonBase} ${styles.skeletonInfoLineSm}`} />
            </div>
          ))}
        </div>

        <div className={styles.plansSection}>
          <div className={styles.plansGrid}>
            {[0, 1].map((idx) => (
              <div key={idx} className={`${styles.skeletonBase} ${styles.skeletonPlanCard}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className={styles.wrapper}>
      {/* تنبيه وجود طلب دفع قيد المراجعة */}
      {hasPendingPayment && (
        <div className={styles.pendingAlertBanner}>
          {isAr
            ? '⏳ لديك طلب دفع قيد المراجعة حالياً — سيتم تفعيل اشتراكك فور تأكيد التحويل.'
            : '⏳ Vous avez un paiement en cours de vérification — votre abonnement sera activé sous peu.'}
        </div>
      )}

      {/* رأس الصفحة */}
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.pageMainTitle}>
            {isAr ? 'إدارة الاشتراك والباقة' : 'Abonnement & Facturation'}
          </h2>
          <p className={styles.pageSubTitle}>
            {isAr
              ? 'راقب حالة اشتراكك، المدة المتبقية، وقم بالتجديد أو الترقية في أي وقت'
              : 'Suivez votre forfait actif, votre échéance et gérez vos renouvellements'}
          </p>
        </div>

        <a
          href={buildWaLink(planTier, selectedCycle)}
          target="_blank"
          rel="noreferrer"
          className={styles.supportBtn}
        >
          <span>💬</span>
          <span>{isAr ? 'تواصل مع قسم الاشتراكات' : 'Contacter le service client'}</span>
        </a>
      </div>

      {/* البطاقة الرئيسية الفاخرة (Hero Subscription Card) */}
      <div className={styles.heroCard} style={{ background: activePlan.gradient }}>
        <div className={styles.heroGlowOrb} />

        <div className={styles.heroTopFlex}>
          <div className={styles.heroDetailsCol}>
            <div className={styles.heroBadgesRow}>
              <span
                className={styles.heroStatusBadge}
                style={{
                  background: currentStatus.bg,
                  color: currentStatus.color
                }}
              >
                <span
                  className={styles.statusDot}
                  style={{ background: currentStatus.dot }}
                />
                {currentStatus.label}
              </span>

              <span className={styles.heroCycleBadge}>
                {cycleLabels[currentBillingCycle]?.title || (isAr ? 'شهري' : 'Mensuel')}
              </span>
            </div>

            <h3 className={styles.heroPlanTitle}>
              💎 {activePlan.name}
            </h3>
            <p className={styles.heroPlanTagline}>
              {activePlan.tagline}
            </p>
          </div>

          {/* صندوق العد التنازلي */}
          <div
            className={styles.countdownBox}
            style={{ textAlign: isAr ? 'right' : 'left' }}
          >
            <span className={styles.countdownLabel}>
              {isAr ? 'المدة المتبقية في الاشتراك' : 'Temps restant'}
            </span>
            <div className={styles.countdownNumbersRow}>
              <strong className={styles.countdownBigDays}>
                {daysLeft !== null ? daysLeft.toLocaleString(localeStr) : '∞'}
              </strong>
              <span className={styles.countdownUnitText}>
                {daysLeft !== null
                  ? isAr
                    ? `يوم و ${hoursLeft} ساعة`
                    : `${daysLeft <= 1 ? 'jour' : 'jours'} et ${hoursLeft}h`
                  : isAr
                  ? 'غير محدود'
                  : 'Illimité'}
              </span>
            </div>
            <div className={styles.countdownExpiry}>
              {isAr ? 'ينتهي في:' : 'Expire le :'} {formattedEndDate}
            </div>
          </div>
        </div>

        {/* شريط التقدم المرئي */}
        {daysLeft !== null && (
          <div className={styles.heroProgressWrap}>
            <div className={styles.heroProgressMeta}>
              <span>
                {isUrgent
                  ? isAr
                    ? '⚠️ اقترب موعد انتهاء اشتراكك — جدد الآن لتجنب توقف الخدمة'
                    : '⚠️ Expiration proche — Renouvelez maintenant'
                  : isAr
                  ? 'حالة صلاحية الاشتراك'
                  : 'Validité de la période en cours'}
              </span>
              <span dir="ltr">{progressPercent}%</span>
            </div>
            <div className={styles.heroProgressTrack}>
              <div
                className={styles.heroProgressFill}
                style={{
                  width: `${progressPercent}%`,
                  background: isUrgent ? '#fbbf24' : '#38bdf8'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* شبكة المعلومات السريعة (3 بطاقات) */}
      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>
            🏰 {isAr ? 'الصالة المسجلة' : 'Salle enregistrée'}
          </span>
          <strong className={styles.infoValueDark}>
            {hallData?.name || (isAr ? 'صالتي' : 'Ma Salle')}
          </strong>
          <small className={styles.infoSubMuted}>
            {isAr ? 'تاريخ الانضمام:' : 'Inscrit le :'} {formattedStartDate}
          </small>
        </div>

        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>
            💳 {isAr ? 'قيمة الباقة الحالية' : 'Tarif de votre offre'}
          </span>
          <strong className={styles.infoValueBlue}>
            {activePlan.monthlyPrice
              ? `${calculatePrice(activePlan.monthlyPrice, currentBillingCycle).toLocaleString(
                  localeStr
                )} ${currencyLabel}`
              : isAr
              ? 'تسعيرة مخصصة'
              : 'Sur mesure'}
          </strong>
          <small className={styles.infoSubSlate}>
            {cycleLabels[currentBillingCycle]?.title}
          </small>
        </div>

        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>
            🛡️ {isAr ? 'طرق الدفع والتفعيل' : 'Paiement & Activation'}
          </span>
          <strong className={styles.infoValueDark} style={{ fontSize: '1rem' }}>
            {isAr ? 'بريدي موب / CCP / USDT / Visa' : 'BaridiMob / CCP / USDT / Visa'}
          </strong>
          <small className={styles.infoSubGreen}>
            {isAr ? 'تفعيل سريع بعد إرسال إثبات الدفع' : 'Activation rapide après justificatif'}
          </small>
        </div>
      </div>

      {/* قسم اختيار مدة التجديد ومقارنة الباقات */}
      <div className={styles.plansSection}>
        <div className={styles.plansSectionHeader}>
          <div>
            <h3 className={styles.plansSectionTitle}>
              {isAr ? 'باقات الاشتراك والتجديد' : 'Offres & Renouvellement'}
            </h3>
            <p className={styles.plansSectionSub}>
              {isAr
                ? 'اختر مدة الاشتراك المناسبة للاستفادة من تخفيضات الدفع النصف سنوي والسنوي'
                : 'Choisissez votre durée pour profiter des remises semestrielles et annuelles'}
            </p>
          </div>

          {/* أزرار تبديل المدة (شهري / 6 أشهر / سنوي) */}
          <div className={styles.cycleTabsWrap}>
            {Object.entries(cycleLabels).map(([key, info]) => {
              const active = selectedCycle === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedCycle(key)}
                  className={`${styles.cycleTabBtn} ${active ? styles.cycleTabBtnActive : ''}`}
                >
                  <span>{info.title}</span>
                  {info.badge && (
                    <span className={styles.cycleDiscountBadge}>{info.badge}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* بطاقات مقارنة الباقات */}
        <div className={styles.plansGrid}>
          {comparisonPlans.map((plan) => {
            const isCurrent = planTier === plan.key;
            const computedTotal = calculatePrice(plan.monthlyPrice, selectedCycle);

            return (
              <div
                key={plan.key}
                className={`${styles.planCard} ${plan.popular ? styles.planCardPopular : ''}`}
              >
                <div>
                  <div className={styles.planCardHeader}>
                    <h4 className={styles.planCardTitle}>{plan.title}</h4>

                    {isCurrent ? (
                      <span className={styles.currentPlanBadge}>
                        {isAr ? 'باقتك الحالية' : 'Votre offre'}
                      </span>
                    ) : plan.popular ? (
                      <span className={styles.popularPlanBadge}>
                        {isAr ? 'موصى بها' : 'Recommandée'}
                      </span>
                    ) : null}
                  </div>

                  <p className={styles.planCardSubtitle}>{plan.subtitle}</p>

                  <div className={styles.planPriceBox}>
                    <span className={styles.planPriceNumber}>
                      {computedTotal.toLocaleString(localeStr)}
                    </span>
                    <span className={styles.planPriceUnit}>
                      {currencyLabel} {cycleLabels[selectedCycle]?.unit}
                    </span>
                  </div>

                  <ul className={styles.planFeaturesList}>
                    {plan.features.map((f, idx) => (
                      <li
                        key={idx}
                        className={styles.planFeatureItem}
                        style={{ color: f.ok ? '#1e293b' : '#94a3b8' }}
                      >
                        <span>{f.ok ? '✅' : '✕'}</span>
                        <span style={{ textDecoration: f.ok ? 'none' : 'line-through' }}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => openPaymentModal(plan.key, selectedCycle)}
                  className={styles.ctaButton}
                  style={{
                    width: '100%',
                    border: 'none',
                    cursor: 'pointer',
                    background: isCurrent ? '#16a34a' : plan.popular ? '#0052cc' : '#0f172a'
                  }}
                >
                  {isCurrent
                    ? isAr
                      ? '🔄 تجديد هذه الباقة الآن'
                      : '🔄 Renouveler cette offre'
                    : plan.key === 'pro' && planTier === 'basic'
                    ? isAr
                      ? '🚀 ترقية إلى الباقة الاحترافية'
                      : '🚀 Passer à l’offre Pro'
                    : isAr
                    ? 'اختيار هذه الباقة'
                    : 'Choisir cette offre'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* سجل طلبات الدفع السابقة */}
      {loadingPayments ? (
        <div className={styles.historyCard} aria-busy="true">
          <div className={`${styles.skeletonBase} ${styles.skeletonHistoryTitle}`} />
          <div className={`${styles.skeletonBase} ${styles.skeletonHistoryRow}`} />
        </div>
      ) : (
        paymentHistory.length > 0 && (
          <div className={styles.historyCard}>
            <h4 className={styles.historyTitle}>
              {isAr ? 'سجل عمليات الدفع' : 'Historique des paiements'}
            </h4>
            <div className={styles.historyList}>
              {paymentHistory.map((item) => {
                const badge =
                  item.status === 'approved'
                    ? { bg: '#dcfce7', color: '#166534', label: isAr ? 'مقبول ومفعّل' : 'Approuvé' }
                    : item.status === 'rejected'
                    ? { bg: '#fee2e2', color: '#991b1b', label: isAr ? 'مرفوض' : 'Rejeté' }
                    : { bg: '#fef3c7', color: '#92400e', label: isAr ? 'قيد المراجعة' : 'En attente' };

                const methodLabel =
                  item.payment_method === 'usdt'
                    ? 'USDT (Crypto)'
                    : item.payment_method === 'visa'
                    ? 'Visa / Mastercard'
                    : 'BaridiMob / CCP';

                return (
                  <div key={item.id} className={styles.historyRow}>
                    <div>
                      <strong className={styles.historyPlanName}>
                        {item.plan_tier === 'pro' ? 'Offre Pro' : 'Offre Essentielle'} •{' '}
                        {cycleLabels[item.billing_cycle]?.title || item.billing_cycle}
                      </strong>
                      <div className={styles.historyMeta}>
                        {methodLabel} •{' '}
                        <span dir="ltr">
                          {item.payment_method === 'usdt' || item.payment_method === 'visa'
                            ? `$${item.amount_usd} (${Number(item.amount_dzd).toLocaleString(
                                localeStr
                              )} ${currencyLabel})`
                            : `${Number(item.amount_dzd).toLocaleString(localeStr)} ${currencyLabel}`}
                        </span>{' '}
                        • {new Date(item.created_at).toLocaleDateString(localeStr)}
                      </div>
                    </div>

                    <span
                      className={styles.historyStatusBadge}
                      style={{
                        background: badge.bg,
                        color: badge.color
                      }}
                    >
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}

      {/* نافذة الدفع (BaridiMob / العملات الرقمية USDT / بطاقة Visa) */}
      {checkoutModal && (
        <div
          className={styles.checkoutBackdrop}
          onClick={() => !submittingPayment && setCheckoutModal(null)}
        >
          <div
            dir={isAr ? 'rtl' : 'ltr'}
            className={styles.checkoutModalBox}
            onClick={(e) => e.stopPropagation()}
          >
            {/* رأس النافذة */}
            <div className={styles.checkoutHeader}>
              <div>
                <h3 className={styles.checkoutTitle}>
                  {isAr ? 'إتمام الدفع وتفعيل الاشتراك' : 'Finaliser le paiement'}
                </h3>
                <p className={styles.checkoutSubtitle}>
                  {checkoutModal.planKey === 'pro' ? 'Offre Pro' : 'Offre Essentielle'} •{' '}
                  {cycleLabels[checkoutModal.cycleKey]?.title}
                </p>
              </div>
              <button
                type="button"
                aria-label={isAr ? 'إغلاق' : 'Fermer'}
                onClick={() => !submittingPayment && setCheckoutModal(null)}
                className={styles.checkoutCloseBtn}
              >
                ✕
              </button>
            </div>

            {/* أزرار اختيار طريقة الدفع */}
            <div className={styles.paymentMethodsGrid}>
              {[
                { id: 'baridimob', label: 'BaridiMob / CCP', icon: '🇩🇿' },
                { id: 'usdt', label: 'USDT Crypto', icon: '🪙' },
                { id: 'visa', label: 'Visa / Card', icon: '💳' }
              ].map((m) => {
                const active = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`${styles.paymentMethodBtn} ${
                      active ? styles.paymentMethodBtnActive : ''
                    }`}
                  >
                    <span style={{ fontSize: '1.15rem' }}>{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* تفاصيل التحويل حسب الطريقة المختارة */}
            <div className={styles.paymentDetailsBox}>
              {paymentMethod === 'baridimob' && (
                <>
                  <div className={styles.paymentAmountRow}>
                    <span className={styles.paymentAmountLabel}>
                      {isAr ? 'المبلغ المطلوب تحويله:' : 'Montant à transférer :'}
                    </span>
                    <strong className={styles.paymentAmountBlue} dir="ltr">
                      {checkoutModal.amountDzd.toLocaleString(localeStr)} {currencyLabel}
                    </strong>
                  </div>

                  {platformSettings?.account_holder_name && (
                    <div className={styles.beneficiaryRow}>
                      <strong>{isAr ? 'اسم المستفيد:' : 'Bénéficiaire :'}</strong>{' '}
                      {platformSettings.account_holder_name}
                    </div>
                  )}

                  {platformSettings?.baridimob_rip && (
                    <div className={styles.copyFieldRow}>
                      <div className={styles.copyFieldValue}>
                        <strong>RIP (BaridiMob):</strong>{' '}
                        <span dir="ltr">{platformSettings.baridimob_rip}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(platformSettings.baridimob_rip, 'rip')}
                        className={styles.copyMiniBtn}
                      >
                        {copiedField === 'rip' ? '✓' : isAr ? 'نسخ' : 'Copier'}
                      </button>
                    </div>
                  )}

                  {platformSettings?.ccp_account && (
                    <div className={styles.copyFieldRow}>
                      <div className={styles.copyFieldValue}>
                        <strong>CCP:</strong>{' '}
                        <span dir="ltr">{platformSettings.ccp_account}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(platformSettings.ccp_account, 'ccp')}
                        className={styles.copyMiniBtn}
                      >
                        {copiedField === 'ccp' ? '✓' : isAr ? 'نسخ' : 'Copier'}
                      </button>
                    </div>
                  )}
                </>
              )}

              {paymentMethod === 'usdt' && (
                <>
                  <div className={styles.paymentAmountRow}>
                    <span className={styles.paymentAmountLabel}>
                      {isAr ? 'المبلغ المطلوب (USDT):' : 'Montant (USDT) :'}
                    </span>
                    <strong className={styles.paymentAmountGreen} dir="ltr">
                      {checkoutModal.amountUsd} USDT
                    </strong>
                  </div>

                  {platformSettings?.usdt_trc20_address && (
                    <div className={styles.copyFieldRow}>
                      <div className={styles.copyFieldValue}>
                        <strong>USDT (TRC20):</strong>{' '}
                        <span dir="ltr">{platformSettings.usdt_trc20_address}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(platformSettings.usdt_trc20_address, 'trc20')}
                        className={styles.copyMiniBtn}
                      >
                        {copiedField === 'trc20' ? '✓' : isAr ? 'نسخ' : 'Copier'}
                      </button>
                    </div>
                  )}

                  {platformSettings?.usdt_bep20_address && (
                    <div className={styles.copyFieldRow}>
                      <div className={styles.copyFieldValue}>
                        <strong>USDT (BEP20):</strong>{' '}
                        <span dir="ltr">{platformSettings.usdt_bep20_address}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(platformSettings.usdt_bep20_address, 'bep20')}
                        className={styles.copyMiniBtn}
                      >
                        {copiedField === 'bep20' ? '✓' : isAr ? 'نسخ' : 'Copier'}
                      </button>
                    </div>
                  )}
                </>
              )}

              {paymentMethod === 'visa' && (
                <>
                  <div className={styles.paymentAmountRow}>
                    <span className={styles.paymentAmountLabel}>
                      {isAr ? 'المبلغ بالدولار (USD):' : 'Montant (USD) :'}
                    </span>
                    <strong className={styles.paymentAmountBlue} dir="ltr">
                      ${checkoutModal.amountUsd} USD
                    </strong>
                  </div>

                  {platformSettings?.visa_payment_link ? (
                    <a
                      href={platformSettings.visa_payment_link}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.visaPayLinkBtn}
                    >
                      {isAr ? '💳 افتح رابط الدفع بالبطاقة (Visa / RedotPay)' : '💳 Ouvrir le lien de paiement Visa'}
                    </a>
                  ) : (
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569' }}>
                      {isAr
                        ? 'قم بإتمام التحويل عبر بطاقتك ثم أرفق صورة الوصل أو رقم العملية في الأسفل.'
                        : 'Effectuez le paiement par carte puis joignez le reçu ci-dessous.'}
                    </p>
                  )}
                </>
              )}
            </div>

            {paymentFeedback.text && (
              <div
                className={`${styles.feedbackAlertBox} ${
                  paymentFeedback.type === 'success'
                    ? styles.feedbackAlertSuccess
                    : styles.feedbackAlertError
                }`}
              >
                {paymentFeedback.text}
              </div>
            )}

            {/* نموذج رفع الوصل ورقم العملية */}
            <form onSubmit={handleSubmitPayment} className={styles.checkoutForm}>
              <div>
                <label className={styles.checkoutFieldLabel}>
                  {isAr ? 'صورة وصل الدفع (Screenshot / Reçu)' : 'Capture du reçu de paiement'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                  className={styles.checkoutFileInput}
                />
              </div>

              <div>
                <label className={styles.checkoutFieldLabel}>
                  {isAr
                    ? 'رقم العملية / معرّف التحويل (اختياري إذا أرفقت الصورة)'
                    : 'Référence / TxID (optionnel avec capture)'}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder={isAr ? 'مثال: 0012345678 أو TxID' : 'Ex: 0012345678 ou TxID'}
                  className={styles.checkoutTextInput}
                />
              </div>

              <button
                type="submit"
                disabled={submittingPayment}
                className={styles.ctaButton}
                style={{
                  width: '100%',
                  border: 'none',
                  cursor: submittingPayment ? 'not-allowed' : 'pointer',
                  background: '#16a34a',
                  marginTop: '0.25rem'
                }}
              >
                {submittingPayment
                  ? isAr
                    ? '⏳ جاري رفع الوصل وإرسال الطلب...'
                    : '⏳ Envoi en cours...'
                  : isAr
                  ? '✅ تأكيد الدفع وإرسال الوصل'
                  : '✅ Confirmer le paiement'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}