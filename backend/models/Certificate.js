const mongoose =
    require("mongoose");

const certificateSchema =
    new mongoose.Schema({

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        },

        certificateId: {
            type: String,
            unique: true
        }

    },
    {
        timestamps: true
    });

module.exports =
    mongoose.model(
        "Certificate",
        certificateSchema
    );