module.exports = {
    authMiddleware: (req, res, next) => {
        if (req.session.user)
            next();
        else
            res.send({ success: false, message: 'login' });
    }
}