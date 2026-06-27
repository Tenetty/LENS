import React, { useContext } from "react";
import Datatable from "../components/datatable/Datatable";
import useFetch from "../hooks/useFetch";
import { Link, useLocation } from "react-router-dom";
import jspdf from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { AuthContext } from "../context/authContext";

const Hotellist = ({ columns }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  // We use /hotels/mine so the Hotel Manager only sees their own hotels
  const fetchPath = user && (user.role === "Admin" || user.isAdmin) ? "/hotels/all" : "/hotels/mine";
  const { data } = useFetch(fetchPath);
  console.log(data);

  function generatePDF(tickets) {
    const doc = new jspdf();
    const tableColumn = [
      "ID",
      "Hotel Name",
      "Hotel Type",
      "City",
      "Contact No",
      "Contact Name",
      "Cheapest price",
      "Added By",
    ];
    const tableRows = [];

    tickets
      .slice(0)
      .reverse()
      .map((ticket, index) => {
        const ticketData = [
          index + 1,
          ticket.name,
          ticket.type,
          ticket.city,
          ticket.contactNo,
          ticket.contactName,
          ticket.cheapestPrice,
          ticket.owner ? ticket.owner.name : "Unknown",
        ];
        tableRows.push(ticketData);
      });

    doc.autoTable(tableColumn, tableRows, {
      styles: { fontSize: 7 },
      startY: 35,
    });
    const date = Date().split(" ");
    const dateStr = date[1] + "-" + date[2] + "-" + date[3];
    doc.text("Traverly-Hotel-Details-Report ", 14, 15).setFontSize(12);
    doc.text(`Report Generated Date - ${dateStr} `, 14, 23);
    doc.save(`Hotel-Details-Report_${dateStr}.pdf`);
  }

  return (
    <>
      <div className="flex flex-row col-span-2 lg:px-32 px-8 pt-7 pb-2 justify-between md:items-center ">
        <div className="text-3xl font-bold">Hotel Managment</div>
        <div className="grid md:grid-cols-2 gap-1">
          <Link to="/hotels/new" className="bg-blue-500 hover:bg-blue-700 text-center text-white font-bold py-2 px-4 rounded cursor-pointer lg:mt-0 mt-3">
            Add Hotel
          </Link>
          <Link to="/hotels/bookings" className="bg-gray-800 hover:bg-gray-600 text-center text-white font-bold py-2 px-4 rounded cursor-pointer lg:mt-0 mt-3">
            Hotel Reservations
          </Link>
        </div>
      </div>
      <div className="lg:px-32 px-8 flex md:justify-end">
        <Link
          onClick={() => {
            generatePDF(data);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-center text-white font-bold py-2 px-4 rounded cursor-pointer lg:mt-0 mt-3">
          Generate Report
        </Link>
      </div>
      <div>
        <Datatable columns={columns} fetchPath={fetchPath} />
      </div>
    </>
  );
};

export default Hotellist;
