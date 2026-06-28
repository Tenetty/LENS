import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/images/bg.jpg";
import axios from "axios";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {percent > 0 ? `${(percent * 100).toFixed(0)}%` : ""}
    </text>
  );
};

const Admin = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("/users/admin/stats")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Failed to load admin stats:", err);
      });
  }, []);

  const barData = stats ? [
    { name: "Hotels", count: stats.reservations.hotels },
    { name: "Vehicles", count: stats.reservations.vehicles },
    { name: "Activities", count: stats.reservations.activities },
    { name: "Tours", count: stats.reservations.tours },
  ] : [];

  const pieData = stats ? [
    { name: "Users", value: stats.counts.users },
    { name: "Hotels", value: stats.counts.hotels },
    { name: "Vehicles", value: stats.counts.vehicles },
    { name: "Tours", value: stats.counts.tours },
  ] : [];

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="md:px-20 md:pt-20 md:pb-48 p-5 pb-20">
        <h1 className="text-center text-[#41A4FF] text-3xl font-bold ">
          Traverly Admin
        </h1>
        <h1 className="text-center text-lg pb-5">{user.name}</h1>

        <div className="flex flex-row col-span-3 lg:px-32 px-8 pt-8 justify-between items-stretch gap-10">
          <Link
            to="/users"
            className="p-10 flex-1 hover:bg-[#41A4FF] hover:text-2xl transition duration-300 ease-in-out hover:text-white rounded-lg font-bold shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white text-center"
          >
            User Management
          </Link>
          <Link
            to="/hotels"
            className="p-10 flex-1 hover:bg-[#41A4FF] hover:text-2xl transition duration-300 ease-in-out hover:text-white rounded-lg font-bold shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white text-center"
          >
            Hotel Management
          </Link>
          <Link
            to="/pending-hotels"
            className="p-10 flex-1 hover:bg-[#FF8042] hover:text-2xl transition duration-300 ease-in-out hover:text-white rounded-lg font-bold shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white text-center"
          >
            Hotel Approvals
          </Link>
          <Link
            to="/tours"
            className="p-10 flex-1 hover:bg-[#41A4FF] hover:text-2xl transition duration-300 ease-in-out hover:text-white rounded-lg font-bold shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white text-center"
          >
            Tour Packages
          </Link>
        </div>

        <div className="flex flex-row col-span-3 lg:px-32 px-8 pt-8 justify-between items-stretch gap-10">
          <Link
            to="/vehicle"
            className="p-10 flex-1 hover:bg-[#41A4FF] hover:text-2xl transition duration-300 ease-in-out hover:text-white rounded-lg font-bold shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white text-center"
          >
            Vehicle Management
          </Link>
          <Link
            to="/pending-vehicles"
            className="p-10 flex-1 hover:bg-[#FF8042] hover:text-2xl transition duration-300 ease-in-out hover:text-white rounded-lg font-bold shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white text-center"
          >
            Vehicle Approvals
          </Link>
          <Link
            to="/restaurants"
            className="p-10 flex-1 hover:bg-[#41A4FF] hover:text-2xl transition duration-300 ease-in-out hover:text-white rounded-lg font-bold shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white text-center"
          >
            Restaurant Management
          </Link>
        </div>

        <div className="flex flex-row col-span-3 lg:px-32 px-8 pt-8 justify-between items-stretch gap-10">
          <Link
            to="/pending-activities"
            className="p-10 flex-1 hover:bg-[#41A4FF] hover:text-2xl transition duration-300 ease-in-out hover:text-white rounded-lg font-bold shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white text-center"
          >
            Event Management
          </Link>
          <Link
            to="/admin/add-admin"
            className="p-10 flex-1 hover:bg-[#FE4D42] hover:text-2xl transition duration-300 ease-in-out hover:text-white rounded-lg font-bold shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white text-center"
          >
            Add New Admin
          </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row col-span-2 lg:px-32 px-8 pt-8 justify-between items-stretch gap-10">
          <div className="p-10 flex-1 rounded-lg font-bold shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white">
            <h2 className="text-center text-lg font-bold text-gray-700 mb-6">Total Reservations by Category</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Reservations" fill="#41A4FF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="p-10 flex-1 rounded-lg font-bold shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white">
            <h2 className="text-center text-lg font-bold text-gray-700 mb-2">System Records Summary</h2>
            <div className="w-full flex justify-center">
              <PieChart width={320} height={320}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs mt-2 border-t pt-4">
              {pieData.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="h-3 w-3 rounded-sm mb-1"
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <p className="font-semibold text-gray-600">{item.name}</p>
                  <p className="font-bold text-gray-900 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
