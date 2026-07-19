// Middleware to check if the user is logged in
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // We expect a token in the format "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Hold up! You need to provide a valid auth token." });
    }

    const token = authHeader.split(' ')[1];
    
    // Hardcoded tokens just for demonstration purposes. 
    // In reality, you'd verify a JWT or check the database here.
    if (token === 'mock-admin-token') {
        req.user = { id: 1, role: 'admin' };
        next();
    } else if (token === 'mock-user-token') {
        req.user = { id: 2, role: 'user' };
        next();
    } else {
        res.status(401).json({ error: "Invalid token. Access denied." });
    }
};

// Middleware to check if the logged-in user has the right permissions
export const authorize = (requiredRole) => {
    return (req, res, next) => {
        // Double-check they're logged in AND have the matching role
        if (req.user && req.user.role === requiredRole) {
            next(); // They're allowed in
        } else {
            res.status(403).json({ error: "You don't have permission to do this." });
        }
    };
};
