import { useState, useEffect } from 'react';
import styles from './WhatsAppWidget.module.css';

const IconWhatsAppOfficial = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.398A9.954 9.954 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 0 1-4.062-1.107l-.291-.173-3.02.848.861-2.946-.19-.303A7.957 7.957 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.406-5.856c-.242-.121-1.432-.707-1.654-.788-.222-.08-.383-.121-.545.121-.162.242-.626.788-.767.95-.141.161-.283.181-.525.06-.242-.121-1.025-.378-1.952-1.205-.722-.644-1.21-1.44-1.351-1.682-.141-.242-.015-.373.106-.494.109-.109.242-.283.363-.424.121-.141.162-.242.242-.404.08-.162.04-.303-.02-.424-.06-.121-.545-1.312-.747-1.796-.196-.473-.396-.408-.545-.416l-.464-.008c-.162 0-.424.06-.646.303-.222.242-.848.828-.848 2.02 0 1.192.868 2.343.989 2.505.121.161 1.708 2.608 4.138 3.657.578.25 1.03.399 1.382.511.58.184 1.108.158 1.525.096.465-.069 1.432-.586 1.634-1.152.202-.566.202-1.05.141-1.152-.06-.101-.222-.161-.464-.283z"
      fill="#FFFFFF"
    />
  </svg>
);

export default function WhatsAppWidget() {
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

  const isAr = lang === 'ar';
  const whatsappNumber = "213550000000"; // استبدله برقمك الخاص
  const defaultMessage = isAr 
    ? "مرحباً منصة salati، أرغب في استفسار حول تفعيل حساب صالتي." 
    : "Bonjour salati, je souhaite me renseigner sur l'activation de ma salle.";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={styles.whatsappCircularBtn}
      title={isAr ? "تحدث معنا عبر الواتساب" : "Contactez-nous sur WhatsApp"}
      aria-label="WhatsApp"
    >
      <div className={styles.pulseRing}></div>
      <IconWhatsAppOfficial />
    </a>
  );
}