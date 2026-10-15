const express = require("express");

const Notification =
    require("../models/Notification");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// SEND NOTIFICATION
// POST /api/notifications
// ADMIN ONLY
// =====================================================

router.post(
    "/",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const {
                title,
                message
            } = req.body;


            // Check fields

            if (
                !title ||
                !message
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please enter notification title and message."

                });

            }


            // Create notification

            const notification =
                await Notification.create({

                    title: title.trim(),

                    message: message.trim(),

                    createdBy:
                        req.user._id

                });


            res.status(201).json({

                success: true,

                message:
                    "Notification sent successfully.",

                notification:
                    notification

            });


        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message:
                    "Failed to send notification."

            });

        }

    }
);


// =====================================================
// GET ALL NOTIFICATIONS
// GET /api/notifications
// LOGGED-IN USERS
// =====================================================

router.get(
    "/",
    protect,
    async (req, res) => {

        try {

            const notifications =
                await Notification.find()
                    .sort({
                        createdAt: -1
                    });


            res.json({

                success: true,

                count:
                    notifications.length,

                notifications:
                    notifications

            });


        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch notifications."

            });

        }

    }
);


// =====================================================
// DELETE NOTIFICATION
// DELETE /api/notifications/:id
// ADMIN ONLY
// =====================================================

router.delete(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const notification =
                await Notification.findByIdAndDelete(
                    req.params.id
                );


            if (!notification) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Notification not found."

                });

            }


            res.json({

                success: true,

                message:
                    "Notification deleted successfully."

            });


        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message:
                    "Failed to delete notification."

            });

        }

    }
);


module.exports = router;