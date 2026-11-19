import React from 'react';

export function DashboardSkeleton({ isAr = true }) {
  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      style={{
        padding: '1.25rem',
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}
    >
      {/* شريط العنوان */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ width: '240px' }}>
          <span className="skeleton-box skeleton-title" style={{ width: '100%', marginBottom: '0.5rem' }} />
          <span className="skeleton-box skeleton-text" style={{ width: '70%' }} />
        </div>
        <span className="skeleton-box" style={{ width: '150px', height: '42px' }} />
      </div>

      {/* بطاقات الإحصائيات (KPIs) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem'
        }}
      >
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              padding: '1.15rem',
              border: '1px solid #e2e8f0'
            }}
          >
            <span className="skeleton-box skeleton-text" style={{ width: '55%', marginBottom: '0.85rem' }} />
            <span className="skeleton-box skeleton-title" style={{ width: '40%', height: '30px' }} />
          </div>
        ))}
      </div>

      {/* منطقة المحتوى / الجدول */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '1.25rem',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.9rem'
        }}
      >
        {[1, 2, 3, 4, 5].map((row) => (
          <div
            key={row}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              gap: '1rem',
              alignItems: 'center',
              padding: '0.6rem 0',
              borderBottom: row < 5 ? '1px solid #f1f5f9' : 'none'
            }}
          >
            <span className="skeleton-box skeleton-text" style={{ width: '80%' }} />
            <span className="skeleton-box skeleton-text" style={{ width: '60%' }} />
            <span className="skeleton-box" style={{ width: '90px', height: '30px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HallProfileSkeleton({ isAr = true }) {
  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ maxWidth: '1180px', margin: '0 auto', padding: '1rem' }}>
      {/* غلاف الصالة */}
      <span className="skeleton-box" style={{ width: '100%', height: 'clamp(220px, 38vw, 400px)', borderRadius: '22px', marginBottom: '1.25rem' }} />

      {/* معلومات الصالة */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: '1 1 280px' }}>
          <span className="skeleton-box skeleton-title" style={{ width: '60%', marginBottom: '0.6rem' }} />
          <span className="skeleton-box skeleton-text" style={{ width: '85%', marginBottom: '0.4rem' }} />
          <span className="skeleton-box skeleton-text" style={{ width: '45%' }} />
        </div>
        <span className="skeleton-box" style={{ width: '180px', height: '48px', borderRadius: '14px' }} />
      </div>

      {/* معرض الصور والتقويم */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        <span className="skeleton-box" style={{ height: '260px', borderRadius: '18px' }} />
        <span className="skeleton-box" style={{ height: '260px', borderRadius: '18px' }} />
      </div>
    </div>
  );
}