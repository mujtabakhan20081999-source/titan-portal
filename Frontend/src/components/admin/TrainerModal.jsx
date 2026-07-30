import { useEffect, useMemo, useState } from 'react';

function TrainerModal({
  open,
  mode,
  initialValues,
  campuses,
  loading,
  serverError,
  onClose,
  onSubmit,
}) {
  const safeInitialValues = useMemo(() => {
    if (initialValues) return initialValues;
    return {
      fullName: '',
      email: '',
      phoneNumber: '',
      campus: '',
      gender: '',
      qualification: '',
      experience: '',
      joiningDate: '',
      salary: '',
      address: '',
      status: 'Active',
      profilePictureUrl: null,
      profilePicturePreview: null,
    };
  }, [initialValues]);

  const [form, setForm] = useState(safeInitialValues);
  const [touched, setTouched] = useState({});


  useEffect(() => {
    if (!open) return;
    setForm(initialValues);
    setTouched({});
  }, [open, initialValues]);

  const errors = useMemo(() => {
    const e = {};
    const required = [
      'fullName',
      'email',
      'phoneNumber',
      'campus',
      'gender',
      'qualification',
      'experience',
      'joiningDate',
      'salary',
      'address',
      'status',
    ];

    for (const key of required) {
      if (form[key] === undefined || form[key] === null || String(form[key]).trim() === '') {
        e[key] = 'This field is required';
      }
    }

    const email = String(form.email || '').trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';

    const phone = String(form.phoneNumber || '').trim();
    if (phone) {
      const normalized = phone.replace(/\s+/g, '');
      // Simple permissive pattern for +92 / 03xx Pakistani numbers
      if (!/^\+?\d{10,15}$/.test(normalized) && !/^0\d{10,14}$/.test(normalized)) {
        e.phoneNumber = 'Enter a valid phone number';
      }
    }

    // Numbers
    if (form.experience !== '' && !Number.isFinite(Number(form.experience))) {
      e.experience = 'Experience must be a number';
    }
    if (form.salary !== '' && !Number.isFinite(Number(form.salary))) {
      e.salary = 'Salary must be a number';
    }

    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (key) => (e) => {
    const value = e?.target?.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const avatarPreview = useMemo(() => {
    if (form.profilePicturePreview) return form.profilePicturePreview;
    if (form.profilePictureUrl) return form.profilePictureUrl;
    return null;
  }, [form.profilePicturePreview, form.profilePictureUrl]);

  if (!open) return null;

  return (
    <>
      <style>{`
        .tmg-modal-backdrop{position:fixed; inset:0; background: rgba(17, 12, 58, .40); display:flex; align-items:center; justify-content:center; padding: 18px; z-index: 2000;}
        .tmg-modal{width: min(780px, 100%); max-height: 85vh; background:#fff; border-radius: 24px; box-shadow: 0 28px 90px rgba(15,23,42,.18); border:1px solid rgba(148,163,184,.22); overflow:hidden; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;}
        .tmg-modal-head{padding:22px 22px 18px; display:flex; align-items:flex-start; justify-content:space-between; gap:14px; border-bottom:1px solid rgba(148,163,184,.18); background: linear-gradient(180deg, rgba(99,102,241,.06), rgba(255,255,255,.00));}
        .tmg-modal-title{font-weight:800;font-size:20px;color:#111827;}
        .tmg-modal-sub{margin-top:6px;font-weight:500;color:#4b5563;font-size:13px;}
        .tmg-modal-close{border:none;background:transparent;font-size:22px;line-height:1;color:#6b7280; cursor:pointer; padding:2px 8px;}
        .tmg-modal-body{padding:20px 22px 22px; overflow-y:auto; max-height: calc(85vh - 112px);}
        .tmg-form-grid{display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:18px; align-items:start;}
        .tmg-field{display:flex; flex-direction:column; gap:8px;}
        .tmg-field-span{grid-column: 1 / -1;}
        .tmg-field label{font-size:13px; font-weight:700; color:#374151;}
        .tmg-field input,
        .tmg-field select{border:1px solid #d1d5db; border-radius:14px; background:#f8fafc; color:#111827; min-height:46px; padding:12px 14px; font-size:14px; outline:none; transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;}
        .tmg-field input:focus,
        .tmg-field select:focus{border-color:#7c3aed; background:#fff; box-shadow: 0 0 0 4px rgba(124,58,237,.12);}
        .tmg-form-grid .tmg-field:nth-child(odd) input,
        .tmg-form-grid .tmg-field:nth-child(odd) select{min-width:0;}
        .tmg-avatar-preview{width: 88px; height: 88px; border-radius: 18px; border: 1px solid #e2e8f0; display:flex; align-items:center; justify-content:center; background:#f8fafc; overflow:hidden;}
        .tmg-avatar-preview img{width:100%; height:100%; object-fit:cover;}
        .tmg-avatar-placeholder{color:#6b7280; font-size:13px; text-align:center;}
        .tmg-server-error{margin-top:12px; padding:12px 14px; border-radius:14px; background:#fee2e2; color:#991b1b; font-weight:700;}
        .tmg-modal-actions{padding:18px 22px 20px; border-top:1px solid rgba(148,163,184,.18); display:flex; justify-content:flex-end; gap:12px; flex-wrap:wrap;}
        .tmg-btn-ghost, .tmg-btn-primary{min-width:110px; height:44px; border-radius:12px; font-weight:700; letter-spacing:.01em;}
        .tmg-btn-ghost{border:1px solid #cbd5e1; background:#ffffff; color:#1f2937;}
        .tmg-btn-ghost:hover{background:#f8fafc;}
        .tmg-btn-primary{border:none; background:linear-gradient(135deg,#4f46e5,#7c3aed); color:#fff; box-shadow:0 12px 30px rgba(79,70,229,.18);}
        .tmg-btn-primary:hover{opacity:.95;}
        @media (max-width: 760px) { .tmg-form-grid{grid-template-columns: 1fr;} .tmg-modal{width: min(100%, 100%);} }
      `}</style>
    <div className="tmg-modal-backdrop" role="dialog" aria-modal="true">
      <div className="tmg-modal">
        <div className="tmg-modal-head">
          <div>
            <div className="tmg-modal-title">{mode === 'edit' ? 'Edit Trainer' : 'Add Trainer'}</div>
            <div className="tmg-modal-sub">Fill in trainer information.</div>
          </div>
          <button className="tmg-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="tmg-modal-body">
          <form
            className="tmg-form"
            onSubmit={(e) => {
              e.preventDefault();
              setTouched((t) => ({ ...t, fullName: true, email: true, phoneNumber: true }));
              onSubmit(form, isValid);
            }}
          >
            <div className="tmg-form-grid">
              <div className="tmg-field">
                <label>Full Name *</label>
                <input
                  value={form.fullName}
                  onChange={handleChange('fullName')}
                  onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                />
                {touched.fullName && errors.fullName && <div className="tmg-error">{errors.fullName}</div>}
              </div>

              <div className="tmg-field">
                <label>Email *</label>
                <input
                  value={form.email}
                  onChange={handleChange('email')}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                />
                {touched.email && errors.email && <div className="tmg-error">{errors.email}</div>}
              </div>

              <div className="tmg-field">
                <label>Phone Number *</label>
                <input
                  value={form.phoneNumber}
                  onChange={handleChange('phoneNumber')}
                  onBlur={() => setTouched((t) => ({ ...t, phoneNumber: true }))}
                />
                {touched.phoneNumber && errors.phoneNumber && (
                  <div className="tmg-error">{errors.phoneNumber}</div>
                )}
              </div>

                  <div className="tmg-field">
                <label>Campus *</label>
                <select value={form.campus} onChange={handleChange('campus')} onBlur={() => setTouched((t) => ({ ...t, campus: true }))}>
                  <option value="">Select campus</option>
                  {campuses.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {touched.campus && errors.campus && <div className="tmg-error">{errors.campus}</div>}
              </div>

              <div className="tmg-field">
                <label>Gender *</label>
                <select value={form.gender} onChange={handleChange('gender')}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && <div className="tmg-error">{errors.gender}</div>}
              </div>

              <div className="tmg-field">
                <label>Qualification *</label>
                <input value={form.qualification} onChange={handleChange('qualification')} />
                {errors.qualification && <div className="tmg-error">{errors.qualification}</div>}
              </div>

              <div className="tmg-field">
                <label>Experience (Years) *</label>
                <input type="number" value={form.experience} onChange={handleChange('experience')} />
                {errors.experience && <div className="tmg-error">{errors.experience}</div>}
              </div>

              <div className="tmg-field">
                <label>Joining Date *</label>
                <input type="date" value={form.joiningDate} onChange={handleChange('joiningDate')} />
                {errors.joiningDate && <div className="tmg-error">{errors.joiningDate}</div>}
              </div>

              <div className="tmg-field">
                <label>Salary *</label>
                <input type="number" value={form.salary} onChange={handleChange('salary')} />
                {errors.salary && <div className="tmg-error">{errors.salary}</div>}
              </div>

              <div className="tmg-field tmg-field-span">
                <label>Address *</label>
                <input value={form.address} onChange={handleChange('address')} />
                {errors.address && <div className="tmg-error">{errors.address}</div>}
              </div>

              <div className="tmg-field">
                <label>Status *</label>
                <select value={form.status} onChange={handleChange('status')}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {errors.status && <div className="tmg-error">{errors.status}</div>}
              </div>

              <div className="tmg-field">
                <label>Profile Picture Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      setForm((prev) => ({ ...prev, profilePicturePreview: reader.result }));
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                <div className="tmg-avatar-preview">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" />
                  ) : (
                    <div className="tmg-avatar-placeholder">No image</div>
                  )}
                </div>
              </div>
            </div>

            {serverError && <div className="tmg-server-error">{serverError}</div>}

            <div className="tmg-modal-actions">
              <button type="button" className="tmg-btn-ghost" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="tmg-btn-primary" disabled={loading}>
                {loading ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default TrainerModal;

