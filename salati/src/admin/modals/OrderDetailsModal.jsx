import React from 'react';
import styles from '../AdminDashboard.module.css';
import { IconCheck, IconFileText } from '../Icons';

const EVENT_TYPE_FR_MAP = {
  'عرس': 'Mariage',
  'خطوبة': 'Fiançailles',
  'عقد قران': 'Fatiha / Akd',
  'تخرج': 'Fête de diplôme',
  'مؤتمر / اجتماع': 'Conférence / Réunion',
  'أخرى': 'Autre événement'
};

export default function OrderDetailsModal({
  booking,
  isAr = true,
  isLoading = false,
  onClose,
  getTimeSlotLabel,
  handleUpdateBookingStatus,
  handleOpenContract
}) {
  if (!booking && !isLoading) return null;

  const formatEventType = (rawType) => {
    const val = rawType || 'عرس';
    if (isAr) return val;
    for (const [arKey, frVal] of Object.entries(EVENT_TYPE_FR_MAP)) {
      if (val === arKey) return frVal;
      if (val.startsWith(`${arKey} (`)) {
        return val.replace(arKey, frVal);
      }
    }
    return val;
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <style>{`
        @keyframes orderModalEnter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes orderShimmerWave {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .orderModalAnim {
          animation: orderModalEnter 0.26s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .orderSkeletonLine {
          height: 18px;
          border-radius: 8px;
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          animation: orderShimmerWave 1.4s infinite linear;
        }
        @media (max-width: 480px) {
          .orderModalBoxResp {
            padding: 1.2rem !important;
            border-radius: 20px !important;
          }
          .orderModalActionsResp > button {
            flex: 1 1 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>

      <div
        dir={isAr ? 'rtl' : 'ltr'}
        className={`${styles.modalBox} orderModalAnim orderModalBoxResp`}
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90dvh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3>
            {isLoading
              ? isAr
                ? 'جاري تحميل تفاصيل الطلبية...'
                : 'Chargement des détails...'
              : isAr
              ? `تفاصيل الطلبية #${String(booking.id).slice(0, 8)}`
              : `Détails de la demande #${String(booking.id).slice(0, 8)}`}
          </h3>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Fermer'}
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div
            aria-busy="true"
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            <div className="orderSkeletonLine" style={{ width: '65%' }} />
            <div className="orderSkeletonLine" style={{ width: '80%' }} />
            <div className="orderSkeletonLine" style={{ width: '55%' }} />
            <div className="orderSkeletonLine" style={{ width: '75%' }} />
            <div className="orderSkeletonLine" style={{ width: '60%' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '18px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                fontSize: '0.92rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#64748b', fontWeight: 700, flexShrink: 0 }}>
                  {isAr ? 'رقم الطلبية:' : 'N° Demande :'}
                </span>
                <strong style={{ color: '#0f172a' }} dir="ltr">
                  #{String(booking.id).slice(0, 8)}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#64748b', fontWeight: 700, flexShrink: 0 }}>
                  {isAr ? 'العميل:' : 'Client :'}
                </span>
                <strong style={{ color: '#0f172a', textAlign: isAr ? 'left' : 'right' }}>
                  {booking.client}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#64748b', fontWeight: 700, flexShrink: 0 }}>
                  {isAr ? 'رقم الهاتف:' : 'Téléphone :'}
                </span>
                <a
                  href={`tel:${booking.phone}`}
                  style={{ color: '#0052cc', fontWeight: 800, textDecoration: 'none' }}
                  dir="ltr"
                >
                  {booking.phone}
                </a>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#64748b', fontWeight: 700, flexShrink: 0 }}>
                  {isAr ? 'تاريخ المناسبة:' : 'Date :'}
                </span>
                <strong style={{ color: '#0f172a' }} dir="ltr">
                  {booking.date}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#64748b', fontWeight: 700, flexShrink: 0 }}>
                  {isAr ? 'الفترة الزمنية:' : 'Créneau :'}
                </span>
                <strong style={{ color: '#0f172a', textAlign: isAr ? 'left' : 'right' }}>
                  {getTimeSlotLabel ? getTimeSlotLabel(booking.timeSlot) : booking.timeSlot}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#64748b', fontWeight: 700, flexShrink: 0 }}>
                  {isAr ? 'نوع المناسبة:' : 'Événement :'}
                </span>
                <strong style={{ color: '#0f172a', textAlign: isAr ? 'left' : 'right' }}>
                  {formatEventType(booking.type)}
                </strong>
              </div>

              {booking.confirmedBy && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 700, flexShrink: 0 }}>
                    {isAr ? 'تم التأكيد بواسطة:' : 'Confirmé par :'}
                  </span>
                  <strong style={{ color: '#059669', textAlign: isAr ? 'left' : 'right' }}>
                    {booking.confirmedBy}
                  </strong>
                </div>
              )}
            </div>

            {/* أزرار الإجراءات حسب حالة الطلب */}
            <div
              className="orderModalActionsResp"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.65rem',
                marginTop: '0.35rem'
              }}
            >
              {booking.status === 'provisional' && (
                <>
                  <button
                    type="button"
                    className={styles.confirmBookingBtn}
                    style={{ flex: '1 1 220px', justifyContent: 'center', padding: '0.75rem 1rem' }}
                    onClick={() => {
                      handleUpdateBookingStatus(booking.id, 'confirmed');
                      onClose();
                    }}
                  >
                    <IconCheck />
                    <span>
                      {isAr ? 'تأكيد الحجز وتثبيت اليوم' : 'Confirmer et verrouiller la date'}
                    </span>
                  </button>

                  <button
                    type="button"
                    className={styles.cancelBookingBtn}
                    style={{ flex: '1 1 120px', justifyContent: 'center', padding: '0.75rem 1rem' }}
                    onClick={() => {
                      handleUpdateBookingStatus(booking.id, 'cancelled');
                      onClose();
                    }}
                  >
                    {isAr ? 'إلغاء الطلب' : 'Annuler la demande'}
                  </button>
                </>
              )}

              {booking.status === 'confirmed' && (
                <>
                  <button
                    type="button"
                    className={styles.addBookingBtn}
                    style={{ flex: '1 1 200px', justifyContent: 'center', padding: '0.75rem 1rem' }}
                    onClick={() => {
                      onClose();
                      if (handleOpenContract) handleOpenContract(booking);
                    }}
                  >
                    <IconFileText />
                    <span>{isAr ? 'عرض العقد الرقمي' : 'Afficher le contrat numérique'}</span>
                  </button>

                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    style={{ flex: '1 1 140px', justifyContent: 'center', padding: '0.75rem 1rem' }}
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
                    style={{ flex: '1 1 120px', justifyContent: 'center', padding: '0.75rem 1rem' }}
                    onClick={() => {
                      handleUpdateBookingStatus(booking.id, 'cancelled');
                      onClose();
                    }}
                  >
                    {isAr ? 'إلغاء الحجز' : 'Annuler la réservation'}
                  </button>
                </>
              )}

              {booking.status === 'cancelled' && (
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  style={{ flex: '1 1 100%', justifyContent: 'center', padding: '0.75rem 1rem' }}
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
        )}
      </div>
    </div>
  );
}