const express = require("express");
const router = express.Router();

const Parking = require("../models/Parking");

const TOTAL_SLOTS = 8;


// ================= VEHICLE ENTRY =================
router.post("/entry", async (req, res) => {
    try {
        const { vehicleNumber, vehicleType } = req.body;

        // Count parked vehicles
        const occupiedSlots = await Parking.countDocuments({
            status: "parked",
        });

        // Parking full check
        if (occupiedSlots >= TOTAL_SLOTS) {
            return res.status(400).json({
                success: false,
                message: "Parking Full",
            });
        }

        // Auto slot assign
        const slotNumber = occupiedSlots + 1;

        const parking = await Parking.create({
            vehicleNumber,
            vehicleType,
            slotNumber,
        });

        res.status(201).json({
            success: true,
            message: "Vehicle Entered",
            data: parking,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


// ================= GET ALL VEHICLES =================
router.get("/", async (req, res) => {
    try {
        const vehicles = await Parking.find();

        res.json(vehicles);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


// ================= VEHICLE EXIT =================
// router.put("/exit/:id", async (req, res) => {
//     try {

//         const vehicle = await Parking.findById(req.params.id);

//         if (!vehicle) {
//             return res.status(404).json({
//                 message: "Vehicle not found",
//             });
//         }

//         // Already exited check
//         if (vehicle.status === "exited") {
//             return res.status(400).json({
//                 message: "Vehicle already exited",
//             });
//         }

//         const exitTime = new Date();

//         // Time difference in hours
//         const milliseconds =
//             exitTime - vehicle.entryTime;

//         let hours = Math.ceil(
//             milliseconds / (1000 * 60 * 60)
//         );

//         if (hours < 1) {
//             hours = 1;
//         }

//         let amount = 0;

//         // CAR BILLING
//         if (vehicle.vehicleType === "car") {

//             if (hours === 1) {
//                 amount = 40;
//             } else {
//                 amount = 40 + ((hours - 1) * 20);
//             }
//         }

//         // BIKE BILLING
//         else if (vehicle.vehicleType === "bike") {

//             if (hours === 1) {
//                 amount = 20;
//             } else {
//                 amount = 20 + ((hours - 1) * 10);
//             }
//         }

//         vehicle.exitTime = exitTime;
//         vehicle.status = "exited";
//         vehicle.amount = amount;

//         await vehicle.save();

//         res.json({
//             success: true,
//             message: "Vehicle Exited",
//             totalHours: hours,
//             totalAmount: amount,
//             data: vehicle,
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: error.message,
//         });
//     }
// });

router.put("/exit/:id", async (req, res) => {
    try {

        const vehicle = await Parking.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }

        // Already exited
        if (vehicle.status === "exited") {
            return res.status(400).json({
                success: false,
                message: "Vehicle already exited",
            });
        }

        // Exit time
        const exitTime = new Date();

        // Time Difference
        const diffMilliseconds =
            exitTime.getTime() - new Date(vehicle.entryTime).getTime();

        // Convert into hours
        let hours = Math.ceil(
            diffMilliseconds / (1000 * 60 * 60)
        );

        // Minimum 1 hour
        if (hours <= 0) {
            hours = 1;
        }

        let amount = 0;

        // ================= CAR BILL =================
        if (vehicle.vehicleType === "car") {

            // First hour = 40
            // Remaining = 20/hr

            amount = 40;

            if (hours > 1) {
                amount += (hours - 1) * 20;
            }
        }

        // ================= BIKE BILL =================
        else if (vehicle.vehicleType === "bike") {

            // First hour = 20
            // Remaining = 10/hr

            amount = 20;

            if (hours > 1) {
                amount += (hours - 1) * 10;
            }
        }

        // ================= UPDATE DB =================
        vehicle.exitTime = exitTime;

        vehicle.totalHours = hours;

        vehicle.amount = amount;

        vehicle.status = "exited";

        await vehicle.save();

        // ================= RESPONSE =================
        res.json({
            success: true,
            message: "Vehicle Exited Successfully",
            totalHours: hours,
            totalAmount: amount,
            data: vehicle,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;