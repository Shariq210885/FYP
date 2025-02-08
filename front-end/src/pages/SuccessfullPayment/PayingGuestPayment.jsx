import { useEffect } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { UpdatePayingGuestBooking } from "../../api/PayingGuestBooking/PayingGuestBooking";

function PayingGuestPaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  // State to store booking details

  useEffect(() => {
    async function updateBookingService() {
      if (sessionId) {
        try {
            await UpdatePayingGuestBooking(sessionId);
            
         
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
            Thank you! Your payment has been processed successfully.
          </p>
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

export default PayingGuestPaymentSuccess;
