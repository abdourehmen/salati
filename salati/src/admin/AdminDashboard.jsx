import { useState, useEffect } from 'react';
import { supabase } from "../lib/supabaseClient";
import styles from './AdminDashboard.module.css';

// استدعاء الأقسام من مجلداتها المستقلة
import OverviewTab from './OverviewTab/OverviewTab';
import OrdersTab from './OrdersTab/OrdersTab';
import CalendarTab from './CalendarTab/CalendarTab';
import SiteSettingsTab from './SiteSettingsTab/SiteSettingsTab';
import InspectionTab from './InspectionTab/InspectionTab';
import StaffTab from './StaffTab/StaffTab';
import SubscriptionTab from './SubscriptionTab/SubscriptionTab';
// استدعاء نافذة تفاصيل الطلبية
import OrderDetailsModal from './modals/OrderDetailsModal';

// استدعاء الأيقونات
import {
  IconDashboard,
  IconInbox,
  IconCalendar,
  IconHallSite,
  IconClipboardCheck,
  IconPlus,
  IconMenu,
  IconGlobe,
  IconLogout,
  IconCheck
} from './Icons';

const parseNumber = (val) => {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;
  const cleaned = String(val).replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
};

export default function AdminDashboard() {
  const [lang, setLang] = useState(document.documentElement.lang || 'ar');
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAr = lang === 'ar';
  const localeStr = isAr ? 'ar-DZ' : 'fr-FR';
  const currencyLabel = isAr ? 'دج' : 'DA';

  // حالات الموظفين والصلاحيات
  const [currentOperatorName, setCurrentOperatorName] = useState('');
  const [isOwnerUser, setIsOwnerUser] = useState(true);
  const [staffPermissions, setStaffPermissions] = useState({
    overview: true,
    orders: true,
    calendar: true,
    site: true,
    inspection: true,
    staff: true
  });
  const [staffMembers, setStaffMembers] = useState([]);

  // النوافذ المنبثقة
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [selectedBookingForContract, setSelectedBookingForContract] = useState(null);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null);

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedBookingForDeposit, setSelectedBookingForDeposit] = useState(null);
  const [depositAmountInput, setDepositAmountInput] = useState('');

  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(2026, 10, 1));
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // كرت التأكيد والتنبيه الموحد في منتصف الشاشة (بديل window.confirm و alert)
  const [centerDialog, setCenterDialog] = useState({
    open: false,
    type: 'confirm', // 'confirm' | 'alert'
    title: '',
    message: '',
    confirmText: '',
    onConfirm: null
  });

  const openCenterDialog = ({ type = 'confirm', title, message, confirmText, onConfirm = null }) => {
    setCenterDialog({
      open: true,
      type,
      title,
      message,
      confirmText: confirmText || (document.documentElement.lang === 'fr' ? 'Confirmer' : 'تأكيد'),
      onConfirm
    });
  };

  const closeCenterDialog = () => {
    setCenterDialog((prev) => ({ ...prev, open: false, onConfirm: null }));
  };

  const [orderFilterTab, setOrderFilterTab] = useState('provisional');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  const [hallData, setHallData] = useState(null);
  const [platformSettings, setPlatformSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const [siteForm, setSiteForm] = useState({
    slug: '',
    name: '',
    capacity: '',
    phone: '',
    visiting_hours: '',
    map_url: '',
    google_review_url: '',
    description: ''
  });

  const [showWhatsapp, setShowWhatsapp] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [pricingPackages, setPricingPackages] = useState([]);
  const [rawBookings, setRawBookings] = useState([]);

  const [spaces] = useState([
    { id: 'sp-1', nameAr: 'القاعة الكبرى (النساء)', nameFr: 'Grande Salle (Femmes)', capacity: 400 },
    { id: 'sp-2', nameAr: 'قاعة الرجال الفرعية', nameFr: 'Salle Annexe (Hommes)', capacity: 200 },
    { id: 'sp-3', nameAr: 'الفضاء الخارجي والحديقة', nameFr: 'Espace Extérieur & Jardin', capacity: 150 }
  ]);

  const [newBooking, setNewBooking] = useState({
    client: '',
    phone: '',
    date: '',
    timeSlot: 'evening',
    spaceId: 'sp-1',
    type: 'عرس',
    amount: '',
    deposit: '',
    status: 'provisional'
  });

  const [staffList] = useState([
    { id: 1, name: 'مالك القاعة (أنت)', role: 'owner', phone: '', email: '' }
  ]);

  const operatorDisplayName = isOwnerUser
    ? isAr
      ? 'مالك القاعة'
      : 'Propriétaire de la salle'
    : currentOperatorName || (isAr ? 'موظف الصالة' : 'Employé');

  // تنسيق الطلبيات ديناميكياً حسب اللغة الحالية (عربي / فرنسي)
  const bookings = rawBookings.map((b) => {
    const numAmount = parseNumber(b.rawAmount);
    const numDeposit = parseNumber(b.rawDeposit);
    return {
      ...b,
      spaceName: isAr ? b.spaceNameAr || 'القاعة الكبرى' : b.spaceNameFr || 'Grande Salle',
      amount: `${numAmount.toLocaleString(localeStr)} ${currencyLabel}`,
      rawAmount: numAmount,
      deposit: `${numDeposit.toLocaleString(localeStr)} ${currencyLabel}`,
      rawDeposit: numDeposit
    };
  });

  useEffect(() => {
    fetchDashboardData();
    const observer = new MutationObserver(() => {
      setLang(document.documentElement.lang || 'ar');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // جلب إعدادات المنصة والإعلان العام
      const { data: pSettings } = await supabase
        .from('platform_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (pSettings) {
        setPlatformSettings(pSettings);
      }

      const { data: authUser } = await supabase.auth.getUser();
      const currentUser = authUser?.user;

      let hall = null;
      if (currentUser?.id) {
        const { data: userHall } = await supabase
          .from('halls')
          .select('*')
          .eq('owner_id', currentUser.id)
          .maybeSingle();
        hall = userHall;
      }

      // إذا لم يكن المستخدم هو المالك، نتحقق إن كان موظفاً مرتبطاً بصالة
      if (!hall && currentUser?.email) {
        const { data: staffRecord } = await supabase
          .from('hall_staff')
          .select('hall_id')
          .ilike('email', currentUser.email.trim())
          .maybeSingle();

        if (staffRecord?.hall_id) {
          const { data: staffHall } = await supabase
            .from('halls')
            .select('*')
            .eq('id', staffRecord.hall_id)
            .maybeSingle();
          hall = staffHall;
        }
      }

      if (hall) {
        setHallData(hall);
        setSiteForm({
          slug: hall.slug || '',
          name: hall.name || '',
          capacity: hall.capacity || '',
          phone: hall.phone || '',
          visiting_hours: hall.visiting_hours || '',
          map_url: hall.map_url || '',
          google_review_url: hall.google_review_url || '',
          description: hall.description || ''
        });
        setShowWhatsapp(hall.show_whatsapp ?? true);
        setWhatsappNumber(hall.whatsapp_number || hall.phone || '');
        setVideoUrl(hall.video_url || '');

        setGalleryImages(
          hall.gallery_images?.length
            ? hall.gallery_images.map((img) => (typeof img === 'string' ? img : img.url))
            : []
        );

        setAmenities(
          hall.amenities?.length
            ? hall.amenities.map((a) => (typeof a === 'string' ? a : a.title))
            : []
        );

        setPricingPackages(hall.pricing_packages || []);

        // جلب فريق العمل والتحقق من صلاحيات الداخل الحالي
        const { data: staffRows } = await supabase
          .from('hall_staff')
          .select('*')
          .eq('hall_id', hall.id)
          .order('created_at', { ascending: false });

        if (staffRows) {
          setStaffMembers(staffRows);
        }

        const matchedStaff = staffRows?.find(
          (s) =>
            (currentUser?.id && s.user_id === currentUser.id) ||
            (currentUser?.email && s.email?.toLowerCase().trim() === currentUser.email.toLowerCase().trim())
        );

        if (matchedStaff && hall.owner_id !== currentUser?.id) {
          if (!matchedStaff.is_active) {
            const isFrench = document.documentElement.lang === 'fr';
            openCenterDialog({
              type: 'alert',
              title: isFrench ? 'Compte suspendu' : 'الحساب موقوف',
              message: isFrench
                ? 'Votre compte est suspendu.'
                : 'تم إيقاف حسابك مؤقتاً من طرف مالك القاعة.',
              confirmText: isFrench ? "D'accord" : 'حسناً',
              onConfirm: async () => {
                closeCenterDialog();
                await supabase.auth.signOut();
                window.history.pushState({}, '', '/login');
                window.dispatchEvent(new Event('popstate'));
              }
            });
            return;
          }
          setIsOwnerUser(false);
          setCurrentOperatorName(matchedStaff.full_name);

          let rawPerms = matchedStaff.permissions || {};
          if (typeof rawPerms === 'string') {
            try {
              rawPerms = JSON.parse(rawPerms);
            } catch {
              rawPerms = {};
            }
          }

          const nextPerms = {
            overview: false,
            orders: rawPerms.orders === true,
            calendar: rawPerms.calendar === true,
            site: rawPerms.site === true,
            inspection: rawPerms.inspection === true,
            staff: false
          };
          setStaffPermissions(nextPerms);

          // توجيه الموظف لأول قسم مسموح له فعلياً
          const firstAllowedTab =
            (nextPerms.orders && 'orders') ||
            (nextPerms.calendar && 'calendar') ||
            (nextPerms.inspection && 'inspection') ||
            (nextPerms.site && 'site') ||
            'orders';
          setActiveTab(firstAllowedTab);
        } else {
          setIsOwnerUser(true);
          setCurrentOperatorName('');
        }

        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*')
          .eq('hall_id', hall.id)
          .order('event_date', { ascending: true });

        if (bookingsData) {
          setRawBookings(
            bookingsData.map((b) => ({
              id: b.id,
              client: b.client_name,
              phone: b.client_phone,
              date: b.event_date,
              timeSlot: b.time_slot || 'evening',
              spaceNameAr: 'القاعة الكبرى',
              spaceNameFr: 'Grande Salle',
              type: b.event_type || 'عرس',
              status: b.status || 'provisional',
              rawAmount: parseNumber(b.amount),
              rawDeposit: parseNumber(b.deposit),
              contractSigned: b.status === 'confirmed',
              confirmedBy: b.confirmed_by || ''
            }))
          );
        }
      } else {
        // حساب جديد بدون صالة مسجلة بعد: تهيئة بيانات نظيفة ومستقلة
        setHallData(null);
        setIsOwnerUser(true);
        setCurrentOperatorName('');
        setRawBookings([]);
        setStaffMembers([]);
        const defaultName = currentUser?.user_metadata?.hall_name || '';
        const autoSlug = defaultName
          ? `${defaultName.trim().toLowerCase().replace(/\s+/g, '-')}-${String(
              currentUser?.id || Date.now()
            ).slice(0, 5)}`
          : `hall-${String(currentUser?.id || Date.now()).slice(0, 6)}`;

        setSiteForm({
          slug: autoSlug,
          name: defaultName,
          capacity: '',
          phone: currentUser?.user_metadata?.phone || '',
          visiting_hours: '',
          map_url: '',
          google_review_url: '',
          description: ''
        });
      }
    } catch (err) {
      console.error('خطأ جلب البيانات:', err);
    } finally {
      setLoading(false);
    }
  };

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
      console.error('خطأ تسجيل الخروج:', error);
    }
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new Event('popstate'));
  };

  const showSuccessModal = (msg) => {
    setSuccessMessage(msg);
    setIsSuccessModalOpen(true);
    setTimeout(() => setIsSuccessModalOpen(false), 3000);
  };

  const isBookingConflicted = (bookingItem) => {
    if (bookingItem.status === 'cancelled') return false;
    return bookings.some(
      (b) =>
        b.id !== bookingItem.id &&
        b.date === bookingItem.date &&
        b.status !== 'cancelled' &&
        (b.timeSlot === bookingItem.timeSlot ||
          b.timeSlot === 'full_day' ||
          bookingItem.timeSlot === 'full_day')
    );
  };

  const handleOpenDepositModal = (booking) => {
    setSelectedBookingForDeposit(booking);
    setDepositAmountInput(booking.rawDeposit || '');
    setIsDepositModalOpen(true);
  };

  const handleSaveDepositSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBookingForDeposit) return;

    try {
      const numericDeposit = Number(depositAmountInput) || 0;
      const { error } = await supabase
        .from('bookings')
        .update({ deposit: numericDeposit })
        .eq('id', selectedBookingForDeposit.id);

      if (error) throw error;

      setRawBookings((prev) =>
        prev.map((b) =>
          b.id === selectedBookingForDeposit.id
            ? {
                ...b,
                rawDeposit: numericDeposit
              }
            : b
        )
      );

      showSuccessModal(isAr ? 'تم حفظ العربون المدفوع بنجاح!' : 'Acompte enregistré !');
      setIsDepositModalOpen(false);
    } catch (err) {
      console.error('خطأ تحديث العربون:', err);
    }
  };

  const executeDeleteBooking = async (bookingId) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        openCenterDialog({
          type: 'alert',
          title: isAr ? 'تعذر الحذف' : 'Suppression bloquée',
          message: isAr
            ? 'لم يتم حذف الطلب من قاعدة البيانات! تأكد من تفعيل صلاحية DELETE في Supabase.'
            : 'Suppression bloquée par les permissions de la base de données.',
          confirmText: isAr ? 'حسناً' : "D'accord",
          onConfirm: closeCenterDialog
        });
        return;
      }

      setRawBookings((prev) => prev.filter((b) => b.id !== bookingId));
      showSuccessModal(isAr ? 'تم حذف الطلب نهائياً!' : 'Demande supprimée !');
    } catch (err) {
      console.error('خطأ في حذف الطلب:', err);
      openCenterDialog({
        type: 'alert',
        title: isAr ? 'خطأ' : 'Erreur',
        message: isAr ? 'حدث خطأ أثناء الحذف: ' + err.message : 'Erreur : ' + err.message,
        confirmText: isAr ? 'حسناً' : "D'accord",
        onConfirm: closeCenterDialog
      });
    }
  };

  const handleDeleteBooking = (bookingId) => {
    openCenterDialog({
      type: 'confirm',
      title: isAr ? 'تأكيد حذف الطلب' : 'Confirmer la suppression',
      message: isAr
        ? 'هل أنت متأكد من حذف هذا الطلب نهائياً؟'
        : 'Voulez-vous vraiment supprimer cette demande ?',
      confirmText: isAr ? 'حذف نهائي' : 'Supprimer',
      onConfirm: async () => {
        closeCenterDialog();
        await executeDeleteBooking(bookingId);
      }
    });
  };

  const handleAddBookingSubmit = async (e) => {
    e.preventDefault();
    if (!newBooking.date) return;

    const selectedSpace = spaces.find((s) => s.id === newBooking.spaceId);
    const clientName = newBooking.client || (isAr ? 'يوم مغلق من المالك' : 'Journée bloquée');
    const inputAmount = parseNumber(newBooking.amount);
    const inputDeposit = parseNumber(newBooking.deposit);

    try {
      if (hallData?.id) {
        const { data, error } = await supabase
          .from('bookings')
          .insert([
            {
              hall_id: hallData.id,
              client_name: clientName,
              client_phone: newBooking.phone || '0000000000',
              event_date: newBooking.date,
              time_slot: newBooking.timeSlot,
              event_type: newBooking.type,
              amount: inputAmount,
              deposit: inputDeposit,
              status: newBooking.status || 'provisional'
            }
          ])
          .select();

        if (error) {
          if (error.code === '23505') {
            showSuccessModal(
              isAr
                ? '⚠️ عذراً! هذا التاريخ والفترة محجوزة ومغلقة بالفعل.'
                : '⚠️ Date déjà réservée !'
            );
            return;
          }
          throw error;
        }

        if (data && data.length > 0) {
          const created = {
            id: data[0].id,
            client: clientName,
            phone: newBooking.phone || '',
            date: newBooking.date,
            timeSlot: newBooking.timeSlot,
            spaceNameAr: selectedSpace ? selectedSpace.nameAr : 'القاعة الرئيسية',
            spaceNameFr: selectedSpace ? selectedSpace.nameFr : 'Grande Salle',
            type: data[0].event_type || newBooking.type,
            status: newBooking.status || 'provisional',
            rawAmount: parseNumber(data[0].amount),
            rawDeposit: parseNumber(data[0].deposit),
            contractSigned: newBooking.status === 'confirmed',
            confirmedBy: ''
          };
          setRawBookings((prev) => [created, ...prev]);
          showSuccessModal(isAr ? 'تم إضافة الطلب بنجاح!' : 'Demande ajoutée avec succès !');
        }
      }
    } catch (err) {
      console.error('فشل إضافة الحجز:', err);
    }

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
      status: 'provisional'
    });
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const target = bookings.find((b) => b.id === bookingId);

      if (newStatus === 'confirmed' && target) {
        const { data, error } = await supabase
          .from('bookings')
          .update({ status: 'confirmed', confirmed_by: operatorDisplayName })
          .eq('id', bookingId)
          .select();

        if (error) throw error;
        if (!data || data.length === 0) {
          openCenterDialog({
            type: 'alert',
            title: isAr ? 'تعذر التحديث' : 'Mise à jour bloquée',
            message: isAr
              ? 'لم يتم تحديث الحالة في قاعدة البيانات! تأكد من تفعيل صلاحية UPDATE في Supabase.'
              : 'Mise à jour bloquée par les permissions.',
            confirmText: isAr ? 'حسناً' : "D'accord",
            onConfirm: closeCenterDialog
          });
          return;
        }

        const conflictingIds = bookings
          .filter(
            (b) =>
              b.id !== bookingId &&
              b.date === target.date &&
              b.status === 'provisional' &&
              (b.timeSlot === target.timeSlot ||
                b.timeSlot === 'full_day' ||
                target.timeSlot === 'full_day')
          )
          .map((b) => b.id);

        if (conflictingIds.length > 0) {
          await supabase.from('bookings').update({ status: 'cancelled' }).in('id', conflictingIds);
        }

        setRawBookings((prev) =>
          prev.map((b) => {
            if (b.id === bookingId) {
              return {
                ...b,
                status: 'confirmed',
                contractSigned: true,
                confirmedBy: operatorDisplayName
              };
            }
            if (conflictingIds.includes(b.id)) return { ...b, status: 'cancelled' };
            return b;
          })
        );

        showSuccessModal(
          isAr ? 'تم تأكيد الحجز ونقله إلى الحجوزات المؤكدة!' : 'Réservation confirmée !'
        );
      } else {
        const { data, error } = await supabase
          .from('bookings')
          .update({ status: newStatus })
          .eq('id', bookingId)
          .select();

        if (error) throw error;
        if (!data || data.length === 0) return;

        setRawBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId
              ? { ...b, status: newStatus, contractSigned: newStatus === 'confirmed' }
              : b
          )
        );
        showSuccessModal(isAr ? 'تم تحديث حالة الحجز!' : 'Statut mis à jour !');
      }
    } catch (err) {
      console.error('خطأ في تغيير الحالة:', err);
      openCenterDialog({
        type: 'alert',
        title: isAr ? 'خطأ' : 'Erreur',
        message: isAr ? 'حدث خطأ أثناء التحديث: ' + err.message : 'Erreur : ' + err.message,
        confirmText: isAr ? 'حسناً' : "D'accord",
        onConfirm: closeCenterDialog
      });
    }
  };

  const handleSaveSiteSettings = async (e) => {
    e.preventDefault();
    try {
      const { data: authUser } = await supabase.auth.getUser();
      const currentUser = authUser?.user;

      const targetSlug = siteForm.slug
        ? siteForm.slug.trim().toLowerCase().replace(/\s+/g, '-')
        : hallData?.slug || 'salle-el-bahdja';

      const hallPayload = {
        ...(hallData?.id ? { id: hallData.id } : {}),
        owner_id: hallData?.owner_id || currentUser?.id || null,
        slug: targetSlug,
        name: siteForm.name || 'قاعتي الجديدة',
        capacity: parseInt(siteForm.capacity, 10) || 0,
        phone: siteForm.phone || '',
        visiting_hours: siteForm.visiting_hours || '',
        map_url: siteForm.map_url || '',
        google_review_url: (siteForm.google_review_url || '').trim(),
        description: siteForm.description || '',
        show_whatsapp: showWhatsapp,
        whatsapp_number: whatsappNumber || siteForm.phone || '',
        video_url: videoUrl || '',
        gallery_images: galleryImages.filter(Boolean),
        amenities: amenities.filter(Boolean),
        pricing_packages: pricingPackages.filter((pkg) => pkg && pkg.title && pkg.price)
      };

      const { data, error } = await supabase
        .from('halls')
        .upsert(hallPayload, { onConflict: 'slug' })
        .select()
        .single();

      if (error) throw error;
      if (data) setHallData(data);

      showSuccessModal(
        isAr ? 'تم حفظ التعديلات ونشر موقع الصالة بنجاح!' : 'Salle enregistrée avec succès !'
      );
    } catch (err) {
      console.error('خطأ في حفظ الإعدادات:', err);
      openCenterDialog({
        type: 'alert',
        title: isAr ? 'فشل الحفظ' : 'Erreur de sauvegarde',
        message: isAr ? 'فشل حفظ الإعدادات: ' + err.message : 'Erreur de sauvegarde : ' + err.message,
        confirmText: isAr ? 'حسناً' : "D'accord",
        onConfirm: closeCenterDialog
      });
    }
  };

  const handleOpenContract = (booking) => {
    setSelectedBookingForContract(booking);
    setIsContractModalOpen(true);
  };

  const handleSignContract = async () => {
    if (!selectedBookingForContract) return;
    try {
      await supabase
        .from('bookings')
        .update({ status: 'confirmed', confirmed_by: operatorDisplayName })
        .eq('id', selectedBookingForContract.id);

      setRawBookings((prev) =>
        prev.map((b) =>
          b.id === selectedBookingForContract.id
            ? {
                ...b,
                contractSigned: true,
                status: 'confirmed',
                confirmedBy: operatorDisplayName
              }
            : b
        )
      );
    } catch (err) {
      console.error('خطأ في تحديث الحالة:', err);
    }
    setIsContractModalOpen(false);
  };

  const getTimeSlotLabel = (slot) => {
    if (slot === 'afternoon') return isAr ? 'فترة الظهيرة' : 'Après-midi';
    if (slot === 'evening') return isAr ? 'فترة المساء' : 'Soirée';
    return isAr ? 'يوم كامل' : 'Journée entière';
  };

  const getCalendarDays = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = [];

    for (let i = 0; i < firstDayIndex; i++) {
      daysArray.push({ isPadding: true });
    }

    for (let d = 1; d <= totalDaysInMonth; d++) {
      const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(
        2,
        '0'
      )}`;
      daysArray.push({ dayNum: d, dateStr: formattedDate, isPadding: false });
    }

    return daysArray;
  };

  const changeCalendarMonth = (offset) => {
    setCurrentCalendarDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1)
    );
  };

  const calendarMonthLabel = currentCalendarDate.toLocaleDateString(
    isAr ? 'ar-EG' : 'fr-FR',
    { month: 'long', year: 'numeric' }
  );

  const unconfirmedOrders = bookings.filter((b) => b.status === 'provisional');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');

  const filteredOrders = bookings.filter((b) => {
    if (orderFilterTab === 'provisional' && b.status !== 'provisional') return false;
    if (orderFilterTab === 'confirmed' && b.status !== 'confirmed') return false;
    if (orderFilterTab === 'cancelled' && b.status !== 'cancelled') return false;

    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      return (
        b.client?.toLowerCase().includes(q) ||
        b.phone?.includes(q) ||
        String(b.id).toLowerCase().includes(q)
      );
    }
    return true;
  });

  const t = {
    overview: isAr ? 'نظرة عامة' : 'Vue générale',
    orders: isAr ? 'الطلبيات' : 'Demandes',
    calendar: isAr ? 'التقويم والحجوزات' : 'Calendrier & Réservations',
    site: isAr ? 'الموقع الخاص بالصالة' : 'Site Web de la Salle',
    inspection: isAr ? 'معاينة الصالة قبل التسليم' : 'Inspection avant remise',
    staff: isAr ? 'العمال' : 'Équipe',
    subscription: isAr ? 'الاشتراك والباقة' : 'Abonnement',
    newBookingBtn: isAr ? 'إضافة طلب جديد' : 'Nouvelle Demande',
    viewSiteBtn: isAr ? 'مشاهدة موقع الصالة' : 'Voir le site Web',
    logoutBtn: isAr ? 'تسجيل الخروج' : 'Déconnexion'
  };

  // Shimmer Skeleton أثناء تحميل لوحة التحكم بالكامل
  if (loading) {
    return (
      <div dir={isAr ? 'rtl' : 'ltr'} className={styles.adminLayout} aria-busy="true">
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={`${styles.skeletonBase} ${styles.skeletonLogo}`} />
          </div>
          <div className={`${styles.skeletonBase} ${styles.skeletonHallCard}`} />
          <div className={styles.sidebarNav}>
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className={`${styles.skeletonBase} ${styles.skeletonNavItem}`} />
            ))}
          </div>
        </aside>

        <div className={styles.mainWrapper}>
          <header className={styles.adminHeader}>
            <div className={`${styles.skeletonBase} ${styles.skeletonHeaderTitle}`} />
            <div className={styles.headerActions}>
              <div className={`${styles.skeletonBase} ${styles.skeletonHeaderBtnSm}`} />
              <div className={`${styles.skeletonBase} ${styles.skeletonHeaderBtnLg}`} />
            </div>
          </header>

          <main className={styles.adminContent}>
            <div className={styles.kpiGrid}>
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className={`${styles.skeletonBase} ${styles.skeletonKpiCard}`} />
              ))}
            </div>
            <div className={`${styles.skeletonBase} ${styles.skeletonMainPanel}`} />
          </main>
        </div>
      </div>
    );
  }

  // التحقق من إيقاف الصالة أو انتهاء صلاحية اشتراكها
  const isHallSuspended = hallData?.is_active === false || hallData?.subscription_status === 'suspended';
  const isSubscriptionExpired =
    hallData?.subscription_ends_at && new Date(hallData.subscription_ends_at) < new Date();

  if (hallData && (isHallSuspended || isSubscriptionExpired)) {
    const waSupportText = encodeURIComponent(
      isAr
        ? `مرحباً فريق Salati، أرغب في تجديد أو تفعيل اشتراك صالة: ${hallData.name}`
        : `Bonjour Salati, je souhaite renouveler l'abonnement de la salle : ${hallData.name}`
    );

    return (
      <div dir={isAr ? 'rtl' : 'ltr'} className={styles.suspendedScreen}>
        <div className={styles.suspendedCard}>
          <div className={styles.suspendedIconBox}>⏳</div>
          <h2 className={styles.suspendedTitle}>
            {isHallSuspended
              ? isAr
                ? 'تم إيقاف حساب الصالة مؤقتاً'
                : 'Compte de la salle suspendu'
              : isAr
              ? 'انتهت مدة اشتراك الصالة'
              : 'Abonnement de la salle expiré'}
          </h2>
          <p className={styles.suspendedDesc}>
            {isAr
              ? 'يرجى تجديد اشتراكك أو التواصل مع إدارة منصة Salati لإعادة تفعيل لوحة التحكم وصفحة صالتك فوراً.'
              : 'Veuillez renouveler votre abonnement ou contacter le support Salati pour réactiver votre espace.'}
          </p>
          <div className={styles.suspendedActions}>
            <a
              href={`https://wa.me/213550000000?text=${waSupportText}`}
              target="_blank"
              rel="noreferrer"
              className={styles.suspendedWaBtn}
            >
              {isAr ? 'تواصل لتجديد الاشتراك عبر واتساب' : 'Contacter le support WhatsApp'}
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className={styles.suspendedLogoutBtn}
            >
              {t.logoutBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // حساب تفاصيل الباقة وتاريخ الانتهاء لعرضها لمالك الصالة
  const planLabels = {
    basic: isAr ? 'الباقة الأساسية' : 'Offre Essentielle',
    pro: isAr ? 'الباقة الاحترافية Pro' : 'Offre Pro',
    enterprise: isAr ? 'باقة المؤسسات' : 'Offre Entreprise'
  };
  const currentPlanLabel = planLabels[hallData?.plan_tier || 'basic'] || planLabels.basic;
  const isTrialStatus = hallData?.subscription_status === 'trial';

  const subscriptionEndDateObj = hallData?.subscription_ends_at
    ? new Date(hallData.subscription_ends_at)
    : null;

  const daysLeft = subscriptionEndDateObj
    ? Math.max(0, Math.ceil((subscriptionEndDateObj - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  const formattedSubEndDate = subscriptionEndDateObj
    ? subscriptionEndDateObj.toLocaleDateString(localeStr, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : null;

  const showRenewalWarning = isOwnerUser && daysLeft !== null && daysLeft <= 5;

  const activeAnnouncementText = platformSettings?.is_announcement_active
    ? isAr
      ? platformSettings.announcement_ar
      : platformSettings.announcement_fr || platformSettings.announcement_ar
    : '';

  const remainingDaysText =
    daysLeft !== null
      ? isAr
        ? daysLeft === 1
          ? 'متبقي يوم واحد'
          : daysLeft === 2
          ? 'متبقي يومان'
          : `متبقي ${daysLeft} أيام`
        : `${daysLeft} ${daysLeft <= 1 ? 'jour restant' : 'jours restants'}`
      : '';

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className={styles.adminLayout}>
      {/* القائمة الجانبية الموحدة */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <a href="/" className={styles.brandLogo}>
            Salati<span>.admin</span>
          </a>
          <button
            type="button"
            aria-label={isAr ? 'إغلاق القائمة' : 'Fermer le menu'}
            className={styles.closeSidebarBtn}
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className={styles.hallSelectorCard}>
          <div className={styles.hallAvatar}>🏰</div>
          <div className={styles.hallMeta}>
            <strong>{hallData?.name || (isAr ? 'قاعتي الجديدة' : 'Ma Salle')}</strong>
            <span>
              {isOwnerUser
                ? hallData?.address || (isAr ? 'الجزائر' : 'Algérie')
                : operatorDisplayName}
            </span>
          </div>
        </div>

        {/* بطاقة الباقة وتاريخ الانتهاء (تظهر لمالك الصالة فقط) */}
        {hallData && isOwnerUser && (
          <div className={styles.sidebarPlanBox}>
            <div
              className={styles.sidebarPlanTop}
              style={{ marginBottom: formattedSubEndDate ? '0.35rem' : 0 }}
            >
              <strong className={styles.sidebarPlanName}>
                💎 {currentPlanLabel}
              </strong>
              <span
                className={styles.sidebarPlanBadge}
                style={{
                  background: isTrialStatus ? '#fef3c7' : '#dcfce7',
                  color: isTrialStatus ? '#b45309' : '#15803d'
                }}
              >
                {isTrialStatus
                  ? isAr
                    ? 'تجريبي'
                    : 'Essai'
                  : isAr
                  ? 'نشط'
                  : 'Actif'}
              </span>
            </div>

            {formattedSubEndDate && (
              <div className={styles.sidebarPlanExpiry}>
                {isAr ? 'ينتهي في:' : 'Expire le :'}{' '}
                <strong>{formattedSubEndDate}</strong>
                {daysLeft !== null && (
                  <span style={{ opacity: 0.85 }}> ({remainingDaysText})</span>
                )}
              </div>
            )}
          </div>
        )}

        <nav className={styles.sidebarNav}>
          {(isOwnerUser || staffPermissions.overview) && (
            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === 'overview' ? styles.navItemActive : ''
              }`}
              onClick={() => {
                setActiveTab('overview');
                setSidebarOpen(false);
              }}
            >
              <IconDashboard />
              <span className={styles.navLabel}>{t.overview}</span>
            </button>
          )}

          {(isOwnerUser || staffPermissions.orders) && (
            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === 'orders' ? styles.navItemActive : ''
              }`}
              onClick={() => {
                setActiveTab('orders');
                setSidebarOpen(false);
              }}
            >
              <IconInbox />
              <span className={styles.navLabel}>{t.orders}</span>
              {unconfirmedOrders.length > 0 && (
                <span className={styles.unconfirmedBadgeCount}>
                  {unconfirmedOrders.length.toLocaleString(localeStr)}
                </span>
              )}
            </button>
          )}

          {(isOwnerUser || staffPermissions.calendar) && (
            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === 'calendar' ? styles.navItemActive : ''
              }`}
              onClick={() => {
                setActiveTab('calendar');
                setSidebarOpen(false);
              }}
            >
              <IconCalendar />
              <span className={styles.navLabel}>{t.calendar}</span>
            </button>
          )}

          {(isOwnerUser || staffPermissions.site) && (
            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === 'site' ? styles.navItemActive : ''
              }`}
              onClick={() => {
                setActiveTab('site');
                setSidebarOpen(false);
              }}
            >
              <IconHallSite />
              <span className={styles.navLabel}>{t.site}</span>
            </button>
          )}

          {(isOwnerUser || staffPermissions.inspection) && (
            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === 'inspection' ? styles.navItemActive : ''
              }`}
              onClick={() => {
                setActiveTab('inspection');
                setSidebarOpen(false);
              }}
            >
              <IconClipboardCheck />
              <span className={styles.navLabel}>{t.inspection}</span>
            </button>
          )}

          {isOwnerUser && (
            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === 'staff' ? styles.navItemActive : ''
              }`}
              onClick={() => {
                setActiveTab('staff');
                setSidebarOpen(false);
              }}
            >
              <IconClipboardCheck />
              <span className={styles.navLabel}>{t.staff}</span>
            </button>
          )}

          {isOwnerUser && (
            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === 'subscription' ? styles.navItemActive : ''
              }`}
              onClick={() => {
                setActiveTab('subscription');
                setSidebarOpen(false);
              }}
            >
              <IconCheck />
              <span className={styles.navLabel}>{t.subscription}</span>
            </button>
          )}
        </nav>

        <div className={styles.sidebarFooter}>
          <a
            href={`/v/${hallData?.slug || siteForm.slug || 'new-hall'}`}
            target="_blank"
            rel="noreferrer"
            className={styles.viewLiveSiteBtn}
            style={{
              backgroundColor: 'var(--primary-blue, #0052cc)',
              color: '#ffffff',
              borderColor: 'var(--primary-blue, #0052cc)'
            }}
          >
            <IconHallSite />
            <span>{t.viewSiteBtn}</span>
          </a>

          <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
            <IconLogout />
            <span>{t.logoutBtn}</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* المحتوى الرئيسي */}
      <div className={styles.mainWrapper}>
        <header className={styles.adminHeader}>
          <div className={styles.headerStartGroup}>
            <button
              type="button"
              aria-label={isAr ? 'فتح القائمة' : 'Ouvrir le menu'}
              className={styles.toggleMenuBtn}
              onClick={() => setSidebarOpen(true)}
            >
              <IconMenu />
            </button>

            <h1 className={styles.headerTitle}>
              {isAr ? 'لوحة إدارة القاعة' : 'Administration de la Salle'}
            </h1>
          </div>

          <div className={styles.headerActions}>
            <button type="button" className={styles.langBtn} onClick={toggleLanguage}>
              <IconGlobe />
              <span>{isAr ? 'FR' : 'AR'}</span>
            </button>

            <button
              type="button"
              className={styles.addBookingBtn}
              onClick={() => setIsAddBookingOpen(true)}
            >
              <IconPlus />
              <span className={styles.addBookingBtnLabel}>{t.newBookingBtn}</span>
            </button>
          </div>
        </header>

        <main className={styles.adminContent}>
          {activeAnnouncementText && (
            <div className={styles.announcementBanner}>
              <span>📢</span>
              <span>{activeAnnouncementText}</span>
            </div>
          )}

          {showRenewalWarning && (
            <div className={styles.renewalWarningBanner}>
              <span>
                ⏳{' '}
                {isAr
                  ? `تنبيه: اشتراكك في (${currentPlanLabel}) ينتهي بتاريخ ${formattedSubEndDate} (${remainingDaysText}).`
                  : `Rappel : Votre abonnement (${currentPlanLabel}) expire le ${formattedSubEndDate} (${remainingDaysText}).`}
              </span>
              <a
                href={`https://wa.me/213550000000?text=${encodeURIComponent(
                  isAr
                    ? `مرحباً فريق Salati، أرغب في تجديد اشتراك صالة: ${hallData?.name || ''}`
                    : `Bonjour Salati, je souhaite renouveler l'abonnement de : ${hallData?.name || ''}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className={styles.renewalWarningBtn}
              >
                {isAr ? 'تجديد الاشتراك الآن' : 'Renouveler maintenant'}
              </a>
            </div>
          )}

          <div key={activeTab} className={styles.tabPaneAnim}>
            {activeTab === 'overview' && (isOwnerUser || staffPermissions.overview) && (
              <OverviewTab
                isAr={isAr}
                isLoading={loading}
                bookings={bookings}
                unconfirmedOrders={unconfirmedOrders}
                confirmedBookings={confirmedBookings}
                staffList={staffList}
                setActiveTab={setActiveTab}
                parseNumber={parseNumber}
                getTimeSlotLabel={getTimeSlotLabel}
                handleOpenDepositModal={handleOpenDepositModal}
                handleDeleteBooking={handleDeleteBooking}
                handleOpenDetails={(item) => setSelectedBookingForDetails(item)}
              />
            )}

            {activeTab === 'orders' && (isOwnerUser || staffPermissions.orders) && (
              <OrdersTab
                bookings={bookings}
                filteredOrders={filteredOrders}
                unconfirmedOrders={unconfirmedOrders}
                confirmedBookings={confirmedBookings}
                orderFilterTab={orderFilterTab}
                setOrderFilterTab={setOrderFilterTab}
                orderSearchQuery={orderSearchQuery}
                setOrderSearchQuery={setOrderSearchQuery}
                isAr={isAr}
                isLoading={loading}
                isBookingConflicted={isBookingConflicted}
                parseNumber={parseNumber}
                getTimeSlotLabel={getTimeSlotLabel}
                handleOpenDepositModal={handleOpenDepositModal}
                handleDeleteBooking={handleDeleteBooking}
                handleOpenDetails={(item) => setSelectedBookingForDetails(item)}
              />
            )}

            {activeTab === 'calendar' && (isOwnerUser || staffPermissions.calendar) && (
              <CalendarTab
                isAr={isAr}
                isLoading={loading}
                calendarMonthLabel={calendarMonthLabel}
                changeCalendarMonth={changeCalendarMonth}
                getCalendarDays={getCalendarDays}
                bookings={bookings}
                setIsAddBookingOpen={setIsAddBookingOpen}
                newBooking={newBooking}
                setNewBooking={setNewBooking}
                t={t}
              />
            )}

            {activeTab === 'site' && (isOwnerUser || staffPermissions.site) && (
              <SiteSettingsTab
                isAr={isAr}
                isLoading={loading}
                hallData={hallData}
                siteForm={siteForm}
                setSiteForm={setSiteForm}
                videoUrl={videoUrl}
                setVideoUrl={setVideoUrl}
                galleryImages={galleryImages}
                setGalleryImages={setGalleryImages}
                amenities={amenities}
                setAmenities={setAmenities}
                pricingPackages={pricingPackages}
                setPricingPackages={setPricingPackages}
                handleSaveSiteSettings={handleSaveSiteSettings}
              />
            )}

            {activeTab === 'inspection' && (isOwnerUser || staffPermissions.inspection) && (
              <InspectionTab
                isAr={isAr}
                isLoading={loading}
                bookings={bookings}
                hallId={hallData?.id}
              />
            )}

            {activeTab === 'staff' && isOwnerUser && (
              <StaffTab
                isAr={isAr}
                isLoading={loading}
                hallId={hallData?.id}
                staffMembers={staffMembers}
                setStaffMembers={setStaffMembers}
                bookings={bookings}
              />
            )}

            {activeTab === 'subscription' && isOwnerUser && (
              <SubscriptionTab
                isAr={isAr}
                isLoading={loading}
                hallData={hallData}
                platformSettings={platformSettings}
              />
            )}
          </div>
        </main>
      </div>

      {/* نافذة تفاصيل الطلبية */}
      {selectedBookingForDetails && (
        <OrderDetailsModal
          booking={selectedBookingForDetails}
          isAr={isAr}
          onClose={() => setSelectedBookingForDetails(null)}
          getTimeSlotLabel={getTimeSlotLabel}
          handleUpdateBookingStatus={handleUpdateBookingStatus}
          handleOpenContract={handleOpenContract}
        />
      )}

      {/* نافذة تعديل/إضافة العربون */}
      {isDepositModalOpen && selectedBookingForDeposit && (
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className={styles.modalBackdrop}
          onClick={() => setIsDepositModalOpen(false)}
        >
          <div
            className={styles.modalBox}
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>💰 {isAr ? 'إضافة / تعديل العربون المدفوع' : "Saisir l'acompte"}</h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsDepositModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDepositSubmit} className={styles.modalForm}>
              <div className={styles.inputGroup}>
                <label>{isAr ? 'مبلغ العربون المستلم (دج)' : "Montant de l'acompte (DA)"}</label>
                <input
                  type="number"
                  dir="ltr"
                  required
                  autoFocus
                  placeholder="20000"
                  value={depositAmountInput}
                  onChange={(e) => setDepositAmountInput(e.target.value)}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setIsDepositModalOpen(false)}
                >
                  {isAr ? 'إلغاء' : 'Annuler'}
                </button>
                <button type="submit" className={styles.addBookingBtn}>
                  <IconCheck /> <span>{isAr ? 'حفظ العربون' : 'Enregistrer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة إضافة طلب جديد */}
      {isAddBookingOpen && (
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className={styles.modalBackdrop}
          onClick={() => setIsAddBookingOpen(false)}
        >
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{t.newBookingBtn}</h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsAddBookingOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddBookingSubmit} className={styles.modalForm}>
              <div className={styles.inputGroup}>
                <label>{isAr ? 'الاسم واللقب' : 'Nom complet'}</label>
                <input
                  type="text"
                  required
                  value={newBooking.client}
                  onChange={(e) => setNewBooking({ ...newBooking, client: e.target.value })}
                  placeholder={isAr ? 'مثال: عبد الرحمان بلحوس' : 'Ex: Abdourehmen Balhous'}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>{isAr ? 'رقم الهاتف' : 'Téléphone'}</label>
                  <input
                    type="tel"
                    dir="ltr"
                    required
                    value={newBooking.phone}
                    onChange={(e) => setNewBooking({ ...newBooking, phone: e.target.value })}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>{isAr ? 'التاريخ المطلوب' : 'Date souhaitée'}</label>
                  <input
                    type="date"
                    dir="ltr"
                    required
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>{isAr ? 'السعر الكلي للقاعة (دج)' : 'Prix Total (DA)'}</label>
                  <input
                    type="number"
                    dir="ltr"
                    placeholder="50000"
                    value={newBooking.amount}
                    onChange={(e) => setNewBooking({ ...newBooking, amount: e.target.value })}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>{isAr ? 'العربون المدفوع (دج)' : 'Acompte (DA)'}</label>
                  <input
                    type="number"
                    dir="ltr"
                    placeholder="20000"
                    value={newBooking.deposit}
                    onChange={(e) => setNewBooking({ ...newBooking, deposit: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setIsAddBookingOpen(false)}
                >
                  {isAr ? 'إلغاء' : 'Annuler'}
                </button>
                <button type="submit" className={styles.addBookingBtn}>
                  {isAr ? 'حفظ الطلب' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة العقد الرقمي */}
      {isContractModalOpen && selectedBookingForContract && (
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className={styles.modalBackdrop}
          onClick={() => setIsContractModalOpen(false)}
        >
          <div
            className={styles.modalBox}
            style={{ maxWidth: '580px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>
                {isAr
                  ? `العقد الرقمي للحجز #${String(selectedBookingForContract.id).slice(0, 8)}`
                  : `Contrat #${String(selectedBookingForContract.id).slice(0, 8)}`}
              </h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsContractModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.contractDocumentBox}>
              <h4>{isAr ? 'عقد حجز قاعة أفراح ومناسبات' : 'Contrat de Réservation'}</h4>
              <p>
                <strong>{isAr ? 'العميل:' : 'Client :'}</strong>{' '}
                {selectedBookingForContract.client} (
                <span dir="ltr">{selectedBookingForContract.phone}</span>)
              </p>
              <p>
                <strong>{isAr ? 'التاريخ:' : 'Date :'}</strong>{' '}
                <span dir="ltr">{selectedBookingForContract.date}</span>
              </p>
              <p>
                <strong>{isAr ? 'المبلغ الإجمالي:' : 'Montant :'}</strong>{' '}
                <span dir="ltr">{selectedBookingForContract.amount}</span>
              </p>
            </div>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setIsContractModalOpen(false)}
              >
                {isAr ? 'إغلاق' : 'Fermer'}
              </button>
              {!selectedBookingForContract.contractSigned && (
                <button
                  type="button"
                  className={styles.addBookingBtn}
                  onClick={handleSignContract}
                >
                  <IconCheck /> <span>{isAr ? 'تأكيد التوقيع' : 'Valider'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* نافذة الإشعار بالنجاح */}
      {isSuccessModalOpen && (
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className={styles.modalBackdrop}
          onClick={() => setIsSuccessModalOpen(false)}
        >
          <div
            className={styles.modalBox}
            style={{ maxWidth: '400px', textAlign: 'center', padding: '2rem 1.5rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.successIconCircle}>
              <IconCheck />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>
              {isAr ? 'تمت العملية بنجاح!' : 'Succès !'}
            </h3>
            <p style={{ margin: '0 0 1.25rem 0', color: '#64748b', fontSize: '0.92rem' }}>
              {successMessage}
            </p>
            <button
              type="button"
              className={styles.addBookingBtn}
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setIsSuccessModalOpen(false)}
            >
              {isAr ? 'موافق' : "D'accord"}
            </button>
          </div>
        </div>
      )}

      {/* كرت التأكيد والتنبيه الصغير في منتصف الشاشة (بديل window.confirm و alert) */}
      {centerDialog.open && (
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className={styles.modalBackdrop}
          style={{ zIndex: 1200 }}
          onClick={closeCenterDialog}
        >
          <div
            className={styles.confirmCardBox}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.confirmIconCircle}>
              {centerDialog.type === 'confirm' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              )}
            </div>
            <h4 className={styles.confirmCardTitle}>{centerDialog.title}</h4>
            <p className={styles.confirmCardMsg}>{centerDialog.message}</p>
            <div className={styles.confirmCardActions}>
              {centerDialog.type === 'confirm' && (
                <button
                  type="button"
                  className={styles.confirmCancelBtn}
                  onClick={closeCenterDialog}
                >
                  {isAr ? 'إلغاء' : 'Annuler'}
                </button>
              )}
              <button
                type="button"
                className={styles.confirmDangerBtn}
                onClick={centerDialog.onConfirm || closeCenterDialog}
              >
                {centerDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}