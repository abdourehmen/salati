import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import styles from './SiteSettingsTab.module.css';
import { IconCheck, IconPlus } from '../Icons';

export default function SiteSettingsTab({
  isAr = true,
  hallData,
  siteForm,
  setSiteForm,
  videoUrl,
  setVideoUrl,
  galleryImages = [],
  setGalleryImages,
  amenities = [],
  setAmenities,
  pricingPackages = [],
  setPricingPackages,
  handleSaveSiteSettings
}) {
  const [newSlotTitle, setNewSlotTitle] = useState('');
  const [newSlotPrice, setNewSlotPrice] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  const fileInputRef = useRef(null);

  const planTier = hallData?.plan_tier || 'basic';
  const canUseQrFeature = planTier === 'pro' || planTier === 'enterprise';
  const reviewUrl = (siteForm.google_review_url || '').trim();
  const qrImageUrl = reviewUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=${encodeURIComponent(reviewUrl)}`
    : '';

  // تحميل صورة QR Code
  const handleDownloadQr = async () => {
    if (!qrImageUrl) return;
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `qr-google-reviews-${siteForm.slug || 'salati'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(qrImageUrl, '_blank', 'noreferrer');
    }
  };

  // طباعة بطاقة تقييم جاهزة للضيوف
  const handlePrintQrCard = () => {
    if (!qrImageUrl) return;
    const printWindow = window.open('', '_blank', 'width=600,height=750');
    if (!printWindow) return;

    const hallTitle = siteForm.name || (isAr ? 'صالتنا' : 'Notre Salle');
    printWindow.document.write(`
      <html dir="${isAr ? 'rtl' : 'ltr'}">
        <head>
          <title>QR Google Maps - ${hallTitle}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: #ffffff;
              color: #0f172a;
            }
            .card {
              border: 3px solid #0052cc;
              border-radius: 28px;
              padding: 40px 32px;
              max-width: 400px;
              text-align: center;
            }
            h1 { margin: 0 0 10px; font-size: 26px; color: #0052cc; }
            p { margin: 0 0 24px; font-size: 16px; color: #475569; line-height: 1.6; }
            img { width: 240px; height: 240px; border-radius: 16px; border: 1px solid #e2e8f0; padding: 10px; }
            .stars { font-size: 26px; margin-top: 18px; letter-spacing: 4px; }
            .brand { margin-top: 18px; font-size: 12px; color: #94a3b8; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>${hallTitle}</h1>
            <p>${
              isAr
                ? 'سعدنا بحضوركم! امسح الكود بكاميرا هاتفك وشاركنا تقييمك على Google Maps'
                : 'Merci de votre visite ! Scannez ce QR Code pour nous laisser un avis sur Google Maps'
            }</p>
            <img src="${qrImageUrl}" alt="QR Code" onload="window.print();" />
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <div class="brand">Salati.work</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // إضافة وقت/باقة سعرية جديدة
  const handleAddPricing = () => {
    if (!newSlotTitle.trim() || !newSlotPrice.trim()) return;
    setPricingPackages([
      ...pricingPackages,
      { title: newSlotTitle.trim(), price: newSlotPrice.trim() }
    ]);
    setNewSlotTitle('');
    setNewSlotPrice('');
  };

  // رفع الصور من ملفات الجهاز إلى Supabase Storage
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadedUrls = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('hall-images')
          .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('hall-images')
          .getPublicUrl(fileName);

        if (data?.publicUrl) {
          uploadedUrls.push(data.publicUrl);
        }
      }

      if (uploadedUrls.length > 0) {
        setGalleryImages([...galleryImages, ...uploadedUrls]);
      }
    } catch (err) {
      console.error('خطأ في رفع الصور:', err);
      alert(
        isAr
          ? 'فشل رفع الصورة: ' + err.message
          : 'Erreur lors du téléchargement : ' + err.message
      );
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // إضافة ميزة جديدة للصالة
  const handleAddAmenity = () => {
    if (!newAmenity.trim()) return;
    setAmenities([...amenities, newAmenity.trim()]);
    setNewAmenity('');
  };

  return (
    <div className={styles.siteSettingsContainer}>
      {/* عنوان الصفحة */}
      <div className={styles.pageTitleBar}>
        <h2 className={styles.pageMainTitle}>
          {isAr ? 'الموقع الخاص بالصالة' : 'Site Web de la Salle'}
        </h2>
      </div>

      {/* الحاوية الرئيسية الكبيرة كما في التصميم */}
      <form className={styles.mainEditorCard} onSubmit={handleSaveSiteSettings}>
        {/* الصف العلوي: 5 حقول رئيسية */}
        <div className={styles.topFiveInputsGrid}>
          <div className={styles.pillFieldBox}>
            <label>{isAr ? 'اسم الصالة' : 'Nom de la salle'}</label>
            <input
              type="text"
              placeholder={isAr ? 'مثال: قاعة البهجة' : 'Ex: Salle El Bahdja'}
              value={siteForm.name || ''}
              onChange={(e) => setSiteForm({ ...siteForm, name: e.target.value })}
            />
          </div>

          <div className={styles.pillFieldBox}>
            <label>{isAr ? 'فيديو الصالة' : 'Vidéo (YouTube)'}</label>
            <input
              type="url"
              placeholder="https://youtube.com/..."
              value={videoUrl || ''}
              onChange={(e) => setVideoUrl && setVideoUrl(e.target.value)}
            />
          </div>

          <div className={styles.pillFieldBox}>
            <label>{isAr ? 'موقع الصالة' : 'Adresse / Ville'}</label>
            <input
              type="text"
              placeholder={isAr ? 'الجزائر العاصمة...' : 'Alger...'}
              value={siteForm.visiting_hours || ''}
              onChange={(e) =>
                setSiteForm({ ...siteForm, visiting_hours: e.target.value })
              }
            />
          </div>

          <div className={styles.pillFieldBox}>
            <label>{isAr ? 'رابط موقع الصالة' : 'Lien ou code HTML Google Maps'}</label>
            <input
              type="text"
              placeholder={isAr ? 'ضع كود HTML (<iframe...>) أو رابط الخريطة' : 'Collez le code HTML ou lien Maps...'}
              value={siteForm.map_url || ''}
              onChange={(e) =>
                setSiteForm({ ...siteForm, map_url: e.target.value })
              }
            />
          </div>

          <div className={styles.pillFieldBox}>
            <label>{isAr ? 'وصف الصالة' : 'Description'}</label>
            <input
              type="text"
              placeholder={isAr ? 'نبذة مختصرة عن القاعة...' : 'Description courte...'}
              value={siteForm.description || ''}
              onChange={(e) =>
                setSiteForm({ ...siteForm, description: e.target.value })
              }
            />
          </div>
        </div>

        <hr className={styles.sectionDivider} />

        {/* الصف السفلي: 3 أعمدة (الأوقات والأسعار | الصور | المميزات) */}
        <div className={styles.threeColumnsGrid}>
          {/* العمود 1 (يمين): إضافة أوقات مع الأسعار */}
          <div className={styles.columnCard}>
            <div className={styles.columnHeaderPill}>
              {isAr ? 'إضافة أوقات مع الأسعار' : 'Créneaux & Tarifs'}
            </div>

            <div className={styles.inlineAddGroup}>
              <input
                type="text"
                placeholder={isAr ? 'الفترة (مثال: المساء)' : 'Créneau'}
                value={newSlotTitle}
                onChange={(e) => setNewSlotTitle(e.target.value)}
              />
              <input
                type="number"
                placeholder={isAr ? 'السعر (دج)' : 'Prix (DA)'}
                value={newSlotPrice}
                onChange={(e) => setNewSlotPrice(e.target.value)}
              />
              <button
                type="button"
                className={styles.miniAddBtn}
                onClick={handleAddPricing}
                title={isAr ? 'إضافة' : 'Ajouter'}
              >
                <IconPlus />
              </button>
            </div>

            <div className={styles.itemsListStack}>
              {pricingPackages.length === 0 ? (
                <div className={styles.emptySlotHint}>
                  {isAr ? 'لم يتم إضافة فترات وأسعار بعد' : 'Aucun tarif ajouté'}
                </div>
              ) : (
                pricingPackages.map((pkg, idx) => (
                  <div key={idx} className={styles.listItemPill}>
                    <span className={styles.itemMainText}>{pkg.title}</span>
                    <strong className={styles.itemPriceTag}>
                      {Number(pkg.price).toLocaleString()} {isAr ? 'دج' : 'DA'}
                    </strong>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      onClick={() =>
                        setPricingPackages(
                          pricingPackages.filter((_, i) => i !== idx)
                        )
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* العمود 2 (وسط): إضافة صور من الملفات */}
          <div className={styles.columnCard}>
            <div className={styles.columnHeaderPill}>
              {isAr ? 'إضافة صور' : 'Ajouter des photos'}
            </div>

            <div className={styles.inlineAddGroup}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <input
                type="text"
                readOnly
                onClick={() => !uploadingImages && fileInputRef.current?.click()}
                style={{ cursor: uploadingImages ? 'wait' : 'pointer' }}
                value={
                  uploadingImages
                    ? isAr
                      ? 'جاري رفع الصور...'
                      : 'Téléchargement...'
                    : isAr
                    ? 'اختر صوراً من ملفات الجهاز...'
                    : 'Choisir des photos depuis l’appareil...'
                }
              />
              <button
                type="button"
                className={styles.miniAddBtn}
                disabled={uploadingImages}
                onClick={() => fileInputRef.current?.click()}
                title={isAr ? 'اختيار صور' : 'Choisir des photos'}
              >
                <IconPlus />
              </button>
            </div>

            <div className={styles.photosPreviewGrid}>
              {galleryImages.length === 0 ? (
                <div className={styles.emptyPhotoBox}>
                  <span>🖼️</span>
                  <small>
                    {isAr
                      ? 'ارفع صور الصالة من جهازك لتظهر في المعرض'
                      : 'Ajoutez des photos de la salle'}
                  </small>
                </div>
              ) : (
                galleryImages.map((imgUrl, idx) => (
                  <div key={idx} className={styles.photoThumbItem}>
                    <img src={imgUrl} alt={`hall-${idx}`} />
                    <button
                      type="button"
                      className={styles.deletePhotoBtn}
                      onClick={() =>
                        setGalleryImages(galleryImages.filter((_, i) => i !== idx))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* العمود 3 (يسار): إضافة مميزات الصالة */}
          <div className={styles.columnCard}>
            <div className={styles.columnHeaderPill}>
              {isAr ? 'إضافة مميزات الصالة' : 'Équipements & Atouts'}
            </div>

            <div className={styles.inlineAddGroup}>
              <input
                type="text"
                placeholder={
                  isAr ? 'مثال: موقف سيارات، تكييف...' : 'Ex: Parking, Climatisation...'
                }
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
              />
              <button
                type="button"
                className={styles.miniAddBtn}
                onClick={handleAddAmenity}
                title={isAr ? 'إضافة ميزة' : 'Ajouter'}
              >
                <IconPlus />
              </button>
            </div>

            <div className={styles.itemsListStack}>
              {amenities.length === 0 ? (
                <div className={styles.emptySlotHint}>
                  {isAr ? 'لم يتم إضافة مميزات بعد' : 'Aucun équipement ajouté'}
                </div>
              ) : (
                amenities.map((item, idx) => (
                  <div key={idx} className={styles.listItemPill}>
                    <span className={styles.itemMainText}>✓ {item}</span>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      onClick={() =>
                        setAmenities(amenities.filter((_, i) => i !== idx))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <hr className={styles.sectionDivider} />

        {/* قسم كود QR الذكي لزيادة تقييمات Google Maps */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '18px',
            padding: '1.25rem 1.5rem',
            marginTop: '1rem',
            marginBottom: '1.25rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '0.85rem'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
                ⭐{' '}
                {isAr
                  ? 'نظام كود QR الذكي لزيادة تقييمات Google Maps'
                  : 'QR Code intelligent pour les avis Google Maps'}
              </h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                {isAr
                  ? 'ضع رابط صفحة التقييم الخاصة بصالتك على Google Maps لتوليد بطاقة QR جاهزة للطباعة.'
                  : 'Collez le lien d’avis Google Maps de votre salle pour générer un QR Code prêt à imprimer.'}
              </p>
            </div>

            <span
              style={{
                background: canUseQrFeature ? '#dbeafe' : '#fef3c7',
                color: canUseQrFeature ? '#1d4ed8' : '#b45309',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 800
              }}
            >
              {canUseQrFeature
                ? isAr
                  ? 'مفعّل في باقتك'
                  : 'Activé dans votre offre'
                : isAr
                ? 'ميزة الباقة الاحترافية (Pro)'
                : 'Fonctionnalité Pro'}
            </span>
          </div>

          {!canUseQrFeature ? (
            <div
              style={{
                background: '#ffffff',
                border: '1px dashed #cbd5e1',
                borderRadius: '14px',
                padding: '1rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <span style={{ color: '#475569', fontSize: '0.9rem', fontWeight: 600 }}>
                {isAr
                  ? 'هذه الميزة متاحة لأصحاب الباقة الاحترافية (Pro) وباقة المؤسسات لزيادة تقييمات الصالة.'
                  : 'Cette fonctionnalité est réservée aux abonnements Pro et Entreprise.'}
              </span>
              <a
                href={`https://wa.me/213550000000?text=${encodeURIComponent(
                  isAr
                    ? `مرحباً فريق Salati، أرغب في ترقية صالة "${siteForm.name || ''}" إلى الباقة الاحترافية (Pro)`
                    : `Bonjour Salati, je souhaite passer la salle "${siteForm.name || ''}" au forfait Pro`
                )}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#0052cc',
                  color: '#ffffff',
                  padding: '0.55rem 1.1rem',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                {isAr ? 'ترقية إلى Pro' : 'Passer à Pro'}
              </a>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.25rem',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: '1 1 280px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#334155',
                    marginBottom: '0.4rem'
                  }}
                >
                  {isAr ? 'رابط تقييم Google Maps المباشر' : 'Lien direct d’avis Google Maps'}
                </label>
                <input
                  type="url"
                  placeholder="https://g.page/r/..."
                  value={siteForm.google_review_url || ''}
                  onChange={(e) =>
                    setSiteForm({ ...siteForm, google_review_url: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />

                {reviewUrl && (
                  <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleDownloadQr}
                      style={{
                        background: '#0f172a',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.55rem 1rem',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      ⬇️ {isAr ? 'تحميل صورة QR' : 'Télécharger QR'}
                    </button>
                    <button
                      type="button"
                      onClick={handlePrintQrCard}
                      style={{
                        background: '#0052cc',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.55rem 1rem',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      🖨️ {isAr ? 'طباعة بطاقة التقييم' : 'Imprimer la carte QR'}
                    </button>
                  </div>
                )}
              </div>

              {reviewUrl && (
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '0.85rem',
                    textAlign: 'center',
                    minWidth: '150px'
                  }}
                >
                  <img
                    src={qrImageUrl}
                    alt="Google Maps Review QR"
                    style={{ width: '130px', height: '130px', display: 'block', margin: '0 auto' }}
                  />
                  <small style={{ display: 'block', marginTop: '0.4rem', color: '#64748b', fontWeight: 700 }}>
                    {isAr ? 'امسح للتقييم' : 'Scanner pour noter'}
                  </small>
                </div>
              )}
            </div>
          )}
        </div>

        {/* زر الحفظ النهائي */}
        <div className={styles.formFooterBar}>
          <button type="submit" className={styles.saveSiteBtn}>
            <IconCheck />
            <span>
              {isAr ? 'حفظ التعديلات ونشر الموقع' : 'Enregistrer et publier'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}