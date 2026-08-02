const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    actorName: { type: String, trim: true, default: 'System' },
    actorRole: { type: String, trim: true, default: '' },
    action: { type: String, required: true, trim: true }, // create | update | delete | login | system
    label: { type: String, trim: true, default: '' },
    module: { type: String, trim: true, default: '' },
    entityType: { type: String, trim: true, default: '' },
    entityId: { type: String, trim: true, default: '' },
    details: { type: String, trim: true, default: '' },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    ip: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ module: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
