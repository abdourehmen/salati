import React, { useState } from 'react';
import styles from './SubscriptionTab.module.css';

export default function SubscriptionTab({ isAr = true, hallData, platformSettings }) {
  const planTier = hallData?.plan_tier || 'basic';
  const currentBillingCycle = hallData?.billing_cycle || 'monthly';
  const subStatus = hallData?.subscription_status || 'trial';

  const [selectedCycle, setSelectedCycle] = useState(currentBillingCycle);

  const basicMonthly = Number(platformSettings?.basic_monthly_price || 3500);
  const proMonthly = Number(platformSettings?.pro_monthly_price || 6500);
  const discount6 = Number(platformSettings?.semi_annual_discount || 10);
  const discount12 = Number(platformSettings?.annual_discount || 20);

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

  const planMeta = {
    basic: {
      name: isAr ? 'الباقة الأساسية (Essentiel)' : 'Offre Essentiel',
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
    ? endDateObj.toLocaleDateString(isAr ? 'ar-DZ' : 'fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : isAr
    ? 'غير محدد'
    : 'Non défini';

  const formattedStartDate = createdDateObj
    ? createdDateObj.toLocaleDateString(isAr ? 'ar-DZ' : 'fr-FR', {
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
    const priceStr = amount ? ` (${amount.toLocaleString()} دج)` : '';

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
      title: isAr ? 'الباقة الأساسية' : 'Essentiel',
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
        { text: isAr ? 'جميع ميزات الباقة الأساسية بالكامل' : 'Toutes les fonctions Essentiel', ok: true },
        { text: isAr ? 'كود QR الذكي لزيادة تقييمات Google Maps' : 'QR Code intelligent avis Google', ok: true },
        { text: isAr ? 'بطاقة تقييم جاهزة للطباعة داخل الصالة' : 'Carte d’avis imprimable en salle', ok: true },
        { text: isAr ? 'أولوية قصوى في الدعم الفني والتحديثات' : 'Support prioritaire & nouveautés', ok: true },
        { text: isAr ? 'توثيق ومعاينة الصالة قبل التسليم' : 'Inspection complète avant remise', ok: true }
      ]
    }
  ];

  const isUrgent = daysLeft !== null && daysLeft <= 5;

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className={styles.wrapper}>
      {/* رأس الصفحة */}
      <div className={styles.headerRow}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.55rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
            {isAr ? 'إدارة الاشتراك والباقة' : 'Abonnement & Facturation'}
          </h2>
          <p style={{ margin: '0.3rem 0 0', color: '#64748b', fontSize: '0.92rem' }}>
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
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            insetInlineEnd: '-60px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1.5rem',
            position: 'relative',
            zIndex: 1
          }}
        >
          <div style={{ flex: '1 1 340px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: currentStatus.bg,
                  color: currentStatus.color,
                  padding: '0.32rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 800
                }}
              >
                <span
                  className={styles.statusDot}
                  style={{ background: currentStatus.dot }}
                />
                {currentStatus.label}
              </span>

              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.14)',
                  color: '#e2e8f0',
                  padding: '0.32rem 0.8rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}
              >
                {cycleLabels[currentBillingCycle]?.title || (isAr ? 'شهري' : 'Mensuel')}
              </span>
            </div>

            <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
              💎 {activePlan.name}
            </h3>
            <p style={{ margin: '0.45rem 0 0', color: 'rgba(255, 255, 255, 0.82)', fontSize: '0.92rem', maxWidth: '520px', lineHeight: 1.6 }}>
              {activePlan.tagline}
            </p>
          </div>

          {/* صندوق العد التنازلي */}
          <div
            className={styles.countdownBox}
            style={{ textAlign: isAr ? 'right' : 'left' }}
          >
            <span style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.78)', fontWeight: 700 }}>
              {isAr ? 'المدة المتبقية في الاشتراك' : 'Temps restant'}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.3rem' }}>
              <strong style={{ fontSize: '2.1rem', fontWeight: 900, lineHeight: 1 }}>
                {daysLeft !== null ? daysLeft : '∞'}
              </strong>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, opacity: 0.9 }}>
                {daysLeft !== null
                  ? isAr
                    ? `يوم و ${hoursLeft} ساعة`
                    : `jours et ${hoursLeft}h`
                  : isAr
                  ? 'غير محدود'
                  : 'Illimité'}
              </span>
            </div>
            <div style={{ marginTop: '0.45rem', fontSize: '0.78rem', color: '#bae6fd', fontWeight: 600 }}>
              {isAr ? 'ينتهي في:' : 'Expire le :'} {formattedEndDate}
            </div>
          </div>
        </div>

        {/* شريط التقدم المرئي */}
        {daysLeft !== null && (
          <div style={{ marginTop: '1.6rem', position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                color: 'rgba(255, 255, 255, 0.85)',
                fontWeight: 700,
                marginBottom: '0.45rem'
              }}
            >
              <span>
                {isUrgent
                  ? isAr
                    ? '⚠️ اقترب موعد انتهاء اشتراكك — جدد الآن لتجنب توقف الخدمة'
                    : '⚠️ Expiration proche — Renouvelez maintenant'
                  : isAr
                  ? 'حالة صلاحية الاشتراك'
                  : 'Validité de la période en cours'}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div
              style={{
                width: '100%',
                height: '9px',
                background: 'rgba(255, 255, 255, 0.18)',
                borderRadius: '999px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: isUrgent ? '#fbbf24' : '#38bdf8',
                  borderRadius: '999px',
                  transition: 'width 0.5s ease'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* شبكة المعلومات السريعة (3 بطاقات) */}
      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>
            🏰 {isAr ? 'الصالة المسجلة' : 'Salle enregistrée'}
          </span>
          <strong style={{ display: 'block', marginTop: '0.35rem', fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
            {hallData?.name || (isAr ? 'صالتي' : 'Ma Salle')}
          </strong>
          <small style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
            {isAr ? 'تاريخ الانضمام:' : 'Inscrit le :'} {formattedStartDate}
          </small>
        </div>

        <div className={styles.infoCard}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>
            💳 {isAr ? 'قيمة الباقة الحالية' : 'Tarif de votre offre'}
          </span>
          <strong style={{ display: 'block', marginTop: '0.35rem', fontSize: '1.15rem', color: '#0052cc', fontWeight: 900 }}>
            {activePlan.monthlyPrice
              ? `${calculatePrice(activePlan.monthlyPrice, currentBillingCycle).toLocaleString()} ${
                  isAr ? 'دج' : 'DA'
                }`
              : isAr
              ? 'تسعيرة مخصصة'
              : 'Sur mesure'}
          </strong>
          <small style={{ color: '#64748b', fontSize: '0.78rem' }}>
            {cycleLabels[currentBillingCycle]?.title}
          </small>
        </div>

        <div className={styles.infoCard}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>
            🛡️ {isAr ? 'طرق الدفع والتفعيل' : 'Paiement & Activation'}
          </span>
          <strong style={{ display: 'block', marginTop: '0.35rem', fontSize: '1rem', color: '#0f172a', fontWeight: 800 }}>
            {isAr ? 'بريدي موب / CCP / تحويل بنكي' : 'BaridiMob / CCP / Virement'}
          </strong>
          <small style={{ color: '#16a34a', fontSize: '0.78rem', fontWeight: 700 }}>
            {isAr ? 'تفعيل فوري بعد إرسال الوصل' : 'Activation immédiate'}
          </small>
        </div>
      </div>

      {/* قسم اختيار مدة التجديد ومقارنة الباقات */}
      <div className={styles.plansSection}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
              {isAr ? 'باقات الاشتراك والتجديد' : 'Offres & Renouvellement'}
            </h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.86rem', color: '#64748b' }}>
              {isAr
                ? 'اختر مدة الاشتراك المناسبة للاستفادة من تخفيضات الدفع النصف سنوي والسنوي'
                : 'Choisissez votre durée pour profiter des remises semestrielles et annuelles'}
            </p>
          </div>

          {/* أزرار تبديل المدة (شهري / 6 أشهر / سنوي) */}
          <div
            style={{
              display: 'inline-flex',
              background: '#f1f5f9',
              padding: '0.32rem',
              borderRadius: '14px',
              gap: '0.3rem'
            }}
          >
            {Object.entries(cycleLabels).map(([key, info]) => {
              const active = selectedCycle === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedCycle(key)}
                  className={styles.cycleTabBtn}
                  style={{
                    background: active ? '#ffffff' : 'transparent',
                    color: active ? '#0052cc' : '#475569',
                    boxShadow: active ? '0 2px 8px rgba(15, 23, 42, 0.08)' : 'none'
                  }}
                >
                  <span>{info.title}</span>
                  {info.badge && (
                    <span
                      style={{
                        background: '#dcfce7',
                        color: '#15803d',
                        padding: '0.1rem 0.42rem',
                        borderRadius: '999px',
                        fontSize: '0.7rem',
                        fontWeight: 800
                      }}
                    >
                      {info.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* بطاقات مقارنة الباقات */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {comparisonPlans.map((plan) => {
            const isCurrent = planTier === plan.key;
            const computedTotal = calculatePrice(plan.monthlyPrice, selectedCycle);

            return (
              <div
                key={plan.key}
                className={`${styles.planCard} ${plan.popular ? styles.planCardPopular : ''}`}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                      {plan.title}
                    </h4>

                    {isCurrent ? (
                      <span
                        style={{
                          background: '#dbeafe',
                          color: '#1d4ed8',
                          padding: '0.22rem 0.65rem',
                          borderRadius: '999px',
                          fontSize: '0.74rem',
                          fontWeight: 800
                        }}
                      >
                        {isAr ? 'باقتك الحالية' : 'Votre offre'}
                      </span>
                    ) : plan.popular ? (
                      <span
                        style={{
                          background: '#0052cc',
                          color: '#ffffff',
                          padding: '0.22rem 0.65rem',
                          borderRadius: '999px',
                          fontSize: '0.74rem',
                          fontWeight: 800
                        }}
                      >
                        {isAr ? 'موصى بها' : 'Recommandée'}
                      </span>
                    ) : null}
                  </div>

                  <p style={{ margin: '0 0 1rem', fontSize: '0.84rem', color: '#64748b' }}>
                    {plan.subtitle}
                  </p>

                  <div style={{ marginBottom: '1.15rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>
                      {computedTotal.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', marginInlineStart: '0.35rem' }}>
                      {isAr ? 'دج' : 'DA'} {cycleLabels[selectedCycle]?.unit}
                    </span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {plan.features.map((f, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.55rem',
                          fontSize: '0.86rem',
                          fontWeight: 600,
                          color: f.ok ? '#1e293b' : '#94a3b8'
                        }}
                      >
                        <span>{f.ok ? '✅' : '✕'}</span>
                        <span style={{ textDecoration: f.ok ? 'none' : 'line-through' }}>{f.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={buildWaLink(plan.key, selectedCycle)}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.ctaButton}
                  style={{
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
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}