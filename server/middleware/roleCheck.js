// Check user role - expects authenticate middleware to have run first
export const requireRole = (roles) => {
    return (req, res, next) => {
        // req.user is set by the authenticate middleware
        if (!req.user || !req.user.role) {
            return res.status(401).json({ error: 'User role not provided in token' });
        }

        // roles parameter can be a single string or an array of strings
        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }

        next();
    };
};
