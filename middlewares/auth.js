const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
    verifyToken: (req, res, next) => {
        const token = req.cookies.accessToken;
        if (!token) return res.status(403).json({ message: "Access denied" });

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(401).json({ message: "Invalid token" });
            req.user = decoded;
            next();
        });
    },

    verifyRefreshToken: (req, res, next) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(403).json({ message: "Refresh token required" });

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(401).json({ message: "Invalid refresh token" });
            req.user = decoded;
            next();
        });
    }
};
