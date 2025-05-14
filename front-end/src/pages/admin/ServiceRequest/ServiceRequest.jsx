// import React from 'react'
import { useEffect, useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import {
  deleteServiceBooking,
  getServiceBooking,
  UpdateOneServiceBooking,
} from "../../../api/serviceBooking/serviceBooking";
import { getAllUsers } from "../../../api/auth/auth";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading";

function ServiceRequest() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [serviceMan, setServiceMan] = useState([]);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedServiceman, setSelectedServiceman] = useState("");

  useEffect(() => {
    async function getAllService() {
      setIsLoading(true);
      try {
        const response = await getServiceBooking();

        if (response.status === 200) {
          setData(response.data.data);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching service bookings:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }
    getAllService();
  }, []);

  useEffect(() => {
    async function getAllService() {
      try {
        const response = await getAllUsers();

        if (response.status === 200) {
          const allServiceManData = response.data.data.users.filter((item) => {
            const serviceman = item.role === "serviceman";
            return serviceman;
          });
          setServiceMan(allServiceManData);
        } else {
          setServiceMan([]);
        }
      } catch (error) {
        console.error("Error fetching servicemen:", error);
        setServiceMan([]);
      }
    }
    getAllService();
  }, []);

  const handleDeleteClick = (propertyId) => {
    setServiceToDelete(propertyId);
    setShowPopup(true);
  };
  const handleViewDetails = (service) => {
    setSelectedService(service);
    setShowDetailPopup(true);
  };

  const closeDetailPopup = () => {
    setShowDetailPopup(false);
    setSelectedService(null);
  };
  const handleDeleteConfirm = async () => {
    if (serviceToDelete) {
      const response = await deleteServiceBooking(serviceToDelete);

      if (response.status === 200) {
        setData((prevData) =>
          prevData.filter((item) => item._id !== serviceToDelete)
        );
        toast.success("Successfully deleted");
        setShowPopup(false);
        setServiceToDelete(null);
      } else {
        toast.error("Failed to delete property");
      }
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setServiceToDelete(null);
  };
  async function handleAsign() {
    if (selectedServiceman === "") {
      toast.warn("Select  one serviceman");
      return;
    }
    const jsonData = JSON.stringify({
      serviceManId: selectedServiceman,
      status: "confirmed",
    });
    const response = await UpdateOneServiceBooking(
      selectedService._id,
      jsonData
    );
    if (response.status === 200) {
      toast.success(response.data.data.message);
      setShowDetailPopup(false);
      setSelectedService(null);
    } else {
      toast.error("Something went wrong!Try again");
    }
  }
  async function handleCancelService() {
    const jsonData = JSON.stringify({ status: "canceled" });
    const response = await UpdateOneServiceBooking(
      selectedService._id,
      jsonData
    );
    if (response.status === 200) {
      toast.success(response.data.data.message);
      setShowDetailPopup(false);
      setSelectedService(null);
    } else {
      toast.error("Something went wrong!Try again");
    }
  }

  return (
    <>
      <div className="h-screen py-8 ml-24 lg:ml-64">
        <div className="flex flex-col">
          <div className="overflow-x-auto ">
            <div className="inline-block min-w-full align-middle">
              <div className="relative mb-4 text-gray-500 focus-within:text-gray-900 ">
                <div className="absolute inset-y-0 flex items-center pl-3 pointer-events-none left-1 ">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z"
                      stroke="#9CA3AF"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z"
                      stroke="black"
                      strokeOpacity="0.2"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z"
                      stroke="black"
                      strokeOpacity="0.2"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="default-search"
                  className="block w-80 h-11 pr-5 pl-12 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
                  placeholder="Search for company"
                />
              </div>
              {isLoading ? (
                <div className="h-[60vh]">
                  <Loading />
                </div>
              ) : (
                <div className="overflow-hidden ">
                  <table className="min-w-full rounded-xl">
                    <thead>
                      <tr className="bg-gray-50">
                        <th
                          scope="col"
                          className="p-5 text-sm font-semibold leading-6 text-left text-gray-900 capitalize rounded-t-xl"
                        >
                          {" "}
                          Image{" "}
                        </th>
                        <th
                          scope="col"
                          className="p-5 text-sm font-semibold leading-6 text-left text-gray-900 capitalize"
                        >
                          {" "}
                          Title{" "}
                        </th>
                        <th
                          scope="col"
                          className="p-5 text-sm font-semibold leading-6 text-left text-gray-900 capitalize"
                        >
                          {" "}
                          Status{" "}
                        </th>
                        <th
                          scope="col"
                          className="p-5 text-sm font-semibold leading-6 text-left text-gray-900 capitalize"
                        >
                          {" "}
                          Payment Status{" "}
                        </th>
                        <th
                          scope="col"
                          className="p-5 text-sm font-semibold leading-6 text-left text-gray-900 capitalize rounded-t-xl"
                        >
                          {" "}
                          Actions{" "}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300 ">
                      {data.map((item, index) => (
                        <tr
                          key={index}
                          className="transition-all duration-500 bg-white hover:bg-gray-50"
                        >
                          <td className="p-5 text-sm font-medium leading-6 text-gray-900 whitespace-nowrap ">
                            {item.serviceId ? (
                              <img
                                src={item?.serviceId.thumbnail}
                                className="object-cover rounded-full size-14"
                              />
                            ) : (
                              <img
                                src="https://hwchamber.co.uk/wp-content/uploads/2022/04/avatar-placeholder.gif"
                                className="object-cover rounded-full size-14"
                              />
                            )}
                          </td>
                          <td className="p-5 text-sm font-medium leading-6 text-gray-900 whitespace-nowrap">
                            {item.serviceId ? item.serviceId.title : ""}
                          </td>
                          <td className="p-5 text-sm font-medium leading-6 text-gray-900 whitespace-nowrap">
                            {item?.status}
                          </td>
                          <td className="p-5 text-sm font-medium leading-6 text-gray-900 whitespace-nowrap">
                            {item?.paymentDetails.paymentStatus}
                          </td>

                          <td className="p-5 ">
                            <div className="flex items-center gap-1">
                              <button
                                className="flex p-2 transition-all duration-500 rounded-full group item-center"
                                onClick={() => handleViewDetails(item)}
                              >
                                <FaEye className="text-blue-500 " />
                              </button>
                              <button
                                className="flex p-2 transition-all duration-500 rounded-full group item-center"
                                onClick={() => handleDeleteClick(item?._id)}
                              >
                                <FaTrash className=" text-primaryColor" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg">
            <h2 className="text-lg font-semibold">
              Are you sure you want to delete this service?
            </h2>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showDetailPopup && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="p-8 bg-white rounded-xl shadow-lg w-[600px] relative">
            {/* Close Button */}
            <button
              onClick={closeDetailPopup}
              className="absolute text-gray-400 top-4 right-4 hover:text-gray-600 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {/* Title */}
            <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
              Service Details
            </h2>
            {/* Service Details */}
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Title:</strong>{" "}
                {selectedService.serviceId?.title || "N/A"}
              </p>
              <p>
                <strong>Scheduled Date:</strong>{" "}
                {new Date(selectedService.scheduledDate).toLocaleString()}
              </p>
              <p>
                <strong>Total Price:</strong> {selectedService.totalPrice}
              </p>
              <p>
                <strong>Status:</strong> {selectedService.status}
              </p>
              <div>
                <strong>Payment Details:</strong>
                <div className="ml-4 space-y-1 text-sm">
                  <p>Method: {selectedService.paymentDetails.paymentMethod}</p>
                  <p>Status: {selectedService.paymentDetails.paymentStatus}</p>
                  <p>
                    Transaction ID:{" "}
                    {selectedService.paymentDetails.transactionId}
                  </p>
                </div>
              </div>
            </div>
            {/* Assign Serviceman */}
            <div className="mt-6">
              <strong>Assign Serviceman:</strong>
              <select
                value={selectedServiceman}
                onChange={(e) => setSelectedServiceman(e.target.value)}
                className="block w-full px-4 py-2 mt-2 text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
              >
                <option value="" className="text-gray-400">
                  Select Serviceman
                </option>
                {serviceMan.map((serviceman) => (
                  <option key={serviceman._id} value={serviceman._id}>
                    {serviceman.name} ({serviceman.serviceType})
                  </option>
                ))}
              </select>
            </div>
            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleAsign}
                className="px-5 py-2 text-sm font-medium text-white rounded-lg shadow-lg bg-primaryColor hover:bg-primaryColor/70 focus:outline-none focus:ring-2 focus:ring-primaryColor focus:ring-offset-2"
              >
                Assign
              </button>
              <button
                onClick={handleCancelService}
                className="px-5 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg shadow-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ServiceRequest;
