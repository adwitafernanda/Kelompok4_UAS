
module.exports = (req, res, next) => {
    res.locals.session = req.session;
    res.locals.userId = req.session.userId;
    res.locals.userRole = req.session.userRole;
    if (!req.session.userId && !req.path.startsWith('/users')) {
        return res.redirect('/users/login');
    }
    next();
};

// Middleware untuk memeriksa apakah pengguna adalah admin
module.exports.isAdmin = (req, res, next) => {
    if (req.session.userRole !== 'admin') {
        return res.status(403).send('Access denied. Only admins can perform this action.');
    }
    next();
};