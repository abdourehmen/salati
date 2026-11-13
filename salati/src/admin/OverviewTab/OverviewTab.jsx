import React, { useState, useMemo } from 'react';
import styles from './OverviewTab.module.css';
import OrderCard from '../OrdersTab/OrderCard';
import { IconChevronLeft, IconChevronRight } from '../Icons';

// مكون الرسم البياني الخطي الممتد من بداية الكرت إلى نهايته
function StatSparklineCard({ title, totalValue, points, color, gradientId, onClick, delay = 0 }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const width = 320;
  const height = 95;
  const padY = 22;

  const maxVal = Math.max(...points.map((p) => p.value), 1);

  // padX = 0 ليمتد الخط من حافة الكرت اليسرى إلى اليمنى بالكامل
  const coords = points.map((p, idx) => {
    const x = (idx / Math.max(points.length - 1, 1)) * width;
    const y = height - padY - (p.value / maxVal) * (height - padY * 1.6);
    return { ...p, x, y };
  });

  const buildSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M 0 ${pts[0].y} L ${width} ${pts[0].y}`;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const ctrlX = (curr.x + next.x) / 2;
      d += ` C ${ctrlX} ${curr.y}, ${ctrlX} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const linePath = buildSmoothPath(coords);
  const areaPath = coords.length
    ? `${linePath} L ${width} ${height} L 0 ${height} Z`
    : '';

  const activePoint = hoveredIdx !== null ? coords[hoveredIdx] : coords[Math.floor(coords.length / 2)];
  const rawLeftPercent = activePoint ? (activePoint.x / width) * 100 : 50;

  return (
    <div
      className={styles.statCard}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div className={styles.statCardHeader}>
        <span className={styles.statCardTitle}>{title}</span>
        <strong className={styles.statCardNumber} style={{ color }}>
          {totalValue}
        </strong>
      </div>

      <div className={styles.sparklineWrapper}>
        {/* فقاعة التلميح العائمة مضبوطة الحدود */}
        {activePoint && (
          <div
            className={styles.floatingTooltip}
            style={{
              left: `clamp(46px, ${rawLeftPercent}%, calc(100% - 46px))`,
              top: `${Math.max(2, (activePoint.y / height) * 100 - 34)}%`,
              borderColor: color
            }}
          >
            <span>{activePoint.label}</span>
            <strong style={{ color }}>{activePoint.value}</strong>
          </div>
        )}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className={styles.sparklineSvg}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.24" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <path d={areaPath} fill={`url(#${gradientId})`} className={styles.areaFadeIn} />
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2.8"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className={styles.animatedLine}
          />
        </svg>

        {/* نقاط التفاعل فوق المنحنى بدون تشويه الأبعاد */}
        <div className={styles.pointsOverlay}>
          {coords.map((pt, idx) => {
            const leftPct = (pt.x / width) * 100;
            const topPct = (pt.y / height) * 100;
            const isEdge = idx === 0 || idx === coords.length - 1;

            return (
              <div
                key={idx}
                className={styles.htmlPointHitbox}
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <span
                  className={`${styles.htmlPointDot} ${
                    hoveredIdx === idx ? styles.htmlPointDotActive : ''
                  }`}
                  style={{
                    borderColor: color,
                    opacity: isEdge && hoveredIdx !== idx ? 0 : 1
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function OverviewTab({
  isAr = true,
  bookings = [],
  unconfirmedOrders = [],
  confirmedBookings = [],
  staffList = [],
  setActiveTab,
  parseNumber,
  getTimeSlotLabel,
  handleOpenDepositModal,
  handleDeleteBooking,
  handleOpenDetails
}) {
  const [todayIdx, setTodayIdx] = useState(0);
  const [hoveredBarIdx, setHoveredBarIdx] = useState(null);

  // 1. إجمالي المبيعات المؤكدة
  const totalSales = useMemo(() => {
    return confirmedBookings.reduce((sum, b) => {
      const val = b.rawAmount ?? (parseNumber ? parseNumber(b.amount) : 0);
      return sum + val;
    }, 0);
  }, [confirmedBookings, parseNumber]);

  // 2. بيانات الـ 12 شهراً كاملة بالنسب المئوية (%)
  const monthlySalesData = useMemo(() => {
    const monthsAr = [
      'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان',
      'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    const monthsFr = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
      'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
    ];
    const labels = isAr ? monthsAr : monthsFr;

    const totalsByMonth = new Array(12).fill(0);
    confirmedBookings.forEach((b) => {
      if (!b.date) return;
      const m = new Date(b.date).getMonth();
      if (m >= 0 && m < 12) {
        const val = b.rawAmount ?? (parseNumber ? parseNumber(b.amount) : 0);
        totalsByMonth[m] += val;
      }
    });

    const maxMonthAmount = Math.max(...totalsByMonth, 0);

    return labels.map((label, idx) => {
      const amount = totalsByMonth[idx];
      const percentage = maxMonthAmount > 0 ? Math.round((amount / maxMonthAmount) * 100) : 0;
      return { label, amount, percentage };
    });
  }, [confirmedBookings, isAr, parseNumber]);

  // 3. طلبيات اليوم
  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = useMemo(() => {
    const exactToday = bookings.filter((b) => b.date === todayStr && b.status !== 'cancelled');
    if (exactToday.length > 0) return exactToday;
    return bookings.filter((b) => b.status !== 'cancelled');
  }, [bookings, todayStr]);

  const safeTodayIdx = todayOrders.length > 0 ? todayIdx % todayOrders.length : 0;
  const currentTodayOrder = todayOrders[safeTodayIdx];

  // 4. توليد آخر 4 أشهر تلقائياً للبطاقات الثلاث العلوية
  const { ordersTrend, pendingTrend, staffTrend } = useMemo(() => {
    const monthsAr = [
      'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان',
      'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    const monthsFr = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
      'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
    ];
    const monthNames = isAr ? monthsAr : monthsFr;
    const now = new Date();

    const last4Months = [];
    for (let i = 3; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last4Months.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        label: monthNames[d.getMonth()]
      });
    }

    const ordersData = last4Months.map((m) => {
      const count = bookings.filter((b) => {
        if (!b.date) return false;
        const bd = new Date(b.date);
        return bd.getFullYear() === m.year && bd.getMonth() === m.month;
      }).length;
      return { label: m.label, value: count };
    });

    const pendingData = last4Months.map((m) => {
      const count = unconfirmedOrders.filter((b) => {
        if (!b.date) return false;
        const bd = new Date(b.date);
        return bd.getFullYear() === m.year && bd.getMonth() === m.month;
      }).length;
      return { label: m.label, value: count };
    });

    const staffData = last4Months.map((m) => ({
      label: m.label,
      value: staffList.length || 1
    }));

    return {
      ordersTrend: ordersData,
      pendingTrend: pendingData,
      staffTrend: staffData
    };
  }, [bookings, unconfirmedOrders, staffList, isAr]);

  return (
    <div className={styles.overviewContainer}>
      <div className={styles.pageTitleBar}>
        <h2 className={styles.pageMainTitle}>
          {isAr ? 'الإحصائيات' : 'Statistiques'}
        </h2>
      </div>

      {/* الصف الأول: 3 بطاقات إحصائية لآخر 4 أشهر */}
      <section className={styles.topStatsGrid}>
        <StatSparklineCard
          title={isAr ? 'الطلبات' : 'Total Demandes'}
          totalValue={bookings.length}
          points={ordersTrend}
          color="#0052cc"
          gradientId="gradOrders"
          delay={0}
          onClick={() => setActiveTab && setActiveTab('orders')}
        />

        <StatSparklineCard
          title={isAr ? 'الطلبات المعلّقة' : 'En attente'}
          totalValue={unconfirmedOrders.length}
          points={pendingTrend}
          color="#d97706"
          gradientId="gradPending"
          delay={80}
          onClick={() => setActiveTab && setActiveTab('orders')}
        />

        <StatSparklineCard
          title={isAr ? 'إجمالي العمال' : 'Équipe & Staff'}
          totalValue={staffList.length}
          points={staffTrend}
          color="#059669"
          gradientId="gradStaff"
          delay={160}
          onClick={() => setActiveTab && setActiveTab('staff')}
        />
      </section>

      {/* الصف الثاني: طلبيات اليوم + رسم المبيعات لـ 12 شهراً بالنسب المئوية */}
      <section className={styles.bottomMainGrid}>
        <div className={styles.todayOrdersPanel}>
          <div className={styles.panelTopHeader}>
            <h3 className={styles.panelSubTitle}>
              {isAr ? 'طلبيات اليوم' : 'Demandes du jour'}
            </h3>

            {todayOrders.length > 1 && (
              <div className={styles.sliderControls}>
                <button
                  type="button"
                  className={styles.sliderBtn}
                  onClick={() =>
                    setTodayIdx((prev) => (prev - 1 + todayOrders.length) % todayOrders.length)
                  }
                >
                  <IconChevronRight />
                </button>
                <span className={styles.sliderCounter}>
                  {safeTodayIdx + 1} / {todayOrders.length}
                </span>
                <button
                  type="button"
                  className={styles.sliderBtn}
                  onClick={() => setTodayIdx((prev) => (prev + 1) % todayOrders.length)}
                >
                  <IconChevronLeft />
                </button>
              </div>
            )}
          </div>

          {currentTodayOrder ? (
            <OrderCard
              key={currentTodayOrder.id}
              item={currentTodayOrder}
              isAr={isAr}
              parseNumber={parseNumber}
              getTimeSlotLabel={getTimeSlotLabel}
              handleOpenDepositModal={handleOpenDepositModal}
              handleDeleteBooking={handleDeleteBooking}
              handleOpenDetails={handleOpenDetails}
            />
          ) : (
            <div className={styles.emptyTodayBox}>
              <span>📅</span>
              <p>{isAr ? 'لا توجد طلبيات مسجلة حالياً' : 'Aucune demande enregistrée'}</p>
            </div>
          )}
        </div>

        {/* بطاقة المبيعات (12 شهراً + نسبة مئوية %) */}
        <div className={styles.salesChartPanel}>
          <div className={styles.salesHeader}>
            <span className={styles.panelSubTitle}>{isAr ? 'المبيعات' : 'Ventes'}</span>
          </div>

          <div className={styles.salesBodyGrid}>
            <div className={styles.salesTotalCol}>
              <strong className={styles.salesBigNumber}>
                {totalSales.toLocaleString()} <span>{isAr ? 'دج' : 'DA'}</span>
              </strong>
              <span className={styles.salesHint}>
                {isAr ? 'إجمالي المداخيل المؤكدة' : 'Revenus confirmés'}
              </span>
            </div>

            <div className={styles.barChartArea}>
              {/* خطوط الشبكة الأفقية بالنسب المئوية من 0% إلى 100% */}
              <div className={styles.chartGridLines}>
                {[100, 80, 60, 40, 20, 0].map((percentTick) => (
                  <div key={percentTick} className={styles.gridLineRow}>
                    <span className={styles.yAxisLabel}>{percentTick}%</span>
                    <div className={styles.gridLine} />
                  </div>
                ))}
              </div>

              {/* أعمدة الـ 12 شهراً */}
              <div className={styles.barsContainer}>
                {monthlySalesData.map((bar, idx) => {
                  const heightPercent = Math.min(100, Math.max(bar.percentage, 3));
                  const isHovered = hoveredBarIdx === idx;

                  return (
                    <div
                      key={idx}
                      className={styles.barColumn}
                      onMouseEnter={() => setHoveredBarIdx(idx)}
                      onMouseLeave={() => setHoveredBarIdx(null)}
                    >
                      {isHovered && (
                        <div className={styles.barTooltip}>
                          <span>{bar.label}</span>
                          <strong>{bar.percentage}%</strong>
                          {bar.amount > 0 && (
                            <small>{bar.amount.toLocaleString()} دج</small>
                          )}
                        </div>
                      )}

                      <div className={styles.barTrack}>
                        <div
                          className={`${styles.barFill} ${isHovered ? styles.barFillActive : ''}`}
                          style={{
                            height: `${heightPercent}%`,
                            animationDelay: `${idx * 55}ms`
                          }}
                        />
                      </div>
                      <span className={styles.xAxisLabel}>{bar.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}