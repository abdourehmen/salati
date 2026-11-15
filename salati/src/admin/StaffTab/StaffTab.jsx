import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabaseClient';
import styles from './StaffTab.module.css';
import { IconPlus, IconCheck } from '../Icons';

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

  // حالات تعديل الصلاحيات مباشرة من البطاقة
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editingPerms, setEditingPerms] = useState({
    orders: true,
    calendar: true,
    inspection: false,
    site: false
  });
  const [savingPerms, setSavingPerms] = useState(false);

  // حالات تغيير كلمة المرور مباشرة من البطاقة
  const [passwordMemberId, setPasswordMemberId] = useState(null);
  const [newMemberPassword, setNewMemberPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // حالة كرت الإشعار في منتصف الشاشة
  const [feedbackModal, setFeedbackModal] = useState({
    open: false,
    type: 'success', // 'success' | 'error'
    title: '',
    message: ''
  });

  const showFeedback = (message, type = 'success', customTitle = '') => {
    setFeedbackModal({
      open: true,
      type,
      title:
        customTitle ||
        (type === 'success'
          ? isAr
            ? 'تمت العملية بنجاح!'
            : 'Opération réussie !'
          : isAr
          ? 'تنبيه'
          : 'Attention'),
      message
    });
  };

  const closeFeedback = () => {
    setFeedbackModal((prev) => ({ ...prev, open: false }));
  };

  const togglePermission = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStartEditPermissions = (member) => {
    const currentPerms = member.permissions || {};
    setPasswordMemberId(null);
    setNewMemberPassword('');
    setEditingMemberId(member.id);
    setEditingPerms({
      orders: currentPerms.orders ?? true,
      calendar: currentPerms.calendar ?? true,
      inspection: currentPerms.inspection ?? false,
      site: currentPerms.site ?? false
    });
  };

  const handleToggleEditingPerm = (key) => {
    setEditingPerms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveCardPermissions = async (memberId) => {
    if (savingPerms) return;
    setSavingPerms(true);
    try {
      const { data, error } = await supabase
        .from('hall_staff')
        .update({ permissions: editingPerms })
        .eq('id', memberId)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        showFeedback(
          isAr
            ? 'قاعدة البيانات رفضت حفظ الصلاحيات! تأكد من صلاحيات جدول hall_staff في Supabase.'
            : 'Mise à jour refusée par Supabase.',
          'error'
        );
        return;
      }

      setStaffMembers((prev) =>
        prev.map((m) =>
          m.id === memberId ? { ...m, permissions: data[0].permissions } : m
        )
      );
      setEditingMemberId(null);
      showFeedback(
        isAr
          ? 'تم حفظ صلاحيات الموظف في قاعدة البيانات بنجاح!'
          : 'Permissions enregistrées avec succès !',
        'success'
      );
    } catch (err) {
      console.error('خطأ في تحديث صلاحيات الموظف:', err);
      showFeedback(
        isAr
          ? 'فشل حفظ الصلاحيات: ' + err.message
          : 'Erreur lors de la mise à jour : ' + err.message,
        'error'
      );
    } finally {
      setSavingPerms(false);
    }
  };

  const handleStartChangePassword = (member) => {
    setEditingMemberId(null);
    setPasswordMemberId(member.id);
    setNewMemberPassword('');
  };

  const handleSaveMemberPassword = async (member) => {
    if (savingPassword) return;
    if (!newMemberPassword.trim() || newMemberPassword.trim().length < 6) {
      showFeedback(
        isAr
          ? 'يرجى إدخال كلمة مرور جديدة من 6 أحرف على الأقل.'
          : 'Le mot de passe doit contenir au moins 6 caractères.',
        'error'
      );
      return;
    }

    setSavingPassword(true);
    try {
      const { data: updatedUserId, error: rpcError } = await supabase.rpc(
        'upsert_staff_auth_account',
        {
          p_email: member.email.trim().toLowerCase(),
          p_password: newMemberPassword.trim(),
          p_full_name: member.full_name || ''
        }
      );

      if (rpcError) throw rpcError;

      if (updatedUserId && !member.user_id) {
        await supabase
          .from('hall_staff')
          .update({ user_id: updatedUserId })
          .eq('id', member.id);

        setStaffMembers((prev) =>
          prev.map((m) => (m.id === member.id ? { ...m, user_id: updatedUserId } : m))
        );
      }

      setPasswordMemberId(null);
      setNewMemberPassword('');
      showFeedback(
        isAr
          ? `تم تغيير كلمة مرور الموظف "${member.full_name}" بنجاح!`
          : `Mot de passe de "${member.full_name}" mis à jour avec succès !`,
        'success'
      );
    } catch (err) {
      console.error('خطأ في تغيير كلمة مرور الموظف:', err);
      showFeedback(
        isAr
          ? 'فشل تغيير كلمة المرور: ' + err.message
          : 'Erreur lors du changement de mot de passe : ' + err.message,
        'error'
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim() || creating) return;

    if (!hallId) {
      showFeedback(
        isAr
          ? 'يرجى حفظ إعدادات الصالة أولاً قبل إضافة الموظفين.'
          : 'Veuillez enregistrer les paramètres de la salle d’abord.',
        'error'
      );
      return;
    }

    setCreating(true);
    try {
      const cleanEmail = email.trim().toLowerCase();

      const { data: createdUserId, error: rpcError } = await supabase.rpc(
        'upsert_staff_auth_account',
        {
          p_email: cleanEmail,
          p_password: password.trim(),
          p_full_name: fullName.trim()
        }
      );

      if (rpcError) throw rpcError;

      const existingMember = staffMembers.find(
        (m) => m.email?.toLowerCase() === cleanEmail
      );

      if (existingMember) {
        const { data: updatedStaff, error: updateError } = await supabase
          .from('hall_staff')
          .update({
            user_id: createdUserId || existingMember.user_id,
            full_name: fullName.trim(),
            phone: phone.trim(),
            is_active: true,
            permissions
          })
          .eq('id', existingMember.id)
          .select()
          .single();

        if (updateError) throw updateError;

        if (updatedStaff && setStaffMembers) {
          setStaffMembers((prev) =>
            prev.map((m) => (m.id === updatedStaff.id ? updatedStaff : m))
          );
        }
      } else {
        const { data: insertedStaff, error: dbError } = await supabase
          .from('hall_staff')
          .insert([
            {
              hall_id: hallId,
              user_id: createdUserId || null,
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
      }

      setFullName('');
      setPhone('');
      setEmail('');
      setPassword('');
      setPermissions({ orders: true, calendar: true, inspection: false, site: false });

      showFeedback(
        isAr
          ? 'تم تفعيل حساب الموظف وتحديث كلمة مروره بنجاح! يمكنه الدخول الآن فوراً.'
          : 'Compte employé activé et mot de passe mis à jour avec succès !',
        'success'
      );
    } catch (err) {
      console.error('خطأ في إضافة الموظف:', err);
      showFeedback(
        isAr
          ? 'حدث خطأ أثناء إضافة الموظف: ' + err.message
          : 'Erreur : ' + err.message,
        'error'
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

      showFeedback(
        nextStatus
          ? isAr
            ? `تم تفعيل حساب الموظف "${member.full_name}" بنجاح.`
            : `Compte de "${member.full_name}" activé.`
          : isAr
          ? `تم إيقاف حساب الموظف "${member.full_name}" مؤقتاً.`
          : `Compte de "${member.full_name}" suspendu.`,
        'success'
      );
    } catch (err) {
      console.error('خطأ في تحديث حالة الموظف:', err);
      showFeedback(
        isAr ? 'فشل تحديث حالة الموظف: ' + err.message : 'Erreur : ' + err.message,
        'error'
      );
    }
  };

  const handleDeleteStaff = async (member) => {
    if (
      !window.confirm(
        isAr
          ? `هل أنت متأكد من حذف الموظف "${member.full_name}" وحسابه نهائياً؟`
          : `Supprimer définitivement l'employé "${member.full_name}" et son compte ?`
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase.rpc('delete_staff_account', {
        p_staff_id: member.id,
        p_user_id: member.user_id || null,
        p_email: member.email || null
      });

      if (error) throw error;

      setStaffMembers((prev) => prev.filter((m) => m.id !== member.id));
      showFeedback(
        isAr
          ? `تم حذف الموظف "${member.full_name}" نهائياً.`
          : `Employé "${member.full_name}" supprimé.`,
        'success'
      );
    } catch (err) {
      console.error('خطأ في حذف الموظف:', err);
      showFeedback(
        isAr
          ? 'حدث خطأ أثناء الحذف النهائي: ' + err.message
          : 'Erreur lors de la suppression : ' + err.message,
        'error'
      );
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
                  ? 'إنشاء / تحديث حساب الموظف'
                  : 'Créer / Mettre à jour'}
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
            {staffMembers.map((member, index) => {
              const confirmedCount = getConfirmedCountByStaff(member.full_name);
              const perms = member.permissions || {};
              const isEditingThisCard = editingMemberId === member.id;
              const isChangingPassThisCard = passwordMemberId === member.id;

              return (
                <div
                  key={member.id}
                  className={styles.staffCard}
                  style={{ animationDelay: `${Math.min(index * 0.06, 0.4)}s` }}
                >
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

                  {/* وضع تغيير كلمة المرور مباشرة من البطاقة */}
                  {isChangingPassThisCard && (
                    <div className={styles.inlineEditBox}>
                      <span className={styles.inlineEditTitle}>
                        {isAr
                          ? 'أدخل كلمة المرور الجديدة (6 أحرف على الأقل):'
                          : 'Nouveau mot de passe (min 6 car.) :'}
                      </span>

                      <input
                        type="text"
                        minLength={6}
                        className={styles.inlinePassInput}
                        placeholder={isAr ? 'كلمة المرور الجديدة...' : 'Nouveau mot de passe...'}
                        value={newMemberPassword}
                        onChange={(e) => setNewMemberPassword(e.target.value)}
                      />

                      <div className={styles.inlineEditActions}>
                        <button
                          type="button"
                          disabled={savingPassword}
                          className={styles.inlineSaveBtn}
                          onClick={() => handleSaveMemberPassword(member)}
                        >
                          <IconCheck />
                          <span>
                            {savingPassword
                              ? isAr
                                ? 'جاري التحديث...'
                                : 'Mise à jour...'
                              : isAr
                              ? 'حفظ كلمة المرور'
                              : 'Enregistrer'}
                          </span>
                        </button>

                        <button
                          type="button"
                          className={styles.inlineCancelBtn}
                          onClick={() => {
                            setPasswordMemberId(null);
                            setNewMemberPassword('');
                          }}
                        >
                          {isAr ? 'إلغاء' : 'Annuler'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* وضع تعديل الصلاحيات أو عرض الصلاحيات الحالية */}
                  {isEditingThisCard ? (
                    <div className={styles.inlineEditBox}>
                      <span className={styles.inlineEditTitle}>
                        {isAr ? 'حدد الأقسام المسموحة:' : 'Sections autorisées :'}
                      </span>

                      <div className={styles.inlineEditChips}>
                        <label
                          className={`${styles.permChip} ${
                            editingPerms.orders ? styles.permChipActive : ''
                          }`}
                          style={{ padding: '0.32rem 0.68rem', fontSize: '0.76rem' }}
                        >
                          <input
                            type="checkbox"
                            checked={editingPerms.orders}
                            onChange={() => handleToggleEditingPerm('orders')}
                          />
                          <span>{isAr ? 'الطلبيات' : 'Demandes'}</span>
                        </label>

                        <label
                          className={`${styles.permChip} ${
                            editingPerms.calendar ? styles.permChipActive : ''
                          }`}
                          style={{ padding: '0.32rem 0.68rem', fontSize: '0.76rem' }}
                        >
                          <input
                            type="checkbox"
                            checked={editingPerms.calendar}
                            onChange={() => handleToggleEditingPerm('calendar')}
                          />
                          <span>{isAr ? 'التقويم' : 'Calendrier'}</span>
                        </label>

                        <label
                          className={`${styles.permChip} ${
                            editingPerms.inspection ? styles.permChipActive : ''
                          }`}
                          style={{ padding: '0.32rem 0.68rem', fontSize: '0.76rem' }}
                        >
                          <input
                            type="checkbox"
                            checked={editingPerms.inspection}
                            onChange={() => handleToggleEditingPerm('inspection')}
                          />
                          <span>{isAr ? 'المعاينة' : 'Inspection'}</span>
                        </label>

                        <label
                          className={`${styles.permChip} ${
                            editingPerms.site ? styles.permChipActive : ''
                          }`}
                          style={{ padding: '0.32rem 0.68rem', fontSize: '0.76rem' }}
                        >
                          <input
                            type="checkbox"
                            checked={editingPerms.site}
                            onChange={() => handleToggleEditingPerm('site')}
                          />
                          <span>{isAr ? 'موقع الصالة' : 'Site Web'}</span>
                        </label>
                      </div>

                      <div className={styles.inlineEditActions}>
                        <button
                          type="button"
                          disabled={savingPerms}
                          className={styles.inlineSaveBtn}
                          onClick={() => handleSaveCardPermissions(member.id)}
                        >
                          <IconCheck />
                          <span>
                            {savingPerms
                              ? isAr
                                ? 'جاري الحفظ...'
                                : 'Enregistrement...'
                              : isAr
                              ? 'حفظ الصلاحيات'
                              : 'Enregistrer'}
                          </span>
                        </button>

                        <button
                          type="button"
                          className={styles.inlineCancelBtn}
                          onClick={() => setEditingMemberId(null)}
                        >
                          {isAr ? 'إلغاء' : 'Annuler'}
                        </button>
                      </div>
                    </div>
                  ) : (
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
                  )}

                  <div className={styles.staffCardActions}>
                    {!isEditingThisCard && (
                      <button
                        type="button"
                        className={styles.toggleActiveBtn}
                        onClick={() => handleStartEditPermissions(member)}
                      >
                        {isAr ? 'تعديل الصلاحيات' : 'Permissions'}
                      </button>
                    )}

                    {!isChangingPassThisCard && (
                      <button
                        type="button"
                        className={styles.toggleActiveBtn}
                        onClick={() => handleStartChangePassword(member)}
                      >
                        {isAr ? 'كلمة المرور' : 'Mot de passe'}
                      </button>
                    )}

                    <button
                      type="button"
                      className={`${styles.toggleActiveBtn} ${
                        member.is_active ? styles.pauseStaffBtn : styles.activateStaffBtn
                      }`}
                      onClick={() => handleToggleStaffStatus(member)}
                    >
                      <IconCheck />{' '}
                      {member.is_active
                        ? isAr
                          ? 'إيقاف'
                          : 'Suspendre'
                        : isAr
                        ? 'تفعيل'
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

      {/* كرت الإشعار الجميل في منتصف الشاشة بالكامل */}
      {feedbackModal.open &&
        createPortal(
          <div className={styles.feedbackBackdrop} onClick={closeFeedback}>
            <div
              dir={isAr ? 'rtl' : 'ltr'}
              className={styles.feedbackCard}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={
                  feedbackModal.type === 'success'
                    ? styles.feedbackIconSuccess
                    : styles.feedbackIconError
                }
              >
                {feedbackModal.type === 'success' ? <IconCheck /> : '⚠️'}
              </div>
              <h3 className={styles.feedbackTitle}>{feedbackModal.title}</h3>
              <p className={styles.feedbackMessage}>{feedbackModal.message}</p>
              <button
                type="button"
                className={styles.feedbackCloseBtn}
                onClick={closeFeedback}
              >
                {isAr ? 'موافق' : "D'accord"}
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}