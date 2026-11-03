import { useState, useEffect } from 'react';
import styles from './AdminDashboard.module.css';

// بيانات تجريبية للصالات المسجلة في المنصة
const INITIAL_HALLS = [
  { id: 1, name: 'قاعة الملكة للأفراح', owner: 'محمد بن علي', wilaya: '16 - الجزائر', plan: 'سنوي (Pro)', status: 'active', joinDate: '2026-10-01' },
  { id: 2, name: 'قاعة الألماس', owner: 'سليم حداد', wilaya: '31 - وهران', plan: 'شهري (Basic)', status: 'active', joinDate: '2026-10-15' },
  { id: 3, name: 'قاعة الأندلس', owner: 'عبد القادر رحماني', wilaya: '25 - قسنطينة', plan: 'تجريبي (Trial)', status: 'pending', joinDate: '2026-11-01' },
  { id: 4, name: 'قاعة النخيل', owner: 'مراد بلعيد', wilaya: '07 - بسكرة', plan: 'منتهي', status: 'expired', joinDate: '2026-08-20' }
];

const translations = {
  ar: {
    portalTitle: 'لوحة التحكم الرئيسية (Super Admin)',
    portalSubtitle: 'مراقبة وإدارة كافة الصالات والاشتراكات عبر 58 ولاية.',
    statTotalHalls: 'إجمالي الصالات',
    statActiveSubs: 'الاشتراكات النشطة',
    statPendingApps: 'طلبات التفعيل المعلقة',
    statTotalRevenue: 'الدخل الشهري الإجمالي',
    tableTitle: 'قائمة الصالات المسجلة',
    searchPlaceholder: 'البحث باسم الصالة، مالكها أو الولاية...',
    filterAll: 'جميع الحالات',
    filterActive: 'نشطة',
    filterPending: 'قيد التفعيل',
    filterExpired: 'منتهية',
    colHall: 'الصالة',
    colOwner: 'المالك',
    colWilaya: 'الولاية',
    colPlan: 'خطة الاشتراك',
    colStatus: 'حالة الحساب',
    colJoinDate: 'تاريخ الانضمام',
    colActions: 'الإجراءات',
    btnActivate: 'تفعيل',
    btnFreeze: 'تجميد',
    statusActive: 'نشط',
    statusPending: 'قيد المراجعة',
    statusExpired: 'منتهي',
    noHalls: 'لا توجد صالات تطابق نتائج البحث.'
  },
  fr: {
    portalTitle: 'Portail Super Admin',
    portalSubtitle: 'Gestion et suivi de toutes les salles et abonnements à travers les 58 wilayas.',
    statTotalHalls: 'Total des Salles',
    statActiveSubs: 'Abonnements Actifs',
    statPendingApps: 'Demandes en Attente',
    statTotalRevenue: 'Revenu Mensuel Total',
    tableTitle: 'Liste des Salles Inscrites',
    searchPlaceholder: 'Rechercher par salle, propriétaire ou wilaya...',
    filterAll: 'Tous les statuts',
    filterActive: 'Actives',
    filterPending: 'En attente',
    filterExpired: 'Expirées',
    colHall: 'Salle',
    colOwner: 'Propriétaire',
    colWilaya: 'Wilaya',
    colPlan: 'Formule',
    colStatus: 'Statut',
    colJoinDate: 'Date d\'inscription',
    colActions: 'Actions',
    btnActivate: 'Activer',
    btnFreeze: 'Geler',
    statusActive: 'Actif',
    statusPending: 'En révision',
    statusExpired: 'Expiré',
    noHalls: 'Aucune salle ne correspond à la recherche.'
  }
};

export default function AdminDashboard() {
  const [lang, setLang] = useState(document.documentElement.lang || 'ar');
  const [halls, setHalls] = useState(INITIAL_HALLS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLang(document.documentElement.lang || 'ar');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  const toggleStatus = (id) => {
    setHalls(halls.map(h => {
      if (h.id === id) {
        const nextStatus = h.status === 'active' ? 'expired' : 'active';
        return { ...h, status: nextStatus };
      }
      return h;
    }));
  };

  const filteredHalls = halls.filter(h => {
    const matchesSearch = h.name.includes(searchTerm) || h.owner.includes(searchTerm) || h.wilaya.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || h.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const t = translations[lang] || translations.ar;

  return (
    <div className={styles.adminWrapper}>
      <div className={styles.container}>
        
        {/* الترويسة العليا */}
        <header className={styles.adminHeader}>
          <div>
            <h1 className={styles.title}>
              {t.portalTitle} <span className={styles.badge}>salati system</span>
            </h1>
            <p className={styles.subtitle}>{t.portalSubtitle}</p>
          </div>
        </header>

        {/* بطاقات الإحصائيات العامة للمنصة */}
        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🏛️</div>
            <div>
              <h3>{halls.length}</h3>
              <p>{t.statTotalHalls}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>⚡</div>
            <div>
              <h3>{halls.filter(h => h.status === 'active').length}</h3>
              <p>{t.statActiveSubs}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📑</div>
            <div>
              <h3>{halls.filter(h => h.status === 'pending').length}</h3>
              <p>{t.statPendingApps}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>💰</div>
            <div>
              <h3>450,000 دج</h3>
              <p>{t.statTotalRevenue}</p>
            </div>
          </div>
        </section>

        {/* أدوات البحث والتصفية وجدول الصالات */}
        <section className={styles.tableSection}>
          <div className={styles.tableHeaderControls}>
            <h2 className={styles.sectionTitle}>{t.tableTitle}</h2>
            
            <div className={styles.controlsGroup}>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                className={styles.filterSelect}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">{t.filterAll}</option>
                <option value="active">{t.filterActive}</option>
                <option value="pending">{t.filterPending}</option>
                <option value="expired">{t.filterExpired}</option>
              </select>
            </div>
          </div>

          {/* الجدول المتجاوب */}
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t.colHall}</th>
                  <th>{t.colOwner}</th>
                  <th>{t.colWilaya}</th>
                  <th>{t.colPlan}</th>
                  <th>{t.colStatus}</th>
                  <th>{t.colJoinDate}</th>
                  <th>{t.colActions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredHalls.length === 0 ? (
                  <tr>
                    <td colSpan="7" className={styles.emptyCell}>{t.noHalls}</td>
                  </tr>
                ) : (
                  filteredHalls.map((hall) => (
                    <tr key={hall.id}>
                      <td><strong>{hall.name}</strong></td>
                      <td>{hall.owner}</td>
                      <td>{hall.wilaya}</td>
                      <td><span className={styles.planTag}>{hall.plan}</span></td>
                      <td>
                        <span className={`${styles.badgeStatus} ${
                          hall.status === 'active' 
                            ? styles.statusActive 
                            : hall.status === 'pending' 
                            ? styles.statusPending 
                            : styles.statusExpired
                        }`}>
                          {hall.status === 'active' ? t.statusActive : hall.status === 'pending' ? t.statusPending : t.statusExpired}
                        </span>
                      </td>
                      <td className={styles.dateTd}>{hall.joinDate}</td>
                      <td>
                        <button
                          className={`${styles.actionBtn} ${hall.status === 'active' ? styles.btnFreeze : styles.btnActivate}`}
                          onClick={() => toggleStatus(hall.id)}
                        >
                          {hall.status === 'active' ? t.btnFreeze : t.btnActivate}
                        </button>
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