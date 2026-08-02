const Permission = require('../models/Permission');

const ROLE_ALIAS = {
  teacher: 'trainer',
  trainer: 'trainer',
  superadmin: 'superadmin',
  subadmin: 'subadmin',
  student: 'student',
};

const ALL_PERMS = ['read', 'write', 'update', 'export'];
const MODULES = ['Dashboard', 'Students', 'Attendance', 'Slots', 'Trainers', 'Updation', 'Reports', 'Settings', 'Audit Logs'];

const DEFAULT_PERMISSIONS = {
  superadmin: Object.fromEntries(MODULES.map((module) => [module, [...ALL_PERMS]])),
  subadmin: Object.fromEntries(MODULES.map((module) => [module, module === 'Settings' || module === 'Audit Logs' ? ['read'] : ['read', 'write', 'update', 'export']])),
  trainer: Object.fromEntries(MODULES.map((module) => [module, ['Dashboard', 'Attendance', 'Students'].includes(module) ? ['read', 'write', 'update'] : ['read']])),
  student: Object.fromEntries(MODULES.map((module) => [module, module === 'Dashboard' ? ['read'] : []])),
};

const LABEL_TO_MODULE = {
  Dashboard: 'Dashboard',
  Students: 'Students',
  Attendance: 'Attendance',
  'Administration (Slots)': 'Slots',
  Slots: 'Slots',
  Trainers: 'Trainers',
  Updation: 'Updation',
  Reports: 'Reports',
  Settings: 'Settings',
  'Audit Logs': 'Audit Logs',
  Profile: 'Dashboard',
  Permissions: 'Settings',
  Support: 'Settings',
  'Trainer Portal': 'Dashboard',
  'Student Portal': 'Dashboard',
};

async function ensureDefaultPermissions() {
  await Promise.all(
    Object.entries(DEFAULT_PERMISSIONS).map(async ([role, permissions]) => {
      await Permission.findOneAndUpdate(
        { role },
        { $setOnInsert: { permissions } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    })
  );
}

async function getPermissionsForRole(role) {
  await ensureDefaultPermissions();
  const key = ROLE_ALIAS[role] || role;
  const doc = await Permission.findOne({ role: key }).lean();
  return doc?.permissions || DEFAULT_PERMISSIONS[key] || {};
}

function hasPermission(permissions, moduleName, action) {
  if (!permissions || typeof permissions !== 'object') return false;
  const allowed = permissions[moduleName] || [];
  return Array.isArray(allowed) && allowed.includes(action);
}

function requirePermission(moduleName, action = 'read') {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
      }

      if (req.user.role === 'superadmin') {
        req.permissions = await getPermissionsForRole('superadmin');
        return next();
      }

      const permissions = await getPermissionsForRole(req.user.role);
      req.permissions = permissions;

      if (!hasPermission(permissions, moduleName, action)) {
        return res.status(403).json({
          success: false,
          message: `Forbidden: missing ${action} permission on ${moduleName}`,
        });
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = {
  ROLE_ALIAS,
  LABEL_TO_MODULE,
  MODULES,
  ALL_PERMS,
  DEFAULT_PERMISSIONS,
  ensureDefaultPermissions,
  getPermissionsForRole,
  hasPermission,
  requirePermission,
};
