import { useEffect, useState } from "react";
import axios from "axios"; // Import axios for API calls
import { FaEye } from "react-icons/fa6";
import { getMyBookings } from "../../../api/propertyBooking/propertyBooking";
import Loading from "../../../components/Loading"; // Import the Loading component

function MyBookings() {
  const [bookings, setBookings] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true); // Set loading to true before the API call
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        const response = await getMyBookings();
        console.log("Response from API:", response);
        if (response.status === 200) {
          setBookings(response.data.data || []); // Set the bookings data or fallback to an empty array
        } else {
          setBookings([]); // Fallback to an empty array if the response is not successful
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to fetch bookings. Please try again later.");
        setBookings([]); // Ensure bookings is set to an empty array on error
      } finally {
        setLoading(false); // Set loading to false after the API call
      }
    }
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col">
        <div className="w-full overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <h1 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-gray-800">
              My Bookings
            </h1>
            {loading ? (
              <div className="h-[60vh]">
                <Loading />
              </div>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <div className="overflow-hidden rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th
                          scope="col"
                          className="p-3 sm:p-4 md:p-5 text-xs sm:text-sm font-semibold leading-5 sm:leading-6 text-left text-gray-900 capitalize"
                        >
                          Image
                        </th>
                        <th
                          scope="col"
                          className="p-3 sm:p-4 md:p-5 text-xs sm:text-sm font-semibold leading-5 sm:leading-6 text-left text-gray-900 capitalize"
                        >
                          Title
                        </th>
                        <th
                          scope="col"
                          className="p-3 sm:p-4 md:p-5 text-xs sm:text-sm font-semibold leading-5 sm:leading-6 text-left text-gray-900 capitalize"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="p-3 sm:p-4 md:p-5 text-xs sm:text-sm font-semibold leading-5 sm:leading-6 text-left text-gray-900 capitalize"
                        >
                          Payment Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {bookings.map((booking, index) => (
                        <tr
                          key={index}
                          className="transition-all duration-500 bg-white hover:bg-gray-50"
                        >
                          <td className="p-3 sm:p-4 md:p-5 text-xs sm:text-sm font-medium leading-5 sm:leading-6 text-gray-900 whitespace-nowrap">
                            {booking.propertyId ? (
                              <img
                                src={booking.propertyId.images[0]}
                                alt="Property"
                                className="object-cover rounded-full w-10 h-10 sm:size-12 md:size-14"
                              />
                            ) : (
                              <img
                                src="https://hwchamber.co.uk/wp-content/uploads/2022/04/avatar-placeholder.gif"
                                alt="Placeholder"
                                className="object-cover rounded-full w-10 h-10 sm:size-12 md:size-14"
                              />
                            )}
                          </td>
                          <td className="p-3 sm:p-4 md:p-5 text-xs sm:text-sm font-medium leading-5 sm:leading-6 text-gray-900">
                            <div className="max-w-[150px] sm:max-w-[200px] md:max-w-none truncate">
                              {booking.propertyId ? booking.propertyId.title : ""}
                            </div>
                          </td>
                          <td className="p-3 sm:p-4 md:p-5 text-xs sm:text-sm font-medium leading-5 sm:leading-6 text-gray-900 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                              booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="p-3 sm:p-4 md:p-5 text-xs sm:text-sm font-medium leading-5 sm:leading-6 text-gray-900 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.paymentDetails.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 
                              booking.paymentDetails.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.paymentDetails.paymentStatus === 'Failed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.paymentDetails.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}                    </tbody>
                  </table>
                </div>
                {bookings.length === 0 && (
                  <p className="p-4 text-center text-gray-500 text-sm">
                    No bookings found.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyBookings;
