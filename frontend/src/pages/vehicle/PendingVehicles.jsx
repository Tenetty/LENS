import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const PendingVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get("/vehicle");
      setVehicles(res.data);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    try {
      // The backend route is a GET request for accept/:id
      await axios.get(`/vehicle/accept/${id}`);
      setVehicles(vehicles.map(v => v._id === id ? { ...v, isApproved: true, isAccepted: true } : v));
      Swal.fire({ icon: "success", title: "Vehicle Approved", showConfirmButton: false, timer: 1500 });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed to approve", text: err.message });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Reject & Delete this vehicle?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`/vehicle/${id}`);
        setVehicles(vehicles.filter(v => v._id !== id));
        Swal.fire({ icon: "success", title: "Deleted", showConfirmButton: false, timer: 1500 });
      } catch (err) {
        Swal.fire({ icon: "error", title: "Failed to delete", text: err.message });
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-lg">Loading vehicles...</div>;

  const pending = vehicles.filter(v => !v.isApproved && !v.isAccepted);
  const approved = vehicles.filter(v => v.isApproved || v.isAccepted);

  return (
    <div className="p-8 pb-32">
      <div className="text-3xl font-bold mb-8">Vehicle Approval Management</div>

      {/* Pending Vehicles */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-orange-500">
          Pending Approval ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-gray-500">No vehicles pending approval.</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-orange-50">
                <tr>
                  <th className="px-6 py-3">Vehicle</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Plate No</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Daily Price</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((vehicle) => (
                  <tr className="bg-white border-b hover:bg-gray-50" key={vehicle._id}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {vehicle.brand} {vehicle.model}
                    </td>
                    <td className="px-6 py-4">{vehicle.vehicleType}</td>
                    <td className="px-6 py-4">{vehicle.vehicleNumber}</td>
                    <td className="px-6 py-4">{vehicle.location}</td>
                    <td className="px-6 py-4">Rs. {vehicle.price}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleApprove(vehicle._id)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Approved Vehicles */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-green-600">
          Approved Vehicles ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="text-gray-500">No approved vehicles.</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-green-50">
                <tr>
                  <th className="px-6 py-3">Vehicle</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Plate No</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Daily Price</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {approved.map((vehicle) => (
                  <tr className="bg-white border-b hover:bg-gray-50" key={vehicle._id}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {vehicle.brand} {vehicle.model}
                    </td>
                    <td className="px-6 py-4">{vehicle.vehicleType}</td>
                    <td className="px-6 py-4">{vehicle.vehicleNumber}</td>
                    <td className="px-6 py-4">{vehicle.location}</td>
                    <td className="px-6 py-4">Rs. {vehicle.price}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(vehicle._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default PendingVehicles;
