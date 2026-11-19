import React from 'react';
import styles from './CalendarTab.module.css';
import { IconPlus, IconChevronLeft, IconChevronRight } from '../Icons';

export default function CalendarTab({
  isAr,
  isLoading = false,
  calendarMonthLabel,
  changeCalendarMonth,
  getCalendarDays,
  bookings = [],
  setIsAddBookingOpen,
  newBooking,
  setNewBooking,
  t
}) {
  const weekDays = isAr
    ? ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
    : ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const calendarDays = getCalendarDays ? getCalendarDays() : [];

  return (
    <div className={styles.tabPaneAnim}>
      <div className={styles.panelCard}>
        
        <div className={styles.calendarHeaderRow}>
          <div className={styles.headerTitleBlock}>
            <h2>{isAr ? 'تقويم الشغور وإدارة الفترات الحية' : 'Calendrier des disponibilités & créneaux'}</h2>
            <p className={styles.sectionDesc}>
              {isAr
                ? 'عند تأكيد أي طلب من قسم الطلبات، سينغلق اليوم في هذه الشبكة أوتوماتيكياً'
                : 'Lorsqu’une demande est confirmée, la journée se verrouille automatiquement sur cette grille'}
            </p>
          </div>

          <div className={styles.headerControlsGroup}>
            <div className={styles.monthNavGroup}>
              <button
                type="button"
                className={styles.monthNavBtn}
                onClick={() => changeCalendarMonth(-1)}
                aria-label={isAr ? 'الشهر السابق' : 'Mois précédent'}
              >
                {isAr ? <IconChevronRight /> : <IconChevronLeft />}
              </button>
              <span className={styles.currentMonthTitle}>{calendarMonthLabel}</span>
              <button
                type="button"
                className={styles.monthNavBtn}
                onClick={() => changeCalendarMonth(1)}
                aria-label={isAr ? 'الشهر suivant' : 'Mois suivant'}
              >
                {isAr ? <IconChevronLeft /> : <IconChevronRight />}
              </button>
            </div>

            <button
              type="button"
              className={styles.addBookingBtn}
              onClick={() => setIsAddBookingOpen(true)}
            >
              <IconPlus /> <span>{t.newBookingBtn}</span>
            </button>
          </div>
        </div>

        <div className={styles.calendarLegendBar}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotFree}`} />
            <span>{isAr ? 'متاح للحجز' : 'Disponible'}</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotConfirmed}`} />
            <span>{isAr ? 'مغلق / مؤكد' : 'Bloqué / Confirmé'}</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotProvisional}`} />
            <span>{isAr ? 'غير مؤكد' : 'En attente'}</span>
          </div>
        </div>

        <div className={styles.calendarScrollWrapper}>
          {isLoading ? (
            <div className={styles.calendarSimGrid} aria-busy="true">
              {weekDays.map((day, idx) => (
                <div key={idx} className={styles.calDayHeader}>{day}</div>
              ))}
              {Array.from({ length: 28 }).map((_, idx) => (
                <div key={idx} className={styles.calSlotCell}>
                  <div className={`${styles.skeletonBase} ${styles.skeletonDayNum}`} />
                  <div className={`${styles.skeletonBase} ${styles.skeletonSlotPill}`} />
                  <div className={`${styles.skeletonBase} ${styles.skeletonSlotPill}`} />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.calendarSimGrid}>
              {weekDays.map((day, idx) => (
                <div key={idx} className={styles.calDayHeader}>{day}</div>
              ))}

              {calendarDays.map((cell, i) => {
                if (cell.isPadding) {
                  return <div key={i} className={styles.calSlotCellEmpty} />;
                }

                const dayAfternoonBooking = bookings.find(
                  b => b.date === cell.dateStr && (b.timeSlot === 'afternoon' || b.timeSlot === 'full_day') && b.status !== 'cancelled'
                );

                const dayEveningBooking = bookings.find(
                  b => b.date === cell.dateStr && (b.timeSlot === 'evening' || b.timeSlot === 'full_day') && b.status !== 'cancelled'
                );

                return (
                  <div key={i} className={styles.calSlotCell}>
                    <div className={styles.calNumRow}>
                      <span className={styles.calNum}>{cell.dayNum}</span>
                    </div>

                    {dayAfternoonBooking ? (
                      <div 
                        className={`${styles.slotItem} ${dayAfternoonBooking.status === 'confirmed' ? styles.slotConfirmed : styles.slotProvisional}`}
                        title={`${dayAfternoonBooking.client} (${dayAfternoonBooking.phone})`}
                      >
                        <span>☀️ {isAr ? 'الظهيرة' : 'Midi'}</span>
                        <small>{dayAfternoonBooking.client.split(' ')[0]}</small>
                      </div>
                    ) : (
                      <div 
                        className={`${styles.slotItem} ${styles.slotFree}`}
                        onClick={() => {
                          setNewBooking({
                            ...newBooking,
                            date: cell.dateStr,
                            timeSlot: 'afternoon',
                            status: 'provisional',
                            client: ''
                          });
                          setIsAddBookingOpen(true);
                        }}
                      >
                        <span>☀️ {isAr ? 'الظهيرة' : 'Midi'}</span>
                        <small>{isAr ? '+ طلب' : '+ Demande'}</small>
                      </div>
                    )}

                    {dayEveningBooking ? (
                      <div 
                        className={`${styles.slotItem} ${dayEveningBooking.status === 'confirmed' ? styles.slotConfirmed : styles.slotProvisional}`}
                        title={`${dayEveningBooking.client} (${dayEveningBooking.phone})`}
                      >
                        <span>🌙 {isAr ? 'المساء' : 'Soir'}</span>
                        <small>{dayEveningBooking.client.split(' ')[0]}</small>
                      </div>
                    ) : (
                      <div 
                        className={`${styles.slotItem} ${styles.slotFree}`}
                        onClick={() => {
                          setNewBooking({
                            ...newBooking,
                            date: cell.dateStr,
                            timeSlot: 'evening',
                            status: 'provisional',
                            client: ''
                          });
                          setIsAddBookingOpen(true);
                        }}
                      >
                        <span>🌙 {isAr ? 'المساء' : 'Soir'}</span>
                        <small>{isAr ? '+ طلب' : '+ Demande'}</small>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}