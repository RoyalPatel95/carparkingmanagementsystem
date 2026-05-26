const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
    {
        vehicleNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        vehicleType: {
            type: String,
            enum: ["car", "bike"],
            required: true,
        },

        slotNumber: {
            type: Number,
            required: true,
        },

        entryTime: {
            type: Date,
            default: Date.now,
        },

        exitTime: {
            type: Date,
            default: null,
        },

        totalHours: {
            type: Number,
            default: 0,
        },

        amount: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["parked", "exited"],
            default: "parked",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Parking", parkingSchema);