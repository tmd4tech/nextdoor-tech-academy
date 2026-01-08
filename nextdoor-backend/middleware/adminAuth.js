// middleware/adminAuth.js
function requireAdmin(req, res, next) {
  const user = req.user; // must be set earlier by your JWT auth middleware
  const adminEmails = ['temidayoakanmu12@gmail.com'];

  if (!user || user.role !== 'admin' || !adminEmails.includes(user.email)) {
    return res.status(403).json({ message: 'Forbidden: admin access only' });
  }

  next();
}

module.exports = requireAdmin;