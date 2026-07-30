import { useEffect, useMemo, useState } from 'react';
import TrainerHeader from '../components/admin/TrainerHeader';
import TrainerTable from '../components/admin/TrainerTable';
import TrainerModal from '../components/admin/TrainerModal';
import TrainerDetails from '../components/admin/TrainerDetails';
import DeleteModal from '../components/admin/DeleteModal';
import { deleteTrainer, getCampuses, listTrainers, createTrainer, updateTrainer } from '../services/trainerService';

function normalizeTrainerForForm(t) {
  if (!t) return null;
  return {
    fullName: t.fullName || '',
    email: t.email || '',
    phoneNumber: t.phoneNumber || '',
    campus: t.campus || '',
    gender: t.gender || '',
    qualification: t.qualification || '',
    experience: t.experience ?? '',
    joiningDate: t.joiningDate || '',
    salary: t.salary ?? '',
    address: t.address || '',
    status: t.status || 'Active',
    profilePictureUrl: t.profilePictureUrl ?? null,
    profilePicturePreview: null,
  };
}

function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [campusFilter, setCampusFilter] = useState('All Campuses');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [modalInitialValues, setModalInitialValues] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTrainer, setDetailsTrainer] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTrainerState, setDeleteTrainerState] = useState(null);

  const campuses = useMemo(() => getCampuses(), []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const rows = await listTrainers();
        if (isMounted) setTrainers(rows);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const openAdd = () => {
    setServerError('');
    setModalMode('add');
    setModalInitialValues({
      fullName: '',
      email: '',
      phoneNumber: '',
      campus: campuses[0] || '',
      gender: '',
      qualification: '',
      experience: '',
      joiningDate: '',
      salary: '',
      address: '',
      status: 'Active',
      profilePictureUrl: null,
      profilePicturePreview: null,
    });
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setServerError('');
    setModalMode('edit');
    setModalInitialValues({ ...normalizeTrainerForForm(t), id: t._id || t.id });
    setModalOpen(true);
  };

  const onSave = async (form, isValid) => {
    if (!isValid) {
      setServerError('Please fix validation errors.');
      return;
    }

    setModalLoading(true);
    setServerError('');
    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        campus: form.campus,
        gender: form.gender,
        qualification: form.qualification,
        experience: Number(form.experience),
        joiningDate: form.joiningDate,
        salary: Number(form.salary),
        address: form.address,
        status: form.status,
        profilePictureUrl: form.profilePicturePreview || form.profilePictureUrl || null,
      };

      if (modalMode === 'add') {
        const created = await createTrainer(payload);
        setTrainers((prev) => [created, ...prev]);
      } else {
        const updated = await updateTrainer(modalInitialValues?.id, payload);
        setTrainers((prev) => prev.map((x) => {
          const xId = x._id || x.id;
          const updatedId = updated._id || updated.id;
          return xId === updatedId ? updated : x;
        }));
      }

      setModalOpen(false);
    } catch (err) {
      setServerError(err?.message || 'Failed to save trainer');
    } finally {
      setModalLoading(false);
    }
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const rows = await listTrainers();
      setTrainers(rows);
    } finally {
      setLoading(false);
    }
  };

  const openView = (t) => {
    setDetailsTrainer(t);
    setDetailsOpen(true);
  };

  const openDelete = (t) => {
    setDeleteTrainerState(t);
    setDeleteOpen(true);
  };

  const confirmDelete = async (id) => {
    setDeleteOpen(false);
    setLoading(true);
    try {
      await deleteTrainer(id);
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tmg-page">
      <style>{tmgStyles}</style>
      <div className="tmg-sr" />

      <TrainerHeader
        title="Trainers"
        subtitle="Manage trainers and staff information."
        onAdd={openAdd}
        searchValue={search}
        onSearchChange={setSearch}
        onNotifyClick={() => {}}
      />

      <TrainerTable
        loading={loading}
        trainers={trainers}
        campuses={campuses}
        search={search}
        onSearchChange={setSearch}
        campusFilter={campusFilter}
        onCampusFilterChange={setCampusFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onView={openView}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <TrainerModal
        open={modalOpen}
        mode={modalMode}
        initialValues={modalInitialValues}
        campuses={campuses}
        loading={modalLoading}
        serverError={serverError}
        onClose={() => setModalOpen(false)}
        onSubmit={onSave}
      />

      <TrainerDetails
        open={detailsOpen}
        trainer={detailsTrainer}
        onClose={() => setDetailsOpen(false)}
      />

      <DeleteModal
        open={deleteOpen}
        trainer={deleteTrainerState}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

const tmgStyles = `
  :root { --tmg-purple: #6C5CE7; --tmg-radius: 12px; }
  .tmg-page { width: 100%; }

  .tmg-header-card{
    background:#fff;
    border:1px solid rgba(108,92,231,.10);
    border-radius: 16px;
    padding:18px 18px;
    box-shadow: 0 10px 30px rgba(108,92,231,.08);
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    gap:14px;
    margin-bottom:14px;
  }
  .tmg-page-title{font-weight:900;font-size:24px;color:#1f1a3a;}
  .tmg-page-subtitle{margin-top:4px;font-size:13.5px;color:#6b6f86;}
  .tmg-header-right{margin-left:auto;display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:flex-end;}
  .tmg-header-actions{display:flex;align-items:center;gap:12px;}

  .tmg-search{
    display:flex;align-items:center;gap:10px;
    background:#fff;border:1px solid rgba(108,92,231,.18);
    border-radius: 14px; padding:10px 14px; min-width: 260px;
  }
  .tmg-search svg{color: var(--tmg-purple);}
  .tmg-search input{border:none;outline:none;width:100%;font-size:13.5px;}

  .tmg-icon-btn{
    width:42px;height:42px;border-radius: 14px;
    border:1px solid rgba(108,92,231,.18);
    background:#fff;color: var(--tmg-purple);
    display:grid;place-items:center;position:relative;
    transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
  }
  .tmg-icon-btn:hover{transform: translateY(-2px); box-shadow: 0 14px 30px rgba(108,92,231,.15); border-color: rgba(108,92,231,.35);} 
  .tmg-notify-dot{position:absolute;top:6px;right:7px;min-width:16px;height:16px;border-radius:999px;background:#ff4757;color:#fff;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;border:2px solid #fff;}

  .tmg-profile{display:flex;align-items:center;gap:10px;}
  .tmg-profile-avatar{width:42px;height:42px;border-radius:50%;background: linear-gradient(135deg, rgba(108,92,231,.95), rgba(108,92,231,.55)); color:#fff; display:grid; place-items:center; border: 1px solid rgba(108,92,231,.25);} 
  .tmg-profile-meta{line-height:1.2;}
  .tmg-profile-name{font-weight:900;font-size:12.5px;color:#1f1a3a;}
  .tmg-profile-role{font-weight:700;font-size:11.5px;color:#7b7e99;}

  .tmg-add-btn{
    background: var(--tmg-purple);
    color:#fff;
    border:none;
    border-radius: 14px;
    padding:12px 16px;
    font-weight:900;
    letter-spacing:.2px;
    box-shadow: 0 16px 34px rgba(108,92,231,.25);
    display:flex;align-items:center;gap:10px;
    transition: transform .18s ease, box-shadow .18s ease, filter .18s ease;
  }
  .tmg-add-btn:hover{transform: translateY(-2px); filter: brightness(1.02); box-shadow: 0 22px 50px rgba(108,92,231,.30);} 
  .tmg-add-dot{width:10px;height:10px;border-radius:999px;background: rgba(255,255,255,.85);}

  @media (max-width: 860px){
    .tmg-header-card{flex-direction:column;align-items:stretch;}
    .tmg-search{min-width: 100%;}
    .tmg-header-actions{justify-content:space-between;}
  }
  @media (max-width: 560px){
    .tmg-header-actions{flex-wrap:wrap;}
    .tmg-profile-meta{display:none;}
    .tmg-search{padding:9px 12px;}
  }

  .tmg-card{background:#fff;border:1px solid rgba(108,92,231,.10); border-radius:16px; box-shadow: 0 12px 32px rgba(108,92,231,.06); overflow:hidden;}
  .tmg-table-head{padding:16px 16px 12px; display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap;}
  .tmg-table-heading{font-weight:950;font-size:16px;color:#1f1a3a;}
  .tmg-table-sub{margin-top:4px;font-size:12.5px;color:#6b6f86;}
  .tmg-filters-inline{display:flex;gap:10px;align-items:center;flex-wrap:wrap;}
  .tmg-select{border:1px solid rgba(108,92,231,.18); border-radius: 12px; padding:10px 12px; font-weight:700; color:#1f1a3a; background:#fff;}

  .tmg-table-scroll{width:100%; overflow-x:auto; -webkit-overflow-scrolling: touch;}
  .tmg-table{width:100%; min-width: 980px; border-collapse: collapse;}
  .tmg-table thead th{background: rgba(108,92,231,.06); color:#4b3fb6; font-size:11.5px; text-transform:uppercase; letter-spacing:.06em; padding:12px 10px; border-bottom:1px solid rgba(108,92,231,.12);}
  .tmg-th-btn{width:100%; text-align:left; background:transparent; border:none; color:inherit; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:8px;}
  .tmg-sort-ind{font-size:10px;color: rgba(108,92,231,.85);} 
  .tmg-table tbody td{padding:12px 10px; border-bottom:1px solid rgba(108,92,231,.08); color:#3c3750; font-size:13.5px;}
  .tmg-tr-row{transition: background .18s ease, transform .18s ease; cursor:pointer;}
  .tmg-tr-row:hover{background: rgba(108,92,231,.04);} 

  .tmg-name-cell{display:flex; align-items:center; gap:12px;}
  .tmg-avatar{width:34px;height:34px;border-radius:50%; background: rgba(108,92,231,.12); border:1px solid rgba(108,92,231,.22); color: var(--tmg-purple); display:grid; place-items:center; font-weight:950; font-size:12.5px;}
  .tmg-name{font-weight:900;color:#1f1a3a;}
  .tmg-muted{color:#7b7e99; font-size:12px; margin-top:2px;}

  .tmg-actions{display:flex; gap:10px; align-items:center;}
  .tmg-icon-action{border:none; background: rgba(108,92,231,.08); color: var(--tmg-purple); border-radius: 12px; width:34px;height:34px; display:grid; place-items:center; transition: transform .15s ease, background .15s ease;}
  .tmg-icon-action:hover{transform: translateY(-2px); background: rgba(108,92,231,.14);} 
  .tmg-icon-danger{border:none; background: rgba(255,71,87,.10); color:#ff4757; border-radius: 12px; width:34px;height:34px; display:grid; place-items:center; transition: transform .15s ease, background .15s ease;}
  .tmg-icon-danger:hover{transform: translateY(-2px); background: rgba(255,71,87,.18);} 

  .tmg-badge{display:inline-flex; align-items:center; justify-content:center; padding:6px 10px; border-radius:999px; font-weight:950; font-size:12px; border:1px solid transparent;}
  .tmg-badge.active{background: rgba(22,163,74,.10); border-color: rgba(22,163,74,.25); color:#16a34a;}
  .tmg-badge.inactive{background: rgba(239,68,68,.10); border-color: rgba(239,68,68,.25); color:#ef4444;}

  .tmg-empty{padding:46px 12px; text-align:center;}
  .tmg-empty-icon{font-size:30px;color: rgba(108,92,231,.7);}
  .tmg-empty-title{margin-top:10px;font-weight:950;color:#1f1a3a;}
  .tmg-empty-sub{margin-top:6px;color:#6b6f86;font-weight:700;font-size:12.5px;}

  .tmg-spinner{width:24px;height:24px;border-radius:50%; border:3px solid rgba(108,92,231,.18); border-top-color: var(--tmg-purple); animation: tmgspin .9s linear infinite; margin: 12px auto;}
  @keyframes tmgspin{to{transform:rotate(360deg);}}
  .tmg-skeleton{height:120px;}

  .tmg-pagination{display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 16px; flex-wrap:wrap; border-top:1px solid rgba(108,92,231,.10);}
  .tmg-page-meta{color:#6b6f86;font-weight:800;font-size:12.5px;}
  .tmg-page-controls{display:flex; align-items:center; gap:10px; flex-wrap:wrap; justify-content:flex-end;}
  .tmg-page-btn{background:#fff; border:1px solid rgba(108,92,231,.18); color: var(--tmg-purple); border-radius: 12px; padding:9px 12px; font-weight:900; font-size:12.5px; transition: transform .15s ease, background .15s ease;}
  .tmg-page-btn:hover{transform: translateY(-2px); background: rgba(108,92,231,.06);} 
  .tmg-page-btn:disabled{opacity:.45; cursor:not-allowed; transform:none;}
  .tmg-page-numbers{display:flex; align-items:center; gap:8px;}
  .tmg-page-num{min-width:38px; padding:9px 10px; border-radius: 12px; border:1px solid rgba(108,92,231,.18); background:#fff; color: var(--tmg-purple); font-weight:950; transition: transform .15s ease, background .15s ease;}
  .tmg-page-num.active{background: rgba(108,92,231,.14);}
  .tmg-page-num:hover{transform: translateY(-2px);} 
  .tmg-ellipsis{color:#6b6f86;font-weight:950; padding:0 2px;}

  /* Modal */
  .tmg-modal-backdrop{position:fixed; inset:0; background: rgba(17, 12, 58, .55); display:flex; align-items:center; justify-content:center; padding: 18px; z-index: 999;}
  .tmg-modal{width: min(760px, 100%); max-height: 500px; background:#fff; border-radius: 16px; box-shadow: 0 30px 80px rgba(0,0,0,.28); border:1px solid rgba(108,92,231,.15); overflow:hidden;}
  .tmg-modal-sm{width: min(520px, 100%);} 
  .tmg-modal-wide{width: min(900px, 100%);} 
  .tmg-modal-head{padding:16px 16px; display:flex; align-items:flex-start; justify-content:space-between; gap:14px; border-bottom:1px solid rgba(108,92,231,.12); background: linear-gradient(180deg, rgba(108,92,231,.06), rgba(108,92,231,.00));}
  .tmg-modal-title{font-weight:1000;font-size:16px;color:#1f1a3a;}
  .tmg-modal-sub{margin-top:5px;font-weight:800;color:#6b6f86;font-size:12.5px;}
  .tmg-modal-close{border:none;background:transparent;font-size:24px;line-height:1;color:#6b6f86; cursor:pointer; padding:2px 8px;}
  .tmg-modal-body{padding:16px 16px 18px; overflow-y:auto; max-height: calc(500px - 113px);}

  .tmg-form-grid{display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:16px; align-items:start;}
  .tmg-field{display:flex; flex-direction:column; gap:8px; min-width:0;}
  .tmg-field-span{grid-column: 1 / -1;}
  .tmg-field label{font-size:12.5px; font-weight:950; color:#2b2750;}
  .tmg-field input, .tmg-field select, .tmg-field input[type="file"]{width:100%; border:1px solid rgba(108,92,231,.18); border-radius: 12px; padding:10px 12px; outline:none; font-weight:800; color:#1f1a3a; background:#fff; box-sizing:border-box;}
  .tmg-field input[type="file"]{padding:12px 12px 10px;}
  .tmg-field input:focus, .tmg-field select:focus, .tmg-field input[type="file"]:focus{border-color: rgba(108,92,231,.55); box-shadow: 0 0 0 4px rgba(108,92,231,.12);} 
  .tmg-error{color:#ff4757; font-weight:900; font-size:11.5px; margin-top: -3px;}
  .tmg-server-error{margin: 8px 0 0; padding: 10px 12px; border-radius: 12px; background: rgba(255,71,87,.10); border:1px solid rgba(255,71,87,.25); color:#d32f2f; font-weight:950; font-size:12.5px;}

  .tmg-avatar-preview{margin-top:8px;}
  .tmg-avatar-preview img{width:72px;height:72px;border-radius: 18px; object-fit:cover; border:1px solid rgba(108,92,231,.2);} 
  .tmg-avatar-placeholder{width:72px;height:72px;border-radius: 18px; border:1px dashed rgba(108,92,231,.28); display:grid; place-items:center; color:#6b6f86; font-weight:900; font-size:11px; background: rgba(108,92,231,.04);} 

  .tmg-modal-actions{padding:14px 16px; border-top:1px solid rgba(108,92,231,.12); display:flex; justify-content:flex-end; gap:10px; flex-wrap:wrap;}
  .tmg-btn-primary{background: var(--tmg-purple); color:#fff; border:none; border-radius: 14px; padding:11px 16px; font-weight:1000; box-shadow: 0 16px 34px rgba(108,92,231,.25); transition: transform .18s ease, box-shadow .18s ease;}
  .tmg-btn-primary:hover{transform: translateY(-2px); box-shadow: 0 22px 50px rgba(108,92,231,.30);} 
  .tmg-btn-ghost{background:#fff; border:1px solid rgba(108,92,231,.20); color: var(--tmg-purple); border-radius: 14px; padding:11px 16px; font-weight:1000; transition: transform .18s ease, background .18s ease;}
  .tmg-btn-ghost:hover{transform: translateY(-2px); background: rgba(108,92,231,.06);} 
  .tmg-btn-danger{background:#ff4757; color:#fff; border:none; border-radius: 14px; padding:11px 16px; font-weight:1000; transition: transform .18s ease;}
  .tmg-btn-danger:hover{transform: translateY(-2px);} 

  .tmg-delete-body{display:flex; gap:12px; align-items:center;}
  .tmg-delete-icon{width:46px;height:46px;border-radius: 16px; background: rgba(255,71,87,.12); border:1px solid rgba(255,71,87,.25); display:grid; place-items:center; font-size:24px; color:#ff4757; font-weight:1000;}
  .tmg-delete-text{font-weight:900; color:#1f1a3a; font-size:13.5px;}
  .tmg-delete-sub{margin-top:4px;color:#6b6f86;font-weight:800;font-size:12.5px;}

  .tmg-details-grid{display:grid; grid-template-columns: 220px 1fr; gap:16px; align-items:start;}
  .tmg-details-avatar img{width:100%; border-radius: 18px; border:1px solid rgba(108,92,231,.20); object-fit:cover;}
  .tmg-details-avatar .tmg-avatar-placeholder{width:100%; height: 220px; border-radius: 18px;}
  .tmg-details-name{font-weight:1100; font-size:20px; color:#1f1a3a;}
  .tmg-details-sub{margin-top:8px; display:flex; align-items:center; gap:10px; flex-wrap:wrap;}
  .tmg-details-chip{background: rgba(108,92,231,.08); border:1px solid rgba(108,92,231,.20); color: var(--tmg-purple); font-weight:1000; padding:6px 10px; border-radius:999px; font-size:12px;}
  .tmg-status-chip{font-weight:1000; padding:6px 10px; border-radius:999px; font-size:12px; border:1px solid transparent;}
  .tmg-status-chip.active{background: rgba(22,163,74,.10); border-color: rgba(22,163,74,.25); color:#16a34a;}
  .tmg-status-chip.inactive{background: rgba(239,68,68,.10); border-color: rgba(239,68,68,.25); color:#ef4444;}
  .tmg-details-fields{margin-top:12px; display:flex; flex-direction:column; gap:8px; font-weight:800; color:#3c3750;}
  .tmg-details-fields b{color:#1f1a3a;}
  .tmg-details-address{margin-top:4px;}

  .tmg-hide-mobile{display: table-cell;}
  @media (max-width: 860px){
    .tmg-hide-mobile{display:none;}
    .tmg-table{min-width: 820px;}
    .tmg-form-grid{grid-template-columns: 1fr;}
    .tmg-details-grid{grid-template-columns: 1fr;}
    .tmg-details-avatar .tmg-avatar-placeholder{height: 200px;}
  }
`;

export default Trainers;

