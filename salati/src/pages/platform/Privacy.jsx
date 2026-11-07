import { useState, useEffect } from 'react';
import styles from './LegalPages.module.css';

const content = {
  ar: {
    title: 'سياسة الخصوصية (Privacy Policy)',
    lastUpdated: 'آخر تحديث: نوفمبر 2026',
    s1Title: '1. البيانات التي نجمعها',
    s1Desc: 'نجمع البيانات الضرورية لتقديم الخدمة فقط، مثل: اسم الصالة، اسم المالك، رقم الهاتف، البريد الإلكتروني، والولايات والخدمات التي تقدمها صالتك.',
    s2Title: '2. كيفية استخدام البيانات',
    s2Desc: 'نستخدم بياناتك لتشغيل منصتك المصغرة، وتسهيل تواصل الزبائن معك لطلب المعاينات والحجز، وتفعيل التنبيهات عبر الرسائل النصية القصيرة (SMS) والواتساب.',
    s3Title: '3. حماية وأمان البيانات',
    s3Desc: 'نحن نلتزم بحماية بياناتك باستخدام أحدث تقنيات التشفير السحابية عبر قواعد بيانات Supabase. لن نبيع أو نشارك بياناتك أو قوائم زبائنك مع أي طرف ثالث لأغراض تسويقية.',
    s4Title: '4. ملفات تعريف الارتباط (Cookies)',
    s4Desc: 'نستخدم ملفات تعريف الارتباط الأساسية لضمان بقاء جلسة تسجيل دخولك نشطة ولتحسين أداء الواجهة وتجربة المستخدم فقط.',
    s5Title: '5. التواصل معنا',
    s5Desc: 'إذا كان لديك أي استفسار حول سياسة الخصوصية، يمكنك التواصل معنا عبر البريد الإلكتروني: contact@salati.work.'
  },
  fr: {
    title: 'Politique de Confidentialité',
    lastUpdated: 'Dernière mise à jour : Novembre 2026',
    s1Title: '1. Données collectées',
    s1Desc: 'Nous collectons uniquement les informations nécessaires au bon fonctionnement du service : nom de la salle, nom du propriétaire, numéro de téléphone, e-mail, wilaya et prestations proposées.',
    s2Title: '2. Utilisation des données',
    s2Desc: 'Vos données sont utilisées pour alimenter votre minisite dédié, faciliter les demandes de visites et de réservations de vos clients, et vous envoyer des notifications système (SMS/WhatsApp).',
    s3Title: '3. Sécurité et protection des données',
    s3Desc: 'Nous protégeons vos informations grâce aux technologies de cryptage cloud avancées avec Supabase. Nous ne vendons et ne partageons aucune de vos données ou de vos listes de clients à des tiers.',
    s4Title: '4. Fichiers témoins (Cookies)',
    s4Desc: 'Nous utilisons des cookies essentiels uniquement pour maintenir votre session active et optimiser la vitesse et les performances de la plateforme.',
    s5Title: '5. Nous contacter',
    s5Desc: 'Pour toute question concernant notre politique de confidentialité, n\'hésitez pas à nous contacter par e-mail à : contact@salati.work.'
  }
};

export default function Privacy() {
  const [lang, setLang] = useState(document.documentElement.lang || 'ar');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLang(document.documentElement.lang || 'ar');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang']
    });

    return () => observer.disconnect();
  }, []);

  const t = content[lang] || content.ar;

  return (
    <div className={styles.legalContainer}>
      <div className={styles.legalHeader}>
        <h1>{t.title}</h1>
        <p>{t.lastUpdated}</p>
      </div>

      <div className={styles.legalContent}>
        <section>
          <h2>{t.s1Title}</h2>
          <p>{t.s1Desc}</p>
        </section>

        <section>
          <h2>{t.s2Title}</h2>
          <p>{t.s2Desc}</p>
        </section>

        <section>
          <h2>{t.s3Title}</h2>
          <p>{t.s3Desc}</p>
        </section>

        <section>
          <h2>{t.s4Title}</h2>
          <p>{t.s4Desc}</p>
        </section>

        <section>
          <h2>{t.s5Title}</h2>
          <p>{t.s5Desc}</p>
        </section>
      </div>
    </div>
  );
}