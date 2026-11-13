import React from 'react';
import styles from './OrderCard.module.css';
import { IconCoins } from '../Icons';

export default function OrderCard({
  item,
  isAr = true,
  hasConflict = false,
  parseNumber,
  getTimeSlotLabel,
  handleOpenDepositModal,
  handleDeleteBooking,
  handleOpenDetails // تفتح نافذة التفاصيل (التأكيد، الإلغاء، أو العقد الرقمي)
}) {
  const totalVal = item.rawAmount ?? (parseNumber ? parseNumber(item.amount) : 0);
  const depositVal = item.rawDeposit ?? (parseNumber ? parseNumber(item.deposit) : 0);
  const remainingVal = Math.max(0, totalVal - depositVal);

  // تقسيم الاسم الكامل إذا كان يحتوي على مسافة لعرضه كـ (الاسم / اللقب) كما في التصميم
  const nameParts = (item.client || '').trim().split(' ');
  const firstName = nameParts[0] || '---';
  const lastName = nameParts.slice(1).join(' ') || '---';

  return (
    <div
      className={`
        ${styles.orderCard}
        ${item.status === 'confirmed' ? styles.cardConfirmed : ''}
        ${item.status === 'provisional' ? styles.cardProvisional : ''}
        ${item.status === 'cancelled' ? styles.cardCancelled : ''}
        ${hasConflict ? styles.cardConflicted : ''}
      `}
    >
      {/* شريط الحالة العلوي المختصر */}
      <div className={styles.cardTopMeta}>
        <span className={styles.dateBadge}>
          📅 {item.date} {getTimeSlotLabel ? `• ${getTimeSlotLabel(item.timeSlot)}` : ''}
        </span>
        <span
          className={`${styles.statusPill} ${
            item.status === 'confirmed'
              ? styles.statusConfirmed
              : item.status === 'cancelled'
              ? styles.statusCancelled
              : styles.statusProvisional
          }`}
        >
          {item.status === 'confirmed'
            ? isAr ? 'مؤكد' : 'Confirmé'
            : item.status === 'cancelled'
            ? isAr ? 'ملغى' : 'Annulé'
            : isAr ? 'معلّق' : 'En attente'}
        </span>
      </div>

      {/* الصندوق المالي العلوي (مطابق للمخطط) */}
      <div className={styles.financialBox}>
        <div className={styles.totalPriceRow}>
          <span className={styles.priceLabel}>
            {isAr ? 'سعر كراء القاعة:' : 'Prix de location :'}
          </span>
          <strong className={styles.totalPriceValue}>
            {totalVal.toLocaleString()} {isAr ? 'دج' : 'DA'}
          </strong>
        </div>

        <div className={styles.amountsGrid}>
          {/* العربون المدفوع - أخضر */}
          <div className={styles.depositBox}>
            <span className={styles.boxSubLabel}>
              {isAr ? 'العربون المدفوع' : 'Acompte payé'}
            </span>
            <strong className={styles.depositValue}>
              {depositVal.toLocaleString()} {isAr ? 'دج' : 'DA'}
            </strong>
          </div>

          {/* المبلغ المتبقي - أحمر */}
          <div className={styles.remainingBox}>
            <span className={styles.boxSubLabel}>
              {isAr ? 'المبلغ المتبقي' : 'Reste à payer'}
            </span>
            <strong className={styles.remainingValue}>
              {remainingVal.toLocaleString()} {isAr ? 'دج' : 'DA'}
            </strong>
          </div>
        </div>

        <button
          type="button"
          className={styles.addDepositBtn}
          onClick={() => handleOpenDepositModal && handleOpenDepositModal(item)}
        >
          <IconCoins />
          <span>
            {depositVal > 0
              ? isAr ? 'تعديل العربون' : 'Modifier l\'acompte'
              : isAr ? 'إضافة عربون' : 'Ajouter un acompte'}
          </span>
        </button>
      </div>

      {/* خط فاصل ناعم */}
      <hr className={styles.cardDivider} />

      {/* بيانات العميل (الاسم، اللقب، رقم الهاتف) */}
      <div className={styles.clientDetailsList}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>{isAr ? 'الاسم :' : 'Prénom :'}</span>
          <strong className={styles.detailValue}>{firstName}</strong>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>{isAr ? 'اللقب :' : 'Nom :'}</span>
          <strong className={styles.detailValue}>{lastName}</strong>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>{isAr ? 'رقم الهاتف :' : 'Téléphone :'}</span>
          <a href={`tel:${item.phone}`} className={styles.phoneValue} dir="ltr">
            {item.phone || '---'}
          </a>
        </div>
      </div>

      {/* أزرار التحكم السفلية (تفاصيل الطلبية + حذف طلبية) */}
      <div className={styles.cardActionsRow}>
        <button
          type="button"
          className={styles.detailsBtn}
          onClick={() => handleOpenDetails && handleOpenDetails(item)}
        >
          {isAr ? 'تفاصيل الطلبية' : 'Détails'}
        </button>

        <button
          type="button"
          className={styles.deleteBtn}
          onClick={() => handleDeleteBooking && handleDeleteBooking(item.id)}
        >
          {isAr ? 'حذف طلبية' : 'Supprimer'}
        </button>
      </div>
    </div>
  );
}