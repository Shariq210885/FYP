import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deletePayingGuest,
  getAllMyPayingGuest,
} from "../../../api/payingGuest/payingGuest";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading";

function MyPayingGuests() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  useEffect(() => {
    async function getAllProperties() {
      setIsLoading(true);
      try {
        const response = await getAllMyPayingGuest();
        if (response.status === 200) {
          setData(response.data.data);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching paying guests:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }
    getAllProperties();
  }, []);

  const handleDeleteClick = (propertyId) => {
    setPropertyToDelete(propertyId);
    setShowPopup(true);
  };

  const handleDeleteConfirm = async () => {
    if (propertyToDelete) {
      const response = await deletePayingGuest(propertyToDelete);

      if (response.status === 200) {
        setData((prevData) =>
          prevData.filter((item) => item._id !== propertyToDelete)
        );
        toast.success("Successfully deleted");
        setShowPopup(false);
        setPropertyToDelete(null);
      } else {
        toast.error("Failed to delete property");
      }
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setPropertyToDelete(null);
  };

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
                <div className="h-[60vh] flex items-center justify-center">
                  <Loading />
                </div>
              ) : data.length > 0 ? (
                <div className="overflow-hidden">
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
                          IsRented{" "}
                        </th>
                        <th
                          scope="col"
                          className="p-5 text-sm font-semibold leading-6 text-left text-gray-900 capitalize"
                        >
                          {" "}
                          Property Type{" "}
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
                    <tbody className="divide-y divide-gray-300">
                      {data.map((item, index) => (
                        <tr
                          key={index}
                          className="transition-all duration-500 bg-white hover:bg-gray-50"
                        >
                          <td className="p-5 text-sm font-medium leading-6 text-gray-900 whitespace-nowrap ">
                            <img
                              src={item.images[0]}
                              className="object-cover rounded-full size-14"
                            />
                          </td>
                          <td className="p-5 text-sm font-medium leading-6 text-gray-900 whitespace-nowrap">
                            {item.title}
                          </td>
                          <td
                            className={`p-5 text-sm font-medium leading-6 text-gray-900 whitespace-nowrap`}
                          >
                            <span
                              className={` px-2 py-1 rounded-full text-white ${
                                item.isRented ? "bg-green-500" : "bg-red-500"
                              }`}
                            >
                              {item.isRented ? "Rented" : "Not Rented"}
                            </span>
                          </td>
                          <td className="p-5 text-sm font-medium leading-6 text-gray-900 whitespace-nowrap">
                            {item.propertyType}
                          </td>
                          <td className="p-5 ">
                            <div className="flex items-center gap-1">
                              <button
                                className="flex p-2 transition-all duration-500 rounded-full group item-center"
                                onClick={() =>
                                  navigate(
                                    `/landowner/UpdatePayingGuest/${item._id}`
                                  )
                                }
                              >
                                <FaEdit className="text-blue-500 " />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(item._id)}
                                className="flex p-2 transition-all duration-500 rounded-full group item-center"
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
              ) : (
                <div className="flex items-center justify-center h-[60vh] text-sm text-gray-500">
                  No Paying Guests found
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
              Are you sure you want to delete this Paying guest?
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
    </>
  );
}

export default MyPayingGuests;
