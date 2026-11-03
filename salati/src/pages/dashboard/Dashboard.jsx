import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';

// بيانات تجريبية لطلبات الحجز والمعاينة
const INITIAL_BOOKINGS = [
  { id: 1, clientName: 'أحمد زروقي', phone: '0555123456', eventDate: '2026-11-15', type: 'معاينة', status: 'pending' },
  { id: 2, clientName: 'ياسين بلخير', phone: '0770987654', eventDate: '2026-12-01', type: 'حجز مؤكد', status: 'confirmed' },
  { id: 3, clientName: 'كريم محيوت', phone: '0661112233', eventDate: '2026-12-10', type: 'معاينة', status: 'pending' }
];

const translations = {
  ar: {
    welcome: 'مرحباً، صالة الملكة للأفراح',
    subtitle: 'إليك ملخص نشاط صالتك وحالة الطلبات هذا الشهر.',
    statVisits: 'زيارات الموقع',
    statPending: 'طلبات المعاينة المعلقة',
    statConfirmed: 'الحجوزات المؤكدة',
    statRating: 'تقييم Google Maps',
    tableTitle: 'أحدث طلبات المعاينة والحجز',
    colClient: 'الزبون',
    colPhone: 'الهاتف',
    colDate: 'الموعد المطلوب',
    colType: 'نوع الطلب',
    colStatus: 'الحالة',
    colActions: 'الإجراءات',
    statusPending: 'معلق',
    statusConfirmed: 'مؤكد',
    btnConfirm: 'تأكيد',
    btnCancel: 'إلغاء',
    noBookings: 'لا توجد طلبات جديدة حالياً.'
  },
  fr: {
    welcome: 'Bienvenue, Salle El Malika',
    subtitle: 'Voici le résumé de votre activité et des demandes ce mois-ci.',
    statVisits: 'Visites du site',
    statPending: 'Demandes en attente',
    statConfirmed: 'Réservations confirmées',
    statRating: 'Avis Google Maps',
    tableTitle: 'Dernières demandes de visite et réservation',
    colClient: 'Client',
    colPhone: 'Téléphone',
    colDate: 'Date souhaitée',
    colType: 'Type',
    colStatus: 'Statut',
    colActions: 'Actions',
    statusPending: 'En attente',
    statusConfirmed: 'Confirmé',
    btnConfirm: 'Confirmer',
    btnCancel: 'Annuler',
    noBookings: 'Aucune demande récente.'
  }
};

export default function Dashboard() {
  const [lang, setLang] = useState(document.documentElement.lang || 'ar');
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLang(document.documentElement.lang || 'ar');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  const handleConfirm = (id) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'confirmed', type: 'حجز مؤكد' } : b));
  };

  const handleCancel = (id) => {

    setBookings(bookings.filter(b => b.id !== id));
  };

  const t = translations[lang] || translations.ar;

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.container}>
        
        {/* الترويسة والترحيب */}
        <header className={styles.dashboardHeader}>
          <div>
            <h1 className={styles.title}>{t.welcome}</h1>
            <p className={styles.subtitle}>{t.subtitle}</p>
          </div>
          <a href="/hall/demo" className={styles.previewBtn} target="_blank" rel="noreferrer">
            🌐 معاينة موقع الصالة
          </a>
        </header>

        {/* بطاقات الإحصائيات السريعة */}
        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👁️</div>
            <div>
              <h3>1,420</h3>
              <p>{t.statVisits}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>⏳</div>
            <div>
              <h3>{bookings.filter(b => b.status === 'pending').length}</h3>
              <p>{t.statPending}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div>
              <h3>{bookings.filter(b => b.status === 'confirmed').length}</h3>
              <p>{t.statConfirmed}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>⭐</div>
            <div>
              <h3>4.9 / 5</h3>
              <p>{t.statRating}</p>
            </div>
          </div>
        </section>

        {/* جدول الطلبات */}
        <section className={styles.tableSection}>
          <h2 className={styles.sectionTitle}>{t.tableTitle}</h2>
          
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t.colClient}</th>
                  <th>{t.colPhone}</th>
                  <th>{t.colDate}</th>
                  <th>{t.colType}</th>
                  <th>{t.colStatus}</th>
                  <th>{t.colActions}</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={styles.emptyCell}>{t.noBookings}</td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td><strong>{booking.clientName}</strong></td>
                      <td className={styles.phoneTd}>{booking.phone}</td>
                      <td>{booking.eventDate}</td>
                      <td>{booking.type}</td>
                      <td>
                        <span className={`${styles.badge} ${booking.status === 'confirmed' ? styles.badgeConfirmed : styles.badgePending}`}>
                          {booking.status === 'confirmed' ? t.statusConfirmed : t.statusPending}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionBtns}>
                          {booking.status === 'pending' && (
                            <button className={styles.confirmBtn} onClick={() => handleConfirm(booking.id)}>
                              {t.btnConfirm}
                            </button>
                          )}
                          <button className={styles.cancelBtn} onClick={() => handleCancel(booking.id)}>
                            {t.btnCancel}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}