const express = require("express");

const Registration =
    require("../models/Registration");

const Event =
    require("../models/Event");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// REGISTER FOR EVENT
// POST /api/registrations/:eventId
// =====================================================

router.post(
    "/:eventId",
    protect,
    async (req, res) => {

        try {

            const event =
                await Event.findById(
                    req.params.eventId
                );

            if (
    event.registeredCount >=
    event.capacity
) {

    return res.status(400).json({

        success: false,

        message: "Event is full."

    });

}

            if (!event) {

                return res.status(404).json({

                    success: false,

                    message: "Event not found"

                });

            }


            // Check if already registered

const existingRegistration =
    await Registration.findOne({
        student: req.user._id,
        event: event._id
    });


if (existingRegistration) {

    // If registration was cancelled,
    // reactivate it

    if (
        existingRegistration.status ===
        "Cancelled"
    ) {

        existingRegistration.status =
            "Registered";

        existingRegistration.registrationDate =
            new Date();

        await existingRegistration.save();

        return res.status(200).json({

            success: true,

            message:
                "Registration reactivated successfully.",

            registration:
                existingRegistration

        });

    }


    // Already registered

    return res.status(400).json({

        success: false,

        message:
            "You are already registered for this event."

    });

}


            // Create registration

            const registration =
                await Registration.create({

                    student: req.user._id,

                    event: event._id

                });
                event.registeredCount++;

                await event.save();


            res.status(201).json({

                success: true,

                message:
                    "Successfully registered for event.",

                registration: registration

            });


        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message:
                    "Failed to register for event."

            });

        }

    }
);

// =====================================================
// GET REGISTRATION COUNT
// GET /api/registrations/stats/count
// =====================================================

// =====================================================
// GET ALL REGISTRATIONS
// GET /api/registrations
// =====================================================

router.get(
    "/",
    protect,adminOnly,
    async (req, res) => {

        try {

            const registrations =
                await Registration.find()
                    .populate(
                        "student",
                        "name email studentId course"
                    )
                    .populate(
                        "event"
                    )
                    .sort({
                        createdAt: -1
                    });

            res.json({

                success: true,

                count:
                    registrations.length,

                registrations:
                    registrations

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch all registrations."

            });

        }

    }
);

router.get(
    "/stats/count",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const totalRegistrations =
                await Registration.countDocuments({
                    status: "Registered"
                });

            res.json({

                success: true,

                totalRegistrations:
                    totalRegistrations

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch registration statistics."

            });

        }

    }
);

// =====================================================
// GET MY REGISTRATIONS
// GET /api/registrations/my
// =====================================================


router.get(
    "/my",
    protect,
    async (req, res) => {

        try {

            const registrations =
                await Registration.find({

                    student: req.user._id

                })
                .populate(
                    "event"
                )
                .sort({
                    createdAt: -1
                });


            res.json({

                success: true,

                count:
                    registrations.length,

                registrations:
                    registrations

            });


        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch registrations."

            });

        }

    }
);


// =====================================================
// CANCEL REGISTRATION
// PUT /api/registrations/:id/cancel
// =====================================================

router.put(
    "/:id/cancel",
    protect,
    async (req, res) => {

        try {

            const registration =
                await Registration.findOne({

                    _id: req.params.id,

                    student: req.user._id

                });


            if (!registration) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Registration not found."

                });

            }


            registration.status =
                "Cancelled";

            const event =
    await Event.findById(
        registration.event
    );

if (
    event &&
    event.registeredCount > 0
) {

    event.registeredCount--;

    await event.save();

}
            await registration.save();


            res.json({

                success: true,

                message:
                    "Registration cancelled successfully.",

                registration:
                    registration

            });


        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message:
                    "Failed to cancel registration."

            });

        }

    }
);

// =====================================
// TOTAL REGISTRATIONS
// =====================================

router.get(
    "/count/all",
    async (req, res) => {

        try {

            const totalRegistrations =
                await Registration.countDocuments();

            res.json({

                success: true,

                totalRegistrations

            });

        } catch (error) {

            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch registration count"

            });

        }

    }
);

module.exports = router;