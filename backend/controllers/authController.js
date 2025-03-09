exports.checkAuth = async (req, res) => {
    try {
        console.log('Session in checkAuth:', req.session);
        
        if (req.session && req.session.user) {
            res.json({
                isAuthenticated: true,
                userRole: req.session.user.role,
                userName: req.session.user.name,
                userId: req.session.user.id
            });
        } else {
            res.json({
                isAuthenticated: false,
                userRole: null,
                userName: null,
                userId: null
            });
        }
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(500).json({ 
            message: 'Error checking authentication status',
            error: error.message 
        });
    }
}; 