import React from 'react';
import styles from './CalendarTab.module.css';
import { IconPlus, IconChevronLeft, IconChevronRight } from '../Icons';

export default function CalendarTab({
  isAr,
  calendarMonthLabel,
  changeCalendarMonth,
  getCalendarDays,
  bookings = [],
  setIsAddBookingOpen,
  newBooking,
  setNewBooking,
  t
}) {
  return (
    <div className={styles.tabPaneAnim}>
      <div className={styles.panelCard}>
        
        <div className={styles.calendarHeaderRow}>
          <div>
            <h2>{isAr ? 'تقويم الشغور وإدارة الفترات الحية' : 'Gestion du Calendrier'}</h2>
            <p className={styles.sectionDesc}>{isAr ? 'عند تأكيد أي طلب من قسم الطلبات، سينغلق اليوم في هذه الشبكة أوتوماتيكياً' : 'Gérez vos dates par créneaux'}</p>
          </div>

          <div className={styles.monthNavGroup}>
            <button className={styles.monthNavBtn} onClick={() => changeCalendarMonth(-1)}>
              <IconChevronRight/>
            </button>
            <span className={styles.currentMonthTitle}>{calendarMonthLabel}</span>
            <button className={styles.monthNavBtn} onClick={() => changeCalendarMonth(1)}>
              <IconChevronLeft/>
            </button>
          </div>

          <button className={styles.addBookingBtn} onClick={() => setIsAddBookingOpen(true)}>
            <IconPlus/> <span>{t.newBookingBtn}</span>
          </button>
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

        <div className={styles.calendarSimGrid}>
          {['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map((day, idx) => (
            <div key={idx} className={styles.calDayHeader}>{day}</div>
          ))}

          {getCalendarDays().map((cell, i) => {
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

      </div>
    </div>
  );
}