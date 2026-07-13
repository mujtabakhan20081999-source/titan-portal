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
      employeeId: '',
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
      'employeeId',
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
              setTouched((t) => ({ ...t, fullName: true, email: true, phoneNumber: true, employeeId: true }));
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
                <label>Employee ID *</label>
                <input
                  value={form.employeeId}
                  onChange={handleChange('employeeId')}
                  onBlur={() => setTouched((t) => ({ ...t, employeeId: true }))}
                  disabled={mode === 'edit'}
                />
                {touched.employeeId && errors.employeeId && <div className="tmg-error">{errors.employeeId}</div>}
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
  );
}

export default TrainerModal;

