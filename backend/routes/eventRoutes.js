const express = require("express");

const Event = require("../models/Event");

const Registration = require("../models/Registration");
const router = express.Router();


// =====================================================
// CREATE EVENT
// POST /api/events
// =====================================================

router.post("/", async (req, res) => {

    try {

        const event = await Event.create(req.body);

        res.status(201).json({

            success: true,

            message: "Event created successfully",

            event: event

        });

    } catch (error) {

        console.error(error);

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

});


// =====================================================
// GET ALL EVENTS
// GET /api/events
// =====================================================

router.get("/", async (req, res) => {

    try {

        const events =
            await Event.find().sort({ date: 1 });


        const eventsWithSeats =
            await Promise.all(

                events.map(async (event) => {

                    const registeredCount =
                        await Registration.countDocuments({
                            event: event._id,
                            status: "Registered"
                        });


                    const availableSeats =
                        Math.max(
                            event.capacity -
                            registeredCount,
                            0
                        );


                    return {

                        ...event.toObject(),

                        registeredCount:
                            registeredCount,

                        availableSeats:
                            availableSeats

                    };

                })

            );


        res.json({

            success: true,

            count:
                eventsWithSeats.length,

            events:
                eventsWithSeats

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Failed to fetch events"

        });

    }

});


router.get("/stats/count", async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();

        res.json({
            success: true,
            totalEvents: totalEvents
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch statistics"
        });
    }
});

// =====================================================
// GET SINGLE EVENT
// GET /api/events/:id
// =====================================================

router.get("/:id", async (req, res) => {

    try {

        const event =
            await Event.findById(req.params.id);


        if (!event) {

            return res.status(404).json({

                success: false,

                message: "Event not found"

            });

        }


        res.json({

            success: true,

            event: event

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: "Failed to fetch event"

        });

    }

});

// =====================================================
// UPDATE EVENT
// PUT /api/events/:id
// =====================================================

router.put("/:id", async (req, res) => {

    try {

        const event =
            await Event.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );


        if (!event) {

            return res.status(404).json({

                success: false,

                message: "Event not found"

            });

        }


        res.json({

            success: true,

            message: "Event updated successfully",

            event: event

        });

    } catch (error) {

        console.error(error);

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

});
// =====================================================
// DELETE EVENT
// DELETE /api/events/:id
// =====================================================

router.delete("/:id", async (req, res) => {

    try {

        // Find the event first
        const event =
            await Event.findById(req.params.id);

        if (!event) {

            return res.status(404).json({

                success: false,

                message: "Event not found"

            });

        }


        // Delete all registrations
        // associated with this event
        const deletedRegistrations =
            await Registration.deleteMany({

                event: event._id

            });


        // Delete the event
        await Event.findByIdAndDelete(
            req.params.id
        );


        res.json({

            success: true,

            message:
                "Event and related registrations deleted successfully.",

            deletedRegistrations:
                deletedRegistrations.deletedCount

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Failed to delete event."

        });

    }

});

router.put(
    "/:id/complete",
    async (req, res) => {

        try {

            const event =
                await Event.findByIdAndUpdate(
                    req.params.id,
                    {
                        status: "Completed"
                    },
                    {
                        new: true
                    }
                );

            res.json({
                success: true,
                event
            });

        } catch (error) {

            res.status(500).json({
                success: false
            });

        }

    }
);

module.exports = router;