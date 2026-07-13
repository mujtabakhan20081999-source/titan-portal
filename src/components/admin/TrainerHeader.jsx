import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';

function TrainerHeader({ title, subtitle, onAdd, searchValue, onSearchChange, onNotifyClick }) {
  return (
    <div className="tmg-header-card">
      <div className="tmg-header-left">
        <div className="tmg-page-title">{title}</div>
        <div className="tmg-page-subtitle">{subtitle}</div>
      </div>

      <div className="tmg-header-right">
        <div className="tmg-header-actions">
          <label className="tmg-search">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search trainers by name or email…"
            />
          </label>

          <button className="tmg-icon-btn" onClick={onNotifyClick} aria-label="Notifications">
            <FontAwesomeIcon icon={faBell} />
            <span className="tmg-notify-dot">5</span>
          </button>

          <div className="tmg-profile" title="Admin profile">
            <div className="tmg-profile-avatar">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className="tmg-profile-meta">
              <div className="tmg-profile-name">Admin</div>
              <div className="tmg-profile-role">Super Admin</div>
            </div>
          </div>
        </div>

        <button className="tmg-add-btn" onClick={onAdd}>
          <span className="tmg-add-dot" />
          Add Trainer
        </button>
      </div>
    </div>
  );
}

export default TrainerHeader;

