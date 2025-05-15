import { useEffect, useState } from "react";
import { AiFillStar, AiOutlineRight, AiOutlineExpand } from "react-icons/ai";
import PropertyCard from "../../../components/PropertyCard/PropertyCard";
import { useNavigate, useParams } from "react-router-dom";
import { RiDownload2Fill, RiHome4Fill } from "react-icons/ri";
import ReviewModel from "../../../components/ReviewModel/ReviewModel";
import { FaBath, FaBed, FaRulerCombined } from "react-icons/fa6";
import {
  getAllPayingGuest,
  getSinglePayingGuest,
  PayingGuestReview,
} from "../../../api/payingGuest/payingGuest";
import { UseUser } from "../../../context/UserContext";
import { createPayingGuestBooking } from "../../../api/PayingGuestBooking/PayingGuestBooking";
import { toast } from "react-toastify";
import PropertyReviews from "../../../components/OverAllReviews/OverAllReviews";
const PayGuestDetail = () => {
  const [data, setData] = useState(null);
  const [properties, setProperties] = useState([]);
  const { id } = useParams();
  const [mainImage, setMainImage] = useState();
  const navigate = useNavigate(); // hook to navigate to the details page
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { user } = UseUser();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(1);
  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  const handleBook = async () => {
    if (user) {
      const startIsoDate = new Date(startDate).toISOString();
      const endIsoDate = new Date(endDate).toISOString();

      // Create a new FormData instance
      const formData = new FormData();
      formData.append("propertyId", data._id);
      formData.append("tenantId", user._id);
      formData.append("landownerId", data.postedById);
      formData.append("startDate", startIsoDate);
      formData.append("endDate", endIsoDate);
      formData.append("monthlyPrice", data.rentPrice);
      formData.append("securityPrice", data.securityAmount);
      formData.append("totalPrice", data.rentPrice + data.securityAmount);
      formData.append("status", "pending");
      formData.append("paymentDetails[paymentMethod]", "credit card");
      formData.append("paymentDetails[paymentStatus]", "pending");
      formData.append("paymentDetails[transactionId]", "txn_67890");

      if (file) {
        formData.append("contractPaper", file);
      }
      const response = await createPayingGuestBooking(formData);
      if (response.status === 200) {
        window.location.href = response.data.url;
      }
    } else {
      navigate("/login");
    }
  };
  const handleCardClick = (id) => {
    navigate(`/payingguest-detail/${id}`);
  };
  const handleAddReviewClick = () => {
    setShowReviewModal(true); // Show the modal when Add Review is clicked
  };

  const handleCloseModal = () => {
    setShowReviewModal(false); // Close the modal
  };

  useEffect(() => {
    const getOne = async () => {
      const response = await getSinglePayingGuest(id);

      if (response.status === 200) {
        const fetchedProperty = response.data.data;
        setData(fetchedProperty);
        setMainImage(fetchedProperty.images[0]);

        // Ensure this property is at the top of the left list
        setProperties((prevProperties) => {
          const filteredProperties = prevProperties.filter(
            (property) => property._id !== fetchedProperty._id
          );
          return [fetchedProperty, ...filteredProperties];
        });
      } else {
        setData(null);
      }
    };
    getOne();
  }, [id]);

  useEffect(() => {
    const getAll = async () => {
      const response = await getAllPayingGuest();
      if (response.status === 200) {
        setProperties(response.data.data);
      } else {
        setProperties([]);
      }
    };
    getAll();
  }, []);
  const handleDownload = (contractPaperUrl) => {
    if (!contractPaperUrl) {
      toast.error("Contract paper not available.");
      return;
    }
    const link = document.createElement("a");
    link.href = contractPaperUrl; // URL of the PDF file
    link.download = "ContractPaper.pdf"; // Set a default filename for download
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };
  async function handleGiveReview() {
    if (!message) {
      toast.warn("Write a message for review");
      return;
    }
    if (!user) {
      toast.warn("Login for Giving review");
      return;
    }
    if (rating === 0) {
      toast.warn("Give rating at least 1");
      return;
    }

    try {
      const reviewData = {
        userid: user._id,
        userName: user.name,
        userImage: user.image,
        rating: rating,
        comment: message,
      };
      const response = await PayingGuestReview(data._id, reviewData);
      if (response.status === 200) {
        const fetchedProperty = response.data.data;
        setData(fetchedProperty);
        setMainImage(fetchedProperty.images[0]);
        toast.success("Review Posted Successfully!");
        setShowReviewModal(false);
        setMessage("");
        setRating(1);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Server Error. Please try again later!"
      );
    }
  }
  return (
    <div className="flex flex-col lg:flex-row px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 lg:pt-28 pb-8 md:pb-12">
      {/* Sidebar with property cards */}
      <div className="w-full lg:w-1/4 mb-6 lg:mb-0">
        <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:h-[calc(100vh-8rem)] pb-4 lg:pr-4 hide-scrollbar">
          {properties.map((property, index) => (
            <div className="w-[280px] lg:w-full flex-shrink-0" key={index}>
              <PropertyCard
                property={property}
                handleCardClick={() => handleCardClick(property._id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="w-full lg:w-3/4 lg:ml-8">
        <div className="p-4 sm:p-6 text-[#333] border-2 rounded-lg border-[#333]">
          {/* Image Gallery */}
          <div className="flex flex-col">
            <div className="relative w-full">
              <img
                src={mainImage}
                alt="Main Property"
                className="object-cover w-full rounded-md h-48 sm:h-72 md:h-96"
              />
              <p className="absolute text-lg sm:text-xl font-bold text-white bottom-2 left-5 drop-shadow-lg">
                {data?.title}
              </p>
            </div>

            {/* Image Gallery Thumbnails */}
            <div className="flex flex-row gap-2 mt-2 overflow-x-auto pb-2 hide-scrollbar">
              {data?.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setMainImage(image)}
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover rounded-md cursor-pointer flex-shrink-0 ${
                    mainImage === image
                      ? "border-2 border-black"
                      : "border border-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Price and Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 gap-4">
            <p className="text-xl sm:text-2xl font-bold">
              Rs.{data?.rentPrice}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => handleDownload(data.contractPaper)}
                className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-primaryColor border-primaryColor"
              >
                <span>Download Contract</span>
                <RiDownload2Fill />
              </button>
              <button
                onClick={() => setIsPopupOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg bg-primaryColor hover:bg-primaryColor/90"
              >
                <span>Book Paying Guest</span>
                <RiHome4Fill />
              </button>
            </div>
          </div>

          {/* Rating and Title */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <span className="text-lg sm:text-xl font-bold">4.8</span>
            <AiFillStar className="text-yellow-400" size={22} />
            <span className="text-lg sm:text-xl font-bold">{data?.title}</span>
          </div>

          {/* Property Details */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="flex items-center gap-1 text-sm font-semibold text-gray-400">
              <AiOutlineExpand /> {data?.area}
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-gray-400">
              <FaRulerCombined /> {data?.areaMeasureType}
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-gray-400">
              <FaBed /> {data?.bedRooms}
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-gray-400">
              <FaBath /> {data?.bathRooms}
            </span>
          </div>

          {/* Facilities */}
          <div className="mt-8 space-y-4">
            <h2 className="text-lg sm:text-xl font-bold">Facilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {data?.facilities.map((amenity, index) => (
                <span
                  key={index}
                  className="p-3 sm:p-4 text-sm sm:text-base font-medium text-center border rounded-md"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div className="mt-8 space-y-4">
            <h2 className="text-lg sm:text-xl font-bold">Policies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {data?.policies.map((policy, index) => (
                <span
                  key={index}
                  className="p-3 sm:p-4 text-sm sm:text-base font-medium text-center border rounded-md"
                >
                  {policy}
                </span>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          {data && (
            <PropertyReviews reviews={data?.reviews} title={data?.title} />
          )}

          <button
            onClick={handleAddReviewClick}
            className="px-4 py-2 my-5 text-white rounded-lg bg-primaryColor hover:bg-primaryColor/90"
          >
            Write Review
          </button>
          {data?.reviews.length > 0 ? (
            data.reviews.map((item, index) => (
              <div className="mt-6 space-y-2" key={index}>
                <div className="space-x-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full">
                      <img
                        src={
                          item.userImage ||
                          "https://hwchamber.co.uk/wp-content/uploads/2022/04/avatar-placeholder.gif"
                        }
                        className="object-cover w-full h-full rounded-full"
                      />
                    </div>
                    <div>
                      <p className="text-base font-semibold">{item.userName}</p>
                    </div>
                  </div>
                  <div className="flex mb-4 text-lg text-gray-600">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <AiFillStar
                          key={i}
                          size={18}
                          color={i < item.rating ? "yellow" : "gray"} // Set color based on rating
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 ">{item.comment}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center mt-10 text-gray-400 text-md">
              No reviews available for this property
            </div>
          )}
          {showReviewModal && (
            <ReviewModel
              handleCloseModal={handleCloseModal}
              handleGiveReview={handleGiveReview}
              setMessage={setMessage}
              message={message}
              setRating={setRating}
              rating={rating}
            />
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Book Property
            </h2>
            <div className="space-y-4">
              {/* Start Date Field */}
              <div>
                <label
                  htmlFor="start-date"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                />
              </div>

              {/* End Date Field */}
              <div>
                <label
                  htmlFor="end-date"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                />
              </div>
              {/* File Upload Field */}
              <div>
                <label
                  htmlFor="file-upload"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Upload File (PDF, PNG, JPG, DOC)
                </label>

                <div className="relative">
                  {/* Hidden file input */}
                  <input
                    type="file"
                    id="file-upload"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  {/* Custom file upload button */}
                  <button
                    type="button"
                    className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white transition duration-300 rounded-lg bg-primaryColor hover:bg-primaryColor/90"
                  >
                    <span>Choose File</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 10l5 5m0 0l5-5m-5 5V3"
                      />
                    </svg>
                  </button>

                  {/* File name display */}
                  {file && (
                    <p className="mt-2 text-sm text-gray-500 truncate">
                      {file.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  onClick={() => setIsPopupOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-primaryColor hover:bg-primaryColor/90"
                  onClick={handleBook}
                >
                  Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayGuestDetail;
