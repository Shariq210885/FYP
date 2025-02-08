import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { UpdateServiceBooking } from "../../api/serviceBooking/serviceBooking";

function ServicePaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  // State to store booking details
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    async function updateBookingService() {
      if (sessionId) {
        try {
            const response = await UpdateServiceBooking(sessionId);
            
          if (response.status === 200) {
            setBookingDetails(response.data.data[0]); // Assuming the data is in the first array element
          }
        } catch (error) {
          console.error("Error fetching booking details:", error);
        }
      }
    }
    updateBookingService();
  }, [sessionId]);

 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-11/12 p-8 bg-white rounded-md shadow-md sm:w-96">
        <div className="flex flex-col items-center space-y-4">
          <FaThumbsUp size={30} className="text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-800">
            Payment Successful
          </h1>
          <p className="text-center text-gray-600">
            Thank you! Your payment has been processed successfully. Here are
            your booking details:
          </p>
          <div className="w-full space-y-2 text-gray-700">
            <p>
              <strong>Service ID:</strong> {bookingDetails?.serviceId}
            </p>
            <p>
              <strong>Sub-Services:</strong>{" "}
              {bookingDetails?.subServices
                .map((sub) => sub.title
            )
                .join(", ")}
            </p>
            <p>
              <strong>Total Price:</strong> Rs.{bookingDetails?.totalPrice}
            </p>
            <p>
              <strong>Status:</strong> {bookingDetails?.status}
            </p>
        
            <p>
              <strong>Scheduled Date:</strong>{" "}
              {new Date(bookingDetails?.scheduledDate).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 text-white rounded-md bg-primaryColor hover:bg-primaryColor/90"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServicePaymentSuccess;
