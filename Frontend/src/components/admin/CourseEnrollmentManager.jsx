import { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import {
  getStudentEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} from '../../services/enrollmentService';
import '../../styles/admin.css';

const STATUS_BADGE = {
  Enrolled: 'badge-blue', Approved: 'badge-green', Passed: 'badge-green', Completed: 'badge-green',
  Rejected: 'badge-grey', Failed: 'badge-grey', Dropout: 'badge-grey', Pending: 'badge-amber',
};

export default function CourseEnrollmentManager({ student, hierarchy, onClose }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    course: '',
    courseRef: '',
    status: 'Pending',
    batch: '',
    batchName: '',
    slot: '',
    campus: student?.campus || '',
  });

  // Fetch enrollments when modal opens
  useEffect(() => {
    if (student) {
      loadEnrollments();
    }
  }, [student]);

  const loadEnrollments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getStudentEnrollments(student._id);
      setEnrollments(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEnrollment = async () => {
    setError('');
    if (!formData.course) {
      setError('Please select a course');
      return;
    }

    setSubmitting(true);
    try {
      const courseObj = hierarchy.courses.find((c) => c.name === formData.course);
      const enrolled = await createEnrollment(student._id, {
        course: formData.course,
        courseRef: courseObj?._id,
        status: formData.status,
        batch: formData.batch || undefined,
        batchName: formData.batchName || '',
        slot: formData.slot || '',
        campus: formData.campus || student.campus,
      });

      setEnrollments([enrolled, ...enrollments]);
      setSuccess('Course enrollment added successfully');
      setShowForm(false);
      setFormData({
        course: '',
        courseRef: '',
        status: 'Pending',
        batch: '',
        batchName: '',
        slot: '',
        campus: student?.campus || '',
      });

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add enrollment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateEnrollment = async (enrollmentId, newStatus) => {
    setError('');
    try {
      const updated = await updateEnrollment(student._id, enrollmentId, { status: newStatus });
      setEnrollments(enrollments.map((e) => (e._id === enrollmentId ? updated : e)));
      setSuccess('Enrollment status updated');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update enrollment');
    }
  };

  const handleDeleteEnrollment = async (enrollmentId) => {
    if (!window.confirm('Remove this enrollment?')) return;

    setError('');
    try {
      await deleteEnrollment(student._id, enrollmentId);
      setEnrollments(enrollments.filter((e) => e._id !== enrollmentId));
      setSuccess('Enrollment removed');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete enrollment');
    }
  };

  const availableCourses = hierarchy.courses.filter(
    (c) => !enrollments.some((e) => e.course === c.name && e.status !== 'Dropout')
  );

  return (
    <div className="tmg-modal-backdrop">
      <div className="tmg-modal" style={{ maxWidth: 800 }}>
        <div className="tmg-modal-head">
          <div>
            <div className="tmg-modal-title">Course Enrollments</div>
            <div className="tmg-modal-sub">{student?.name} ({student?.roll})</div>
          </div>
          <button className="tmg-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="tmg-modal-body">
          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: 12, borderRadius: 6, marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: 12, borderRadius: 6, marginBottom: 12 }}>
              ✓ {success}
            </div>
          )}

          {loading ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#64748b' }}>Loading enrollments...</div>
          ) : (
            <>
              {/* Current Enrollments */}
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#1e293b' }}>Current Enrollments</h3>
                {enrollments.length === 0 ? (
                  <div style={{ padding: 16, background: '#f8fafc', borderRadius: 6, color: '#64748b', textAlign: 'center' }}>
                    No courses enrolled yet
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {enrollments.map((enrollment) => (
                      <div key={enrollment._id} style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr auto auto auto',
                        gap: 12,
                        padding: 12,
                        background: '#f8fafc',
                        borderRadius: 6,
                        alignItems: 'center',
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                          {enrollment.course}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                          {enrollment.batchName && `Batch: ${enrollment.batchName}`}
                          {enrollment.slotId && (enrollment.batchName ? ` · ${enrollment.slotId}` : `Slot: ${enrollment.slotId}`)}
                        </div>
                        <select
                          value={enrollment.status}
                          onChange={(e) => handleUpdateEnrollment(enrollment._id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            fontSize: 12,
                            borderRadius: 4,
                            border: '1px solid #e2e8f0',
                            background: '#fff',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Enrolled">Enrolled</option>
                          <option value="Passed">Passed</option>
                          <option value="Failed">Failed</option>
                          <option value="Dropout">Dropout</option>
                        </select>
                        <span className={`badge ${STATUS_BADGE[enrollment.status] || 'badge-grey'}`} style={{ fontSize: 11 }}>
                          {enrollment.status}
                        </span>
                        <button
                          onClick={() => handleDeleteEnrollment(enrollment._id)}
                          style={{
                            padding: '4px 8px',
                            background: '#fee2e2',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer',
                            color: '#991b1b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Enrollment Form */}
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  disabled={availableCourses.length === 0}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: availableCourses.length === 0 ? '#e2e8f0' : '#2563eb',
                    color: availableCourses.length === 0 ? '#64748b' : '#fff',
                    border: 'none',
                    borderRadius: 6,
                    cursor: availableCourses.length === 0 ? 'not-allowed' : 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Plus size={16} /> Add Course Enrollment
                </button>
              ) : (
                <div style={{ background: '#f8fafc', padding: 16, borderRadius: 6 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#1e293b' }}>Add New Enrollment</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>
                        Course *
                      </label>
                      <select
                        value={formData.course}
                        onChange={(e) => {
                          setFormData((f) => ({ ...f, course: e.target.value }));
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          fontSize: 12,
                          borderRadius: 4,
                          border: '1px solid #e2e8f0',
                          background: '#fff',
                        }}
                      >
                        <option value="">Select Course</option>
                        {availableCourses.map((c) => (
                          <option key={c._id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          fontSize: 12,
                          borderRadius: 4,
                          border: '1px solid #e2e8f0',
                          background: '#fff',
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Enrolled">Enrolled</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>
                        Batch
                      </label>
                      <input
                        type="text"
                        value={formData.batchName}
                        onChange={(e) => setFormData((f) => ({ ...f, batchName: e.target.value }))}
                        placeholder="e.g., Batch A"
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          fontSize: 12,
                          borderRadius: 4,
                          border: '1px solid #e2e8f0',
                          background: '#fff',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>
                        Slot
                      </label>
                      <input
                        type="text"
                        value={formData.slot}
                        onChange={(e) => setFormData((f) => ({ ...f, slot: e.target.value }))}
                        placeholder="e.g., Morning"
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          fontSize: 12,
                          borderRadius: 4,
                          border: '1px solid #e2e8f0',
                          background: '#fff',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setFormData({
                          course: '',
                          courseRef: '',
                          status: 'Pending',
                          batch: '',
                          batchName: '',
                          slot: '',
                          campus: student?.campus || '',
                        });
                      }}
                      style={{
                        padding: '8px 16px',
                        background: '#f1f5f9',
                        border: '1px solid #e2e8f0',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#475569',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddEnrollment}
                      disabled={submitting || !formData.course}
                      style={{
                        padding: '8px 16px',
                        background: submitting || !formData.course ? '#e2e8f0' : '#16a34a',
                        border: 'none',
                        borderRadius: 4,
                        cursor: submitting || !formData.course ? 'not-allowed' : 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                        color: submitting || !formData.course ? '#64748b' : '#fff',
                      }}
                    >
                      {submitting ? 'Adding...' : 'Add Enrollment'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
