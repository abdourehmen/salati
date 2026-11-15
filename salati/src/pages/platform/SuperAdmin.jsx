import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import styles from './SuperAdmin.module.css';

// البريد الإلكتروني الخاص بمالك المنصة المصرّح له بالدخول
const SUPER_ADMIN_EMAIL = 'salatisalati20@gmail.com';

const PLAN_PRICES = {
  basic: 3500,
  pro: 6500,
  enterprise: 12000
};

const navigate = (to) => {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new Event('popstate'));
};

function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;
    if (end === 0) {
      setDisplayValue(0);
      return;
    }
    const duration = 750;
    const incrementTime = 20;
    const step = Math.max(1, Math.ceil(end / (duration / incrementTime)));

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
}

const translations = {
  ar: {
    brandSub: 'مركز القيادة • Super Admin',
    title: 'لوحة تحكم مالك المنصة',
    subtitle: 'إدارة الصالات، الباقات (الأساسية، Pro، المجمعات)، ومتابعة الإيرادات اللحظية.',
    logout: 'خروج آمن',
    checkingAuth: 'جاري التحقق من هوية مالك المنصة...',
    unauthorizedTitle: 'وصول محظور',
    unauthorizedDesc: 'هذه المنطقة مشفرة ومخصصة لمالك منصة Salati فقط.',
    backHome: 'العودة للواجهة الرئيسية',
    // KPIs
    totalHalls: 'إجمالي الصالات',
    activeHalls: 'اشتراكات نشطة',
    trialHalls: 'فترة تجريبية',
    suspendedHalls: 'موقوفة / منتهية',
    totalBookings: 'إجمالي الحجوزات',
    monthlyRevenue: 'الإيراد الشهري المتوقع (دج)',
    // Tabs
    tabHalls: 'إدارة الصالات والباقات',
    tabSettings: 'إعدادات المنصة والتنبيهات',
    // Filters
    searchPlaceholder: 'ابحث باسم الصالة، الولاية، الرابط، أو الهاتف...',
    filterAll: 'الكل',
    filterActive: 'نشط',
    filterTrial: 'تجريبي',
    filterExpired: 'منتهي',
    filterSuspended: 'موقوف',
    // Table
    colHall: 'الصالة والرابط',
    colWilaya: 'الولاية والهاتف',
    colPlan: 'الباقة الحالية',
    colStats: 'الحجوزات',
    colStatus: 'حالة الاشتراك',
    colExpiry: 'تاريخ الانتهاء',
    colActions: 'تمديد وتحكم',
    // Plans
    planBasic: 'الأساسية (3,500 دج)',
    planPro: 'الاحترافية Pro (6,500 دج)',
    planEnterprise: 'المجمعات (12,000 دج)',
    // Statuses
    statusActive: 'نشط',
    statusTrial: 'تجريبي',
    statusExpired: 'منتهي',
    statusSuspended: 'موقوف',
    // Actions
    extend1m: '+شهر',
    extend6m: '+6 أشهر',
    extend12m: '+سنة',
    suspendBtn: 'إيقاف',
    activateBtn: 'تفعيل',
    previewBtn: 'معاينة',
    whatsappBtn: 'واتساب',
    noHallsFound: 'لا توجد صالات مطابقة لمعايير البحث الحالية.',
    // Settings
    settingsHeading: 'التحكم العام في المنصة',
    settingsSubheading: 'تعديل شروط التجربة المجانية وبث التنبيهات الفورية لجميع أصحاب الصالات.',
    trialDaysLabel: 'مدة الفترة التجريبية المجانية (بالأيام)',
    announcementActiveLabel: 'تفعيل شريط التنبيه العام داخل لوحات تحكم الصالات',
    announcementArLabel: 'نص التنبيه (باللغة العربية)',
    announcementFrLabel: 'نص التنبيه (باللغة الفرنسية)',
    saveSettingsBtn: 'حفظ وتطبيق التعديلات',
    savingBtn: 'جاري الحفظ...',
    settingsSaved: 'تم حفظ إعدادات المنصة وتحديثها بنجاح.',
    actionSuccess: 'تم تحديث بيانات واشتراك الصالة بنجاح.'
  },
  fr: {
    brandSub: 'Centre de contrôle • Super Admin',
    title: 'Tableau de bord Propriétaire',
    subtitle: 'Gestion des salles, offres (Basique, Pro, Entreprise) et revenus mensuels.',
    logout: 'Déconnexion',
    checkingAuth: 'Vérification des accès Super Admin...',
    unauthorizedTitle: 'Accès Restreint',
    unauthorizedDesc: 'Cette zone est réservée au propriétaire de la plateforme Salati.',
    backHome: 'Retour à l’accueil',
    totalHalls: 'Total Salles',
    activeHalls: 'Abonnements Actifs',
    trialHalls: 'Essai Gratuit',
    suspendedHalls: 'Suspendues / Expirées',
    totalBookings: 'Total Réservations',
    monthlyRevenue: 'Revenu Mensuel Estimé (DZD)',
    tabHalls: 'Salles & Offres',
    tabSettings: 'Paramètres & Annonces',
    searchPlaceholder: 'Rechercher par salle, wilaya, lien ou téléphone...',
    filterAll: 'Toutes',
    filterActive: 'Actives',
    filterTrial: 'Essai',
    filterExpired: 'Expirées',
    filterSuspended: 'Suspendues',
    colHall: 'Salle & Lien',
    colWilaya: 'Wilaya & Contact',
    colPlan: 'Offre / Pack',
    colStats: 'Réservations',
    colStatus: 'Statut',
    colExpiry: 'Expiration',
    colActions: 'Actions Rapides',
    planBasic: 'Basique (3 500 DA)',
    planPro: 'Pro (6 500 DA)',
    planEnterprise: 'Complexes (12 000 DA)',
    statusActive: 'Actif',
    statusTrial: 'Essai',
    statusExpired: 'Expiré',
    statusSuspended: 'Suspendu',
    extend1m: '+1 mois',
    extend6m: '+6 mois',
    extend12m: '+1 an',
    suspendBtn: 'Suspendre',
    activateBtn: 'Activer',
    previewBtn: 'Voir',
    whatsappBtn: 'WhatsApp',
    noHallsFound: 'Aucune salle ne correspond à votre recherche.',
    settingsHeading: 'Configuration Globale',
    settingsSubheading: 'Gérez la période d’essai et diffusez des annonces en temps réel.',
    trialDaysLabel: 'Durée de l’essai gratuit par défaut (jours)',
    announcementActiveLabel: 'Activer la bannière d’annonce globale pour les salles',
    announcementArLabel: 'Message de l’annonce (Arabe)',
    announcementFrLabel: 'Message de l’annonce (Français)',
    saveSettingsBtn: 'Enregistrer les modifications',
    savingBtn: 'Enregistrement...',
    settingsSaved: 'Paramètres mis à jour avec succès.',
    actionSuccess: 'Offre et statut de la salle mis à jour.'
  }
};

export default function SuperAdmin() {
  const [lang, setLang] = useState(document.documentElement.lang || 'ar');
  const [authStatus, setAuthStatus] = useState('checking');
  const [activeTab, setActiveTab] = useState('halls');

  const [halls, setHalls] = useState([]);
  const [bookingsCountByHall, setBookingsCountByHall] = useState({});
  const [totalBookings, setTotalBookings] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [settings, setSettings] = useState({
    trial_days: 14,
    announcement_ar: '',
    announcement_fr: '',
    is_announcement_active: false
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLang(document.documentElement.lang || 'ar');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    verifySuperAdmin();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3200);
  };

  const verifySuperAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email?.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
      setAuthStatus('unauthorized');
      return;
    }
    setAuthStatus('authorized');
    fetchAllData();
  };

  const fetchAllData = async () => {
    const { data: hallsData } = await supabase
      .from('halls')
      .select('*')
      .order('created_at', { ascending: false });

    if (hallsData) setHalls(hallsData);

    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('id, hall_id');

    if (bookingsData) {
      setTotalBookings(bookingsData.length);
      const counts = {};
      bookingsData.forEach((b) => {
        counts[b.hall_id] = (counts[b.hall_id] || 0) + 1;
      });
      setBookingsCountByHall(counts);
    }

    const { data: settingsData } = await supabase
      .from('platform_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (settingsData) {
      setSettings({
        trial_days: settingsData.trial_days ?? 14,
        announcement_ar: settingsData.announcement_ar || '',
        announcement_fr: settingsData.announcement_fr || '',
        is_announcement_active: Boolean(settingsData.is_announcement_active)
      });
    }
  };

  const handlePlanChange = async (hall, newPlanTier) => {
    const { error } = await supabase
      .from('halls')
      .update({ plan_tier: newPlanTier })
      .eq('id', hall.id);

    if (!error) {
      setHalls((prev) =>
        prev.map((item) =>
          item.id === hall.id ? { ...item, plan_tier: newPlanTier } : item
        )
      );
      showToast((translations[lang] || translations.ar).actionSuccess);
    }
  };

  const handleToggleHallActive = async (hall) => {
    const nextActive = !(hall.is_active ?? true);
    const nextStatus = nextActive
      ? (hall.subscription_status === 'suspended' ? 'active' : (hall.subscription_status || 'active'))
      : 'suspended';

    const { error } = await supabase
      .from('halls')
      .update({ is_active: nextActive, subscription_status: nextStatus })
      .eq('id', hall.id);

    if (!error) {
      setHalls((prev) =>
        prev.map((item) =>
          item.id === hall.id ? { ...item, is_active: nextActive, subscription_status: nextStatus } : item
        )
      );
      showToast((translations[lang] || translations.ar).actionSuccess);
    }
  };

  const handleExtendSubscription = async (hall, daysToAdd, cycleName) => {
    const currentEnd = hall.subscription_ends_at && new Date(hall.subscription_ends_at) > new Date()
      ? new Date(hall.subscription_ends_at)
      : new Date();

    currentEnd.setDate(currentEnd.getDate() + daysToAdd);
    const newExpiryIso = currentEnd.toISOString();

    const { error } = await supabase
      .from('halls')
      .update({
        is_active: true,
        subscription_status: 'active',
        billing_cycle: cycleName,
        subscription_ends_at: newExpiryIso
      })
      .eq('id', hall.id);

    if (!error) {
      setHalls((prev) =>
        prev.map((item) =>
          item.id === hall.id
            ? {
                ...item,
                is_active: true,
                subscription_status: 'active',
                billing_cycle: cycleName,
                subscription_ends_at: newExpiryIso
              }
            : item
        )
      );
      showToast((translations[lang] || translations.ar).actionSuccess);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    const { error } = await supabase
      .from('platform_settings')
      .upsert({
        id: 1,
        trial_days: Number(settings.trial_days) || 14,
        announcement_ar: settings.announcement_ar,
        announcement_fr: settings.announcement_fr,
        is_announcement_active: settings.is_announcement_active,
        updated_at: new Date().toISOString()
      });

    setSavingSettings(false);
    if (!error) {
      showToast((translations[lang] || translations.ar).settingsSaved);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const t = translations[lang] || translations.ar;

  if (authStatus === 'checking') {
    return (
      <div className={styles.centeredBox} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className={styles.loaderRing}></div>
        <p className={styles.loadingText}>{t.checkingAuth}</p>
      </div>
    );
  }

  if (authStatus === 'unauthorized') {
    return (
      <div className={styles.centeredBox} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className={styles.unauthCard}>
          <div className={styles.lockIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2>{t.unauthorizedTitle}</h2>
          <p>{t.unauthorizedDesc}</p>
          <button type="button" className={styles.primaryBtn} onClick={() => navigate('/')}>
            {t.backHome}
          </button>
        </div>
      </div>
    );
  }

  const activeHallsList = halls.filter((h) => h.is_active !== false && h.subscription_status === 'active');
  const activeCount = activeHallsList.length;
  const trialCount = halls.filter((h) => h.is_active !== false && (h.subscription_status === 'trial' || !h.subscription_status)).length;
  const suspendedCount = halls.filter((h) => h.is_active === false || h.subscription_status === 'suspended' || h.subscription_status === 'expired').length;

  const estimatedMonthlyRevenue = activeHallsList.reduce((sum, hall) => {
    const tier = hall.plan_tier || 'basic';
    return sum + (PLAN_PRICES[tier] || 3500);
  }, 0);

  const filteredHalls = halls.filter((hall) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      hall.name?.toLowerCase().includes(q) ||
      hall.wilaya?.toLowerCase().includes(q) ||
      hall.phone?.toLowerCase().includes(q) ||
      hall.slug?.toLowerCase().includes(q);

    const effectiveStatus = hall.is_active === false ? 'suspended' : (hall.subscription_status || 'trial');
    const matchesStatus = statusFilter === 'all' || effectiveStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString(lang === 'ar' ? 'ar-DZ' : 'fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getWhatsAppUrl = (phone) => {
    if (!phone) return '#';
    const cleaned = phone.replace(/\D/g, '').replace(/^0/, '213');
    return `https://wa.me/${cleaned}`;
  };

  const kpis = [
    { label: t.totalHalls, value: halls.length, accent: 'indigo', icon: '🏛️' },
    { label: t.activeHalls, value: activeCount, accent: 'emerald', icon: '✨' },
    { label: t.trialHalls, value: trialCount, accent: 'sky', icon: '⏳' },
    { label: t.suspendedHalls, value: suspendedCount, accent: 'rose', icon: '🔒' },
    { label: t.totalBookings, value: totalBookings, accent: 'amber', icon: '📅' },
    { label: t.monthlyRevenue, value: estimatedMonthlyRevenue, accent: 'violet', icon: '💰' }
  ];

  return (
    <div className={styles.pageWrapper} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className={styles.ambientGlowTop} />
      <div className={styles.ambientGlowBottom} />

      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.brandArea}>
            <span className={styles.logo}>salati<span className={styles.dot}>.</span></span>
            <span className={styles.badgeAdmin}>
              <span className={styles.pulseDot} />
              {t.brandSub}
            </span>
          </div>

          <div className={styles.topActions}>
            <button
              type="button"
              className={styles.langSwitch}
              onClick={() => {
                const nextLang = lang === 'ar' ? 'fr' : 'ar';
                document.documentElement.lang = nextLang;
                setLang(nextLang);
              }}
            >
              {lang === 'ar' ? 'FR' : 'AR'}
            </button>
            <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.headerSection}>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        {toastMsg && (
          <div className={styles.toastFloating}>
            <span className={styles.toastIcon}>✓</span>
            <span>{toastMsg}</span>
          </div>
        )}

        <div className={styles.kpiGrid}>
          {kpis.map((item, idx) => (
            <div
              key={item.label}
              className={`${styles.kpiCard} ${styles[`accent_${item.accent}`]}`}
              style={{ animationDelay: `${idx * 70}ms` }}
            >
              <div className={styles.kpiTop}>
                <span className={styles.kpiLabel}>{item.label}</span>
                <span className={styles.kpiEmoji}>{item.icon}</span>
              </div>
              <strong className={styles.kpiValue}>
                <AnimatedNumber value={item.value} />
              </strong>
            </div>
          ))}
        </div>

        <div className={styles.tabsRow}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'halls' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('halls')}
          >
            {t.tabHalls}
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'settings' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            {t.tabSettings}
          </button>
        </div>

        {activeTab === 'halls' && (
          <div key="tab-halls" className={`${styles.panel} ${styles.tabContentAnimate}`}>
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className={styles.filterGroup}>
                {[
                  { key: 'all', label: t.filterAll },
                  { key: 'active', label: t.filterActive },
                  { key: 'trial', label: t.filterTrial },
                  { key: 'expired', label: t.filterExpired },
                  { key: 'suspended', label: t.filterSuspended }
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    className={`${styles.filterBtn} ${statusFilter === f.key ? styles.filterActiveBtn : ''}`}
                    onClick={() => setStatusFilter(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t.colHall}</th>
                    <th>{t.colWilaya}</th>
                    <th>{t.colPlan}</th>
                    <th>{t.colStats}</th>
                    <th>{t.colStatus}</th>
                    <th>{t.colExpiry}</th>
                    <th>{t.colActions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHalls.length === 0 ? (
                    <tr>
                      <td colSpan="7" className={styles.emptyCell}>{t.noHallsFound}</td>
                    </tr>
                  ) : (
                    filteredHalls.map((hall, index) => {
                      const effectiveStatus = hall.is_active === false ? 'suspended' : (hall.subscription_status || 'trial');
                      const statusMap = {
                        active: { label: t.statusActive, cls: styles.badgeGreen },
                        trial: { label: t.statusTrial, cls: styles.badgeBlue },
                        expired: { label: t.statusExpired, cls: styles.badgeRed },
                        suspended: { label: t.statusSuspended, cls: styles.badgeRed }
                      };
                      const badge = statusMap[effectiveStatus] || statusMap.trial;
                      const currentTier = hall.plan_tier || 'basic';

                      return (
                        <tr
                          key={hall.id}
                          className={styles.tableRowAnimate}
                          style={{ animationDelay: `${index * 45}ms` }}
                        >
                          <td>
                            <div className={styles.hallIdentity}>
                              <div className={styles.hallAvatar}>
                                {(hall.name || 'S').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className={styles.hallName}>{hall.name}</div>
                                {hall.slug && <span className={styles.hallSlug}>/v/{hall.slug}</span>}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className={styles.wilayaText}>{hall.wilaya || '—'}</div>
                            <div className={styles.phoneText} dir="ltr">{hall.phone || hall.whatsapp_number || '—'}</div>
                          </td>
                          <td>
                            <select
                              className={`${styles.planSelect} ${styles[`plan_${currentTier}`]}`}
                              value={currentTier}
                              onChange={(e) => handlePlanChange(hall, e.target.value)}
                            >
                              <option value="basic">{t.planBasic}</option>
                              <option value="pro">{t.planPro}</option>
                              <option value="enterprise">{t.planEnterprise}</option>
                            </select>
                          </td>
                          <td>
                            <span className={styles.bookingPill}>{bookingsCountByHall[hall.id] || 0}</span>
                          </td>
                          <td>
                            <span className={`${styles.statusBadge} ${badge.cls}`}>
                              <span className={styles.statusDot} />
                              {badge.label}
                            </span>
                          </td>
                          <td className={styles.dateCell}>{formatDate(hall.subscription_ends_at)}</td>
                          <td>
                            <div className={styles.actionsCell}>
                              <button
                                type="button"
                                className={styles.actionBtnBlue}
                                onClick={() => handleExtendSubscription(hall, 30, 'monthly')}
                              >
                                {t.extend1m}
                              </button>
                              <button
                                type="button"
                                className={styles.actionBtnBlue}
                                onClick={() => handleExtendSubscription(hall, 180, 'semi_annual')}
                              >
                                {t.extend6m}
                              </button>
                              <button
                                type="button"
                                className={styles.actionBtnBlue}
                                onClick={() => handleExtendSubscription(hall, 365, 'annual')}
                              >
                                {t.extend12m}
                              </button>
                              <button
                                type="button"
                                className={hall.is_active === false ? styles.actionBtnGreen : styles.actionBtnRed}
                                onClick={() => handleToggleHallActive(hall)}
                              >
                                {hall.is_active === false ? t.activateBtn : t.suspendBtn}
                              </button>
                              {hall.slug && (
                                <a
                                  href={`/v/${hall.slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={styles.actionBtnNeutral}
                                >
                                  {t.previewBtn}
                                </a>
                              )}
                              {(hall.whatsapp_number || hall.phone) && (
                                <a
                                  href={getWhatsAppUrl(hall.whatsapp_number || hall.phone)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={styles.actionBtnWhatsapp}
                                >
                                  {t.whatsappBtn}
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <form key="tab-settings" onSubmit={handleSaveSettings} className={`${styles.panel} ${styles.tabContentAnimate}`}>
            <div className={styles.settingsHeader}>
              <h2>{t.settingsHeading}</h2>
              <p>{t.settingsSubheading}</p>
            </div>

            <div className={styles.settingsGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="trialDays">{t.trialDaysLabel}</label>
                <input
                  id="trialDays"
                  type="number"
                  min="1"
                  max="365"
                  value={settings.trial_days}
                  onChange={(e) => setSettings({ ...settings, trial_days: e.target.value })}
                />
              </div>

              <label htmlFor="annActive" className={styles.switchCard}>
                <input
                  id="annActive"
                  type="checkbox"
                  checked={settings.is_announcement_active}
                  onChange={(e) => setSettings({ ...settings, is_announcement_active: e.target.checked })}
                />
                <span>{t.announcementActiveLabel}</span>
              </label>

              <div className={styles.formGroup}>
                <label htmlFor="annAr">{t.announcementArLabel}</label>
                <textarea
                  id="annAr"
                  rows="3"
                  value={settings.announcement_ar}
                  onChange={(e) => setSettings({ ...settings, announcement_ar: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="annFr">{t.announcementFrLabel}</label>
                <textarea
                  id="annFr"
                  rows="3"
                  dir="ltr"
                  value={settings.announcement_fr}
                  onChange={(e) => setSettings({ ...settings, announcement_fr: e.target.value })}
                />
              </div>

              <div>
                <button type="submit" className={styles.primaryBtn} disabled={savingSettings}>
                  {savingSettings ? t.savingBtn : t.saveSettingsBtn}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}