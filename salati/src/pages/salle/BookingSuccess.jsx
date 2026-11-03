import { useState, useEffect } from 'react';
import styles from './BookingSuccess.module.css';

const translations = {
  ar: {
    title: 'تم استلام طلبك بنجاح! 🎉',
    subtitle: 'شكراً لاستخدامك منصة salati. تم إرسال تفاصيل طلبك مباشرة لإدارة الصالة.',
    detailsTitle: 'ملخص تفاصيل الطلب',
    hallName: 'قاعة الملكة للأفراح والمناسبات',
    wilaya: '16 - الجزائر (الشراقة)',
    nextStepsTitle: 'ما هي الخطوة القادمة؟',
    step1: 'ستقوم إدارة الصالة بمراجعة التوافر في التاريخ المحدد.',
    step2: 'سيتصل بك مسؤول الحجوزات عبر الهاتف لتأكيد الموعد النهائي.',
    backToHall: 'العودة لصفحة الصالة',
    homeBtn: 'الانتقال للرئيسية'
  },
  fr: {
    title: 'Demande reçue avec succès ! 🎉',
    subtitle: 'Merci d’utiliser salati. Les détails ont été transmis à l’administration de la salle.',
    detailsTitle: 'Récapitulatif de la demande',
    hallName: 'Salle El Malika des Fêtes',
    wilaya: '16 - Alger (Chéraga)',
    nextStepsTitle: 'Prochaines étapes',
    step1: 'L’administration vérifiera la disponibilité à la date choisie.',
    step2: 'Le responsable vous contactera par téléphone pour tout confirmer.',
    backToHall: 'Retour à la salle',
    homeBtn: 'Accueil'
  }
};

export default function BookingSuccess() {
  const [lang, setLang] = useState(document.documentElement.lang || 'ar');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLang(document.documentElement.lang || 'ar');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  const t = translations[lang] || translations.ar;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.iconCircle}>✓</div>
        
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>

        <div className={styles.infoBox}>
          <h3>{t.detailsTitle}</h3>
          <div className={styles.infoRow}>
            <span>الصالة:</span>
            <strong>{t.hallName}</strong>
          </div>
          <div className={styles.infoRow}>
            <span>الموقع:</span>
            <strong>{t.wilaya}</strong>
          </div>
        </div>

        <div className={styles.nextSteps}>
          <h4>{t.nextStepsTitle}</h4>
          <ul>
            <li>1. {t.step1}</li>
            <li>2. {t.step2}</li>
          </ul>
        </div>

        <div className={styles.btnGroup}>
          <a href="/hall/demo" className={styles.primaryBtn}>{t.backToHall}</a>
          <a href="/" className={styles.secondaryBtn}>{t.homeBtn}</a>
        </div>
      </div>
    </div>
  );
}