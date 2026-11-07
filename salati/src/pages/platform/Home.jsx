import { useState, useEffect } from 'react';
import styles from './Home.module.css';
import homePc from '../../assets/home-pc.png';

/* الأيقونات الأساسية */
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
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const IconChevronDown = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

/* أيقونات Bento Grid */
const IconMonitor = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="3" rx="2"></rect>
    <line x1="8" x2="16" y1="21" y2="21"></line>
    <line x1="12" x2="12" y1="17" y2="21"></line>
  </svg>
);

const IconCalendarCheck = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4"></path>
    <path d="M16 2v4"></path>
    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
    <path d="M3 10h18"></path>
    <path d="m9 16 2 2 4-4"></path>
  </svg>
);

const IconBuilding = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01"></path>
    <path d="M16 6h.01"></path>
    <path d="M12 6h.01"></path>
    <path d="M12 10h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 10h.01"></path>
    <path d="M16 14h.01"></path>
    <path d="M8 10h.01"></path>
    <path d="M8 14h.01"></path>
  </svg>
);

const content = {
  ar: {
    titlePrefix: 'إدارة صالة أفراحك أصبحت أسهل مع ',
    subtitle: 'نظام سحابي متكامل لمتابعة الحجوزات، تنظيم مواعيد المعاينة، وتوفير موقع مخصص لصالتك يستعرض الصور والأيام المتاحة للزبائن.',
    primaryCta: 'ابدأ تجربتك الآن',
    secondaryCta: 'كيفية الاستخدام',
    
    aboutTitlePrefix: 'منظومة سحابية متكاملة تليق بمستوى ',
    aboutTitleBrand: 'صالتك والمناسبات الفاخرة',
    aboutSubtitle: 'نحن لا نكتفي بحفظ المواعيد، بل نمنح صالتك حضوراً رقمياً عالمياً ورابطاً خاصاً يتيح للعائلات اكتشاف خدماتك وتفادي تضارب الحجوزات نهائياً.',
    
    bento1Title: 'موقع مصغر خاص ببراند صالتك',
    bento1Desc: 'احصل على موقع مستقل واحترافي يعرض الصور عالية الجودة، الخدمات، وطاقة الاستيعاب مع تقويم التوافر التفاعلي أونلاين.',
    
    bento2Title: 'إدارة المعاينات والحجوزات بنقرة واحدة',
    bento2Desc: 'تتبع طلبات المعاينة الميدانية وأكد المواعيد مع العائلات مباشرة من هاتفك الذكي في أي وقت.',
    
    bento3Title: 'تغطية شاملة ومصممة خصيصاً للـ 58 ولاية',
    bento3Desc: 'مصممة لتتناسب مع ديناميكية العملة، الأسعار الموسمية (صيف/شتاء)، وثقافة المناسبات المحلية في الجزائر.',

    bentoStat1Val: '100%',
    bentoStat1Lbl: 'إنهاء تضارب المواعيد',
    bentoStat2Val: '24/7',
    bentoStat2Lbl: 'حضور رقمي أونلاين',
    bentoStat3Val: '58',
    bentoStat3Lbl: 'ولاية مدعومة بالكامل',

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

    pricingTitle: 'خطط اشتراك واضحة ومحددة السعر',
    pricingSubtitle: 'اختر المدى الزمني المناسب لصالتك: دفع شهري، 6 أشهر، أو دفع سنوي إجمالي.',
    
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
    guarantee3: 'إلغاء أو تعديل الباقة متى شئت',

    faqTitle: 'الأسئلة الشائعة',
    faqSubtitle: 'إجابات على أكثر الأسئلة تداولاً من قبل أصحاب صالات الأفراح في الجزائر.',
    faqs: [
      {
        q: 'هل تأخذ منصة salati نسبة أو عمولة من كل حجز؟',
        a: 'لا إطلاقاً! نحن نعتمد نظام اشتراك ثابت وواضح دون أي عمولات على الإطلاق. كل المداخيل وعرابين الحجوزات تعود لك بنسبة 100%.'
      },
      {
        q: 'هل يحتاج النظام إلى تثبيت برامج أو أجهزة خاصة؟',
        a: 'لا، منصة salati تعمل بالكامل عبر السحابة. يمكنك استخدام المنصة والدخول للوحة التحكم مباشرة من هاتفك، التابلت، أو الكمبيوتر عبر المتصفح.'
      },
      {
        q: 'كيف يُساعد نظام كود QR في رفع تقييمات الصالة على Google Maps؟',
        a: 'نوفر لك كود QR مخصص لصالتك يمكنك طباعته أو عرضه للضيوف والعائلات أثناء العرس. بمسحة واحدة بالهاتف ينتقل الضيف فوراً لصفحة تقييم صالتك، مما يرفع ترتيبك ويجلب زبائن جدد.'
      },
      {
        q: 'هل يمكنني تجربة المنصة قبل الالتزام بالدفع؟',
        a: 'نعم! نمنحك تجربة مجانية كاملة لمدة 14 يوماً بدون الحاجة لإدخال أي بيانات بنكية، لتتمكن من تجربة جميع الخصائص والتأكد من ملاءمتها لصالتك.'
      },
      {
        q: 'ما هي طرق الدفع المتاحة للاشتراك؟',
        a: 'نوفر طرق دفع سهلة تناسب الجزائر مثل الدفع عبر البطاقة الذهبية، بطاقة CIB، أو التحويل عبر البريد الجاري CCP.'
      }
    ],

    footerDesc: 'المنصة الجزائرية الأولى المتخصصة في إدارة صالات الأفراح والفعاليات وتوفير مواقع مخصصة لعرض التوافر أونلاين.',
    footerCol1: 'الروابط السريعة',
    footerCol2: 'القانونية والدعم',
    footerCol3: 'تواصل معنا',
    linkHome: 'الرئيسية',
    linkWhy: 'لماذا salati',
    linkHow: 'كيف تعمل',
    linkPricing: 'الأسعار',
    linkFaq: 'الأسئلة الشائعة',
    linkTerms: 'شروط الخدمة',
    linkPrivacy: 'سياسة الخصوصية',
    copyright: 'جميع الحقوق محفوظة منصة salati © 2026'
  },
  fr: {
    titlePrefix: 'La gestion de votre salle des fêtes devient plus simple avec ',
    subtitle: 'Un système cloud complet pour suivre les réservations, gérer les visites et offrir un site dédié à votre salle affichant les photos et les dates disponibles.',
    primaryCta: 'Commencer maintenant',
    secondaryCta: 'Comment ça marche',

    aboutTitlePrefix: 'Une solution cloud d\'excellence pour ',
    aboutTitleBrand: 'votre salle des fêtes',
    aboutSubtitle: 'Plus qu\'un simple agenda, salati offre à votre salle une présence digitale haut de gamme avec un minisite dédié pour sublimer vos prestations et supprimer les doublons de dates.',
    
    bento1Title: 'Un minisite à votre nom de marque',
    bento1Desc: 'Profitez d\'un lien indépendant et élégant présentant vos photos haute définition, capacités, équipements et un calendrier interactif.',
    
    bento2Title: 'Gestion fluide des visites et réservations',
    bento2Desc: 'Suivez les demandes de visite sur place et confirmez les créneaux en un clic depuis votre smartphone.',
    
    bento3Title: 'Conçu sur mesure pour les 58 Wilayas',
    bento3Desc: 'Parfaitement adapté au marché algérien, aux tarifs saisonniers (Été/Hiver) et aux habitudes de réservations locales.',

    bentoStat1Val: '100%',
    bentoStat1Lbl: 'Zéro doublon de date',
    bentoStat2Val: '24/7',
    bentoStat2Lbl: 'Présence en ligne',
    bentoStat3Val: '58',
    bentoStat3Lbl: 'Wilayas supportées',

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

    pricingTitle: 'Des forfaits clairs avec montants globaux',
    pricingSubtitle: 'Choisissez votre période : mensuelle, 6 mois ou règlement annuel global.',
    
    cycleMonthly: 'Mensuel',
    cycleSemiAnnual: '6 Mois',
    cycleAnnual: 'Annuel (12 Mois)',

    perMonth: '/ mois',
    perSemiAnnual: '/ 6 mois',
    perAnnual: '/ an',
    popularBadge: '🔥 Le choix N°1 des propriétaires de salles',
    selectPlan: 'Essayer gratuitement',
    noHiddenFees: 'Sans aucun frais caché ni commission sur vos réservations',

    plan1Name: 'Formule Essentielle',
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
    guarantee3: 'Annulation ou changement à tout moment',

    faqTitle: 'Foire Aux Questions',
    faqSubtitle: 'Réponses aux questions les plus fréquentes des propriétaires de salles des fêtes en Algérie.',
    faqs: [
      {
        q: 'Est-ce que salati prend une commission sur mes réservations ?',
        a: 'Absolument pas ! Nous appliquons un système d’abonnement fixe sans aucune commission sur vos ventes. 100% de vos revenus restent à vous.'
      },
      {
        q: 'Faut-il installer un logiciel ou du matériel spécifique ?',
        a: 'Non, salati est 100% basé sur le cloud. Vous pouvez accéder à votre espace de gestion directement depuis votre smartphone, tablette ou ordinateur via un simple navigateur web.'
      },
      {
        q: 'Comment le QR Code augmente-t-il mes avis Google Maps ?',
        a: 'Nous générons un QR Code personnalisé pour votre salle. En le scannant durant les fêtes, vos invités sont redirigés immédiatement sur votre fiche Google Maps pour laisser un avis 5 étoiles.'
      },
      {
        q: 'Puis-je tester la plateforme avant de m\'engager ?',
        a: 'Oui ! Nous vous offrons 14 jours d’essai gratuit sans carte bancaire pour découvrir toutes les fonctionnalités et valider l\'outil.'
      },
      {
        q: 'Quels sont les modes de paiement disponibles ?',
        a: 'Nous acceptons la Carte Edahabia, les cartes CIB, ainsi que les virements CCP pour vous faciliter l\'abonnement.'
      }
    ],

    footerDesc: 'La première plateforme algérienne dédiée à la gestion des salles des fêtes et complexes d\'événements avec minissites en ligne.',
    footerCol1: 'Liens Rapides',
    footerCol2: 'Légal & Support',
    footerCol3: 'Contactez-nous',
    linkHome: 'Accueil',
    linkWhy: 'Pourquoi salati',
    linkHow: 'Comment ça marche',
    linkPricing: 'Tarifs',
    linkFaq: 'FAQ',
    linkTerms: 'Conditions d\'utilisation',
    linkPrivacy: 'Politique de confidentialité',
    copyright: 'Tous droits réservés salati © 2026'
  }
};

export default function Home() {
  const [lang, setLang] = useState(document.documentElement.lang || 'ar');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });
  const [openFaq, setOpenFaq] = useState(null);
  const [isImgLoaded, setIsImgLoaded] = useState(false);

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

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.animateIn);
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const animatedElements = document.querySelectorAll(`.${styles.revealOnScroll}`);
    
    animatedElements.forEach(el => observer.observe(el));

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

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const navigateTo = (e, targetPath) => {
    e.preventDefault();
    window.history.pushState({}, '', targetPath);
    window.dispatchEvent(new Event('popstate'));
  };

  const t = content[lang] || content.ar;

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
          <div className={`${styles.heroText} ${styles.revealOnScroll} ${styles.fadeUp}`}>
            <h1 className={styles.title}>
              {t.titlePrefix}<span className={styles.brandName}>salati</span>
            </h1>
            <p className={styles.subtitle}>{t.subtitle}</p>
            <div className={styles.ctaGroup}>
              <a href="/register" onClick={(e) => navigateTo(e, '/register')} className={styles.primaryCta}>{t.primaryCta}</a>
              <a href="#pricing" className={styles.secondaryCta}>{t.secondaryCta}</a>
            </div>
          </div>

          <div className={`${styles.heroVisual} ${styles.revealOnScroll} ${styles.zoomIn}`}>
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
              {/* Shimmer Skeleton عند تحميل الصورة */}
              {!isImgLoaded && (
                <div className={`${styles.skeletonBase} ${styles.heroImageSkeleton}`}></div>
              )}

              <img 
                src={homePc} 
                alt="salati wedding hall showcase" 
                className={`${styles.heroImg} ${isImgLoaded ? styles.imgLoaded : styles.imgHidden}`} 
                onLoad={() => setIsImgLoaded(true)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. قسم التعريف بـ salati (Bento Grid) */}
      <section className={styles.aboutSection}>
        <div className={`${styles.aboutHeader} ${styles.revealOnScroll} ${styles.fadeUp}`}>
          <h2 className={styles.aboutMainTitle}>
            {t.aboutTitlePrefix}<span>{t.aboutTitleBrand}</span>
          </h2>
          <p className={styles.aboutMainSubtitle}>{t.aboutSubtitle}</p>
        </div>

        <div className={styles.bentoGrid}>
          {/* بطاقة Bento 1 */}
          <div className={`${styles.bentoCard} ${styles.bentoSpan2} ${styles.revealOnScroll} ${styles.fadeUp}`} style={{ transitionDelay: '0.1s' }}>
            <div className={styles.bentoHeader}>
              <div className={styles.bentoIcon}><IconMonitor /></div>
              <h3 className={styles.bentoTitle}>{t.bento1Title}</h3>
              <p className={styles.bentoDesc}>{t.bento1Desc}</p>
            </div>
            
            <div className={styles.bentoVisualArea}>
              <div className={styles.statPill}>
                <span className={`${styles.statVal} ${styles.statValPrimary}`}>{t.bentoStat1Val}</span>
                <span className={styles.statLbl}>{t.bentoStat1Lbl}</span>
              </div>
              <div className={styles.statPill}>
                <span className={styles.statVal}>{t.bentoStat2Val}</span>
                <span className={styles.statLbl}>{t.bentoStat2Lbl}</span>
              </div>
            </div>
          </div>

          {/* بطاقة Bento 2 */}
          <div className={`${styles.bentoCard} ${styles.revealOnScroll} ${styles.fadeUp}`} style={{ transitionDelay: '0.2s' }}>
            <div className={styles.bentoHeader}>
              <div className={styles.bentoIcon}><IconCalendarCheck /></div>
              <h3 className={styles.bentoTitle}>{t.bento2Title}</h3>
              <p className={styles.bentoDesc}>{t.bento2Desc}</p>
            </div>
          </div>

          {/* بطاقة Bento 3 */}
          <div className={`${styles.bentoCard} ${styles.bentoSpan2} ${styles.revealOnScroll} ${styles.fadeUp}`} style={{ transitionDelay: '0.3s' }}>
            <div className={styles.bentoHeader}>
              <div className={styles.bentoIcon}><IconBuilding /></div>
              <h3 className={styles.bentoTitle}>{t.bento3Title}</h3>
              <p className={styles.bentoDesc}>{t.bento3Desc}</p>
            </div>
            
            <div className={styles.bentoVisualArea}>
              <div className={styles.statPill}>
                <span className={`${styles.statVal} ${styles.statValPrimary}`}>{t.bentoStat3Val}</span>
                <span className={styles.statLbl}>{t.bentoStat3Lbl}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. لماذا تختار salati */}
      <section id="why-us" className={styles.whyUsSection}>
        <div className={`${styles.whyUsHeader} ${styles.revealOnScroll} ${styles.fadeUp}`}>
          <h2 className={styles.whyUsTitle}>{t.whyTitle}</h2>
          <p className={styles.whyUsSubtitle}>{t.whySubtitle}</p>
        </div>

        <div className={styles.whyUsGrid}>
          <div className={`${styles.whyCard} ${styles.revealOnScroll} ${styles.fadeUp}`} style={{ transitionDelay: '0.1s' }}>
            <div className={styles.cardTopRow}>
              <div className={styles.iconBox}><IconGlobe /></div>
              <span className={styles.stepBadge}>01</span>
            </div>
            <h3>{t.why1Title}</h3>
            <p>{t.why1Desc}</p>
          </div>

          <div className={`${styles.whyCard} ${styles.revealOnScroll} ${styles.fadeUp}`} style={{ transitionDelay: '0.2s' }}>
            <div className={styles.cardTopRow}>
              <div className={styles.iconBox}><IconMapPin /></div>
              <span className={styles.stepBadge}>02</span>
            </div>
            <h3>{t.why2Title}</h3>
            <p>{t.why2Desc}</p>
          </div>

          <div className={`${styles.whyCard} ${styles.revealOnScroll} ${styles.fadeUp}`} style={{ transitionDelay: '0.3s' }}>
            <div className={styles.cardTopRow}>
              <div className={styles.iconBox}><IconStarQr /></div>
              <span className={styles.stepBadge}>03</span>
            </div>
            <h3>{t.why3Title}</h3>
            <p>{t.why3Desc}</p>
          </div>

          <div className={`${styles.whyCard} ${styles.revealOnScroll} ${styles.fadeUp}`} style={{ transitionDelay: '0.4s' }}>
            <div className={styles.cardTopRow}>
              <div className={styles.iconBox}><IconZap /></div>
              <span className={styles.stepBadge}>04</span>
            </div>
            <h3>{t.why4Title}</h3>
            <p>{t.why4Desc}</p>
          </div>
        </div>
      </section>

      {/* 4. كيفية الاستخدام */}
      <section id="how-it-works" className={styles.howSection}>
        <div className={`${styles.howHeader} ${styles.revealOnScroll} ${styles.fadeUp}`}>
          <h2 className={styles.howTitle}>{t.howTitle}</h2>
          <p className={styles.howSubtitle}>{t.howSubtitle}</p>
        </div>

        <div className={styles.howContainer}>
          <div className={styles.progressLine}></div>

          <div className={styles.howGrid}>
            <div className={`${styles.howCard} ${styles.revealOnScroll} ${styles.fadeUp}`} style={{ transitionDelay: '0.1s' }}>
              <div className={styles.nodeHeader}>
                <div className={styles.iconBoxSaas}><IconUserPlus /></div>
                <span className={styles.nodeNumber}>01</span>
              </div>
              <h3>{t.step1Title}</h3>
              <p>{t.step1Desc}</p>
            </div>

            <div className={`${styles.howCard} ${styles.revealOnScroll} ${styles.fadeUp}`} style={{ transitionDelay: '0.25s' }}>
              <div className={styles.nodeHeader}>
                <div className={styles.iconBoxSaas}><IconLayout /></div>
                <span className={styles.nodeNumber}>02</span>
              </div>
              <h3>{t.step2Title}</h3>
              <p>{t.step2Desc}</p>
            </div>

            <div className={`${styles.howCard} ${styles.revealOnScroll} ${styles.fadeUp}`} style={{ transitionDelay: '0.4s' }}>
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

      {/* 5. قسم خطط الأسعار والاشتراكات */}
      <section id="pricing" className={styles.pricingSection}>
        <div className={`${styles.pricingHeader} ${styles.revealOnScroll} ${styles.fadeUp}`}>
          <h2 className={styles.pricingTitle}>{t.pricingTitle}</h2>
          <p className={styles.pricingSubtitle}>{t.pricingSubtitle}</p>

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
          
          {/* الباقة 1 */}
          {(() => {
            const plan1 = getPriceAndPeriod(t.plan1PriceMonthly, t.plan1PriceSemiAnnual, t.plan1PriceAnnual);
            return (
              <div className={`${styles.priceCard} ${styles.revealOnScroll} ${styles.fadeUp}`} style={{ transitionDelay: '0.1s' }}>
                <div className={styles.cardHead}>
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
                <a href="/register" onClick={(e) => navigateTo(e, '/register')} className={styles.priceCta}>{t.selectPlan}</a>
                <span className={styles.noRiskSub}>{t.noHiddenFees}</span>
              </div>
            );
          })()}

          {/* الباقة 2 */}
          {(() => {
            const plan2 = getPriceAndPeriod(t.plan2PriceMonthly, t.plan2PriceSemiAnnual, t.plan2PriceAnnual);
            return (
              <div className={`${styles.priceCard} ${styles.popularCard} ${styles.revealOnScroll} ${styles.fadeUp}`} style={{ transitionDelay: '0.25s' }}>
                <div className={styles.popularBadge}>{t.popularBadge}</div>
                <div className={styles.cardHead}>
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
                <a href="/register" onClick={(e) => navigateTo(e, '/register')} className={`${styles.priceCta} ${styles.popularCta}`}>{t.selectPlan}</a>
                <span className={styles.noRiskSub}>{t.noHiddenFees}</span>
              </div>
            );
          })()}

          {/* الباقة 3 */}
          {(() => {
            const plan3 = getPriceAndPeriod(t.plan3PriceMonthly, t.plan3PriceSemiAnnual, t.plan3PriceAnnual);
            return (
              <div className={`${styles.priceCard} ${styles.revealOnScroll} ${styles.fadeUp}`} style={{ transitionDelay: '0.4s' }}>
                <div className={styles.cardHead}>
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
                <a href="/register" onClick={(e) => navigateTo(e, '/register')} className={styles.priceCta}>{t.selectPlan}</a>
                <span className={styles.noRiskSub}>{t.noHiddenFees}</span>
              </div>
            );
          })()}

        </div>

        <div className={`${styles.trustBar} ${styles.revealOnScroll} ${styles.fadeUp}`}>
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

      {/* 6. قسم الأسئلة الشائعة (FAQ) */}
      <section id="faq" className={styles.faqSection}>
        <div className={`${styles.faqHeader} ${styles.revealOnScroll} ${styles.fadeUp}`}>
          <h2 className={styles.faqTitle}>{t.faqTitle}</h2>
          <p className={styles.faqSubtitle}>{t.faqSubtitle}</p>
        </div>

        <div className={styles.faqContainer}>
          {t.faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''} ${styles.revealOnScroll} ${styles.fadeUp}`}
                style={{ transitionDelay: `${index * 0.08}s` }}
              >
                <button 
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <span className={`${styles.faqChevron} ${isOpen ? styles.faqChevronOpen : ''}`}>
                    <IconChevronDown />
                  </span>
                </button>
                {isOpen && (
                  <div className={styles.faqAnswer}>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. قسم الفوتر (Footer) */}
      <footer className={styles.footer}>
        <div className={`${styles.footerContainer} ${styles.revealOnScroll} ${styles.fadeUp}`}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>salati<span>.work</span></div>
            <p className={styles.footerDesc}>{t.footerDesc}</p>
          </div>

          <div className={styles.footerCol}>
            <h4>{t.footerCol1}</h4>
            <ul className={styles.footerList}>
              <li><a href="#">{t.linkHome}</a></li>
              <li><a href="#why-us">{t.linkWhy}</a></li>
              <li><a href="#how-it-works">{t.linkHow}</a></li>
              <li><a href="#pricing">{t.linkPricing}</a></li>
              <li><a href="#faq">{t.linkFaq}</a></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>{t.footerCol2}</h4>
            <ul className={styles.footerList}>
              <li>
                <a href="/terms" onClick={(e) => navigateTo(e, '/terms')}>
                  {t.linkTerms}
                </a>
              </li>
              <li>
                <a href="/privacy" onClick={(e) => navigateTo(e, '/privacy')}>
                  {t.linkPrivacy}
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>{t.footerCol3}</h4>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <IconPhone /> <span>+213 550 00 00 00</span>
              </div>
              <div className={styles.contactItem}>
                <IconMail /> <span>contact@salati.work</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div>{t.copyright}</div>
        </div>
      </footer>

    </div>
  );
}