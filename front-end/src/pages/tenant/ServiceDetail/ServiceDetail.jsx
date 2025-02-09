import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";

import { RiHome4Fill } from "react-icons/ri";
import ReviewModel from "../../../components/ReviewModel/ReviewModel";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleService, ServiceReview } from "../../../api/service/Service";
import { UseUser } from "../../../context/UserContext";
import { toast } from "react-toastify";
import PropertyReviews from "../../../components/OverAllReviews/OverAllReviews";

const ServiceDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [mainImage, setMainImage] = useState();
  const [selectedServices, setSelectedServices] = useState([]);
  const navigate = useNavigate();
  const { user, setCartService, cartService } = UseUser();
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(1);
  // Toggle selection
  const toggleService = (service) => {
    const exists = selectedServices.find((s) => s._id === service._id);
    if (exists) {
      // Remove from selected services
      setSelectedServices(
        selectedServices.filter((s) => s._id !== service._id)
      );
    } else {
      // Add to selected services
      setSelectedServices([...selectedServices, service]);
    }
  };

  useEffect(() => {
    const getOne = async () => {
      const response = await getSingleService(id);

      if (response.status === 200) {
        const fetchedProperty = response.data.data;
        setData(fetchedProperty);
        setMainImage(fetchedProperty.thumbnail);
      } else {
        setData(null);
      }
    };
    getOne();
  }, [id]);

  const handleAddReviewClick = () => {
    setShowReviewModal(true);
  };

  const handleCloseModal = () => {
    setShowReviewModal(false); // Close the modal
  };

  const calculateTotalPrice = (subServices) => {
    if (!Array.isArray(subServices)) return 0;

    const totalPrice = subServices.reduce((sum, subService) => {
      return sum + (subService.price || 0);
    }, 0);

    return totalPrice;
  };
  function addService() {
    if (user) {
      if (selectedServices.length > 0) {
        const currentDate = new Date().toISOString();

        // Check if the service already exists in the cart
        const serviceIndex = cartService.services.findIndex(
          (service) => service.serviceId === data._id
        );

        if (serviceIndex !== -1) {
          // Service exists; merge subservices
          const existingService = cartService.services[serviceIndex];

          // Add new subservices to the existing service, avoiding duplicates
          const updatedSubServices = [
            ...existingService.subServices,
            ...selectedServices.filter(
              (subService) =>
                !existingService.subServices.some(
                  (existingSubService) =>
                    existingSubService._id === subService._id
                )
            ),
          ];

          // Update the service's subservices and total price
          const updatedService = {
            ...existingService,
            subServices: updatedSubServices,
            totalPrice: calculateTotalPrice(updatedSubServices),
          };

          // Update the cart service
          const updatedServices = [...cartService.services];
          updatedServices[serviceIndex] = updatedService;

          setCartService({
            totalAmount:
              cartService.totalAmount +
              calculateTotalPrice(updatedSubServices) -
              existingService.totalPrice,
            services: updatedServices,
          });

          toast.success("Subservices added to the existing service!");
        } else {
          // Service doesn't exist; create a new entry
          const selectedServiceToBeAdd = {
            serviceId: data._id,
            subServices: selectedServices,
            tenantId: user._id,
            providerId: data.providedById,
            scheduledDate: currentDate,
            totalPrice: calculateTotalPrice(selectedServices),
            status: "pending",
            paymentDetails: {
              paymentMethod: "credit card",
              paymentStatus: "pending",
              transactionId: "TXN123456789",
            },
          };

          setCartService({
            totalAmount:
              cartService.totalAmount + selectedServiceToBeAdd.totalPrice,
            services: [...cartService.services, selectedServiceToBeAdd],
          });

          toast.success("Service added successfully!");
        }
      } else {
        toast.warn("Please select at least one service.");
      }
    } else {
      navigate("/login");
      toast.error("For service booking, please log in.");
    }
  }

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
      const response = await ServiceReview(data._id, reviewData);
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
    <div className="flex mx-8 pt-28">
      <div className="w-full p-4  text-[#333] border-2 rounded-lg  ">
        <div className="flex md:flex-col">
          <div className="relative ">
            <img
              src={mainImage}
              alt="Main Property"
              className="object-cover w-full rounded-md h-96"
            />
            <p className="absolute text-xl font-bold text-white bottom-2 left-5">
              {data?.title}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between ">
          <p className="mt-6 text-2xl font-bold">
            Rs: {calculateTotalPrice(data?.subServices)}/hour
          </p>
          <button
            onClick={addService}
            className="flex items-center gap-2 px-2 py-2 text-white rounded-lg bg-primaryColor hover:bg-primaryColor/90"
          >
            <span>Add Service</span>
            <RiHome4Fill />
          </button>
        </div>
        <div className="w-full p-4 mx-auto ">
          <h2 className="mb-4 text-lg font-semibold">Select Subservices</h2>
          <div className="space-y-4">
            {data?.subServices.map((service) => (
              <div
                key={service._id}
                className={`flex items-center justify-between border p-3 rounded-md shadow-sm ${
                  selectedServices.includes(service._id)
                    ? "bg-blue-50 border-blue-400"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={service.thumbnail}
                    alt={service.title}
                    className="object-cover w-12 h-12 rounded-md"
                  />
                  <div>
                    <p className="font-medium">{service.title}</p>
                    <p className="text-sm text-gray-500">Rs.{service.price}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-500"
                  checked={selectedServices.some((s) => s._id === service._id)}
                  onChange={() => toggleService(service)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-end mt-6 space-x-2 ">
          <span className="text-xl font-bold">4.8</span>
          <AiFillStar className="" size={22} />
          <span className="text-xl font-bold">{data?.title}</span>
        </div>

        <div className="mt-6 space-y-2">
          <h2 className="text-xl font-bold">Description</h2>
          <p className="text-gray-600 ">{data?.description}</p>
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
            No reviews available for this Service
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
  );
};

export default ServiceDetail;
