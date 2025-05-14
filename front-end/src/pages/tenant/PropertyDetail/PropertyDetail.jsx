import { useMemo } from "react";
import { useEffect, useState } from "react";
import { AiFillStar, AiOutlineRight, AiOutlineExpand } from "react-icons/ai";
import PropertyCard from "../../../components/PropertyCard/PropertyCard";
import { useNavigate, useParams } from "react-router-dom";
import { RiDownload2Fill, RiHome4Fill } from "react-icons/ri";
import ReviewModel from "../../../components/ReviewModel/ReviewModel";
import {
  getAllProperty,
  getSingleProperty,
  PropertyReview,
} from "../../../api/property/property";
import { FaBath, FaBed, FaRulerCombined } from "react-icons/fa6";
import { createPropertyBooking } from "../../../api/propertyBooking/propertyBooking";
import { UseUser } from "../../../context/UserContext";
import { toast } from "react-toastify";
import PropertyReviews, {
  calculateRatingData,
} from "../../../components/OverAllReviews/OverAllReviews";

// Simple static map component with improved zoom settings
const StaticMapComponent = ({ location, propertyData }) => {
  // Higher zoom level (17-18 is good for viewing buildings)
  const zoom = 18;

  // Create a static map using Google Maps Static API with higher zoom
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=${zoom}&size=800x600&scale=2&maptype=roadmap&markers=color:red%7Csize:mid%7C${location.lat},${location.lng}&key=AIzaSyBLkn9GPPPyMai82Dl8fHwVMmYWlWn9MjQ`;

  // Directly use OpenStreetMap for a more reliable solution
  // The bbox parameters define the bounding box - making it smaller zooms in more
  const openStreetMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    location.lng - 0.002
  }%2C${location.lat - 0.002}%2C${location.lng + 0.002}%2C${
    location.lat + 0.002
  }&layer=mapnik&marker=${location.lat}%2C${location.lng}`;

  return (
    <div className="w-full h-full">
      {/* First try with Google Maps Static API */}
      <img
        src={staticMapUrl}
        alt="Property Location Map"
        className="w-full h-full object-cover rounded-lg"
        onError={(e) => {
          // If Google Maps fails, fall back to OpenStreetMap iframe
          console.log(
            "Google Maps image failed to load, using OpenStreetMap fallback"
          );
          e.target.style.display = "none";
          document.getElementById("fallback-map").style.display = "block";
        }}
      />

      {/* Fallback to OpenStreetMap iframe */}
      <iframe
        id="fallback-map"
        style={{
          display: "none",
          width: "100%",
          height: "100%",
          border: "none",
          borderRadius: "0.5rem",
        }}
        src={openStreetMapUrl}
        title="Property Location"
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

const PropertyDetail = () => {
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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the index of the current image
  const [geoLocation, setGeoLocation] = useState(null);
  const [isBooking, setIsBooking] = useState(false); // New state for tracking booking status

  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  const nextImage = (e) => {
    e.stopPropagation(); // Prevent the full-screen toggle from being triggered
    const nextIndex = (currentIndex + 1) % data?.images.length;
    setMainImage(data?.images[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  // Switch to the previous image in the gallery
  const prevImage = (e) => {
    e.stopPropagation(); // Prevent the full-screen toggle from being triggered
    const prevIndex =
      (currentIndex - 1 + data?.images.length) % data?.images.length;
    setMainImage(data?.images[prevIndex]);
    setCurrentIndex(prevIndex);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleBook = async () => {
    if (user) {
      setIsBooking(true); // Set loading state to true when booking starts

      const startIsoDate = new Date(startDate).toISOString();
      const endIsoDate = new Date(endDate).toISOString();
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

      // Send the form data to the server
      try {
        const response = await createPropertyBooking(formData);

        if (response.status === 200) {
          window.location.href = response.data.url;
        }
      } catch (error) {
        console.error("Error booking property:", error);
        toast.error("Failed to book property. Please try again.");
      } finally {
        setIsBooking(false); // Reset loading state regardless of outcome
      }
    } else {
      navigate("/login");
    }
  };

  const handleCardClick = (id) => {
    navigate(`/property-detail/${id}`);
  };
  const handleAddReviewClick = () => {
    setShowReviewModal(true); // Show the modal when Add Review is clicked
  };

  const handleCloseModal = () => {
    setShowReviewModal(false); // Close the modal
  };

  useEffect(() => {
    const getOne = async () => {
      const response = await getSingleProperty(id);

      if (response.status === 200) {
        const fetchedProperty = response.data.data;
        setData(fetchedProperty);
        setMainImage(fetchedProperty.images[0]);

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
      const response = await getAllProperty();
      if (response.status === 200) {
        setProperties(response.data.data);
      } else {
        setProperties([]);
      }
    };
    getAll();
  }, []);

  // Geocode the property address
  useEffect(() => {
    if (data && data.city && data.sector && data.state) {
      const geocodeProperty = async () => {
        const address = `${data.sector}, ${data.city}, ${data.state}, ${data.country}`;
        try {
          // Using OpenStreetMap Nominatim for geocoding (free)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              address
            )}`
          );
          const result = await response.json();
          console.log("Geocoding result:", result);

          if (result && result.length > 0) {
            setGeoLocation({
              lat: parseFloat(result[0].lat),
              lng: parseFloat(result[0].lon),
            });
          } else {
            // Fallback to Islamabad coordinates if geocoding fails
            setGeoLocation({ lat: 33.6844, lng: 73.0479 });
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          // Fallback to Islamabad coordinates
          setGeoLocation({ lat: 33.6844, lng: 73.0479 });
        }
      };

      geocodeProperty();
    }
  }, [data]);

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

    const reviewData = {
      userid: user._id,
      userName: user.name,
      userImage: user.image,
      rating: rating,
      comment: message,
    };
    const response = await PropertyReview(data._id, reviewData);
    if (response.status === 200) {
      const fetchedProperty = response.data.data;
      setData(fetchedProperty);
      setMainImage(fetchedProperty.images[0]);
      toast.success("Review Posted Successfully!");
      setShowReviewModal(false);
      setMessage("");
      setRating(1);
    } else if ((response.status = 400)) {
      toast.error(response.response.data.message);
    }
  }
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    //this is sidebar in property details page
    <div className="flex mx-8 pt-28">
      <div className="flex flex-col w-1/4 gap-4 py-4 pr-4 h-[100rem] overflow-y-auto">
        {properties.map((property, index) => (
          <PropertyCard
            key={index}
            property={property}
            handleCardClick={() => handleCardClick(property._id)}
          />
        ))}
      </div>
      <div className="mt-4 font-extrabold">
        <AiOutlineRight size={24} />
      </div>
      <div className="w-3/4 p-4  text-[#333] border-2 rounded-lg border-[#333] ">
        <div className="flex md:flex-col">
          <div className="relative">
            {/* Full-Screen Modal */}
            {isFullScreen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer"
                onClick={toggleFullScreen}
              >
                <div className="relative">
                  <img
                    src={mainImage}
                    alt="Main Property"
                    className="w-[90vw] h-[90vh] object-contain"
                  />
                  {/* Previous and Next Buttons */}
                  <button
                    onClick={prevImage}
                    className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white text-3xl"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white text-3xl"
                  >
                    →
                  </button>
                </div>
              </div>
            )}

            {/* Main Image with Double Click to Fullscreen */}
            <div className="relative">
              {/* Main Image with Double Click to Fullscreen */}
              <img
                src={mainImage}
                alt="Main Property"
                className="object-cover w-full rounded-md h-96 cursor-pointer"
                onDoubleClick={toggleFullScreen}
              />

              {/* Title on top of the main image */}
              <p className="absolute text-xl font-bold text-white bottom-5 left-5 z-10">
                {data?.title}
              </p>
            </div>

            {/* Image Gallery Thumbnails */}
            <div className="flex flex-col flex-wrap gap-2 mt-2 md:flex-row">
              {data?.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => {
                    setMainImage(image);
                    setCurrentIndex(index); // Update current index when thumbnail clicked
                  }}
                  className={`w-40 h-40 object-cover rounded-md cursor-pointer ${
                    mainImage === image
                      ? "border-2 border-black"
                      : "border border-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6 ">
          <p className="mt-6 text-2xl font-bold">
            <span className="text-base">PKR</span>{" "}
            {data?.rentPrice >= 10000000
              ? parseFloat((data?.rentPrice / 10000000).toFixed(2)).toString() +
                " Crore"
              : data?.rentPrice >= 100000
              ? parseFloat((data?.rentPrice / 100000).toFixed(2)).toString() +
                " Lac"
              : data?.rentPrice}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleDownload(data.contractPaper)}
              className="flex items-center gap-2 px-2 py-2 border rounded-lg text-primaryColor border-primaryColor"
            >
              <span>Download Contract</span>
              <RiDownload2Fill />
            </button>
            <button
              onClick={() => setIsPopupOpen(true)}
              className="flex items-center gap-2 px-2 py-2 text-white rounded-lg bg-primaryColor hover:bg-primaryColor/90"
            >
              <span>Book Property</span>
              <RiHome4Fill />
            </button>
          </div>
        </div>

        <div className="flex items-end mt-6 space-x-2 ">
          <span className="text-xl font-bold">
            {calculateAverageRating(data?.reviews)}
          </span>
          <AiFillStar className="" size={22} />
          <span className="text-xl font-bold">{data?.title}</span>
        </div>
        <div className="flex items-end gap-4 mt-2">
          <span className="flex items-center gap-1 text-sm font-semibold text-gray-400">
            <AiOutlineExpand /> {data?.area} ,
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-gray-400">
            <FaRulerCombined /> {data?.areaMeasureType} ,
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-gray-400">
            <FaBed /> {data?.bedRooms} ,
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-gray-400">
            <FaBath />
            {data?.bathRooms}
          </span>
        </div>
        <div className="mt-6 space-y-6">
          <h2 className="text-xl font-bold">Facilities</h2>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
            {data?.facilities.map((amenity, index) => (
              <span
                key={index}
                className="p-5 font-bold text-center border rounded-md"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <h2 className="text-xl font-bold">Policies</h2>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
            {data?.policies.map((policy, index) => (
              <span
                key={index}
                className="p-5 font-bold text-center border rounded-md"
              >
                {policy}
              </span>
            ))}
          </div>
        </div>

        {/* Property Location Map - Using Static Map with Fallbacks */}
        <div className="mt-6 space-y-2">
          <h2 className="text-xl font-bold">Property Location</h2>
          <div className="w-full h-96 border rounded-lg overflow-hidden">
            {geoLocation ? (
              <>
                <StaticMapComponent
                  location={geoLocation}
                  propertyData={data}
                />
                <div className="absolute bottom-2 right-10 bg-white/80 p-2 rounded shadow z-20 text-sm">
                  <a
                    href={`https://www.google.com/maps?q=${geoLocation.lat},${geoLocation.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primaryColor hover:underline flex items-center gap-1"
                  >
                    Open in Google Maps
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100">
                <p className="text-gray-500">Loading map...</p>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Location: {data?.sector}, {data?.city}, {data?.state},{" "}
            {data?.country}
          </p>
        </div>

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

      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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
                  disabled={isBooking}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center justify-center gap-2 ${
                    isBooking
                      ? "bg-primaryColor/70 cursor-not-allowed"
                      : "bg-primaryColor hover:bg-primaryColor/90"
                  }`}
                  onClick={handleBook}
                  disabled={isBooking}
                >
                  {isBooking ? (
                    <>
                      <svg
                        className="w-4 h-4 mr-1 text-white animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Booking...
                    </>
                  ) : (
                    "Book"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
