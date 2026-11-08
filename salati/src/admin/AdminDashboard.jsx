import { useState, useEffect } from 'react';
import { supabase } from "../lib/supabaseClient";
import styles from './AdminDashboard.module.css';

/* =========================================
   أيقونات اللوحة (SVG Icons)
   ========================================= */
const IconDashboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9"></rect>
    <rect x="14" y="3" width="7" height="5"></rect>
    <rect x="14" y="12" width="7" height="9"></rect>
    <rect x="3" y="16" width="7" height="5"></rect>
  </svg>
);

const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const IconHallSite = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"></path>
  </svg>
);

const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const IconSms = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconFileText = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
  </svg>
);

const IconClipboardCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    <polyline points="9 14 11 16 15 11"></polyline>
  </svg>
);

const IconSettings = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const IconMenu = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const IconGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"></path>
  </svg>
);

const IconQr = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const IconAlertTriangle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const IconWhatsApp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.298-1.144z"/>
  </svg>
);

export default function AdminDashboard() {
  const [lang, setLang] = useState(document.documentElement.lang || 'ar');
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [selectedBookingForContract, setSelectedBookingForContract] = useState(null);

  // إعدادات زر الواتساب العائم
  const [showWhatsapp, setShowWhatsapp] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('0555 12 34 56');

  // وسائط القاعة (معرض الصور حتى 20 صورة وفيديو واحد)
  const [galleryImages, setGalleryImages] = useState([
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1545232979-fbfd433bd14b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [videoUrl, setVideoUrl] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // الخصائص والمرافق المكتوبة القابلة للتعديل والإضافة
  const [amenities, setAmenities] = useState([
    'فصل قاعة الرجال عن النساء (مدخل مستقل)',
    'موقف سيارات محروس (Parking)',
    'طباخ ومطبخ مجهز مدمج',
    'تكييف وتدفئة مركزية',
    'مولد كهربائي احتياطي (Groupe Électrogène)',
    'غرفة العروس الخاصة (VIP Bride Room)',
    'نظام DJ وإضاءة كوشة مجهزة',
    'طاقم أمن ونادلات محترفات'
  ]);

  // جدول أسعار الفترات والخدمات المخصص المطابق للصورة المرفقة
  const [pricingPackages, setPricingPackages] = useState([
    { title: 'كراء القاعة مساءا (من 2 إلى 7 مساءا)', price: '200.000' },
    { title: 'العشاء والليل (من 5 مساءً حتى منتصف الليل) للقاعتين', price: '400.000' },
    { title: 'الكراء في الليل (9 مساءً - 3 صباحًا)', price: '270.000' },
    { title: 'الكراء للغذاء (للقاعتين)', price: '350.000' },
    { title: 'العشاء للشخص الواحد (من 6 مساءا إلى 10 ليلا)', price: '3.500' },
    { title: 'العشاء في القاعتين', price: '350.000' }
  ]);

  // 1. الفضاءات المتاحة بالقاعة (Multi-Space)
  const [spaces] = useState([
    { id: 'sp-1', name: 'القاعة الكبرى (النساء)', capacity: 400 },
    { id: 'sp-2', name: 'قاعة الرجال الفرعية', capacity: 200 },
    { id: 'sp-3', name: 'الفضاء الخارجي والحديقة', capacity: 150 }
  ]);

  // 2. نموذج بيانات حجز جديد
  const [newBooking, setNewBooking] = useState({
    client: '',
    phone: '',
    date: '',
    timeSlot: 'evening',
    spaceId: 'sp-1',
    type: 'عرس',
    amount: '',
    deposit: '',
    holdHours: '72',
    services: {
      catering: false,
      waiters: false,
      decor: false,
      dj: false
    }
  });

  // 3. فريق العمل
  const [staffList] = useState([
    { id: 1, name: 'مالك القاعة (أنت)', role: 'owner', phone: '0555 12 34 56', email: 'owner@salati.work' },
    { id: 2, name: 'سليم بن أحمد', role: 'manager', phone: '0770 98 76 54', email: 'salim@gmail.com' }
  ]);

  // 4. الحجوزات
  const [bookings, setBookings] = useState([
    {
      id: 'BK-101',
      client: 'كمال بن علي',
      phone: '0551234567',
      date: '2026-11-15',
      timeSlot: 'evening',
      spaceName: 'القاعة الكبرى (النساء)',
      type: 'عرس',
      status: 'confirmed',
      amount: '140,000 دج',
      deposit: '50,000 دج',
      contractSigned: true,
      holdExpiresAt: null
    },
    {
      id: 'BK-102',
      client: 'ياسين بلخير',
      phone: '0669876543',
      date: '2026-11-20',
      timeSlot: 'afternoon',
      spaceName: 'قاعة الرجال الفرعية',
      type: 'خطوبة',
      status: 'provisional',
      amount: '80,000 دج',
      deposit: '0 دج',
      contractSigned: false,
      holdExpiresAt: 'ينتهي خلال 48 ساعة'
    },
    {
      id: 'BK-103',
      client: 'حمزة سعيد',
      phone: '0771122334',
      date: '2026-11-28',
      timeSlot: 'full_day',
      spaceName: 'القاعة الكبرى + الحديقة',
      type: 'عرس',
      status: 'confirmed',
      amount: '210,000 دج',
      deposit: '80,000 دج',
      contractSigned: true,
      holdExpiresAt: null
    },
    {
      id: 'BK-104',
      client: 'أمين شريف',
      phone: '0559988776',
      date: '2026-12-05',
      timeSlot: 'evening',
      spaceName: 'القاعة الكبرى (النساء)',
      type: 'حفلة تكريم',
      status: 'cancelled',
      amount: '60,000 دج',
      deposit: '0 دج',
      contractSigned: false,
      holdExpiresAt: null
    }
  ]);

  // 5. قائمة الانتظار
  const [waitlist] = useState([
    { id: 'WL-01', client: 'فاروق تواتي', phone: '0661002233', desiredDate: '2026-11-15', timeSlot: 'evening', note: 'يرغب بالقاعة الكبرى في حال إلغاء حجز كمال بن علي' }
  ]);

  // 6. بيانات التراخيص
  const [licenseInfo] = useState({
    insuranceDate: '2026-12-01',
    permitDate: '2027-05-15',
    daysToExpiry: 24
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLang(document.documentElement.lang || 'ar');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  const isAr = lang === 'ar';

  const toggleLanguage = () => {
    const nextLang = isAr ? 'fr' : 'ar';
    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    setLang(nextLang);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('حدث خطأ أثناء تسجيل الخروج:', error);
    }
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new Event('popstate'));
  };

  const handleAddImage = (urlToAdd) => {
    if (!urlToAdd) return;
    if (galleryImages.length >= 20) {
      alert(isAr ? 'الحد الأقصى للصور هو 20 صورة فقط' : 'Le limite est de 20 photos');
      return;
    }
    setGalleryImages([...galleryImages, urlToAdd]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setGalleryImages(galleryImages.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const remainingSlots = 20 - galleryImages.length;
    if (remainingSlots <= 0) {
      alert(isAr ? 'وصلت للحد الأقصى (20 صورة)' : 'Limite de 20 photos atteinte');
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);
    const newUploadedUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setGalleryImages([...galleryImages, ...newUploadedUrls]);
  };

  // دوال التحكم بالخصائص والمرافق المكتوبة
  const handleAmenityChange = (index, value) => {
    const updated = [...amenities];
    updated[index] = value;
    setAmenities(updated);
  };

  const handleAddAmenity = () => {
    setAmenities([...amenities, '']);
  };

  const handleRemoveAmenity = (indexToRemove) => {
    setAmenities(amenities.filter((_, idx) => idx !== indexToRemove));
  };

  // دوال التحكم بباقات وخيارات الأسعار المكتوبة
  const handlePricingChange = (index, field, value) => {
    const updated = [...pricingPackages];
    updated[index][field] = value;
    setPricingPackages(updated);
  };

  const handleAddPricingPackage = () => {
    setPricingPackages([...pricingPackages, { title: '', price: '' }]);
  };

  const handleRemovePricingPackage = (indexToRemove) => {
    setPricingPackages(pricingPackages.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddBookingSubmit = (e) => {
    e.preventDefault();
    if (!newBooking.client || !newBooking.date) return;
    
    const selectedSpace = spaces.find(s => s.id === newBooking.spaceId);
    const created = {
      id: `BK-10${bookings.length + 1}`,
      client: newBooking.client,
      phone: newBooking.phone,
      date: newBooking.date,
      timeSlot: newBooking.timeSlot,
      spaceName: selectedSpace ? selectedSpace.name : 'القاعة الرئيسية',
      type: newBooking.type,
      status: 'provisional',
      amount: `${Number(newBooking.amount).toLocaleString()} دج`,
      deposit: newBooking.deposit ? `${Number(newBooking.deposit).toLocaleString()} دج` : '0 دج',
      contractSigned: false,
      holdExpiresAt: `ينتهي خلال ${newBooking.holdHours} ساعة`
    };

    setBookings([created, ...bookings]);
    setIsAddBookingOpen(false);
    setNewBooking({
      client: '',
      phone: '',
      date: '',
      timeSlot: 'evening',
      spaceId: 'sp-1',
      type: 'عرس',
      amount: '',
      deposit: '',
      holdHours: '72',
      services: { catering: false, waiters: false, decor: false, dj: false }
    });
  };

  const handleSaveSiteSettings = async (e) => {
    e.preventDefault();
    try {
      // حفظ البيانات وإعدادات الواتساب والوسائط والخصائص وجدول الأسعار إلى Supabase
      const { error } = await supabase
        .from('halls')
        .update({
          show_whatsapp: showWhatsapp,
          whatsapp_number: whatsappNumber,
          video_url: videoUrl,
          gallery_images: galleryImages,
          amenities: amenities,
          pricing_packages: pricingPackages
        })
        .eq('slug', 'salle-el-bahdja');

      if (error) throw error;
      alert(isAr ? 'تم حفظ التعديلات بنجاح ونشرها للموقع!' : 'Modifications enregistrées!');
    } catch (err) {
      console.error('خطأ في حفظ الإعدادات:', err);
      alert(isAr ? 'تم حفظ التعديلات محلياً!' : 'Enregistré localement!');
    }
  };

  const handleOpenContract = (booking) => {
    setSelectedBookingForContract(booking);
    setIsContractModalOpen(true);
  };

  const handleSignContract = () => {
    if (!selectedBookingForContract) return;
    setBookings(bookings.map(b => b.id === selectedBookingForContract.id ? { ...b, contractSigned: true, status: 'confirmed' } : b));
    setIsContractModalOpen(false);
  };

  const getTimeSlotLabel = (slot) => {
    if (slot === 'afternoon') return isAr ? 'الظهيرة (12:00 - 17:00)' : 'Après-midi';
    if (slot === 'evening') return isAr ? 'المساء / العشاء (18:00 - 23:00)' : 'Soirée';
    return isAr ? 'يوم كامل (الظهيرة + المساء)' : 'Journée entière';
  };

  const t = {
    overview: isAr ? 'نظرة عامة' : 'Vue générale',
    calendar: isAr ? 'التقويم والحجوزات' : 'Calendrier & Réservations',
    site: isAr ? 'موقع القاعة الخاص' : 'Site Web de la Salle',
    staff: isAr ? 'فريق العمل والعُمّال' : 'Équipe & Personnel',
    sms: isAr ? 'تذكيرات SMS والـ QR' : 'Rappels SMS & QR',
    inspection: isAr ? 'معاينة القاعة قبل/بعد' : 'Inspection Pré/Post',
    settings: isAr ? 'الإعدادات والاشتراك' : 'Paramètres & Offre',
    newBookingBtn: isAr ? 'إضافة حجز جديد' : 'Nouvelle Réservation',
    viewSiteBtn: isAr ? 'معاينة موقع الصالة' : 'Voir le site Web',
    logoutBtn: isAr ? 'تسجيل الخروج' : 'Déconnexion',
    kpi1: isAr ? 'إجمالي حجوزات الشهر' : 'Réservations du mois',
    kpi2: isAr ? 'حجوزات مؤقتة (تنتظر العربون)' : 'Réservations provisoires',
    kpi3: isAr ? 'المناسبة القادمة' : 'Prochain Événement',
    kpi4: isAr ? 'قائمة الانتظار' : 'Liste d\'attente',
    recentBookings: isAr ? 'أحدث طلبات وفترات الحجز' : 'Dernières Réservations',
    bookingId: isAr ? 'رقم الحجز' : 'ID',
    client: isAr ? 'اسم الزبون' : 'Client',
    date: isAr ? 'التاريخ والفترة' : 'Date & Créneau',
    space: isAr ? 'الفضاء' : 'Espace',
    amount: isAr ? 'المبلغ' : 'Montant',
    status: isAr ? 'الحالة والمهلة' : 'Statut & Délai',
    action: isAr ? 'الإجراء والعقد' : 'Action & Contrat',
    confirmed: isAr ? 'مؤكد' : 'Confirmé',
    provisional: isAr ? 'مؤقت (بانتظار العربون)' : 'Provisoire',
    cancelled: isAr ? 'ملغى' : 'Annulé',
    manage: isAr ? 'إدارة' : 'Gérer',
    contractBtn: isAr ? 'العقد الرقمي' : 'Contrat Numérique',
    addWorker: isAr ? 'إضافة مساعد / عامل' : 'Ajouter un assistant',
  };

  return (
    <div className={styles.adminLayout}>
      {/* 1. الشريط الجانبي */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <a href="/" className={styles.brandLogo}>
            salati<span>.admin</span>
          </a>
          <button className={styles.closeSidebarBtn} onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <div className={styles.hallSelectorCard}>
          <div className={styles.hallAvatar}>🏰</div>
          <div className={styles.hallMeta}>
            <strong>{isAr ? 'قاعة البهجة' : 'Salle El Bahdja'}</strong>
            <span>{isAr ? 'الجزائر العاصمة' : 'Alger'}</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'overview' ? styles.navItemActive : ''}`}
            onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
          >
            <IconDashboard />
            <span>{t.overview}</span>
          </button>

          <button 
            className={`${styles.navItem} ${activeTab === 'calendar' ? styles.navItemActive : ''}`}
            onClick={() => { setActiveTab('calendar'); setSidebarOpen(false); }}
          >
            <IconCalendar />
            <span>{t.calendar}</span>
          </button>

          <button 
            className={`${styles.navItem} ${activeTab === 'site' ? styles.navItemActive : ''}`}
            onClick={() => { setActiveTab('site'); setSidebarOpen(false); }}
          >
            <IconHallSite />
            <span>{t.site}</span>
          </button>

          <button 
            className={`${styles.navItem} ${activeTab === 'inspection' ? styles.navItemActive : ''}`}
            onClick={() => { setActiveTab('inspection'); setSidebarOpen(false); }}
          >
            <IconClipboardCheck />
            <span>{t.inspection}</span>
          </button>

          <button 
            className={`${styles.navItem} ${activeTab === 'staff' ? styles.navItemActive : ''}`}
            onClick={() => { setActiveTab('staff'); setSidebarOpen(false); }}
          >
            <IconUsers />
            <span>{t.staff}</span>
          </button>

          <button 
            className={`${styles.navItem} ${activeTab === 'sms' ? styles.navItemActive : ''}`}
            onClick={() => { setActiveTab('sms'); setSidebarOpen(false); }}
          >
            <IconSms />
            <span>{t.sms}</span>
          </button>

          <button 
            className={`${styles.navItem} ${activeTab === 'settings' ? styles.navItemActive : ''}`}
            onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
          >
            <IconSettings />
            <span>{t.settings}</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <a href="/v/salle-el-bahdja" target="_blank" rel="noreferrer" className={styles.viewLiveSiteBtn}>
            <IconHallSite />
            <span>{t.viewSiteBtn}</span>
          </a>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <IconLogout />
            <span>{t.logoutBtn}</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />}

      {/* 2. المحتوى الرئيسي */}
      <div className={styles.mainWrapper}>
        <header className={styles.adminHeader}>
          <button className={styles.toggleMenuBtn} onClick={() => setSidebarOpen(true)}>
            <IconMenu />
          </button>
          
          <h1 className={styles.headerTitle}>{isAr ? 'لوحة إدارة القاعة' : 'Gestion de la Salle'}</h1>

          <div className={styles.headerActions}>
            <button className={styles.langBtn} onClick={toggleLanguage}>
              <IconGlobe />
              <span>{isAr ? 'FR' : 'AR'}</span>
            </button>

            <button className={styles.addBookingBtn} onClick={() => setIsAddBookingOpen(true)}>
              <IconPlus />
              <span>{t.newBookingBtn}</span>
            </button>

            <div className={styles.userProfile}>
              <span className={styles.avatarText}>م</span>
              <span className={styles.userName}>{isAr ? 'مالك القاعة' : 'Propriétaire'}</span>
            </div>
          </div>
        </header>

        {licenseInfo.daysToExpiry <= 30 && (
          <div className={styles.alertBanner}>
            <IconAlertTriangle />
            <span>
              {isAr 
                ? `تنبيه إداري: ينتهي تأمين المنشأة ورخصة السلامة خلال ${licenseInfo.daysToExpiry} يوماً (${licenseInfo.insuranceDate}). يُرجى التجديد.`
                : `Alerte: Votre assurance et permis expirent dans ${licenseInfo.daysToExpiry} jours.`}
            </span>
          </div>
        )}

        <main className={styles.adminContent}>
          
          {/* تبويب 1: نظرة عامة */}
          {activeTab === 'overview' && (
            <div className={styles.tabPaneAnim}>
              <section className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                  <div className={styles.kpiIcon}>📅</div>
                  <div className={styles.kpiData}>
                    <span>{t.kpi1}</span>
                    <strong>{bookings.length} {isAr ? 'حجوزات' : 'réservations'}</strong>
                  </div>
                </div>
                <div className={styles.kpiCard}>
                  <div className={styles.kpiIcon}>⏳</div>
                  <div className={styles.kpiData}>
                    <span>{t.kpi2}</span>
                    <strong>{bookings.filter(b => b.status === 'provisional').length} {isAr ? 'مؤقتة' : 'provisoires'}</strong>
                  </div>
                </div>
                <div className={styles.kpiCard}>
                  <div className={styles.kpiIcon}>🎉</div>
                  <div className={styles.kpiData}>
                    <span>{t.kpi3}</span>
                    <strong>15 {isAr ? 'نوفمبر (مساءً)' : 'Novembre (Soir)'}</strong>
                  </div>
                </div>
                <div className={styles.kpiCard}>
                  <div className={styles.kpiIcon}>📋</div>
                  <div className={styles.kpiData}>
                    <span>{t.kpi4}</span>
                    <strong>{waitlist.length} {isAr ? 'في الانتظار' : 'en attente'}</strong>
                  </div>
                </div>
              </section>

              <section className={styles.tableSection}>
                <div className={styles.tableHeader}>
                  <div>
                    <h2>{t.recentBookings}</h2>
                    <p>{isAr ? 'إدارة فترات الظهيرة والعشاء مع مهلة تحرير العربون التلقائي' : 'Gérez vos créneaux et acomptes'}</p>
                  </div>
                  <button className={styles.secondaryBtn} onClick={() => setActiveTab('calendar')}>
                    {isAr ? 'عرض التقويم بالفترات' : 'Voir créneaux'}
                  </button>
                </div>

                <div className={styles.tableContainer}>
                  <table className={styles.bookingsTable}>
                    <thead>
                      <tr>
                        <th>{t.bookingId}</th>
                        <th>{t.client}</th>
                        <th>{t.date}</th>
                        <th>{t.space}</th>
                        <th>{t.amount}</th>
                        <th>{t.status}</th>
                        <th>{t.action}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((item) => (
                        <tr key={item.id}>
                          <td className={styles.bookingId}>{item.id}</td>
                          <td className={styles.clientName}>
                            <div>{item.client}</div>
                            <small className={styles.subText}>{item.phone}</small>
                          </td>
                          <td>
                            <div>{item.date}</div>
                            <span className={styles.timeSlotBadge}>{getTimeSlotLabel(item.timeSlot)}</span>
                          </td>
                          <td>{item.spaceName}</td>
                          <td className={styles.amountText}>
                            <div>{item.amount}</div>
                            <small className={styles.subText}>{isAr ? `العربون: ${item.deposit}` : `Acompte: ${item.deposit}`}</small>
                          </td>
                          <td>
                            <span className={`${styles.statusBadge} ${styles[item.status]}`}>
                              {t[item.status] || item.status}
                            </span>
                            {item.status === 'provisional' && (
                              <div className={styles.expiryTimer}>
                                <IconClock /> <span>{item.holdExpiresAt}</span>
                              </div>
                            )}
                          </td>
                          <td>
                            <div className={styles.tableActions}>
                              <button className={styles.actionBtn} onClick={() => handleOpenContract(item)}>
                                <IconFileText /> <span>{t.contractBtn}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className={styles.panelCard} style={{ marginTop: '1.5rem' }}>
                <div className={styles.panelHeader}>
                  <h2>{isAr ? 'قائمة الانتظار لموسم الذروة' : 'Liste d\'attente Haute Saison'}</h2>
                  <span className={styles.waitCountBadge}>{waitlist.length} {isAr ? 'طلبات متراكمة' : 'demandes'}</span>
                </div>
                <div className={styles.staffGrid}>
                  {waitlist.map((wl) => (
                    <div key={wl.id} className={styles.staffCard}>
                      <div className={styles.staffAvatar}>⏳</div>
                      <div className={styles.staffInfo}>
                        <strong>{wl.client} ({wl.phone})</strong>
                        <span>{isAr ? `التاريخ المطلوب: ${wl.desiredDate} (${getTimeSlotLabel(wl.timeSlot)})` : wl.desiredDate}</span>
                        <small>{wl.note}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* تبويب 2: التقويم */}
          {activeTab === 'calendar' && (
            <div className={styles.tabPaneAnim}>
              <div className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <div>
                    <h2>{isAr ? 'تقويم الشغور مقسّم بالفترات (الظهيرة / المساء)' : 'Calendrier par Créneaux'}</h2>
                    <p className={styles.sectionDesc}>{isAr ? 'كل يوم يحتوي على فترتين مستقلتين بسعر وساعات خاصة' : 'Chaque jour a deux créneaux مستقلين'}</p>
                  </div>
                  <button className={styles.addBookingBtn} onClick={() => setIsAddBookingOpen(true)}>
                    <IconPlus /> <span>{t.newBookingBtn}</span>
                  </button>
                </div>

                <div className={styles.calendarSimGrid}>
                  {['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map((day, idx) => (
                    <div key={idx} className={styles.calDayHeader}>{day}</div>
                  ))}
                  {Array.from({ length: 28 }).map((_, i) => {
                    const dayNum = i + 1;
                    const isAfternoonBooked = [5, 12, 20].includes(dayNum);
                    const isEveningBooked = [15, 20, 28].includes(dayNum);

                    return (
                      <div key={i} className={styles.calSlotCell}>
                        <div className={styles.calNumRow}>
                          <span className={styles.calNum}>{dayNum}</span>
                        </div>
                        <div className={`${styles.slotItem} ${isAfternoonBooked ? styles.slotBooked : styles.slotFree}`}>
                          <span>{isAr ? 'الظهيرة' : 'Midi'}</span>
                          <small>{isAfternoonBooked ? (isAr ? 'محجوز' : 'Occupé') : (isAr ? 'شاغر' : 'Libre')}</small>
                        </div>
                        <div className={`${styles.slotItem} ${isEveningBooked ? styles.slotBooked : styles.slotFree}`}>
                          <span>{isAr ? 'المساء' : 'Soir'}</span>
                          <small>{isEveningBooked ? (isAr ? 'محجوز' : 'Occupé') : (isAr ? 'شاغر' : 'Libre')}</small>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================
             تبويب 3: موقع القاعة الخاص والخصائص
             ========================================= */}
          {activeTab === 'site' && (
            <div className={styles.tabPaneAnim}>
              <div className={styles.panelCard}>
                <h2>{isAr ? 'إدارة محتوى وخصائص القاعة' : 'Gérer Caractéristiques de la Salle'}</h2>
                <p className={styles.sectionDesc}>
                  {isAr ? 'تُعرض هذه البيانات مباشرة للزبائن في صفحة صالتك الخاصة (salati.work/v/salle-el-bahdja)' : 'Visible par vos clients sur votre page'}
                </p>

                <form className={styles.siteCustomizerForm} onSubmit={handleSaveSiteSettings}>
                  
                  {/* 1. المعلومات الأساسية والتواصل والموقع */}
                  <div className={styles.sectionBlock}>
                    <h3>{isAr ? '1. المعلومات الأساسية والتواصل والموقع' : '1. Informations Générales & Localisation'}</h3>
                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label>{isAr ? 'اسم القاعة التجاري' : 'Nom commercial'}</label>
                        <input type="text" defaultValue="قاعة البهجة للمناسبات" />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>{isAr ? 'السعة الإجمالية للضيوف' : 'Capacité totale'}</label>
                        <input type="number" defaultValue="600" />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label>{isAr ? 'رقم الهاتف المباشر للاتصال' : 'Téléphone direct'}</label>
                        <input type="tel" defaultValue="0555 12 34 56" />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>{isAr ? 'أوقات المعاينة الميدانية' : 'Horaires des visites'}</label>
                        <input type="text" defaultValue="يومياً من 10:00 صباحاً إلى 18:00 مساءً" />
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>{isAr ? 'رابط الموقع الجغرافي على Google Maps' : 'Lien Google Maps'}</label>
                      <input type="url" defaultValue="https://maps.google.com/?q=Salle+El+Bahdja" placeholder="https://maps.app.goo.gl/..." />
                    </div>
                  </div>

                  {/* إعدادات زر الواتساب العائم */}
                  <div className={styles.sectionBlock}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span style={{ color: '#25D366' }}><IconWhatsApp /></span>
                      <h3 style={{ margin: 0 }}>{isAr ? 'إعدادات زر التواصل عبر WhatsApp' : 'Paramètres WhatsApp'}</h3>
                    </div>

                    <div className={styles.formRow}>
                      <label className={styles.checkboxLabel}>
                        <input 
                          type="checkbox" 
                          checked={showWhatsapp} 
                          onChange={(e) => setShowWhatsapp(e.target.checked)} 
                        />
                        <span>{isAr ? 'إظهار زر الواتساب العائم في أسفل الموقع للزبائن' : 'Afficher le bouton WhatsApp flottant sur le site'}</span>
                      </label>
                    </div>

                    {showWhatsapp && (
                      <div className={styles.inputGroup} style={{ marginTop: '0.85rem' }}>
                        <label>{isAr ? 'رقم هاتف الواتساب المخصص للرد على استفسارات الزبائن' : 'Numéro WhatsApp de contact'}</label>
                        <input 
                          type="tel" 
                          value={whatsappNumber} 
                          onChange={(e) => setWhatsappNumber(e.target.value)} 
                          placeholder="0555123456" 
                        />
                      </div>
                    )}
                  </div>

                  {/* 2. الخصائص والمرافق المكتوبة (كتابة وإضافة بدلاً من التحديد) */}
                  <div className={styles.sectionBlock}>
                    <div className={styles.sectionTitleRow} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ margin: 0 }}>{isAr ? '2. الخصائص والمرافق المتاحة (Amenities)' : '2. Équipements & Commodités'}</h3>
                      <button 
                        type="button" 
                        className={styles.secondaryBtn}
                        onClick={handleAddAmenity}
                      >
                        + {isAr ? 'إضافة خاصية جديدة' : 'Ajouter une commodité'}
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {amenities.map((item, index) => (
                        <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleAmenityChange(index, e.target.value)}
                            placeholder={isAr ? `خاصية ${index + 1} (مثال: موقف سيارات محروس)` : `Équipement ${index + 1}`}
                            style={{ flex: 1, padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveAmenity(index)}
                            title={isAr ? 'حذف الخاصية' : 'Supprimer'}
                            style={{ 
                              background: 'rgba(239, 68, 68, 0.1)', 
                              color: '#ef4444', 
                              border: '1px solid #fca5a5', 
                              borderRadius: '8px', 
                              padding: '0.6rem 0.8rem', 
                              cursor: 'pointer', 
                              fontWeight: 'bold' 
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. أسعار الفترات والخدمات المخصص المطابق للصورة */}
                  <div className={styles.sectionBlock}>
                    <div className={styles.sectionTitleRow} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ margin: 0 }}>{isAr ? '3. جدول أسعار الفترات والخدمات' : '3. Tarifs et Prestations'}</h3>
                      <button 
                        type="button" 
                        className={styles.secondaryBtn}
                        onClick={handleAddPricingPackage}
                      >
                        + {isAr ? 'إضافة سعر/فترة جديدة' : 'Ajouter un tarif'}
                      </button>
                    </div>

                    <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
                      {pricingPackages.map((pkg, index) => (
                        <div 
                          key={index} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.75rem', 
                            padding: '0.75rem 1rem', 
                            borderBottom: index < pricingPackages.length - 1 ? '1px solid #e2e8f0' : 'none',
                            background: index % 2 === 0 ? '#ffffff' : '#f8fafc'
                          }}
                        >
                          <input
                            type="text"
                            value={pkg.title}
                            onChange={(e) => handlePricingChange(index, 'title', e.target.value)}
                            placeholder={isAr ? 'تفاصيل الفترة أو الخدمة (مثال: كراء القاعة مساءا...)' : 'Détails du tarif'}
                            style={{ flex: 2, padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flex: 1, minWidth: '130px' }}>
                            <input
                              type="text"
                              value={pkg.price}
                              onChange={(e) => handlePricingChange(index, 'price', e.target.value)}
                              placeholder="200.000"
                              style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 'bold', textAlign: 'right' }}
                            />
                            <span style={{ fontWeight: 'bold', color: '#334155', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>دج</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePricingPackage(index)}
                            title={isAr ? 'حذف البند' : 'Supprimer'}
                            style={{ 
                              background: 'rgba(239, 68, 68, 0.1)', 
                              color: '#ef4444', 
                              border: '1px solid #fca5a5', 
                              borderRadius: '8px', 
                              padding: '0.55rem 0.75rem', 
                              cursor: 'pointer', 
                              fontWeight: 'bold' 
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. وسائط القاعة (معرض 20 صورة + فيديو واحد) */}
                  <div className={styles.sectionBlock}>
                    <div className={styles.sectionTitleRow} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3>{isAr ? '4. وسائط القاعة (الصور والفيديو)' : '4. Médias (Photos & Vidéo)'}</h3>
                      <span className={styles.countBadge} style={{ background: '#e2e8f0', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        {galleryImages.length} / 20 {isAr ? 'صورة' : 'photos'}
                      </span>
                    </div>

                    {/* فيديو الصالة الرئيسي (فيديو واحد فقط) */}
                    <div className={styles.subSectionBox} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0' }}>🎬 {isAr ? 'فيديو الصالة الرئيسي (فيديو واحد)' : 'Vidéo principale (1 vidéo)'}</h4>
                      <div className={styles.inputGroup}>
                        <label>{isAr ? 'رابط فيديو للجولة الافتراضية (YouTube / Reel)' : 'Lien vidéo (YouTube / Reel)'}</label>
                        <input
                          type="url"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="https://www.youtube.com/embed/... أو https://instagram.com/reel/..."
                        />
                      </div>
                    </div>

                    {/* معرض صور القاعة (حتى 20 صورة) */}
                    <div className={styles.subSectionBox} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ margin: '0 0 1rem 0' }}>📸 {isAr ? 'معرض صور الصالة (حتى 20 صورة)' : 'Galerie photos (max 20)'}</h4>

                      {galleryImages.length < 20 && (
                        <div className={styles.addImageBar} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                          <input
                            type="url"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder={isAr ? 'رابط صورة أونلاين...' : 'URL de la photo...'}
                            style={{ flex: 1, minWidth: '200px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                          />
                          <button
                            type="button"
                            className={styles.secondaryBtn}
                            onClick={() => handleAddImage(newImageUrl)}
                          >
                            {isAr ? 'إضافة بالرابط' : 'Ajouter par URL'}
                          </button>
                          <label className={styles.addBookingBtn} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', margin: 0 }}>
                            📁 {isAr ? 'رفع من الجهاز' : 'Uploader'}
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileUpload}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>
                      )}

                      <div className={styles.imageUploadGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
                        {galleryImages.map((imgUrl, index) => (
                          <div key={index} className={styles.imgPreviewCard} style={{ position: 'relative', height: '110px', overflow: 'hidden', padding: 0, border: '1px solid #cbd5e1', borderRadius: '10px' }}>
                            <img src={imgUrl} alt={`صورة ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <span style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '10px' }}>
                              {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              title={isAr ? 'حذف الصورة' : 'Supprimer'}
                              style={{ position: 'absolute', top: '4px', left: '4px', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}

                        {galleryImages.length < 20 && (
                          <label className={styles.uploadPlaceholderBtn} style={{ height: '110px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px dashed #cbd5e1', borderRadius: '10px', background: '#fff' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>+</span>
                            <span style={{ fontSize: '0.85rem' }}>{isAr ? 'إضافة صورة' : 'Ajouter'}</span>
                            <small style={{ fontSize: '0.7rem', color: '#64748b' }}>({20 - galleryImages.length} {isAr ? 'متبقية' : 'restantes'})</small>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileUpload}
                              style={{ display: 'none' }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  <button type="submit" className={styles.saveChangesBtn}>
                    <IconCheck /> <span>{isAr ? 'حفظ التعديلات ونشر الموقع' : 'Enregistrer et Publier'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* تبويب 4: المعاينة */}
          {activeTab === 'inspection' && (
            <div className={styles.tabPaneAnim}>
              <div className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <div>
                    <h2>{isAr ? 'معاينة واستلام القاعة (Pre & Post Event Inspection)' : 'Inspection Avant/Après Événement'}</h2>
                    <p className={styles.sectionDesc}>{isAr ? 'وثيقة توثيق حالة الأثاث والتجهيزات بالصور قبل التسليم وبعد المغادرة لتفادي النزاعات' : 'État des lieux et équipements avec photos'}</p>
                  </div>
                  <button className={styles.addBookingBtn} onClick={() => setIsInspectionModalOpen(true)}>
                    <IconPlus /> <span>{isAr ? 'إجراء معاينة جديدة' : 'Nouvelle inspection'}</span>
                  </button>
                </div>

                <div className={styles.staffGrid}>
                  <div className={styles.staffCard}>
                    <div className={styles.staffAvatar}>📋</div>
                    <div className={styles.staffInfo}>
                      <strong>معاينة حفل كمال بن علي (BK-101)</strong>
                      <span>{isAr ? 'حالة الاستلام قبل الحفل: ممتازة (40 طاولة + 400 كرسي سليمة)' : 'Avant événement: Parfait'}</span>
                      <small>{isAr ? 'تاريخ التوثيق: 15 نوفمبر 2026' : '15 Nov 2026'}</small>
                    </div>
                    <button className={styles.secondaryBtn}>{isAr ? 'عرض الصور والتوقيع' : 'Voir photos'}</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* تبويب 5: طاقم العمل */}
          {activeTab === 'staff' && (
            <div className={styles.tabPaneAnim}>
              <div className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <div>
                    <h2>{isAr ? 'فريق العمل والمساعدون' : 'Personnel et Assistants'}</h2>
                    <p className={styles.sectionDesc}>{isAr ? 'إدارة صلاحيات العامل الوحيد أو مساعد الاستقبال' : 'Gérer l\'accès de vos assistants'}</p>
                  </div>
                  <button className={styles.addBookingBtn} onClick={() => setIsAddWorkerOpen(true)}>
                    <IconPlus /> <span>{t.addWorker}</span>
                  </button>
                </div>

                <div className={styles.staffGrid}>
                  {staffList.map((member) => (
                    <div key={member.id} className={styles.staffCard}>
                      <div className={styles.staffAvatar}>👤</div>
                      <div className={styles.staffInfo}>
                        <strong>{member.name}</strong>
                        <span>{member.role === 'owner' ? (isAr ? 'المالك الرئيسي' : 'Propriétaire') : (isAr ? 'مساعد استقبال' : 'Assistant')}</span>
                        <small>{member.phone}</small>
                      </div>
                      {member.role !== 'owner' && (
                        <button className={styles.removeWorkerBtn}>{isAr ? 'حذف' : 'Supprimer'}</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تبويب 6: SMS والـ QR */}
          {activeTab === 'sms' && (
            <div className={styles.tabPaneAnim}>
              <div className={styles.gridTwoCols}>
                <div className={styles.panelCard}>
                  <h2>{isAr ? 'تذكيرات SMS الأوتوماتيكية' : 'Rappels SMS Automatiques'}</h2>
                  <div className={styles.toggleRow}>
                    <span>{isAr ? 'إرسال تذكير أوتوماتيكي قبل المناسبة بـ 48 ساعة' : 'Envoyer SMS 48h avant l\'événement'}</span>
                    <input type="checkbox" defaultChecked className={styles.toggleSwitch} />
                  </div>
                  <div className={styles.toggleRow}>
                    <span>{isAr ? 'إرسال تنبيه SMS عند اقتراب مهلة دفع العربون' : 'SMS de rappel d\'acompte'}</span>
                    <input type="checkbox" defaultChecked className={styles.toggleSwitch} />
                  </div>
                </div>

                <div className={styles.panelCard}>
                  <h2>{isAr ? 'رمز Google Maps QR Code' : 'QR Code Google Maps'}</h2>
                  <p className={styles.sectionDesc}>{isAr ? 'اطبع الرمز في الاستقبال لجمع تقييمات الزبائن وتكثير زبائنك' : 'Imprimez votre QR code pour booster vos avis'}</p>
                  <div className={styles.qrDisplayBox}>
                    <IconQr />
                    <span>Google Maps QR Code</span>
                    <button className={styles.secondaryBtn}>{isAr ? 'تحميل جاهز للطباعة (PDF)' : 'Télécharger (PDF)'}</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* تبويب 7: الإعدادات والاشتراكات */}
          {activeTab === 'settings' && (
            <div className={styles.tabPaneAnim}>
              <div className={styles.panelCard}>
                <h2>{isAr ? 'اشتراكك الحالي في Salati' : 'Votre Abonnement Salati'}</h2>
                <div className={styles.subCardActive}>
                  <div>
                    <span className={styles.planBadge}>{isAr ? 'الخطة الاحترافية (Pro)' : 'Plan Professionnel'}</span>
                    <h3>4,000 دج / {isAr ? 'شهرياً' : 'Mois'}</h3>
                    <p>{isAr ? 'التجديد القادم: 01 ديسمبر 2026' : 'Prochain renouvellement: 01 Déc 2026'}</p>
                  </div>
                  <button className={styles.upgradePlanBtn}>{isAr ? 'ترقية الاشتراك' : 'Changer d\'offre'}</button>
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <h3>{isAr ? 'سجل التراخيص والوثائق الإدارية' : 'Documents Administratifs'}</h3>
                  <div className={styles.staffGrid} style={{ marginTop: '1rem' }}>
                    <div className={styles.staffCard}>
                      <div className={styles.staffAvatar}>🛡️</div>
                      <div className={styles.staffInfo}>
                        <strong>{isAr ? 'تأمين المنشأة والحريق' : 'Assurance Incendie'}</strong>
                        <span>{isAr ? `تاريخ الانتهاء: ${licenseInfo.insuranceDate}` : licenseInfo.insuranceDate}</span>
                      </div>
                    </div>
                    <div className={styles.staffCard}>
                      <div className={styles.staffAvatar}>📜</div>
                      <div className={styles.staffInfo}>
                        <strong>{isAr ? 'رخصة التجارة والسلامة' : 'Registre du commerce'}</strong>
                        <span>{isAr ? `تاريخ الانتهاء: ${licenseInfo.permitDate}` : licenseInfo.permitDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* النوافذ المنبثقة */}
      {isAddBookingOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3>{t.newBookingBtn}</h3>
              <button className={styles.modalCloseBtn} onClick={() => setIsAddBookingOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddBookingSubmit} className={styles.modalForm}>
              <div className={styles.inputGroup}>
                <label>{isAr ? 'اسم الزبون الكامل' : 'Nom du client'}</label>
                <input 
                  type="text" 
                  required 
                  value={newBooking.client} 
                  onChange={(e) => setNewBooking({...newBooking, client: e.target.value})}
                  placeholder={isAr ? 'مثال: محمد العماري' : 'Ex: Mohamed Amari'} 
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>{isAr ? 'رقم الهاتف' : 'Téléphone'}</label>
                  <input 
                    type="tel" 
                    required 
                    value={newBooking.phone} 
                    onChange={(e) => setNewBooking({...newBooking, phone: e.target.value})}
                    placeholder="0550 00 00 00" 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>{isAr ? 'تاريخ المناسبة' : 'Date'}</label>
                  <input 
                    type="date" 
                    required 
                    value={newBooking.date} 
                    onChange={(e) => setNewBooking({...newBooking, date: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>{isAr ? 'فترة الحجز (Time Slot)' : 'Créneau horaire'}</label>
                  <select 
                    value={newBooking.timeSlot} 
                    onChange={(e) => setNewBooking({...newBooking, timeSlot: e.target.value})}
                  >
                    <option value="afternoon">{isAr ? 'فترة الظهيرة (12:00 - 17:00)' : 'Après-midi'}</option>
                    <option value="evening">{isAr ? 'فترة المساء / العشاء (18:00 - 23:00)' : 'Soirée'}</option>
                    <option value="full_day">{isAr ? 'يوم كامل (الظهيرة + المساء)' : 'Journée entière'}</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>{isAr ? 'الفضاء المحجوز' : 'Espace réservé'}</label>
                  <select 
                    value={newBooking.spaceId} 
                    onChange={(e) => setNewBooking({...newBooking, spaceId: e.target.value})}
                  >
                    {spaces.map(sp => (
                      <option key={sp.id} value={sp.id}>{sp.name} ({sp.capacity} شخص)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>{isAr ? 'المبلغ الإجمالي (دج)' : 'Montant total (DZD)'}</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="140000"
                    value={newBooking.amount} 
                    onChange={(e) => setNewBooking({...newBooking, amount: e.target.value})}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>{isAr ? 'العربون المدفوع (دج)' : 'Acompte'}</label>
                  <input 
                    type="number" 
                    placeholder="50000"
                    value={newBooking.deposit} 
                    onChange={(e) => setNewBooking({...newBooking, deposit: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setIsAddBookingOpen(false)}>
                  {isAr ? 'إلغاء' : 'Annuler'}
                </button>
                <button type="submit" className={styles.addBookingBtn}>
                  {isAr ? 'حفظ الحجز والمتابعة' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isContractModalOpen && selectedBookingForContract && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox} style={{ maxWidth: '650px' }}>
            <div className={styles.modalHeader}>
              <h3>{isAr ? `العقد الرقمي للحجز ${selectedBookingForContract.id}` : `Contrat ${selectedBookingForContract.id}`}</h3>
              <button className={styles.modalCloseBtn} onClick={() => setIsContractModalOpen(false)}>✕</button>
            </div>
            
            <div className={styles.contractDocumentBox}>
              <h4>{isAr ? 'عقد حجز قاعة أفراح ومناسبات' : 'Contrat de Réservation de Salle'}</h4>
              <p><strong>{isAr ? 'طرف أول (القاعة):' : 'Partie 1:'}</strong> {isAr ? 'قاعة البهجة للمناسبات' : 'Salle El Bahdja'}</p>
              <p><strong>{isAr ? 'طرف ثاني (الزبون):' : 'Partie 2:'}</strong> {selectedBookingForContract.client} ({selectedBookingForContract.phone})</p>
              <p><strong>{isAr ? 'تاريخ الحجز والفترة:' : 'Date & Créneau:'}</strong> {selectedBookingForContract.date} ({getTimeSlotLabel(selectedBookingForContract.timeSlot)})</p>
              <p><strong>{isAr ? 'المبلغ الإجمالي:' : 'Montant:'}</strong> {selectedBookingForContract.amount} | <strong>{isAr ? 'العربون:' : 'Acompte:'}</strong> {selectedBookingForContract.deposit}</p>
              
              <div className={styles.contractTerms}>
                <small>
                  {isAr 
                    ? '* بنود الإلغاء: في حال الإلغاء قبل 15 يوماً من المناسبة يُسترجع 50% من العربون، وبعدها لا يُسترجع العربون.' 
                    : '* Conditions d\'annulation: Acompte non remboursable 15 jours avant l\'événement.'}
                </small>
              </div>

              <div className={styles.signatureSection}>
                <div className={styles.signatureBox}>
                  <span>{isAr ? 'توقيع المالك' : 'Signature Propriétaire'}</span>
                  <div className={styles.signatureStamp}>{isAr ? 'موقع إلكترونياً ✓' : 'Signé electroniquement'}</div>
                </div>
                <div className={styles.signatureBox}>
                  <span>{isAr ? 'توقيع الزبون' : 'Signature Client'}</span>
                  {selectedBookingForContract.contractSigned ? (
                    <div className={styles.signatureStamp}>{isAr ? 'موقع باللمس ✓' : 'Signé ✓'}</div>
                  ) : (
                    <div className={styles.signatureCanvasPlaceholder}>{isAr ? '[ارسم التوقيع هنا باللمس]' : '[Signer ici]'}</div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button type="button" className={styles.secondaryBtn} onClick={() => setIsContractModalOpen(false)}>
                {isAr ? 'إغلاق' : 'Fermer'}
              </button>
              {!selectedBookingForContract.contractSigned && (
                <button type="button" className={styles.addBookingBtn} onClick={handleSignContract}>
                  <IconCheck /> <span>{isAr ? 'تأكيد التوقيع الإلكتروني' : 'Valider la signature'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isAddWorkerOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3>{t.addWorker}</h3>
              <button className={styles.modalCloseBtn} onClick={() => setIsAddWorkerOpen(false)}>✕</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setIsAddWorkerOpen(false); }} className={styles.modalForm}>
              <div className={styles.inputGroup}>
                <label>{isAr ? 'اسم العامل أو المساعد' : 'Nom de l\'assistant'}</label>
                <input type="text" required placeholder={isAr ? 'مثال: رفيق بلحاج' : 'Ex: Rafik Belhadj'} />
              </div>
              <div className={styles.inputGroup}>
                <label>{isAr ? 'رقم الهاتف' : 'Téléphone'}</label>
                <input type="tel" required placeholder="0550 00 00 00" />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setIsAddWorkerOpen(false)}>
                  {isAr ? 'إلغاء' : 'Annuler'}
                </button>
                <button type="submit" className={styles.addBookingBtn}>
                  {isAr ? 'دعوة العامل' : 'Inviter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isInspectionModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3>{isAr ? 'معاينة القاعة وتوثيق الحالة' : 'Inspection & État des Lieux'}</h3>
              <button className={styles.modalCloseBtn} onClick={() => setIsInspectionModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setIsInspectionModalOpen(false); }} className={styles.modalForm}>
              <div className={styles.inputGroup}>
                <label>{isAr ? 'الحجز المرتبط' : 'Réservation'}</label>
                <select>
                  {bookings.map(b => (
                    <option key={b.id} value={b.id}>{b.id} - {b.client} ({b.date})</option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>{isAr ? 'نوع المعاينة' : 'Type d\'inspection'}</label>
                <select>
                  <option value="pre">{isAr ? 'معاينة قبل الحفل (استلام القاعة)' : 'Avant événement'}</option>
                  <option value="post">{isAr ? 'معاينة بعد المغادرة (مراجعة الأضرار)' : 'Après événement'}</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>{isAr ? 'رفع صور التوثيق' : 'Photos d\'état des lieux'}</label>
                <div className={styles.uploadPlaceholderBtn}>+ التقاط أو رفع صور التجهيزات</div>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setIsInspectionModalOpen(false)}>
                  {isAr ? 'إلغاء' : 'Annuler'}
                </button>
                <button type="submit" className={styles.addBookingBtn}>
                  {isAr ? 'حفظ التوثيق' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
     
    </div>
  );
}