import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000/api/parking";

function App() {

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("car");
  const [vehicles, setVehicles] = useState([]);
  const [message, setMessage] = useState("");

  // ================= GET VEHICLES =================
  const getVehicles = async () => {

    try {

      const res = await axios.get(API);

      setVehicles(res.data);

    } catch (error) {

      console.log(error);
    }
  };


  useEffect(() => {

    getVehicles();

  }, []);


  // ================= ENTRY =================
  const handleEntry = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(`${API}/entry`, {
        vehicleNumber,
        vehicleType,
      });

      setMessage(res.data.message);

      setVehicleNumber("");
      setVehicleType("car");

      getVehicles();

    } catch (error) {

      setMessage(error.response?.data?.message);
    }
  };


  // ================= EXIT =================
  const handleExit = async (id) => {

    try {

      const res = await axios.put(`${API}/exit/${id}`);

      alert(`Total Amount: ₹${res.data.totalAmount}`);

      getVehicles();

    } catch (error) {

      console.log(error);
    }
  };


  // ================= FILTER PARKED =================
  const parkedVehicles = vehicles.filter(
    (v) => v.status === "parked"
  );


  // ================= RETURN UI =================
  return (

    <div className="w-[90%] mx-auto font-sans py-6">

      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
        Car Parking Management System
      </h1>


      {/* ================= ENTRY BLOCK ================= */}

      <div className="bg-white p-6 rounded-xl shadow-lg">

        <h2 className="text-2xl font-semibold mb-4">
          Vehicle Entry
        </h2>

        <form
          onSubmit={handleEntry}
          className="flex flex-col md:flex-row gap-4"
        >

          <input
            type="text"
            placeholder="Vehicle Number"
            value={vehicleNumber}
            onChange={(e) =>
              setVehicleNumber(e.target.value)
            }
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={vehicleType}
            onChange={(e) =>
              setVehicleType(e.target.value)
            }
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >

            <option value="car">Car</option>

            <option value="bike">Bike</option>

          </select>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300"
          >
            Vehicle Entry
          </button>

        </form>

        <p className="mt-4 text-green-600 font-medium">
          {message}
        </p>

      </div>


      {/* ================= STATUS BLOCK ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            Total Slots
          </h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            8
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            Occupied
          </h3>
          <p className="text-3xl font-bold text-red-500 mt-2">
            {parkedVehicles.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            Available
          </h3>
          <p className="text-3xl font-bold text-green-500 mt-2">
            {8 - parkedVehicles.length}
          </p>
        </div>

      </div>


      {/* ================= TABLE BLOCK ================= */}

      <div className="bg-white p-6 rounded-xl shadow-lg mt-6">

        <h2 className="text-2xl font-semibold mb-4">
          Parked Vehicles
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full border-collapse">

            <thead>

              <tr className="bg-blue-600 text-white">

                <th className="p-3 text-left">
                  Vehicle No.
                </th>

                <th className="p-3 text-left">
                  Type
                </th>

                <th className="p-3 text-left">
                  Slot
                </th>

                <th className="p-3 text-left">
                  Status
                </th>

                <th className="p-3 text-left">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {parkedVehicles.map((vehicle) => (

                <tr
                  key={vehicle._id}
                  className="border-b hover:bg-gray-100 transition"
                >

                  <td className="p-3">
                    {vehicle.vehicleNumber}
                  </td>

                  <td className="p-3 capitalize">
                    {vehicle.vehicleType}
                  </td>

                  <td className="p-3">
                    {vehicle.slotNumber}
                  </td>

                  <td className="p-3 text-green-600 font-medium">
                    {vehicle.status}
                  </td>

                  <td className="p-3">

                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300"
                      onClick={() =>
                        handleExit(vehicle._id)
                      }
                    >
                      Exit
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default App;