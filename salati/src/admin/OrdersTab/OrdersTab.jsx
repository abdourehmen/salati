import React from 'react';
import styles from './OrdersTab.module.css';
import OrderCard from './OrderCard';
import { IconSearch } from '../Icons';

export default function OrdersTab({
  bookings = [],
  filteredOrders = [],
  unconfirmedOrders = [],
  confirmedBookings = [],
  orderFilterTab,
  setOrderFilterTab,
  orderSearchQuery,
  setOrderSearchQuery,
  isAr = true,
  isBookingConflicted,
  parseNumber,
  getTimeSlotLabel,
  handleOpenDepositModal,
  handleDeleteBooking,
  handleOpenDetails
}) {
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  return (
    <div className={styles.ordersContainer}>
      {/* عنوان الصفحة */}
      <div className={styles.pageTitleBar}>
        <h2 className={styles.pageMainTitle}>
          {isAr ? 'الطلبيات' : 'Demandes'}
        </h2>
        <span className={styles.totalCountPill}>
          {bookings.length} {isAr ? 'طلب' : 'demandes'}
        </span>
      </div>

      {/* شريط البحث العريض كما في التصميم */}
      <div className={styles.searchSection}>
        <div className={styles.wideSearchBar}>
          <IconSearch />
          <input
            type="text"
            placeholder={
              isAr
                ? 'البحث باسم العميل أو رقم الهاتف...'
                : 'Rechercher par nom ou numéro de téléphone...'
            }
            value={orderSearchQuery}
            onChange={(e) => setOrderSearchQuery(e.target.value)}
          />
          {orderSearchQuery && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => setOrderSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* شريط الفلترة الرباعي */}
      <div className={styles.filterGridBar}>
        <button
          type="button"
          className={`${styles.filterPillBtn} ${
            orderFilterTab === 'all' ? styles.filterActive : ''
          }`}
          onClick={() => setOrderFilterTab('all')}
        >
          <span>{isAr ? 'جميع الطلبات' : 'Toutes les demandes'}</span>
          <span className={styles.filterBadge}>{bookings.length}</span>
        </button>

        <button
          type="button"
          className={`${styles.filterPillBtn} ${
            orderFilterTab === 'provisional' ? styles.filterActiveWarning : ''
          }`}
          onClick={() => setOrderFilterTab('provisional')}
        >
          <span>{isAr ? 'الطلبات المعلّقة' : 'En attente'}</span>
          <span className={styles.filterBadge}>{unconfirmedOrders.length}</span>
        </button>

        <button
          type="button"
          className={`${styles.filterPillBtn} ${
            orderFilterTab === 'confirmed' ? styles.filterActiveSuccess : ''
          }`}
          onClick={() => setOrderFilterTab('confirmed')}
        >
          <span>{isAr ? 'الحجوزات المؤكدة' : 'Confirmées'}</span>
          <span className={styles.filterBadge}>{confirmedBookings.length}</span>
        </button>

        <button
          type="button"
          className={`${styles.filterPillBtn} ${
            orderFilterTab === 'cancelled' ? styles.filterActiveDanger : ''
          }`}
          onClick={() => setOrderFilterTab('cancelled')}
        >
          <span>{isAr ? 'الطلبات الملغاة' : 'Annulées'}</span>
          <span className={styles.filterBadge}>{cancelledCount}</span>
        </button>
      </div>

      {/* شبكة بطاقات الطلبات (3 أعمدة) */}
      {filteredOrders.length === 0 ? (
        <div className={styles.emptyOrdersBox}>
          <span>🔍</span>
          <p>
            {isAr
              ? 'لا توجد طلبيات مطابقة لخيارات البحث أو الفلترة الحالية'
              : 'Aucune demande trouvée'}
          </p>
        </div>
      ) : (
        <div className={styles.cardsGridThreeCols}>
          {filteredOrders.map((item, index) => (
            <div
              key={item.id}
              style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
              className={styles.cardWrapperAnim}
            >
              <OrderCard
                item={item}
                isAr={isAr}
                hasConflict={isBookingConflicted ? isBookingConflicted(item) : false}
                parseNumber={parseNumber}
                getTimeSlotLabel={getTimeSlotLabel}
                handleOpenDepositModal={handleOpenDepositModal}
                handleDeleteBooking={handleDeleteBooking}
                handleOpenDetails={handleOpenDetails}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}