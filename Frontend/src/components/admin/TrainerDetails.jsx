function TrainerDetails({ open, trainer, onClose }) {
  if (!open || !trainer) return null;

  return (
    <div className="tmg-modal-backdrop" role="dialog" aria-modal="true">
      <div className="tmg-modal tmg-modal-wide">
        <div className="tmg-modal-head">
          <div>
            <div className="tmg-modal-title">Trainer Details</div>
            <div className="tmg-modal-sub">View complete trainer profile.</div>
          </div>
          <button className="tmg-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="tmg-modal-body">
          <div className="tmg-details-grid">
            <div className="tmg-details-avatar">
              {trainer.profilePictureUrl ? (
                <img src={trainer.profilePictureUrl} alt={trainer.fullName} />
              ) : (
                <div className="tmg-avatar-placeholder">No image</div>
              )}
            </div>

            <div className="tmg-details-meta">
              <div className="tmg-details-name">{trainer.fullName}</div>
              <div className="tmg-details-sub">
                <span className="tmg-details-chip">{trainer.employeeId}</span>
                <span className={`tmg-status-chip ${trainer.status === 'Active' ? 'active' : 'inactive'}`}
                >{trainer.status}</span>
              </div>

              <div className="tmg-details-fields">
                <div><b>Email:</b> {trainer.email}</div>
                <div><b>CNIC:</b> {trainer.cnic || '—'}</div>
                <div><b>Phone:</b> {trainer.phoneNumber}</div>
                <div><b>Campus:</b> {trainer.campus}</div>
                <div><b>Joining Date:</b> {trainer.joiningDate}</div>
                <div><b>Gender:</b> {trainer.gender}</div>
                <div><b>Qualification:</b> {trainer.qualification}</div>
                <div><b>Experience:</b> {trainer.experience} years</div>
                <div><b>Salary:</b> {trainer.salary}</div>
                <div><b>Hourly Rate:</b> {trainer.hourlyRate ?? '—'}</div>
                <div><b>Urdu Name:</b> {trainer.urduName || '—'}</div>
                <div><b>Courses Taught:</b> {(trainer.coursesTaught || []).join(', ') || '—'}</div>
                <div className="tmg-details-address"><b>Bio:</b> {trainer.bio || '—'}</div>
                <div><b>Facebook:</b> {trainer.socialLinks?.facebook || '—'}</div>
                <div><b>LinkedIn:</b> {trainer.socialLinks?.linkedin || '—'}</div>
                <div><b>YouTube:</b> {trainer.socialLinks?.youtube || '—'}</div>
                <div><b>Twitter:</b> {trainer.socialLinks?.twitter || '—'}</div>
                <div className="tmg-details-address"><b>Address:</b> {trainer.address}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="tmg-modal-actions">
          <button className="tmg-btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default TrainerDetails;

