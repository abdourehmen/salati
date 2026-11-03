import { useState, useEffect } from 'react';
import styles from './Home.module.css';
import homePc from '../../assets/home-pc.png';

const IconGlobe = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"></path>
  </svg>
);

const IconMapPin = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const IconStarQr = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const IconZap = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const IconUserPlus = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="23" y1="11" x2="17" y2="11"></line>
  </svg>
);

const IconLayout = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="3" y1="9" x2="21" y2="9"></line>
    <line x1="9" y1="21" x2="9" y2="9"></line>
  </svg>
);

const IconShare = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const content = {
  ar: {
    titlePrefix: 'إدارة صالة أفراحك أصبحت أسهل مع ',
    subtitle: 'نظام سحابي متكامل لمتابعة الحجوزات، تنظيم مواعيد المعاينة، وتوفير موقع مخصص لصالتك يستعرض الصور والأيام المتاحة للزبائن.',
    primaryCta: 'ابدأ تجربتك الآن',
    secondaryCta: 'كيفية الاستخدام',
    floatingTag: 'حجز متاح أونلاين',
    
    whyTitle: 'لماذا تختار salati عن بقية المنصات؟',
    whySubtitle: 'حلول ذكية مصممة خصيصاً لخصوصية وسوق صالات الأفراح في الجزائر، وليست مجرد نظام إدارة تقليدي.',
    why1Title: 'موقع مصغر خاص ببراند صالتك',
    why1Desc: 'لا نضع صالتك في مجرد قائمة مجتمعة مع المنافسين، بل نمنحك رابطاً احترافياً مستقل يُمثّل هويتك أمام الزبائن.',
    why2Title: 'مصمم خصيصاً للسوق الجزائري',
    why2Desc: 'نراعي طبيعة المعاينات الميدانية قبل الحجز، وتفاصيل الـ 58 ولاية، وديناميكية العملة والخدمات المحلية.',
    why3Title: 'رفع تقييمات Google Maps بذكاء',
    why3Desc: 'نظام توليد كود QR مخصص يُسهّل على ضيوف عرسك ترك تقييمات إيجابية ترفع من ترتيب صالتك على الخريطة.',
    why4Title: 'سهولة مطلقة بدون تعقيد تقني',
    why4Desc: 'واجهة بسيطة باللغتين العربية والفرنسية تتيح لك ولعُمالك إدارة الحجوزات من الهاتف خلال ثوانٍ.',

    howTitle: 'كيف تعمل منصة salati؟',
    howSubtitle: 'الانتقال إلى النظام الرقمي يتم خلال دقائق معدودة عبر 3 خطوات واضحة.',
    step1Title: 'سجّل صالتك وأدخل البيانات',
    step1Desc: 'أنشئ حسابك، أضف اسم الصالة، الولاية، الطاقة الاستيعابية، والأسعار الأولية للبداية.',
    step2Title: 'خصص المعرض والخدمات',
    step2Desc: 'ارفع الصور عالية الجودة وحدد الخدمات المتاحة (تكييف، موقف سيارات، طهي) لاستعراضها.',
    step3Title: 'انشر الرابط واستقبل الحجوزات',
    step3Desc: 'شارك رابط موقعك الخاص مع الزبائن واستقبل طلبات المعاينة والحجز مباشرة في لوحة التحكم.',

    pricingTag: 'اشتراكات واسعة وشفافة',
    pricingTitle: 'خطط اشتراك واضحة ومحددة السعر',
    pricingSubtitle: 'اختر المدى الزمني المناسب لصالتك: دفع شهري، 6 أشهر، أو دفع سنوي إجمالي.',
    trialBadge: '🎁 تجربة مجانية لمدة 14 يومًا • بدون بطاقة إئتمان',
    
    cycleMonthly: 'شهري',
    cycleSemiAnnual: '6 أشهر',
    cycleAnnual: 'سنوي (12 شهر)',

    perMonth: '/ شهرياً',
    perSemiAnnual: '/ إجمالي 6 أشهر',
    perAnnual: '/ المجموع السنوي الكلي',
    popularBadge: '🔥 الأكثر اختياراً من أصحاب الصالات',
    selectPlan: 'ابدأ تجريب الباقة مجاناً',
    noHiddenFees: 'بدون أية مصاريف خفية أو اقتطاعات على الحجوزات',

    plan1Name: 'الباقة الأساسية',
    plan1Tag: 'للبداية المنظمة',
    plan1Desc: 'مثالية للصالات التي تبحث عن إنهاء فوضى المواعيد وتنظيم الحجوزات من الهاتف.',
    plan1PriceMonthly: '3,500 دج',
    plan1PriceSemiAnnual: '21,000 دج',
    plan1PriceAnnual: '42,000 دج',
    plan1Features: [
      'موقع مخصص احترافي باسم براند صالتك',
      'جدولة الحجوزات والمعاينات الميدانية',
      'عرض تقويم التوافر التفاعلي للزبائن',
      'إحصائيات أساسية للطلبات والشهرية',
      'دعم فني سريع عبر الواتساب'
    ],

    plan2Name: 'الباقة الاحترافية (Pro)',
    plan2Tag: 'للمضاعفة السريعة للحجوزات',
    plan2Desc: 'الباقة الأكثر مبيعاً للصالات الراغبة في تصدّر الخريطة ومضاعفة ثقة العائلات.',
    plan2PriceMonthly: '6,500 دج',
    plan2PriceSemiAnnual: '39,000 دج',
    plan2PriceAnnual: '78,000 دج',
    plan2Features: [
      'كل مميزات الباقة الأساسية بالكامل',
      'نظام كود QR الذكي لزيادة تقييمات Google Maps',
      'إمكانية تحديد أسعار المواعيد والمواسم (صيف/شتاء)',
      'إرسال إشعارات وتأكيدات SMS للزبائن',
      'دعم هاتف مباشر ذو أولوية فائقة'
    ],

    plan3Name: 'باقة المجمعات والمؤسسات',
    plan3Tag: 'للإدارة المتقدمة والمتعددة',
    plan3Desc: 'حل مخصص لأصحاب الصالات المتعددة والمجمعات الكبرى في الجزائر.',
    plan3PriceMonthly: '12,000 دج',
    plan3PriceSemiAnnual: '72,000 دج',
    plan3PriceAnnual: '144,000 دج',
    plan3Features: [
      'إدارة شبكة صالات متعددة من لوحة واحدة',
      'ربط دومين مخصص (www.salle-yourname.com)',
      'تقارير مالية وتوقعات أرباح موثوقة',
      'ربط مع أنظمة المحاسبة والطابعات',
      'مدير حساب خاص لمتابعة وتدريب عُمالك'
    ],

    guarantee1: 'تفعيل فوري خلال 5 دقائق',
    guarantee2: 'تشفير وحماية كاملة لبياناتك',
    guarantee3: 'إلغاء أو تعديل الباقة متى شئت'
  },
  fr: {
    titlePrefix: 'La gestion de votre salle des fêtes devient plus simple avec ',
    subtitle: 'Un système cloud complet pour suivre les réservations, gérer les visites et offrir un site dédié à votre salle affichant les photos et les dates disponibles.',
    primaryCta: 'Commencer maintenant',
    secondaryCta: 'Comment ça marche',
    floatingTag: 'Réservation disponible en ligne',
    
    whyTitle: 'Pourquoi choisir salati par rapport aux autres ?',
    whySubtitle: 'Des solutions conçues sur mesure pour le marché et les spécificités des salles des fêtes en Algérie.',
    why1Title: 'Un minisite dédié à votre marque',
    why1Desc: 'Votre salle n’est pas juste une ligne parmi d’autres. Nous vous offrons un lien professionnel unique valorisant votre identité.',
    why2Title: 'Conçu spécialement pour l\'Algérie',
    why2Desc: 'Adapté aux visites physiques préalables, aux 58 wilayas et à la gestion des prestations locales.',
    why3Title: 'Boost de vos avis Google Maps',
    why3Desc: 'Un QR Code personnalisé permettant aux invités de laisser facilement des avis positifs pour améliorer votre classement.',
    why4Title: 'Simplicité absolue sans complexité',
    why4Desc: 'Une interface fluide en arabe et français vous permettant de gérer vos réservations depuis un smartphone.',

    howTitle: 'Comment fonctionne salati ?',
    howSubtitle: 'Passez au numérique en quelques minutes grâce à 3 étapes simples.',
    step1Title: 'Inscrivez votre salle',
    step1Desc: 'Créez votre compte, ajoutez la wilaya, la capacité et les tarifs de base.',
    step2Title: 'Personnalisez les prestations',
    step2Desc: 'Téléchargez vos plus belles photos et cochez vos équipements (climatisation, parking...).',
    step3Title: 'Partagez et recevez des demandes',
    step3Desc: 'Diffusez votre lien unique et gérez les demandes de réservation sur votre tableau de bord.',

    pricingTag: 'Abonnements Transparents',
    pricingTitle: 'Des forfaits clairs avec montants globaux',
    pricingSubtitle: 'Choisissez votre période : mensuelle, 6 mois ou règlement annuel global.',
    trialBadge: '🎁 14 jours d’essai gratuit • Sans carte bancaire',
    
    cycleMonthly: 'Mensuel',
    cycleSemiAnnual: '6 Mois',
    cycleAnnual: 'Annuel (12 Mois)',

    perMonth: '/ mois',
    perSemiAnnual: '/ total 6 mois',
    perAnnual: '/ an (Total Global)',
    popularBadge: '🔥 Le choix N°1 des propriétaires de salles',
    selectPlan: 'Essayer gratuitement',
    noHiddenFees: 'Sans aucun frais caché ni commission sur vos réservations',

    plan1Name: 'Formule Essentielle',
    plan1Tag: 'Pour démarrer sereinement',
    plan1Desc: 'Parfait pour les salles souhaitant digitaliser leurs agendas et supprimer les doublons.',
    plan1PriceMonthly: '3 500 DA',
    plan1PriceSemiAnnual: '21 000 DA',
    plan1PriceAnnual: '42 000 DA',
    plan1Features: [
      'Minisite dédié à votre nom de marque',
      'Calendrier de réservations et visites',
      'Affichage de la disponibilité aux clients',
      'Statistiques de réservation mensuelles',
      'Support rapide via WhatsApp'
    ],

    plan2Name: 'Formule Professionnelle (Pro)',
    plan2Tag: 'Pour maximiser vos réservations',
    plan2Desc: 'La formule la plus appréciée pour dominer votre région et booster vos avis Google.',
    plan2PriceMonthly: '6 500 DA',
    plan2PriceSemiAnnual: '39 000 DA',
    plan2PriceAnnual: '78 000 DA',
    plan2Features: [
      'Toutes les fonctionnalités Essentiel incluses',
      'Générateur QR Code Avis Google Maps dédié',
      'Tarification dynamique par saison (Été/Hiver)',
      'Envoi de confirmations SMS aux clients',
      'Support téléphonique prioritaire VIP'
    ],

    plan3Name: 'Formule Multi-Salles (VIP)',
    plan3Tag: 'Pour grands complexes & réseaux',
    plan3Desc: 'Solution complète pour les propriétaires de plusieurs salles en Algérie.',
    plan3PriceMonthly: '12 000 DA',
    plan3PriceSemiAnnual: '72 000 DA',
    plan3PriceAnnual: '144 000 DA',
    plan3Features: [
      'Gestion centralisée de plusieurs salles',
      'Nom de domaine personnalisé (salle-exemple.dz)',
      'Rapports financiers et prévisions de revenus',
      'Intégration comptabilité et impression',
      'Account Manager dédié pour votre équipe'
    ],

    guarantee1: 'Activation immédiate en 5 minutes',
    guarantee2: 'Cryptage & protection totale des données',
    guarantee3: 'Annulation ou changement à tout moment'
  }
};

export default function Home() {
  const [lang, setLang] = useState(document.documentElement.lang || 'ar');
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'semiAnnual' | 'annual'
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });

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

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    setTilt({ x: rotateX, y: rotateY, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, active: false });
  };

  const t = content[lang] || content.ar;

  // دالة مساعدة لتحديد السعر والوصف بحسب الفترة المحددة
  const getPriceAndPeriod = (monthly, semiAnnual, annual) => {
    if (billingCycle === 'semiAnnual') {
      return { price: semiAnnual, period: t.perSemiAnnual };
    }
    if (billingCycle === 'annual') {
      return { price: annual, period: t.perAnnual };
    }
    return { price: monthly, period: t.perMonth };
  };

  return (
    <div className={styles.homeContainer}>
      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.particlesContainer}>
          <span className={`${styles.particle} ${styles.p1}`}></span>
          <span className={`${styles.particle} ${styles.p2}`}></span>
          <span className={`${styles.particle} ${styles.p3}`}></span>
          <span className={`${styles.particle} ${styles.p4}`}></span>
          <span className={`${styles.particle} ${styles.p5}`}></span>
          <span className={`${styles.particle} ${styles.p6}`}></span>
        </div>

        <div className={styles.heroContainer}>
          <div className={styles.heroText}>
            <h1 className={styles.title}>
              {t.titlePrefix}<span className={styles.brandName}>salati</span>
            </h1>
            <p className={styles.subtitle}>{t.subtitle}</p>
            <div className={styles.ctaGroup}>
              <a href="/register" className={styles.primaryCta}>{t.primaryCta}</a>
              <a href="#pricing" className={styles.secondaryCta}>{t.secondaryCta}</a>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div 
              className={styles.imageFrame}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: tilt.active 
                  ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
                  : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                transition: tilt.active ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
            >
              <img src={homePc} alt="salati wedding hall showcase" className={styles.heroImg} />
              <div 
                className={styles.floatingTag}
                style={{
                  transform: tilt.active ? 'translateZ(40px)' : 'translateZ(0px)',
                  transition: tilt.active ? 'transform 0.1s ease-out' : 'transform 0.6s ease'
                }}
              >
                <span className={styles.tagDot}></span>
                {t.floatingTag}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. لماذا تختار salati */}
      <section id="why-us" className={styles.whyUsSection}>
        <div className={styles.whyUsHeader}>
          <h2 className={styles.whyUsTitle}>{t.whyTitle}</h2>
          <p className={styles.whyUsSubtitle}>{t.whySubtitle}</p>
        </div>

        <div className={styles.whyUsGrid}>
          <div className={styles.whyCard}>
            <div className={styles.cardTopRow}>
              <div className={styles.iconBox}><IconGlobe /></div>
              <span className={styles.stepBadge}>01</span>
            </div>
            <h3>{t.why1Title}</h3>
            <p>{t.why1Desc}</p>
          </div>

          <div className={styles.whyCard}>
            <div className={styles.cardTopRow}>
              <div className={styles.iconBox}><IconMapPin /></div>
              <span className={styles.stepBadge}>02</span>
            </div>
            <h3>{t.why2Title}</h3>
            <p>{t.why2Desc}</p>
          </div>

          <div className={styles.whyCard}>
            <div className={styles.cardTopRow}>
              <div className={styles.iconBox}><IconStarQr /></div>
              <span className={styles.stepBadge}>03</span>
            </div>
            <h3>{t.why3Title}</h3>
            <p>{t.why3Desc}</p>
          </div>

          <div className={styles.whyCard}>
            <div className={styles.cardTopRow}>
              <div className={styles.iconBox}><IconZap /></div>
              <span className={styles.stepBadge}>04</span>
            </div>
            <h3>{t.why4Title}</h3>
            <p>{t.why4Desc}</p>
          </div>
        </div>
      </section>

      {/* 3. كيفية الاستخدام */}
      <section id="how-it-works" className={styles.howSection}>
        <div className={styles.howHeader}>
          <h2 className={styles.howTitle}>{t.howTitle}</h2>
          <p className={styles.howSubtitle}>{t.howSubtitle}</p>
        </div>

        <div className={styles.howContainer}>
          <div className={styles.progressLine}></div>

          <div className={styles.howGrid}>
            <div className={styles.howCard}>
              <div className={styles.nodeHeader}>
                <div className={styles.iconBoxSaas}><IconUserPlus /></div>
                <span className={styles.nodeNumber}>01</span>
              </div>
              <h3>{t.step1Title}</h3>
              <p>{t.step1Desc}</p>
            </div>

            <div className={styles.howCard}>
              <div className={styles.nodeHeader}>
                <div className={styles.iconBoxSaas}><IconLayout /></div>
                <span className={styles.nodeNumber}>02</span>
              </div>
              <h3>{t.step2Title}</h3>
              <p>{t.step2Desc}</p>
            </div>

            <div className={styles.howCard}>
              <div className={styles.nodeHeader}>
                <div className={styles.iconBoxSaas}><IconShare /></div>
                <span className={styles.nodeNumber}>03</span>
              </div>
              <h3>{t.step3Title}</h3>
              <p>{t.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. قسم خطط الأسعار والاشتراكات لـ 3 خيارات (شهري، 6 أشهر، سنوي) */}
      <section id="pricing" className={styles.pricingSection}>
        <div className={styles.pricingHeader}>
          <span className={styles.pricingTagHeader}>{t.pricingTag}</span>
          <h2 className={styles.pricingTitle}>{t.pricingTitle}</h2>
          <p className={styles.pricingSubtitle}>{t.pricingSubtitle}</p>

          <div className={styles.trialPill}>
            {t.trialBadge}
          </div>

          {/* شريط الاختيارات الثلاثي (Segmented Control) */}
          <div className={styles.cycleSegmentedControl}>
            <button
              className={`${styles.segmentBtn} ${billingCycle === 'monthly' ? styles.activeSegment : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              {t.cycleMonthly}
            </button>
            <button
              className={`${styles.segmentBtn} ${billingCycle === 'semiAnnual' ? styles.activeSegment : ''}`}
              onClick={() => setBillingCycle('semiAnnual')}
            >
              {t.cycleSemiAnnual}
            </button>
            <button
              className={`${styles.segmentBtn} ${billingCycle === 'annual' ? styles.activeSegment : ''}`}
              onClick={() => setBillingCycle('annual')}
            >
              {t.cycleAnnual}
            </button>
          </div>
        </div>

        <div className={styles.pricingGrid}>
          
          {/* الباقة 1: الأساسية */}
          {(() => {
            const plan1 = getPriceAndPeriod(t.plan1PriceMonthly, t.plan1PriceSemiAnnual, t.plan1PriceAnnual);
            return (
              <div className={styles.priceCard}>
                <div className={styles.cardHead}>
                  <span className={styles.planMicroTag}>{t.plan1Tag}</span>
                  <h3>{t.plan1Name}</h3>
                  <p>{t.plan1Desc}</p>
                  <div className={styles.priceValue}>
                    <strong>{plan1.price}</strong>
                    <small>{plan1.period}</small>
                  </div>
                </div>
                <ul className={styles.featureList}>
                  {t.plan1Features.map((feat, index) => (
                    <li key={index}><IconCheck /> <span>{feat}</span></li>
                  ))}
                </ul>
                <a href="/register" className={styles.priceCta}>{t.selectPlan}</a>
                <span className={styles.noRiskSub}>{t.noHiddenFees}</span>
              </div>
            );
          })()}

          {/* الباقة 2: الاحترافية (Pro) */}
          {(() => {
            const plan2 = getPriceAndPeriod(t.plan2PriceMonthly, t.plan2PriceSemiAnnual, t.plan2PriceAnnual);
            return (
              <div className={`${styles.priceCard} ${styles.popularCard}`}>
                <div className={styles.popularBadge}>{t.popularBadge}</div>
                <div className={styles.cardHead}>
                  <span className={`${styles.planMicroTag} ${styles.proMicroTag}`}>{t.plan2Tag}</span>
                  <h3>{t.plan2Name}</h3>
                  <p>{t.plan2Desc}</p>
                  <div className={styles.priceValue}>
                    <strong>{plan2.price}</strong>
                    <small>{plan2.period}</small>
                  </div>
                </div>
                <ul className={styles.featureList}>
                  {t.plan2Features.map((feat, index) => (
                    <li key={index}><IconCheck /> <span>{feat}</span></li>
                  ))}
                </ul>
                <a href="/register" className={`${styles.priceCta} ${styles.popularCta}`}>{t.selectPlan}</a>
                <span className={styles.noRiskSub}>{t.noHiddenFees}</span>
              </div>
            );
          })()}

          {/* الباقة 3: المؤسسات والمجمعات */}
          {(() => {
            const plan3 = getPriceAndPeriod(t.plan3PriceMonthly, t.plan3PriceSemiAnnual, t.plan3PriceAnnual);
            return (
              <div className={styles.priceCard}>
                <div className={styles.cardHead}>
                  <span className={styles.planMicroTag}>{t.plan3Tag}</span>
                  <h3>{t.plan3Name}</h3>
                  <p>{t.plan3Desc}</p>
                  <div className={styles.priceValue}>
                    <strong>{plan3.price}</strong>
                    <small>{plan3.period}</small>
                  </div>
                </div>
                <ul className={styles.featureList}>
                  {t.plan3Features.map((feat, index) => (
                    <li key={index}><IconCheck /> <span>{feat}</span></li>
                  ))}
                </ul>
                <a href="/register" className={styles.priceCta}>{t.selectPlan}</a>
                <span className={styles.noRiskSub}>{t.noHiddenFees}</span>
              </div>
            );
          })()}

        </div>

        <div className={styles.trustBar}>
          <div className={styles.trustItem}>
            <IconShield /> <span>{t.guarantee1}</span>
          </div>
          <div className={styles.trustDivider}>•</div>
          <div className={styles.trustItem}>
            <IconShield /> <span>{t.guarantee2}</span>
          </div>
          <div className={styles.trustDivider}>•</div>
          <div className={styles.trustItem}>
            <IconShield /> <span>{t.guarantee3}</span>
          </div>
        </div>

      </section>

    </div>
  );
}