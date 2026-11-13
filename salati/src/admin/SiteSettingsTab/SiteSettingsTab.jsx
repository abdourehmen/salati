import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import styles from './SiteSettingsTab.module.css';
import { IconCheck, IconPlus } from '../Icons';

export default function SiteSettingsTab({
  isAr = true,
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