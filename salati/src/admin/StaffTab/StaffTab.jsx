import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import styles from './StaffTab.module.css';
import { IconPlus, IconCheck } from '../Icons';

// عميل ثانوي بدون حفظ الجلسة لإنشاء حساب للموظف دون تسجيل خروج المالك
const createTempAuthClient = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
};

export default function StaffTab({
  isAr = true,
  hallId,
  staffMembers = [],
  setStaffMembers,
  bookings = []
}) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [permissions, setPermissions] = useState({
    orders: true,
    calendar: true,
    inspection: false,
    site: false
  });
  const [creating, setCreating] = useState(false);

  const togglePermission = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim() || creating) return;

    if (!hallId) {
      alert(
        isAr
          ? 'يرجى حفظ إعدادات الصالة أولاً قبل إضافة الموظفين.'
          : 'Veuillez enregistrer les paramètres de la salle d’abord.'
      );
      return;
    }

    setCreating(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      let createdUserId = null;

      // إنشاء حساب دخول للموظف في Supabase Auth
      const tempClient = createTempAuthClient();
      if (tempClient) {
        const { data: signUpData, error: signUpError } = await tempClient.auth.signUp({
          email: cleanEmail,
          password: password.trim(),
          options: {
            data: { full_name: fullName.trim(), role: 'staff' }
          }
        });

        if (signUpError && !signUpError.message.toLowerCase().includes('already registered')) {
          throw signUpError;
        }
        createdUserId = signUpData?.user?.id || null;
      }

      const { data: insertedStaff, error: dbError } = await supabase
        .from('hall_staff')
        .insert([
          {
            hall_id: hallId,
            user_id: createdUserId,
            full_name: fullName.trim(),
            phone: phone.trim(),
            email: cleanEmail,
            is_active: true,
            permissions
          }
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      if (insertedStaff && setStaffMembers) {
        setStaffMembers((prev) => [insertedStaff, ...prev]);
      }

      setFullName('');
      setPhone('');
      setEmail('');
      setPassword('');
      setPermissions({ orders: true, calendar: true, inspection: false, site: false });

      alert(
        isAr
          ? 'تم إنشاء حساب الموظف بنجاح! يمكنه الآن تسجيل الدخول ببريده وكلمة المرور.'
          : 'Compte employé créé avec succès !'
      );
    } catch (err) {
      console.error('خطأ في إضافة الموظف:', err);
      alert(
        isAr
          ? 'حدث خطأ أثناء إضافة الموظف: ' + err.message
          : 'Erreur : ' + err.message
      );
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStaffStatus = async (member) => {
    try {
      const nextStatus = !member.is_active;
      const { error } = await supabase
        .from('hall_staff')
        .update({ is_active: nextStatus })
        .eq('id', member.id);

      if (error) throw error;

      setStaffMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, is_active: nextStatus } : m))
      );
    } catch (err) {
      console.error('خطأ في تحديث حالة الموظف:', err);
    }
  };

  const handleDeleteStaff = async (member) => {
    if (
      !window.confirm(
        isAr
          ? `هل أنت متأكد من حذف الموظف "${member.full_name}"؟`
          : `Supprimer l'employé "${member.full_name}" ?`
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from('hall_staff')
        .delete()
        .eq('id', member.id);

      if (error) throw error;

      setStaffMembers((prev) => prev.filter((m) => m.id !== member.id));
    } catch (err) {
      console.error('خطأ في حذف الموظف:', err);
    }
  };

  const getConfirmedCountByStaff = (staffName) => {
    if (!staffName) return 0;
    return bookings.filter(
      (b) => b.status === 'confirmed' && b.confirmedBy === staffName
    ).length;
  };

  return (
    <div className={styles.staffContainer}>
      <div className={styles.pageTitleBar}>
        <h2 className={styles.pageMainTitle}>
          {isAr ? 'العمال وفريق إدارة الطلبيات' : 'Équipe & Gestion des accès'}
        </h2>
      </div>

      <div className={styles.mainCard}>
        <div className={styles.sectionHeaderPill}>
          <span>👤</span>
          <span>{isAr ? 'إضافة موظف جديد للوحة التحكم' : 'Ajouter un employé'}</span>
        </div>

        {/* نموذج إضافة موظف */}
        <form className={styles.addStaffForm} onSubmit={handleAddStaffSubmit}>
          <div className={styles.inputsGrid}>
            <div className={styles.pillInputGroup}>
              <label>{isAr ? 'الاسم الكامل للموظف' : 'Nom complet'}</label>
              <input
                type="text"
                required
                placeholder={isAr ? 'مثال: سارة بن علي' : 'Ex: Sara Benali'}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className={styles.pillInputGroup}>
              <label>{isAr ? 'رقم الهاتف' : 'Téléphone'}</label>
              <input
                type="tel"
                placeholder="0550 00 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className={styles.pillInputGroup}>
              <label>{isAr ? 'البريد الإلكتروني (للدخول)' : 'Email de connexion'}</label>
              <input
                type="email"
                required
                placeholder="staff@salati.dz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.pillInputGroup}>
              <label>{isAr ? 'كلمة المرور' : 'Mot de passe'}</label>
              <input
                type="text"
                required
                minLength={6}
                placeholder={isAr ? '6 أحرف على الأقل' : 'Min 6 caractères'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.permissionsBar}>
            <div className={styles.permissionsList}>
              <span className={styles.permLabelTitle}>
                {isAr ? 'الأقسام المسموحة له:' : 'Sections autorisées :'}
              </span>

              <label
                className={`${styles.permChip} ${
                  permissions.orders ? styles.permChipActive : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={permissions.orders}
                  onChange={() => togglePermission('orders')}
                />
                <span>{isAr ? 'متابعة وتأكيد الطلبيات' : 'Demandes'}</span>
              </label>

              <label
                className={`${styles.permChip} ${
                  permissions.calendar ? styles.permChipActive : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={permissions.calendar}
                  onChange={() => togglePermission('calendar')}
                />
                <span>{isAr ? 'التقويم والحجوزات' : 'Calendrier'}</span>
              </label>

              <label
                className={`${styles.permChip} ${
                  permissions.inspection ? styles.permChipActive : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={permissions.inspection}
                  onChange={() => togglePermission('inspection')}
                />
                <span>{isAr ? 'معاينة الصالة' : 'Inspection'}</span>
              </label>

              <label
                className={`${styles.permChip} ${
                  permissions.site ? styles.permChipActive : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={permissions.site}
                  onChange={() => togglePermission('site')}
                />
                <span>{isAr ? 'إعدادات موقع الصالة' : 'Site Web'}</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={creating}
              className={styles.submitStaffBtn}
            >
              <IconPlus />
              <span>
                {creating
                  ? isAr
                    ? 'جاري الإنشاء...'
                    : 'Création...'
                  : isAr
                  ? 'إنشاء حساب الموظف'
                  : 'Créer le compte'}
              </span>
            </button>
          </div>
        </form>

        {/* قائمة الموظفين الحاليين */}
        <div className={styles.sectionHeaderPill}>
          <span>👥</span>
          <span>
            {isAr
              ? `فريق العمل المسجّل (${staffMembers.length})`
              : `Membres de l'équipe (${staffMembers.length})`}
          </span>
        </div>

        {staffMembers.length === 0 ? (
          <div className={styles.emptyStateBox}>
            <p style={{ margin: 0, fontWeight: 700 }}>
              {isAr
                ? 'لا يوجد موظفون مضافون حالياً. أضف موظفاً من النموذج أعلاه ليتمكن من متابعة وتأكيد الطلبيات.'
                : 'Aucun employé enregistré pour le moment.'}
            </p>
          </div>
        ) : (
          <div className={styles.staffCardsGrid}>
            {staffMembers.map((member) => {
              const confirmedCount = getConfirmedCountByStaff(member.full_name);
              const perms = member.permissions || {};

              return (
                <div key={member.id} className={styles.staffCard}>
                  <div className={styles.staffCardTop}>
                    <div className={styles.staffIdentity}>
                      <div className={styles.staffAvatar}>
                        {member.full_name?.charAt(0) || '👤'}
                      </div>
                      <div className={styles.staffMeta}>
                        <strong>{member.full_name}</strong>
                        <span dir="ltr">{member.email}</span>
                        {member.phone && <span dir="ltr">{member.phone}</span>}
                      </div>
                    </div>

                    <span
                      className={
                        member.is_active
                          ? styles.statusBadgeActive
                          : styles.statusBadgePaused
                      }
                    >
                      {member.is_active
                        ? isAr
                          ? 'نشط'
                          : 'Actif'
                        : isAr
                        ? 'موقوف'
                        : 'Suspendu'}
                    </span>
                  </div>

                  <div className={styles.staffDetailsRow}>
                    <span style={{ color: '#475569', fontWeight: 700 }}>
                      {isAr ? 'الطلبيات المؤكدة بواسطته:' : 'Confirmations :'}
                    </span>
                    <strong style={{ color: '#0052cc', fontSize: '0.95rem' }}>
                      {confirmedCount} {isAr ? 'طلبية' : 'demande(s)'}
                    </strong>
                  </div>

                  <div className={styles.staffPermsBadges}>
                    {perms.orders && (
                      <span className={styles.miniPermTag}>
                        ✓ {isAr ? 'الطلبيات' : 'Demandes'}
                      </span>
                    )}
                    {perms.calendar && (
                      <span className={styles.miniPermTag}>
                        ✓ {isAr ? 'التقويم' : 'Calendrier'}
                      </span>
                    )}
                    {perms.inspection && (
                      <span className={styles.miniPermTag}>
                        ✓ {isAr ? 'المعاينة' : 'Inspection'}
                      </span>
                    )}
                    {perms.site && (
                      <span className={styles.miniPermTag}>
                        ✓ {isAr ? 'موقع الصالة' : 'Site Web'}
                      </span>
                    )}
                  </div>

                  <div className={styles.staffCardActions}>
                    <button
                      type="button"
                      className={styles.toggleActiveBtn}
                      onClick={() => handleToggleStaffStatus(member)}
                    >
                      <IconCheck />{' '}
                      {member.is_active
                        ? isAr
                          ? 'إيقاف الدخول مؤقتاً'
                          : 'Suspendre'
                        : isAr
                        ? 'تفعيل الحساب'
                        : 'Activer'}
                    </button>

                    <button
                      type="button"
                      className={styles.deleteStaffBtn}
                      onClick={() => handleDeleteStaff(member)}
                    >
                      {isAr ? 'حذف' : 'Supprimer'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}   