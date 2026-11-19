import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import styles from './InspectionTab.module.css';
import { IconPlus, IconCheck } from '../Icons';

export default function InspectionTab({ isAr = true, bookings = [], hallId = null }) {
  const [resolvedHallId, setResolvedHallId] = useState(hallId);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [photoNoteInput, setPhotoNoteInput] = useState('');
  const [inspectionPhotos, setInspectionPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    initInspections();
  }, [hallId]);

  const initInspections = async () => {
    setLoadingPhotos(true);
    try {
      let activeHallId = hallId;

      if (!activeHallId) {
        const { data: authUser } = await supabase.auth.getUser();
        const currentUser = authUser?.user;

        if (currentUser?.id) {
          const { data: userHall } = await supabase
            .from('halls')
            .select('id')
            .eq('owner_id', currentUser.id)
            .maybeSingle();
          if (userHall?.id) activeHallId = userHall.id;
        }

        if (!activeHallId) {
          const { data: latestHalls } = await supabase
            .from('halls')
            .select('id')
            .order('updated_at', { ascending: false })
            .limit(1);
          if (latestHalls && latestHalls.length > 0) {
            activeHallId = latestHalls[0].id;
          }
        }
      }

      if (activeHallId) {
        setResolvedHallId(activeHallId);
        await fetchInspectionPhotos(activeHallId);
      }
    } catch (err) {
      console.error('خطأ في تهيئة بيانات المعاينة:', err);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const fetchInspectionPhotos = async (targetHallId) => {
    const { data, error } = await supabase
      .from('hall_inspections')
      .select('*')
      .eq('hall_id', targetHallId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('خطأ في جلب صور المعاينة:', error);
      return;
    }

    if (data) {
      setInspectionPhotos(
        data.map((item) => ({
          id: item.id,
          url: item.image_url,
          note: item.note || (isAr ? 'حالة الصالة جاهزة للتسليم' : 'Salle prête pour la remise'),
          bookingLabel:
            item.booking_label || (isAr ? 'معاينة عامة' : 'Inspection générale'),
          rawCreatedAt: item.created_at
        }))
      );
    }
  };

  const formatTimestamp = (isoDate) => {
    if (!isoDate) return '';
    return new Date(isoDate).toLocaleDateString(
      isAr ? 'ar-DZ' : 'fr-FR',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const handleAddInspectionPhoto = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0 || uploading) return;

    if (!resolvedHallId) {
      alert(
        isAr
          ? 'يرجى حفظ إعدادات الصالة أولاً قبل إضافة صور المعاينة.'
          : 'Veuillez enregistrer les paramètres de la salle d’abord.'
      );
      return;
    }

    setUploading(true);
    try {
      const targetBooking = bookings.find(
        (b) => String(b.id) === String(selectedBookingId)
      );
      const bookingLabel = targetBooking
        ? `${targetBooking.client} (${targetBooking.date})`
        : isAr
        ? 'معاينة عامة'
        : 'Inspection générale';

      const noteText =
        photoNoteInput.trim() ||
        (isAr ? 'حالة الصالة جاهزة للتسليم' : 'Salle prête pour la remise');

      const rowsToInsert = [];

      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `inspections/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('hall-images')
          .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('hall-images')
          .getPublicUrl(fileName);

        if (urlData?.publicUrl) {
          rowsToInsert.push({
            hall_id: resolvedHallId,
            booking_id: targetBooking ? targetBooking.id : null,
            booking_label: bookingLabel,
            image_url: urlData.publicUrl,
            note: noteText
          });
        }
      }

      if (rowsToInsert.length > 0) {
        const { data: insertedRows, error: insertError } = await supabase
          .from('hall_inspections')
          .insert(rowsToInsert)
          .select();

        if (insertError) throw insertError;

        if (insertedRows) {
          const formattedNew = insertedRows.map((item) => ({
            id: item.id,
            url: item.image_url,
            note: item.note,
            bookingLabel: item.booking_label,
            rawCreatedAt: item.created_at
          }));
          setInspectionPhotos((prev) => [...formattedNew, ...prev]);
        }
      }

      setSelectedFiles([]);
      setPhotoNoteInput('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('خطأ في حفظ صور المعاينة:', err);
      alert(
        isAr
          ? 'حدث خطأ أثناء رفع وحفظ الصورة: ' + err.message
          : 'Erreur lors de l’enregistrement : ' + err.message
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteInspectionPhoto = async (photo) => {
    try {
      const { error } = await supabase
        .from('hall_inspections')
        .delete()
        .eq('id', photo.id);

      if (error) throw error;

      // حذف الملف من Storage إن أمكن
      if (photo.url && photo.url.includes('/hall-images/')) {
        const storagePath = photo.url.split('/hall-images/')[1];
        if (storagePath) {
          await supabase.storage.from('hall-images').remove([storagePath]);
        }
      }

      setInspectionPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    } catch (err) {
      console.error('خطأ في حذف صورة المعاينة:', err);
      alert(
        isAr
          ? 'فشل حذف الصورة: ' + err.message
          : 'Erreur lors de la suppression : ' + err.message
      );
    }
  };

  return (
    <div className={styles.inspectionContainer}>
      {/* عنوان الصفحة */}
      <div className={styles.pageTitleBar}>
        <h2 className={styles.pageMainTitle}>
          {isAr
            ? 'معاينة الصالة قبل التسليم'
            : 'Inspection de la salle avant remise'}
        </h2>
      </div>

      {/* التسمية الفرعية أعلى الإطار الكبير */}
      <div className={styles.subSectionHeader}>
        <span className={styles.subSectionLabel}>
          {isAr
            ? 'آخر تحديثات صور الصالة'
            : 'Dernières mises à jour photos de la salle'}
        </span>
      </div>

      {/* الإطار الكبير */}
      <div className={styles.largeInspectionCard}>
        {/* شريط إضافة الصور من الملفات */}
        <form
          className={styles.uploadToolbar}
          onSubmit={handleAddInspectionPhoto}
        >
          <select
            className={styles.pillSelect}
            value={selectedBookingId}
            onChange={(e) => setSelectedBookingId(e.target.value)}
          >
            <option value="">
              {isAr
                ? '-- اختر الحجز / المناسبة (اختياري) --'
                : '-- Choisir une réservation (optionnel) --'}
            </option>
            {bookings
              .filter((b) => b.status !== 'cancelled')
              .map((b) => (
                <option key={b.id} value={b.id}>
                  {b.client} - {b.date}
                </option>
              ))}
          </select>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          <input
            type="text"
            readOnly
            className={`${styles.pillInput} ${styles.filePickerInput}`}
            onClick={() => !uploading && fileInputRef.current?.click()}
            placeholder={
              isAr
                ? 'اضغط لاختيار صورة من الملفات...'
                : 'Choisir une photo depuis l’appareil...'
            }
            value={
              selectedFiles.length > 0
                ? isAr
                  ? selectedFiles.length === 1
                    ? selectedFiles[0].name
                    : `تم اختيار ${selectedFiles.length} صور`
                  : `${selectedFiles.length} photo(s) sélectionnée(s)`
                : ''
            }
          />

          <input
            type="text"
            className={styles.pillInput}
            placeholder={
              isAr
                ? 'ملاحظة (مثال: القاعة الكبرى نظيفة)...'
                : 'Note (ex : Grande salle propre)...'
            }
            value={photoNoteInput}
            onChange={(e) => setPhotoNoteInput(e.target.value)}
          />

          <button
            type="submit"
            disabled={selectedFiles.length === 0 || uploading}
            className={styles.addPhotoActionBtn}
          >
            <IconPlus />
            <span>
              {uploading
                ? isAr
                  ? 'جاري الحفظ...'
                  : 'Envoi...'
                : isAr
                ? 'إضافة صورة'
                : 'Ajouter'}
            </span>
          </button>
        </form>

        {/* الإطار السفلي لعرض الصور المضافة أو Shimmer Skeleton */}
        {loadingPhotos ? (
          <div className={styles.compactGalleryGrid} aria-busy="true">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className={styles.compactPhotoCard}>
                <div className={`${styles.skeletonBase} ${styles.skeletonPhotoThumb}`} />
                <div className={styles.compactCardBody}>
                  <div className={`${styles.skeletonBase} ${styles.skeletonTag}`} />
                  <div className={`${styles.skeletonBase} ${styles.skeletonNoteLine}`} />
                  <div className={`${styles.skeletonBase} ${styles.skeletonTimeLine}`} />
                </div>
              </div>
            ))}
          </div>
        ) : inspectionPhotos.length === 0 ? (
          <div className={styles.emptyInspectionArea}>
            <div className={styles.emptyIconCircle}>📸</div>
            <h3>
              {isAr
                ? 'لا توجد صور معاينة مسجلة حالياً'
                : 'Aucune photo d’inspection enregistrée'}
            </h3>
            <p>
              {isAr
                ? 'قم بإضافة صور توثق حالة الصالة والتجهيزات قبل تسليمها للزبون لحفظ حقوق الطرفين.'
                : 'Ajoutez des photos pour documenter l’état de la salle avant la remise des clés.'}
            </p>
          </div>
        ) : (
          <div className={styles.compactGalleryGrid}>
            {inspectionPhotos.map((photo) => (
              <div
                key={photo.id}
                className={`${styles.inspectionPhotoCard} ${styles.compactPhotoCard}`}
              >
                <div className={styles.compactPhotoImageWrap}>
                  <img
                    src={photo.url}
                    alt={photo.note}
                    loading="lazy"
                  />
                  <button
                    type="button"
                    className={styles.compactDeleteBtn}
                    onClick={() => handleDeleteInspectionPhoto(photo)}
                    aria-label={isAr ? 'حذف الصورة' : 'Supprimer la photo'}
                  >
                    ✕
                  </button>
                </div>

                <div className={styles.compactCardBody}>
                  <span className={styles.compactBookingTag}>
                    {photo.bookingLabel}
                  </span>
                  <strong className={styles.compactPhotoNote}>
                    {photo.note}
                  </strong>
                  <small className={styles.compactPhotoTime}>
                    <IconCheck /> {formatTimestamp(photo.rawCreatedAt)}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}