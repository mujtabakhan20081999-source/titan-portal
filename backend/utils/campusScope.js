function campusRegex(campus) {
  if (!campus) return null;
  const base = String(campus).replace(/\s*Campus$/i, '').trim();
  if (!base) return null;
  return new RegExp(`^${base}(\\s+Campus)?$`, 'i');
}

function applyCampusScope(req, filter = {}, field = 'campus') {
  if (req.user?.role !== 'subadmin') return filter;
  const campus = req.user.campus || req.query.campus || '';
  const regex = campusRegex(campus);
  if (!regex) return filter;
  return { ...filter, [field]: regex };
}

function studentCampusFilter(req, filter = {}) {
  if (req.user?.role !== 'subadmin') return filter;
  const campus = req.user.campus || req.query.city || req.query.campus || '';
  const base = String(campus).replace(/\s*Campus$/i, '').trim();
  if (!base) return filter;
  const regex = new RegExp(`^${base}(\\s+Campus)?$`, 'i');
  const campusClause = {
    $or: [
      { city: new RegExp(`^${base}$`, 'i') },
      { campus: regex },
    ],
  };
  if (!Object.keys(filter).length) return campusClause;
  return { $and: [filter, campusClause] };
}

module.exports = { campusRegex, applyCampusScope, studentCampusFilter };
