import { useState } from "react";
import { PiImage } from "react-icons/pi";
import { FiTrash2 } from "react-icons/fi";
import { listService } from "../../../api/service/Service";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify"
function ServiceListing() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
const navigate=useNavigate()
  const [subServices, setSubServices] = useState([
    { title: "", thumbnail: null, price: "" },
  ]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImage(files[0]);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleDeleteImage = () => {
    setImage(null);
  };

  const handleSubServiceChange = (index, field, value) => {
    const updatedSubServices = subServices.map((subService, i) =>
      i === index ? { ...subService, [field]: value } : subService
    );
    setSubServices(updatedSubServices);
  };
  const handleRemoveSubServiceThumbnail = (index) => {
    const updatedSubServices = [...subServices];
    updatedSubServices[index].thumbnail = ""; // Remove the thumbnail
    setSubServices(updatedSubServices);
  };
  const handleThumbnailUpload = (index, file) => {
    const updatedSubServices = subServices.map((subService, i) =>
      i === index
        ? { ...subService, thumbnail: file }
        : subService
    );
    setSubServices(updatedSubServices);
  };

  const handleAddSubService = () => {
    setSubServices([...subServices, { title: "", thumbnail: null, price: "" }]);
  };

  const handleRemoveSubService = (index) => {
    setSubServices(subServices.filter((_, i) => i !== index));
  };
  const postService = async () => {
    const data = new FormData();

    // Append simple fields
    data.append("title", title);
    data.append("description", description);
    data.append("thumbnail", image);
    data.append("subServices", JSON.stringify(subServices));
    subServices.forEach((item) => {
      if (item.thumbnail) {
        data.append(`subServices[]`, item.thumbnail); // Keep file uploads separate
      }
    });
    
    const response = await listService(data);
    setLoading(true);
    
    if (response.status === 200) {
      setLoading(false);
      navigate("/admin/");
      toast.success("Service listed successfully");
    } else if (response.status === 400) {
      toast.error(response.response.data.message);
      setLoading(false);
    } else {
      toast.error("Something went wrong please try again");
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center min-h-screen px-4 pt-20 pb-4">
      <div className="w-[60%] p-6 bg-white">
        <h2 className="mb-4 text-2xl font-bold">List Your Service</h2>

        {/* Service Type Dropdown */}
        <div className="mb-6">
          <label className="block font-semibold text-gray-700">Title</label>
          <div className="relative w-full">
            <input
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              placeholder="Type your title"
              className="w-full p-4 pr-10 mt-1 bg-gray-100 border rounded-lg focus:outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            rows={4}
            placeholder="Describe your service"
            className="w-full p-4 mt-1 bg-gray-100 border rounded-lg focus:outline-none"
          />
        </div>

      {!image&& <div className="relative mb-6">
          <div className="flex items-center gap-2 p-3 bg-gray-100 border rounded-lg w-max">
            <PiImage size={20} />
            <p className="font-semibold">Thumbnail</p>
          </div>
          <input
            type="file"
            onChange={handleImageUpload}
            className="absolute top-0 left-0 w-full h-full opacity-0"
          />
        </div>}
        <div className="w-full ">
          {image&&<div className="w-full  overflow-hidden rounded-lg h-[16rem]">
            <div className="relative">
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                className="object-cover w-full h-full"
              />
              <button
                onClick={() => handleDeleteImage()}
                className="absolute p-2 text-white bg-red-500 rounded-full top-2 right-2"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>}
          
        </div>

        {/* Sub Services */}
        <div className="my-6">
          <h3 className="mb-2 text-lg font-bold">Sub-Services</h3>
          {subServices.map((subService, index) => (
            <div key={index} className="p-4 mb-4 border rounded-lg bg-gray-50">
              <div className="flex justify-end">
                <button
                  onClick={() => handleRemoveSubService(index)}
                  className="px-4 py-2 text-white bg-red-500 rounded w-max hover:bg-red-600"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
              {/* Sub-Service Title */}
              <div className="flex items-center justify-between gap-2">
              <div className="w-full mb-2">
                <label className="block font-semibold text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Sub-service title"
                  value={subService.title}
                  onChange={(e) =>
                    handleSubServiceChange(index, "title", e.target.value)
                  }
                  className="w-full p-2 mt-1 bg-white border rounded focus:outline-none"
                />
              </div>

              {/* Price */}
              <div className="w-full mb-2">
                <label className="block font-semibold text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  placeholder="Price"
                  value={subService.price}
                  onChange={(e) =>
                    handleSubServiceChange(index, "price", e.target.value)
                  }
                  className="w-full p-2 mt-1 bg-white border rounded focus:outline-none"
                />
              </div></div>

              {/* Thumbnail Upload */}
              <div className="mb-2">
          

                <div className="relative mb-6">
                  <div className="flex items-center w-full gap-2 p-3 bg-gray-100 border rounded-lg">
                    <PiImage size={20} />
                    <p className="font-semibold">Image</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleThumbnailUpload(index, e.target.files[0])
                    }
                    className="absolute top-0 left-0 w-full h-full opacity-0"
                  />
                </div>
                {subService.thumbnail && (
                  <div className="w-full h-full overflow-hidden rounded-lg">
                    <div className="relative w-max">
                      <img
                        src={URL.createObjectURL(subService.thumbnail)}
                        alt="Uploaded"
                        className="object-cover w-[7rem] h-full"
                      />
                      <button
                        onClick={() => handleRemoveSubServiceThumbnail(index)}
                        className="absolute p-2 text-white bg-red-500 rounded-full top-2 right-2"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Remove Sub-Service Button */}
            </div>
          ))}

          {/* Add Sub-Service Button */}
          <button
            onClick={handleAddSubService}
            className="px-6 py-3 font-bold border rounded text-primaryColor border-primaryColor/90 "
          >
            + Add 
          </button>
        </div>

        {/* Image Gallery
        {image&&<div className="grid items-center grid-cols-1 gap-2 mb-8 md:grid-cols-4">
         
          <div
            
            className="w-full h-full overflow-hidden rounded-lg"
          >
            <div className="relative">
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                className="object-cover w-full h-full"
              />
              <button
                onClick={() => handleDeleteImage()}
                className="absolute p-2 text-white bg-red-500 rounded-full top-2 right-2"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>

        </div>} */}

        <button
          disabled={loading}
          onClick={postService}
          className="px-6 py-3 text-white rounded-lg bg-primaryColor hover:bg-primaryColor/90"
        >
         {loading?"Loading...":"Service List"}
        </button>
      </div>
    </div>
  );
}

export default ServiceListing;
