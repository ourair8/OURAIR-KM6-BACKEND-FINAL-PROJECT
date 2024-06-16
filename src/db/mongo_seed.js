const data = [
    {
      "flightId": 1,
      "seats": [
        {"seatNumber": "A1", "isBooked": false, "passengerId": null},
        {"seatNumber": "A2", "isBooked": true, "passengerId": 123}
      ]
    },
    {
      "flightId": 2,
      "seats": [
        {"seatNumber": "B1", "isBooked": false, "passengerId": null},
        {"seatNumber": "B2", "isBooked": true, "passengerId": 124}
      ]
    },
    {
      "flightId": 3,
      "seats": [
        {"seatNumber": "C1", "isBooked": false, "passengerId": null},
        {"seatNumber": "C2", "isBooked": true, "passengerId": 125}
      ]
    },
    {
      "flightId": 4,
      "seats": [
        {"seatNumber": "D1", "isBooked": false, "passengerId": null},
        {"seatNumber": "D2", "isBooked": true, "passengerId": 126}
      ]
    },
    {
      "flightId": 5,
      "seats": [
        {"seatNumber": "E1", "isBooked": false, "passengerId": null},
        {"seatNumber": "E2", "isBooked": true, "passengerId": 127}
      ]
    },
    {
      "flightId": 6,
      "seats": [
        {"seatNumber": "F1", "isBooked": false, "passengerId": null},
        {"seatNumber": "F2", "isBooked": true, "passengerId": 128}
      ]
    },
    {
      "flightId": 7,
      "seats": [
        {"seatNumber": "G1", "isBooked": false, "passengerId": null},
        {"seatNumber": "G2", "isBooked": true, "passengerId": 129}
      ]
    },
    {
      "flightId": 8,
      "seats": [
        {"seatNumber": "H1", "isBooked": false, "passengerId": null},
        {"seatNumber": "H2", "isBooked": true, "passengerId": 130}
      ]
    },
    {
      "flightId": 9,
      "seats": [
        {"seatNumber": "I1", "isBooked": false, "passengerId": null},
        {"seatNumber": "I2", "isBooked": true, "passengerId": 131}
      ]
    },
    {
      "flightId": 10,
      "seats": [
        {"seatNumber": "J1", "isBooked": false, "passengerId": null},
        {"seatNumber": "J2", "isBooked": true, "passengerId": 132}
      ]
    }
  ];

  const { mongoose, FlightSeats } = require("./schema")
  
  async function insertDataMongo() {
    try {
        const flightIds = data.map(flight => flight.flightId);
        await FlightSeats.deleteMany({ flightId: { $in: flightIds } });

        await FlightSeats.insertMany(data);
      console.log('Data inserted successfully!');
    } catch (error) {
      console.error('Error inserting data:', error);
    } finally {
      await mongoose.disconnect();
    }
  }

  async function updateFlightSeats() {
    try {
  

      // Membuat data kursi dari A1 sampai K6
      const seats = [];
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
      for (const row of rows) {
        for (let number = 1; number <= 6; number++) {
          seats.push({ seatNumber: `${row}${number}`, isBooked: false, passengerId: null });
        }
      }
  
      // Memperbarui dokumen dengan flightId 1
      await FlightSeats.updateOne(
        { flightId: 1},
        { $set: { seats: seats } }
      );
  
      console.log(`Data for flightId 1 updated successfully!`);
    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
      await mongoose.disconnect();
    }
  }
  
 module.exports = {
    insertDataMongo,
    updateFlightSeats
 }