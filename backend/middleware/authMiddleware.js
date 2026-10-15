const jwt = require("jsonwebtoken");
const User = require("../models/User");


// =====================================
// AUTHENTICATION
// =====================================

const protect = async (req, res, next) => {

    try {

        // Get authorization header
        const authHeader =
            req.headers.authorization;


        // Check if token exists
        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Not authorized. Token required."

            });

        }


        // Extract token
        const token =
            authHeader.split(" ")[1];


        // Verify token
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // Find user
        const user =
            await User.findById(
                decoded.userId
            ).select("-password");


        // Check user exists
        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "User not found."

            });

        }


        // Attach user to request
        req.user = user;


        // Continue to next middleware
        next();


    } catch (error) {

        console.error(
            "Authentication error:",
            error.message
        );


        return res.status(401).json({

            success: false,

            message:
                "Invalid or expired token."

        });

    }

};


// =====================================
// ADMIN AUTHORIZATION
// =====================================

const adminOnly = (req, res, next) => {

    // Check if user exists
    if (!req.user) {

        return res.status(401).json({

            success: false,

            message:
                "Not authorized."

        });

    }


    // Check admin role
    if (req.user.role !== "admin") {

        return res.status(403).json({

            success: false,

            message:
                "Admin access required."

        });

    }


    // User is admin
    next();

};


// =====================================
// EXPORT MIDDLEWARE
// =====================================

module.exports = {
    protect,
    adminOnly
};