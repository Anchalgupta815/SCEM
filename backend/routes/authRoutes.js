const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");
const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// STUDENT REGISTRATION
// ==========================================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            studentId,
            course
        } = req.body;


        // Check required fields

        if (
            !name ||
            !email ||
            !password ||
            !studentId ||
            !course
        ) {

            return res.status(400).json({

                success: false,

                message: "Please fill all fields."

            });

        }


        // Check existing email

        const existingEmail =
            await User.findOne({
                email: email.toLowerCase()
            });


        if (existingEmail) {

            return res.status(400).json({

                success: false,

                message: "Email is already registered."

            });

        }


        // Check existing student ID

        const existingStudent =
            await User.findOne({
                studentId
            });


        if (existingStudent) {

            return res.status(400).json({

                success: false,

                message: "Student ID is already registered."

            });

        }


        // Hash password

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create user

        const user = new User({

            name,

            email: email.toLowerCase(),

            password: hashedPassword,

            studentId,

            course,

            role: "student"

        });


        // Save user

        await user.save();


        res.status(201).json({

            success: true,

            message: "Registration successful!"

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server error during registration."

        });

    }

});


// ==========================================
// LOGIN
// ==========================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Check fields

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Please enter email and password."

            });

        }


        // Find user

        const user =
            await User.findOne({
                email: email.toLowerCase()
            });


        // User not found

        if (!user) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password."

            });

        }


        // Compare password

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        // Wrong password

        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password."

            });

        }


        // Create JWT

        const token =
            jwt.sign(

                {
                    userId: user._id,

                    role: user.role

                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "1d"
                }

            );


        // Send response

        res.status(200).json({

            success: true,

            message: "Login successful!",

            token: token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                studentId: user.studentId,

                course: user.course,

                role: user.role

            }

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server error during login."

        });

    }

});

// =====================================
// GET LOGGED-IN USER
// =====================================

router.get("/me", protect, async (req, res) => {

    try {

        res.json({

            success: true,

            user: req.user

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server error"

        });

    }

});

// =====================================
// UPDATE PROFILE
// PUT /api/auth/profile
// =====================================

router.put(
    "/profile",
    protect,
    async (req, res) => {

        try {

            const {
                name,
                studentId,
                course
            } = req.body;

            const user =
                await User.findById(
                    req.user._id
                );

            if (!user) {

                return res.status(404).json({

                    success: false,
                    message: "User not found"

                });

            }

            user.name =
                name || user.name;

            user.studentId =
                studentId || user.studentId;

            user.course =
                course || user.course;

            await user.save();

            res.json({

                success: true,

                message:
                    "Profile updated successfully",

                user

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message:
                    "Failed to update profile"

            });

        }

    }
);

// =====================================
// ADMIN STATISTICS - TOTAL STUDENTS
// =====================================

router.get(
    "/stats/count",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const totalStudents =
                await User.countDocuments({
                    role: "student"
                });

            res.json({

                success: true,

                totalStudents:
                    totalStudents

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch student statistics."

            });

        }

    }
);

module.exports = router;
