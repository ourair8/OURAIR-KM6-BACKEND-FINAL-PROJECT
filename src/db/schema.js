const mongoose = require("mongoose");

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_DB, {});

const seatSchema = new mongoose.Schema({
    seatNumber: {
        type: String,
        required: true,
    },
    isBooked: {
        type: Boolean,
        default: false,
    },
    passengerId: {
        type: Number,
        default: null,
    },
});

const flightSchema = new mongoose.Schema({
    flightId: {
        type: Number,
        required: true,
        unique: true,
    },
    seats: [seatSchema],
});

const FlightSeats = mongoose.model("FlightSeats", flightSchema);
const Seat = mongoose.model("Seat", seatSchema);

module.exports = { FlightSeats, Seat, mongoose };