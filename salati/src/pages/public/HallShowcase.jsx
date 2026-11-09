import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import styles from './HallShowcase.module.css';

/* أيقونات SVG الاحترافية */
const IconCheckSquare = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4"></polyline>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);

const IconMapPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const IconNavigation = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
  </svg>
);

const IconVideo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"></polygon>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
  </svg>
);

const IconGlobe = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"></path>
  </svg>
);

const IconChevronLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const IconChevronRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const IconWhatsApp = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.298-1.144z"/>
  </svg>
);

// دالة مساعدة لفك تشفير حقول JSON أو المصفوفات بأمان
const parseJsonField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  try {
    const parsed = typeof field === 'string' ? JSON.parse(field) : field;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function HallShowcase() {
  const [lang, setLang] = useState(document.documentElement.lang || 'ar');
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [dateError, setDateError] = useState('');

  const [bookingForm, setBookingForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    eventDate: '',
    timeSlot: '',
    eventType: 'عرس'
  });

  const currentPath = window.location.pathname;
  const rawSlug = currentPath.split('/v/')[1];
  const hallSlug = rawSlug ? rawSlug.split('?')[0].split('#')[0] : null;

  const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchHallData();
  }, [hallSlug]);

 const fetchHallData = async () => {
    setLoading(true);
    try {
      let hallData = null;

      // 1. البحث بالـ slug المحصل عليه من الرابط فقط
      if (hallSlug) {
        const { data } = await supabase
          .from('halls')
          .select('*')
          .eq('slug', hallSlug)
          .maybeSingle();
        hallData = data;
      }

      // 2. إذا لم يجد السجل، يجلب السجل التابع للمستخدم الحالي
      if (!hallData) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userHall } = await supabase
            .from('halls')
            .select('*')
            .eq('owner_id', user.id)
            .maybeSingle();
          hallData = userHall;
        }
      }

      // تم حذف الخيار الثالث لمنع جلب بيانات قاعات قديمة غريبة

      if (hallData) {
        setHall(hallData);
        fetchBookedDates(hallData.id);
      }
    } catch (err) {
      console.error('خطأ في جلب البيانات:', err);
    } finally {
      setLoading(false);
    }
  };
  const fetchBookedDates = async (hallId) => {
    try {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('event_date, time_slot')
        .eq('hall_id', hallId)
        .neq('status', 'cancelled');

      if (bookings) {
        setBookedDates(bookings);
      }
    } catch (err) {
      console.error('خطأ في جلب الحجوزات:', err);
    }
  };

  const isAr = lang === 'ar';

  const toggleLanguage = () => {
    const nextLang = isAr ? 'fr' : 'ar';
    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    setLang(nextLang);
  };

  // معالجة مصفوفة الصور بأمان وتأمين الروابط المكسورة أو المحلية
  const rawImages = parseJsonField(hall?.gallery_images);
  const fallbackImage = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80';

  const hallImages = rawImages
    .map(item => {
      let src = '';
      if (typeof item === 'string') src = item;
      else if (item && typeof item === 'object' && item.url) src = item.url;
      else if (item) src = String(item);

      if (!src || src.startsWith('blob:') || src.includes('localhost')) {
        return { url: fallbackImage };
      }
      return { url: src };
    })
    .filter(img => Boolean(img.url));

  // معالجة مصفوفة المميزات بأمان
  const rawAmenities = parseJsonField(hall?.amenities);
  const amenitiesList = rawAmenities.map(item => {
    if (typeof item === 'string') return { title: item, icon: '✨' };
    if (item && item.title) return { title: item.title, icon: item.icon || '✨' };
    return { title: String(item), icon: '✨' };
  });

  // معالجة مصفوفة الأسعار بأمان
  const pricingPackages = parseJsonField(hall?.pricing_packages);

  const nextImage = () => {
    if (!hallImages.length) return;
    setCurrentImgIndex((prev) => (prev + 1) % hallImages.length);
  };

  const prevImage = () => {
    if (!hallImages.length) return;
    setCurrentImgIndex((prev) => (prev - 1 + hallImages.length) % hallImages.length);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDateChange = (selectedDate, selectedSlot) => {
    const defaultSlot = pricingPackages[0]?.title || '';
    const slotToCheck = selectedSlot || bookingForm.timeSlot || defaultSlot;
    
    const isTaken = bookedDates.some(
      b => b.event_date === selectedDate && b.time_slot === slotToCheck
    );

    if (isTaken) {
      setDateError(isAr ? 'عذراً، هذا التاريخ محجوز لهذه الفترة!' : 'Désolé, cette date est déjà réservée!');
    } else {
      setDateError('');
    }

    setBookingForm({ ...bookingForm, eventDate: selectedDate, timeSlot: slotToCheck });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (dateError) return;

    setBookingStatus('submitting');
    try {
      const fullClientName = `${bookingForm.firstName} ${bookingForm.lastName}`.trim();
      const defaultSlot = pricingPackages[0]?.title || '';

      if (hall?.id) {
        await supabase.from('bookings').insert([
          {
            hall_id: hall.id,
            client_name: fullClientName,
            client_phone: bookingForm.phone,
            event_date: bookingForm.eventDate,
            time_slot: bookingForm.timeSlot || defaultSlot,
            event_type: bookingForm.eventType,
            status: 'provisional'
          }
        ]);
      }
      setBookingStatus('submitted');
      setTimeout(() => {
        setIsBookingModalOpen(false);
        setBookingStatus(null);
        setDateError('');
      }, 2500);
    } catch (err) {
      console.error('فشل إرسال الطلب:', err);
    }
  };

  if (loading) {
    return <div className={styles.loadingWrapper}>{isAr ? 'جاري تحميل موقع الصالة...' : 'Chargement de la salle...'}</div>;
  }

  const hallName = hall?.name || (isAr ? 'قاعتي' : 'Ma Salle');
  const hallAddress = hall?.address || (hall?.visiting_hours ? `${isAr ? 'أوقات المعاينة' : 'Visites'}: ${hall.visiting_hours}` : '');
  const phone = hall?.phone || '';
  const mapUrl = hall?.map_url || '';
  const videoUrl = hall?.video_url || '';

  const mapEmbedUrl = hall?.map_url && hall.map_url.includes('embed') 
    ? hall.map_url 
    : (hall?.map_url || '');

  const showWhatsApp = hall?.show_whatsapp && (hall?.whatsapp_number || phone);
  const rawWhatsAppPhone = hall?.whatsapp_number || phone || '';
  const cleanedPhone = rawWhatsAppPhone.replace(/\D/g, '');
  const formattedPhone = cleanedPhone.startsWith('0') ? `213${cleanedPhone.substring(1)}` : cleanedPhone;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(isAr ? `مرحباً، أريد الاستفسار عن حجز ${hallName}` : `Bonjour, je souhaite me renseigner sur la salle ${hallName}`)}`;

  const currencyUnit = isAr ? 'دج' : 'DA';

  const hasNoContent = hallImages.length === 0 && amenitiesList.length === 0 && !mapUrl && pricingPackages.length === 0;

  return (
    <div className={styles.showcaseLayout}>
      
      {/* الترويسة العلوية */}
      <header className={styles.topHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.venueLogo}>
            <div className={styles.logoBadge}>🏰</div>
            <strong>{hallName}</strong>
          </div>

          <nav className={styles.navLinks}>
            {amenitiesList.length > 0 && (
              <button onClick={() => scrollToSection('features')}>{isAr ? 'مميزات القاعة' : 'Commodités'}</button>
            )}
            {mapUrl && (
              <button onClick={() => scrollToSection('location')}>{isAr ? 'مكان القاعة' : 'Localisation'}</button>
            )}
            {pricingPackages.length > 0 && (
              <button onClick={() => scrollToSection('pricing')}>{isAr ? 'جدول الأسعار' : 'Tarifs'}</button>
            )}
          </nav>

          <div className={styles.headerRightGroup}>
            <button className={styles.headerCtaBtn} onClick={() => setIsBookingModalOpen(true)}>
              <span>{isAr ? 'طلب حجز' : 'Réservation'}</span>
            </button>

            <button className={styles.langBtn} onClick={toggleLanguage}>
              <IconGlobe />
              <span>{isAr ? 'FR' : 'AR'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className={styles.mainContainer}>
        
        {/* في حالة عدم تحميل أي محتوى */}
        {hasNoContent && (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏰</div>
            <h2 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>{isAr ? 'مرحباً بك في صفحة القاعة' : 'Bienvenue sur la page de la salle'}</h2>
            <p>{isAr ? 'لم يقم المالك بإضافة الصور والأسعار بعد. يمكنك إضافتها الآن من لوحة التحكم.' : 'Le propriétaire n\'a pas encore ajouté de détails.'}</p>
          </div>
        )}

        {/* 1. معرض الصور */}
        {hallImages.length > 0 && (
          <section className={styles.heroCarouselSection}>
            <div className={styles.carouselCard}>
              {videoUrl && (
                <button className={styles.videoOverlayBtn} onClick={() => setIsVideoModalOpen(true)}>
                  <IconVideo />
                  <span>{isAr ? 'مشاهدة فيديو الصالة' : 'Voir la vidéo'}</span>
                </button>
              )}

              <div className={styles.sliderWrapper}>
                {hallImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`${styles.slide} ${idx === currentImgIndex ? styles.slideActive : ''}`}
                    style={{ backgroundImage: `url(${img.url})` }}
                  />
                ))}
              </div>

              {hallImages.length > 1 && (
                <>
                  <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prevImage} aria-label={isAr ? "السابقة" : "Précédent"}>
                    <IconChevronRight />
                  </button>
                  <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={nextImage} aria-label={isAr ? "التالية" : "Suivant"}>
                    <IconChevronLeft />
                  </button>

                  <div className={styles.dotsContainer}>
                    {hallImages.map((_, idx) => (
                      <span
                        key={idx}
                        className={`${styles.dot} ${idx === currentImgIndex ? styles.dotActive : ''}`}
                        onClick={() => setCurrentImgIndex(idx)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* 2. قسم الخصائص والموقع */}
        {(amenitiesList.length > 0 || mapUrl) && (
          <section className={styles.middleTwoColumnsSection}>
            
            {amenitiesList.length > 0 && (
              <div id="features" className={styles.columnFeatures} style={{ flex: !mapUrl ? '1 1 100%' : undefined }}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.columnTitle}>{isAr ? 'ما الذي تشتمل عليه القاعة؟' : 'Commodités & Équipements'}</h2>
                  <span className={styles.countBadge}>{amenitiesList.length} {isAr ? 'مرافق متوفرة' : 'disponibles'}</span>
                </div>

                <div className={styles.amenitiesGridList}>
                  {amenitiesList.map((item, index) => (
                    <div key={index} className={styles.amenityRowCard}>
                      <div className={styles.checkIconWrapper}>
                        <IconCheckSquare />
                      </div>
                      <div className={styles.amenityRightMeta}>
                        <span className={styles.featureText}>{item.title}</span>
                      </div>
                      <span className={styles.featureIconBox}>{item.icon || '✨'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mapUrl && (
              <div id="location" className={styles.columnLocation} style={{ flex: !amenitiesList.length ? '1 1 100%' : undefined }}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.columnTitle}>{isAr ? 'مكان القاعة وموقعها' : 'Localisation de la salle'}</h2>
                  {hallAddress && (
                    <div className={styles.addressMeta}>
                      <IconMapPin />
                      <span>{hallAddress}</span>
                    </div>
                  )}
                </div>

                {mapEmbedUrl && (
                  <div className={styles.mapFrameWrapper}>
                    <iframe
                      title="Google Maps Location"
                      src={mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                  </div>
                )}

                <a href={mapUrl} target="_blank" rel="noreferrer" className={styles.openMapsBtn}>
                  <IconNavigation />
                  <span>{isAr ? 'فتح اتجاهات الوصول في Google Maps' : 'Itinéraire sur Google Maps'}</span>
                </a>
              </div>
            )}

          </section>
        )}

        {/* 3. جدول الأسعار */}
        {pricingPackages.length > 0 && (
          <section id="pricing" className={styles.pricingSection}>
            <div className={styles.pricingCardContainer}>
              {pricingPackages.map((pkg, idx) => (
                <div key={idx} className={styles.pricingRow}>
                  <div className={styles.pricingMeta}>
                    <span className={styles.packageTitle}>{pkg.title}</span>
                    <span className={styles.priceTag}>{pkg.price} {currencyUnit}</span>
                  </div>
                  <button 
                    className={styles.rowBookBtn} 
                    onClick={() => {
                      handleDateChange(bookingForm.eventDate, pkg.title);
                      setIsBookingModalOpen(true);
                    }}
                  >
                    {isAr ? 'حجز' : 'Réserver'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* دائرة الواتساب */}
      {showWhatsApp && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className={styles.whatsappFloatBtn}
          title={isAr ? "تواصل معنا مباشرة عبر واتساب" : "Contactez-nous sur WhatsApp"}
        >
          <span className={styles.whatsappPulseEffect} />
          <IconWhatsApp />
        </a>
      )}

      {/* النافذة المنبثقة للفيديو */}
      {isVideoModalOpen && videoUrl && (
        <div className={styles.modalBackdrop} onClick={() => setIsVideoModalOpen(false)}>
          <div className={styles.videoModalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{isAr ? 'جولة فيديو في القاعة' : 'Vidéo de présentation de la salle'}</h3>
              <button className={styles.modalCloseBtn} onClick={() => setIsVideoModalOpen(false)}>✕</button>
            </div>
            <div className={styles.videoFrameWrapper}>
              <iframe src={videoUrl} title="فيديو الصالة" allowFullScreen></iframe>
            </div>
          </div>
        </div>
      )}

      {/* نافذة طلب الحجز المنبثقة */}
      {isBookingModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3>{isAr ? 'إرسال طلب حجز أونلاين' : 'Demande de réservation en ligne'}</h3>
              <button className={styles.modalCloseBtn} onClick={() => setIsBookingModalOpen(false)}>✕</button>
            </div>

            {bookingStatus === 'submitted' ? (
              <div className={styles.successMessageBox}>
                <h4>{isAr ? 'تم إرسال الطلب بنجاح!' : 'Demande envoyée avec succès!'}</h4>
                <p>{isAr ? 'سيتصل بك مالك القاعة لتأكيد الحجز.' : 'Le propriétaire vous contactera pour confirmation.'}</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className={styles.modalForm}>
                
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>{isAr ? 'الاسم' : 'Prénom'}</label>
                    <input
                      type="text"
                      required
                      placeholder={isAr ? "محمد" : "Ex: Mohamed"}
                      value={bookingForm.firstName}
                      onChange={(e) => setBookingForm({ ...bookingForm, firstName: e.target.value })}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>{isAr ? 'اللقب' : 'Nom'}</label>
                    <input
                      type="text"
                      required
                      placeholder={isAr ? "العماري" : "Ex: Amari"}
                      value={bookingForm.lastName}
                      onChange={(e) => setBookingForm({ ...bookingForm, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>{isAr ? 'رقم الهاتف' : 'Téléphone'}</label>
                    <input
                      type="tel"
                      required
                      placeholder="0550 00 00 00"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>{isAr ? 'تاريخ المناسبة' : 'Date de l\'événement'}</label>
                    <input
                      type="date"
                      required
                      min={todayDate}
                      value={bookingForm.eventDate}
                      onChange={(e) => handleDateChange(e.target.value, bookingForm.timeSlot)}
                    />
                  </div>
                </div>

                {dateError && (
                  <div className={styles.dateErrorBox}>
                    <span>⚠️ {dateError}</span>
                  </div>
                )}

                <div className={styles.inputGroup}>
                  <label>{isAr ? 'نوع المناسبة' : 'Type d\'événement'}</label>
                  <select
                    className={styles.selectInput}
                    value={bookingForm.eventType}
                    onChange={(e) => setBookingForm({ ...bookingForm, eventType: e.target.value })}
                  >
                    <option value="عرس">{isAr ? 'عرس / زفاف' : 'Mariage'}</option>
                    <option value="خطوبة">{isAr ? 'حفل خطوبة' : 'Fiançailles'}</option>
                    <option value="عقد قران">{isAr ? 'عقد قران (فاتحة)' : 'Fatiha / Akd'}</option>
                    <option value="تخرج">{isAr ? 'حفل تخرج' : 'Fête de diplôme'}</option>
                    <option value="مؤتمر / اجتماع">{isAr ? 'مؤتمر / اجتماع عمل' : 'Conférence / Réunion'}</option>
                    <option value="أخرى">{isAr ? 'مناسبة أخرى' : 'Autre événement'}</option>
                  </select>
                </div>

                {pricingPackages.length > 0 && (
                  <div className={styles.inputGroup}>
                    <label>{isAr ? 'الفترة الزمنية المتاحة' : 'Créneau horaire disponible'}</label>
                    <select
                      className={styles.selectInput}
                      value={bookingForm.timeSlot || pricingPackages[0]?.title}
                      onChange={(e) => handleDateChange(bookingForm.eventDate, e.target.value)}
                    >
                      {pricingPackages.map((pkg, idx) => (
                        <option key={idx} value={pkg.title}>
                          {pkg.title} ({pkg.price} {currencyUnit})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button type="submit" disabled={!!dateError} className={styles.submitBookingBtn}>
                  {isAr ? 'إرسال طلب الحجز' : 'Envoyer la demande'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}