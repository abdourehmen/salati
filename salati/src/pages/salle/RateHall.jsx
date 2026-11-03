import { useState, useEffect } from 'react';
import styles from './RateHall.module.css';

const translations = {
  ar: {
    title: 'شاركنا رأيك في قاعة الملكة',
    subtitle: 'تقييمك يساعدنا ويساعد العائلات الأخرى في اختيار الصالة المناسبة.',
    ratingLabel: 'اختر تقييمك من 5 نجوم:',
    commentLabel: 'تعليقك أو انطباعك عن الصالة:',
    commentPlaceholder: 'اكتب تجربتك هنا...',
    nameLabel: 'اسمك (اختياري):',
    namePlaceholder: 'أحمد',
    submitBtn: 'إرسال التقييم',
    googleMapsBtn: '📍 قيمنا أيضاً على Google Maps',
    successMsg: 'شكراً جزيلاً لتقييمك! ❤️'
  },
  fr: {
    title: 'Donnez votre avis sur Salle El Malika',
    subtitle: 'Votre avis aide notre équipe et d’autres familles à bien choisir.',
    ratingLabel: 'Notez sur 5 étoiles :',
    commentLabel: 'Votre commentaire ou remarque :',
    commentPlaceholder: 'Partagez votre expérience ici...',
    nameLabel: 'Nom (optionnel) :',
    namePlaceholder: 'Ahmed',
    submitBtn: 'Envoyer l’avis',
    googleMapsBtn: '📍 Évaluez-nous sur Google Maps',
    successMsg: 'Merci beaucoup pour votre avis ! ❤️'
  }
};

export default function RateHall() {
  const [lang, setLang] = useState(document.documentElement.lang || 'ar');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLang(document.documentElement.lang || 'ar');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const t = translations[lang] || translations.ar;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* اختيار النجوم */}
            <div className={styles.starsGroup}>
              <label>{t.ratingLabel}</label>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`${styles.starBtn} ${star <= rating ? styles.activeStar : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* الاسم */}
            <div className={styles.inputGroup}>
              <label>{t.nameLabel}</label>
              <input
                type="text"
                placeholder={t.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* التعليق */}
            <div className={styles.inputGroup}>
              <label>{t.commentLabel}</label>
              <textarea
                rows="4"
                required
                placeholder={t.commentPlaceholder}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className={styles.submitBtn}>{t.submitBtn}</button>

            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noreferrer" 
              className={styles.googleBtn}
            >
              {t.googleMapsBtn}
            </a>
          </form>
        ) : (
          <div className={styles.successBox}>
            <div className={styles.successHeart}>⭐</div>
            <h2>{t.successMsg}</h2>
          </div>
        )}
      </div>
    </div>
  );
}