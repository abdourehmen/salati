import React from 'react';
import styles from '../AdminDashboard.module.css';
import { IconCheck, IconFileText } from '../Icons';

export default function OrderDetailsModal({
  booking,
  isAr = true,
  onClose,
  getTimeSlotLabel,
  handleUpdateBookingStatus,
  handleOpenContract
}) {
  if (!booking) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        className={styles.modalBox}
        style={{ maxWidth: '500px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3>
            {isAr
              ? `تفاصيل الطلبية #${String(booking.id).slice(0, 8)}`
              : `Détails de la demande #${String(booking.id).slice(0, 8)}`}
          </h3>
          <button type="button" className={styles.modalCloseBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              fontSize: '0.92rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b', fontWeight: 700 }}>
                {isAr ? 'رقم الطلبية:' : 'N° Demande :'}
              </span>
              <strong style={{ color: '#0f172a' }} dir="ltr">
                #{String(booking.id).slice(0, 8)}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b', fontWeight: 700 }}>
                {isAr ? 'العميل:' : 'Client :'}
              </span>
              <strong style={{ color: '#0f172a' }}>{booking.client}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b', fontWeight: 700 }}>
                {isAr ? 'رقم الهاتف:' : 'Téléphone :'}
              </span>
              <strong style={{ color: '#0052cc' }} dir="ltr">
                {booking.phone}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b', fontWeight: 700 }}>
                {isAr ? 'تاريخ المناسبة:' : 'Date :'}
              </span>
              <strong style={{ color: '#0f172a' }}>{booking.date}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b', fontWeight: 700 }}>
                {isAr ? 'الفترة الزمنية:' : 'Créneau :'}
              </span>
              <strong style={{ color: '#0f172a' }}>
                {getTimeSlotLabel ? getTimeSlotLabel(booking.timeSlot) : booking.timeSlot}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b', fontWeight: 700 }}>
                {isAr ? 'نوع المناسبة:' : 'Événement :'}
              </span>
              <strong style={{ color: '#0f172a' }}>{booking.type || 'عرس'}</strong>
            </div>

            {booking.confirmedBy && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: 700 }}>
                  {isAr ? 'تم التأكيد بواسطة:' : 'Confirmé par :'}
                </span>
                <strong style={{ color: '#059669' }}>{booking.confirmedBy}</strong>
              </div>
            )}
          </div>

          {/* أزرار الإجراءات حسب حالة الطلب */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.65rem',
              marginTop: '0.5rem'
            }}
          >
            {booking.status === 'provisional' && (
              <>
                <button
                  type="button"
                  className={styles.confirmBookingBtn}
                  style={{ flex: 1, justifyContent: 'center', padding: '0.7rem 1rem' }}
                  onClick={() => {
                    handleUpdateBookingStatus(booking.id, 'confirmed');
                    onClose();
                  }}
                >
                  <IconCheck />
                  <span>
                    {isAr ? 'تأكيد الحجز وتثبيت اليوم' : 'Confirmer la réservation'}
                  </span>
                </button>

                <button
                  type="button"
                  className={styles.cancelBookingBtn}
                  style={{ padding: '0.7rem 1rem' }}
                  onClick={() => {
                    handleUpdateBookingStatus(booking.id, 'cancelled');
                    onClose();
                  }}
                >
                  {isAr ? 'إلغاء الطلب' : 'Annuler'}
                </button>
              </>
            )}

            {booking.status === 'confirmed' && (
              <>
                <button
                  type="button"
                  className={styles.addBookingBtn}
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => {
                    onClose();
                    if (handleOpenContract) handleOpenContract(booking);
                  }}
                >
                  <IconFileText />
                  <span>{isAr ? 'عرض العقد الرقمي' : 'Contrat Numérique'}</span>
                </button>

                <button
                  type="button"
                  className={styles.secondaryBtn}
                  style={{ padding: '0.7rem 1rem' }}
                  onClick={() => {
                    handleUpdateBookingStatus(booking.id, 'provisional');
                    onClose();
                  }}
                >
                  {isAr ? '↺ إرجاع كمعلّق' : '↺ Mettre en attente'}
                </button>

                <button
                  type="button"
                  className={styles.cancelBookingBtn}
                  style={{ padding: '0.7rem 1rem' }}
                  onClick={() => {
                    handleUpdateBookingStatus(booking.id, 'cancelled');
                    onClose();
                  }}
                >
                  {isAr ? 'إلغاء الحجز' : 'Annuler'}
                </button>
              </>
            )}

            {booking.status === 'cancelled' && (
              <button
                type="button"
                className={styles.secondaryBtn}
                style={{ flex: 1 }}
                onClick={() => {
                  handleUpdateBookingStatus(booking.id, 'provisional');
                  onClose();
                }}
              >
                {isAr ? '↺ إعادة فتح الطلب كمعلّق' : '↺ Restaurer la demande'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}