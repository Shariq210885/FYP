import { useEffect, useState } from "react";
import { getAllProperty, deleteProperty } from "../../../api/property/property"; // Assuming delete API exists
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading";

function AdminDashboard() {
  const [data, setData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getAll = async () => {
      setIsLoading(true);
      try {
        const response = await getAllProperty();
        if (response.status === 200) {
          setData(response.data.data);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    getAll();
  }, []);

  const handleDeleteClick = (propertyId) => {
    setPropertyToDelete(propertyId);
    setShowPopup(true);
  };

  const handleDeleteConfirm = async () => {
    if (propertyToDelete) {
      const response = await deleteProperty(propertyToDelete); 
      
      if (response.status === 200) {
        setData((prevData) => prevData.filter((item) => item._id !== propertyToDelete));
        setShowPopup(false);
        setPropertyToDelete(null);
      } else {
        alert("Failed to delete property");
      }
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setPropertyToDelete(null);
  };

  return (
    <>
      <div className="h-screen pt-24 pb-8 ml-24 lg:ml-64 ">
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              {isLoading ? (
                <div className="h-[60vh] flex items-center justify-center">
                  <Loading />
                </div>
              ) : (
                <div className="overflow-hidden">
                  <table className="min-w-full rounded-xl">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-5 text-sm font-semibold text-left text-gray-900">Image</th>
                        <th className="p-5 text-sm font-semibold text-left text-gray-900">Title</th>
                        <th className="p-5 text-sm font-semibold text-left text-gray-900">IsRented</th>
                        <th className="p-5 text-sm font-semibold text-left text-gray-900">Property Type</th>
                        <th className="p-5 text-sm font-semibold text-left text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {data.map((item, index) => (
                        <tr
                          key={index}
                          className="transition-all duration-500 bg-white hover:bg-gray-50"
                        >
                          <td className="p-5 text-sm font-medium text-gray-900">
                            <img
                              src={item.images[0]}
                              className="object-cover rounded-full size-14"
                            />
                          </td>
                          <td className="p-5 text-sm font-medium text-gray-900">{item.title}</td>
                          <td className="p-5 text-sm font-medium text-gray-900">
                            <span
                              className={`px-2 py-1 rounded-full text-white ${
                                item.isRented ? "bg-green-500" : "bg-red-500"
                              }`}
                            >
                              {item.isRented ? "Rented" : "Not Rented"}
                            </span>
                          </td>
                          <td className="p-5 text-sm font-medium text-gray-900">
                            {item.propertyType}
                          </td>
                          <td className="p-5">
                            <div className="flex items-center gap-1">
                              <button
                                className="flex p-2 transition-all duration-500 rounded-full group item-center"
                                onClick={() => navigate(`UpdateProperty/${item._id}`)}
                              >
                                <FaEdit className="text-blue-500" />
                              </button>
                              <button
                                className="flex p-2 transition-all duration-500 rounded-full group item-center"
                                onClick={() => handleDeleteClick(item._id)}
                              >
                                <FaTrash className="text-primaryColor" />
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

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg">
            <h2 className="text-lg font-semibold">Are you sure you want to delete this property?</h2>
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

export default AdminDashboard;
