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
          note: item.note || (isAr ? 'حالة الصالة جاهزة للتسليم' : 'Salle prête'),
          bookingLabel:
            item.booking_label || (isAr ? 'معاينة عامة' : 'Inspection générale'),
          timestamp: new Date(item.created_at).toLocaleDateString(
            isAr ? 'ar-DZ' : 'fr-FR',
            {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }
          )
        }))
      );
    }
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
        (isAr ? 'حالة الصالة جاهزة للتسليم' : 'Salle prête');

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
            timestamp: new Date(item.created_at).toLocaleDateString(
              isAr ? 'ar-DZ' : 'fr-FR',
              {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }
            )
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
      alert(isAr ? 'فشل حذف الصورة: ' + err.message : 'Erreur : ' + err.message);
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
                : '-- Choisir une réservation --'}
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
            className={styles.pillInput}
            style={{ cursor: 'pointer' }}
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
              isAr ? 'ملاحظة (مثال: القاعة الكبرى نظيفة)...' : 'Note...'
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

        {/* الإطار السفلي لعرض الصور المضافة بشكل صغير */}
        {loadingPhotos ? (
          <div className={styles.emptyInspectionArea}>
            <p style={{ color: '#0052cc', fontWeight: 700 }}>
              {isAr ? 'جاري تحميل صور المعاينة...' : 'Chargement des photos...'}
            </p>
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
          <div
            style={{
              border: '1.5px dashed #cbd5e1',
              borderRadius: '20px',
              backgroundColor: '#f8fafc',
              padding: '1.15rem',
              minHeight: '260px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))',
              gap: '0.75rem',
              alignContent: 'start'
            }}
          >
            {inspectionPhotos.map((photo) => (
              <div
                key={photo.id}
                className={styles.inspectionPhotoCard}
                style={{
                  borderRadius: '14px',
                  overflow: 'hidden',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div
                  className={styles.photoImageWrap}
                  style={{ height: '100px', position: 'relative' }}
                >
                  <img
                    src={photo.url}
                    alt={photo.note}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  <button
                    type="button"
                    className={styles.deleteEntryBtn}
                    style={{
                      width: '22px',
                      height: '22px',
                      fontSize: '0.72rem',
                      top: '6px',
                      left: '6px'
                    }}
                    onClick={() => handleDeleteInspectionPhoto(photo)}
                  >
                    ✕
                  </button>
                </div>

                <div
                  className={styles.photoCardBody}
                  style={{ padding: '0.5rem', gap: '0.2rem' }}
                >
                  <span
                    className={styles.bookingTag}
                    style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
                  >
                    {photo.bookingLabel}
                  </span>
                  <strong
                    className={styles.photoNoteText}
                    style={{ fontSize: '0.78rem', lineHeight: '1.35' }}
                  >
                    {photo.note}
                  </strong>
                  <small
                    className={styles.photoTimeText}
                    style={{ fontSize: '0.66rem' }}
                  >
                    <IconCheck /> {photo.timestamp}
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