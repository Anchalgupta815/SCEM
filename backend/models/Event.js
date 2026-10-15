const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        date: {
            type: String,
            required: true
        },

        time: {
            type: String,
            required: true
        },

        capacity: {
            type: Number,
            required: true,
            min: 1
        },

        registeredCount: {
    type: Number,
    default: 0
},

        venue: {
            type: String,
            required: true,
            trim: true
        },

        organizer: {
            type: String,
            required: true,
            trim: true
        },

        status: {
    type: String,
    enum: ["Upcoming", "Completed"],
    default: "Upcoming"
},

        description: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Event", eventSchema);