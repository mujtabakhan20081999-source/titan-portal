function DeleteModal({ open, trainer, onClose, onConfirm }) {
  if (!open || !trainer) return null;

  return (
    <div className="tmg-modal-backdrop" role="dialog" aria-modal="true">
      <div className="tmg-modal tmg-modal-sm">
        <div className="tmg-modal-head">
          <div>
            <div className="tmg-modal-title">Delete Trainer?</div>
            <div className="tmg-modal-sub">This action can’t be undone.</div>
          </div>
          <button className="tmg-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="tmg-modal-body">
          <div className="tmg-delete-body">
            <div className="tmg-delete-icon">!</div>
            <div>
              <div className="tmg-delete-text">
                Are you sure you want to delete <b>{trainer.fullName}</b>?
              </div>
              <div className="tmg-delete-sub">Employee ID: {trainer.employeeId}</div>
            </div>
          </div>
        </div>

        <div className="tmg-modal-actions">
          <button className="tmg-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="tmg-btn-danger" onClick={() => onConfirm(trainer.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;

