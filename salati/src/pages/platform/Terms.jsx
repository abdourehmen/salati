import { useState, useEffect } from 'react';
import styles from './LegalPages.module.css';

const content = {
  ar: {
    title: 'شروط الخدمة (Terms of Service)',
    lastUpdated: 'آخر تحديث: نوفمبر 2026',
    s1Title: '1. القبول بالشروط',
    s1Desc: 'بمجرد إنشائك لحساب أو استخدامك لمنصة salati (salati.work)، فإنك توافق التام على الالتزام بشروط الخدمة هذه وكافة السياسات المتعلقة بها.',
    s2Title: '2. وصف الخدمة',
    s2Desc: 'تقدم منصة salati نظاماً سحابياً لإدارة صالات الأفراح وقاعات الفعاليات في الجزائر، يتيح للمشتركين إنشاء مواقع مصغرة لعرض التوافر، جدول الحجوزات، وإدارة المعاينات الميدانية.',
    s3Title: '3. الاشتراكات والمدفوعات',
    s3Desc: 'تعتمد المنصة على خطط اشتراك دورية (شهري، 6 أشهر، سنوي). لا تتقاضى المنصة أي عمولة أو نسبة مئوية على الحجوزات، وجميع العرابين والمدفوعات تتم مباشرة بين صاحب الصالة وزبائنه.',
    s4Title: '4. مسؤولية الحساب والبيانات',
    s4Desc: 'يتحمل صاحب الصالة المسؤولية الكاملة عن صحة ودقة البيانات والمعلومات والصور التي يتم نشرها عبر موقعه المصغر، وعن الحفاظ على سرية بيانات الدخول لنسخته.',
    s5Title: '5. إلغاء الخدمة وإنهاء الاشتراك',
    s5Desc: 'يحق لك إلغاء أو تغيير خطة اشتراكك في أي وقت. في حال التوقف عن السداد، تحتفظ المنصة بالحق في إيقاف مؤقت للرابط الخاص ببراند صالتك حتى تجديد الاشتراك.'
  },
  fr: {
    title: 'Conditions d\'Utilisation',
    lastUpdated: 'Dernière mise à jour : Novembre 2026',
    s1Title: '1. Acceptation des conditions',
    s1Desc: 'En créant un compte ou en utilisant la plateforme salati (salati.work), vous acceptez pleinement d\'être lié par ces conditions d\'utilisation et toutes les politiques associées.',
    s2Title: '2. Description du service',
    s2Desc: 'salati propose un système cloud de gestion pour les salles des fêtes et complexes d\'événements en Algérie, permettant de créer des minisites dédiés pour afficher la disponibilité, le calendrier des réservations et gérer les visites.',
    s3Title: '3. Abonnements et paiements',
    s3Desc: 'La plateforme repose sur des forfaits d\'abonnement périodiques (mensuel, 6 mois, annuel). Aucune commission n\'est prélevée sur les réservations. Tous les acomptes et règlements s\'effectuent directement entre le propriétaire de la salle et ses clients.',
    s4Title: '4. Responsabilité du compte et des données',
    s4Desc: 'Le propriétaire de la salle est entièrement responsable de l\'exactitude des informations, images et tarifs publiés sur son minisite, ainsi que de la confidentialité de ses accès.',
    s5Title: '5. Annulation et résiliation',
    s5Desc: 'Vous pouvez modifier ou annuler votre abonnement à tout moment. En cas de non-renouvellement, la plateforme se réserve le droit de suspendre temporairement le lien de votre minisite.'
  }
};

export default function Terms() {
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