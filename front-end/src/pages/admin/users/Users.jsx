// import React from 'react'
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { getAllUsers, VerifiedAccount } from "../../../api/auth/auth";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading";

function Users() {
  const [data, setData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleViewClick = (user) => {
    setSelectedUser(user);
    setShowPopup(true);
  };

  useEffect(() => {
    async function getAllUser() {
      setIsLoading(true);
      try {
        const response = await getAllUsers();

        if (response.status === 200) {
          setData(response.data.data.users);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }
    getAllUser();
  }, []);

  const handleCancel = () => {
    setShowPopup(false);
  };

  async function handleVerified() {
    const response = await VerifiedAccount({ id: selectedUser._id });
    if (response.status === 200) {
      toast.success(response.data.message);
      setShowPopup(false);
      setSelectedUser(null);
    } else {
      toast.error("something went wrong! Try later.");
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
                          Name{" "}
                        </th>

                        <th
                          scope="col"
                          className="p-5 text-sm font-semibold leading-6 text-left text-gray-900 capitalize"
                        >
                          {" "}
                          email
                        </th>
                        <th
                          scope="col"
                          className="p-5 text-sm font-semibold leading-6 text-left text-gray-900 capitalize"
                        >
                          {" "}
                          Verified{" "}
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
                            {item.image ? (
                              <img
                                src={item.image}
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
                            {item.name}
                          </td>

                          <td className="p-5 text-sm font-medium leading-6 text-gray-900 whitespace-nowrap">
                            {item?.email}
                          </td>
                          <td className="p-5 text-sm font-medium leading-6 text-gray-900 whitespace-nowrap">
                            {item?.isVerified ? "True" : "False"}
                          </td>

                          <td className="p-5 ">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleViewClick(item)}
                                className="flex p-2 transition-all duration-500 rounded-full group item-center"
                              >
                                <FaEye className="text-blue-500 " />
                              </button>

                              {/* <button className="flex p-2 transition-all duration-500 rounded-full group item-center">
                              <FaEye/>
                              </button> */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg h-[25rem] overflow-y-auto">
            {selectedUser && (
              <>
                <h2 className="mb-4 text-lg font-bold">User Details</h2>
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong> {selectedUser.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedUser.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {selectedUser.role}
                  </p>
                  <p>
                    <strong>Verified:</strong>{" "}
                    {selectedUser.isVerified ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Address:</strong> {`
                    ${selectedUser.address?.street || "N/A"}, 
                    ${selectedUser.address?.sector || "N/A"}, 
                    ${selectedUser.address?.city || "N/A"}, 
                    ${selectedUser.address?.state || "N/A"}, 
                    ${selectedUser.address?.country || "N/A"}
                  `}
                  </p>
                  <div>
                    <strong>CNIC Image:</strong>
                    {selectedUser.cnicImage.length > 0 ? (
                      <img
                        src={selectedUser.cnicImage[0]}
                        alt="CNIC"
                        className="object-cover w-full h-48 mt-2 rounded-lg"
                      />
                    ) : (
                      <p className="mt-2 text-gray-500">
                        No CNIC image available
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-white rounded bg-primaryColor hover:bg-primaryColor/80"
                    onClick={handleVerified}
                  >
                    Verify
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Users;
