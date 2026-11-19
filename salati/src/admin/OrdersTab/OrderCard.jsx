import React from 'react';
import styles from './OrderCard.module.css';
import { IconCoins } from '../Icons';

export default function OrderCard({
  item,
  isAr = true,
  isLoading = false,
  hasConflict = false,
  parseNumber,
  getTimeSlotLabel,
  handleOpenDepositModal,
  handleDeleteBooking,
  handleOpenDetails // تفتح نافذة التفاصيل (التأكيد، الإلغاء، أو العقد الرقمي)
}) {
  if (isLoading || !item) {
    return (
      <div className={styles.orderCard} aria-busy="true">
        <div className={styles.cardTopMeta}>
          <div className={`${styles.skeletonBase} ${styles.skeletonDateBadge}`} />
          <div className={`${styles.skeletonBase} ${styles.skeletonStatusPill}`} />
        </div>

        <div className={styles.financialBox}>
          <div className={styles.totalPriceRow}>
            <div className={`${styles.skeletonBase} ${styles.skeletonLabel}`} />
            <div className={`${styles.skeletonBase} ${styles.skeletonPriceVal}`} />
          </div>

          <div className={styles.amountsGrid}>
            <div className={`${styles.skeletonBase} ${styles.skeletonSubBox}`} />
            <div className={`${styles.skeletonBase} ${styles.skeletonSubBox}`} />
          </div>

          <div className={`${styles.skeletonBase} ${styles.skeletonDepositBtn}`} />
        </div>

        <hr className={styles.cardDivider} />

        <div className={styles.clientDetailsList}>
          <div className={`${styles.skeletonBase} ${styles.skeletonDetailLine}`} />
          <div className={`${styles.skeletonBase} ${styles.skeletonDetailLine}`} />
          <div className={`${styles.skeletonBase} ${styles.skeletonDetailLine}`} />
        </div>

        <div className={styles.cardActionsRow}>
          <div className={`${styles.skeletonBase} ${styles.skeletonActionBtn}`} />
          <div className={`${styles.skeletonBase} ${styles.skeletonActionBtn}`} />
        </div>
      </div>
    );
  }

  const totalVal = item.rawAmount ?? (parseNumber ? parseNumber(item.amount) : 0);
  const depositVal = item.rawDeposit ?? (parseNumber ? parseNumber(item.deposit) : 0);
  const remainingVal = Math.max(0, totalVal - depositVal);
  const localeStr = isAr ? 'ar-DZ' : 'fr-FR';
  const currencyLabel = isAr ? 'دج' : 'DA';

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
            {totalVal.toLocaleString(localeStr)} {currencyLabel}
          </strong>
        </div>

        <div className={styles.amountsGrid}>
          {/* العربون المدفوع - أخضر */}
          <div className={styles.depositBox}>
            <span className={styles.boxSubLabel}>
              {isAr ? 'العربون المدفوع' : 'Acompte payé'}
            </span>
            <strong className={styles.depositValue}>
              {depositVal.toLocaleString(localeStr)} {currencyLabel}
            </strong>
          </div>

          {/* المبلغ المتبقي - أحمر */}
          <div className={styles.remainingBox}>
            <span className={styles.boxSubLabel}>
              {isAr ? 'المبلغ المتبقي' : 'Reste à payer'}
            </span>
            <strong className={styles.remainingValue}>
              {remainingVal.toLocaleString(localeStr)} {currencyLabel}
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
          {item.phone ? (
            <a href={`tel:${item.phone}`} className={styles.phoneValue} dir="ltr">
              {item.phone}
            </a>
          ) : (
            <strong className={styles.detailValue}>---</strong>
          )}
        </div>
      </div>

      {/* أزرار التحكم السفلية (تفاصيل الطلبية + حذف طلبية) */}
      <div className={styles.cardActionsRow}>
        <button
          type="button"
          className={styles.detailsBtn}
          aria-label={isAr ? 'تفاصيل الطلبية' : 'Détails de la demande'}
          onClick={() => handleOpenDetails && handleOpenDetails(item)}
        >
          {isAr ? 'تفاصيل الطلبية' : 'Détails'}
        </button>

        <button
          type="button"
          className={styles.deleteBtn}
          aria-label={isAr ? 'حذف طلبية' : 'Supprimer la demande'}
          onClick={() => handleDeleteBooking && handleDeleteBooking(item.id)}
        >
          {isAr ? 'حذف طلبية' : 'Supprimer'}
        </button>
      </div>
    </div>
  );
}