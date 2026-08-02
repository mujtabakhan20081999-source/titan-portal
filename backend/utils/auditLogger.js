const AuditLog = require('../models/AuditLog');

async function writeAuditLog({
  req,
  action,
  label,
  module,
  entityType = '',
  entityId = '',
  details = '',
  meta = {},
}) {
  try {
    await AuditLog.create({
      actor: req?.user?.id || req?.user?._id || undefined,
      actorName: req?.user?.fullName || req?.user?.email || 'System',
      actorRole: req?.user?.role || '',
      action,
      label: label || action,
      module,
      entityType,
      entityId: entityId ? String(entityId) : '',
      details,
      meta,
      ip: req?.ip || req?.headers?.['x-forwarded-for'] || '',
    });
  } catch (error) {
    console.error('Audit log write failed:', error.message);
  }
}

module.exports = { writeAuditLog };
