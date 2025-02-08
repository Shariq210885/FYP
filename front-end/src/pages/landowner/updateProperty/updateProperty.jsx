import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { PiFile, PiImage } from "react-icons/pi";
import {
  getSingleProperty,
  updateProperty,
} from "../../../api/property/property";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function UpdateProperty() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [propertyType, setPropertyType] = useState("Choose one");
  const [isOpen, setIsOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [sector, setSector] = useState("");
  const [street, setStreet] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [areaMeasureType, setAreaMeasureType] = useState("");
  const [rentPrice, setRentPrice] = useState("");
  const [securityAmount, setSecurityAmount] = useState("");
  const [bedRooms, setBedRooms] = useState("");
  const [bathRooms, setBathRooms] = useState("");
  const [floors, setFloors] = useState("");
  const [policies, setPolicies] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [inputValue, setInputValue] = useState(""); 
  const [contractPaper, setContractPaper] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null); 
  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Update input value
  };
  useEffect(() => {
    async function getSinglePropert() {
      const response = await getSingleProperty(id);
      if (response.status === 200) {
        setTitle(response.data.data.title);
        setImages(response.data.data.images);
        setPropertyType(response.data.data.propertyType);
        setDescription(response.data.data.description);
        setArea(response.data.data.area);
        setState(response.data.data.state);
        setCountry(response.data.data.country);
        setCity(response.data.data.city);
        setSector(response.data.data.sector);
        setAreaMeasureType(response.data.data.areaMeasureType);
        setRentPrice(response.data.data.rentPrice);
        setSecurityAmount(response.data.data.securityAmount);
        setBedRooms(response.data.data.bedRooms);
        setBathRooms(response.data.data.bathRooms);
        setFloors(response.data.data.floors);
        setPolicies(response.data.data.policies);
        setFacilities(response.data.data.facilities);
        setStreet(response.data.data.street);
        setHouseNo(response.data.data.houseNo);
        setContractPaper(response.data.data.contractPaper)
        setPreviewSrc(response.data.data.contractPaper)
      }
    }
    getSinglePropert();
  }, [id]);
  // this will add policy input value to policies array by pressing Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault(); // Prevent form submission

      setPolicies((prevPolicies) => [...prevPolicies, inputValue.trim()]); // Add tag to the array
      setInputValue(""); // Clear the input
    }
  };

  // remove policy
  const removePolicy = (policyToRemove) => {
    setPolicies(policies.filter((policy) => policy !== policyToRemove)); // Remove tag from the array
  };

  // facilities
  const [facilityInputValue, setFacilityInputValue] = useState(""); // State for current input value
  const handleFacilityInputChange = (e) => {
    setFacilityInputValue(e.target.value); // Update input value
  };

  // this will add facility input value to facilities array by pressing Enter
  const handleFacilityKeyPress = (e) => {
    if (e.key === "Enter" && facilityInputValue.trim()) {
      e.preventDefault(); // Prevent form submission

      setFacilities((prevPolicies) => [
        ...prevPolicies,
        facilityInputValue.trim(),
      ]); // Add tag to the array
      setFacilityInputValue(""); // Clear the input
    }
  };
  const handleContractUpload = (e) => {
    const files = Array.from(e.target.files);
    setContractPaper(files[0]);
    previewFile(files[0]);
  };

  const previewFile = (file) => {
    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      setPreviewSrc(fileReader.result); // Set previewSrc to the file's base64 data
    };

    if (file.type.startsWith("image/")) {
      fileReader.readAsDataURL(file); // For image files
    } else if (file.type === "application/pdf") {
      // You can use pdf.js to display the first page of the PDF
      // For simplicity, we'll show the PDF as an object (could be a better approach with pdf.js)
      setPreviewSrc(URL.createObjectURL(file)); // For PDF files
    } else {
      setPreviewSrc(null); // Handle other types of files, if needed
    }
  };
  // remove facility
  const removeFacility = (facilityToRemove) => {
    setFacilities(
      facilities.filter((facility) => facility !== facilityToRemove)
    ); // Remove tag from the array
  };

  const options = ["Choose one", "Apartment", "House", "Villa"];

  const handleOptionClick = (option) => {
    setPropertyType(option);
    setIsOpen(false);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => file);
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  // Handle address change
  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index)); // Removes the image at the specified index
  };

  const UpdateProperty = async () => {
    const data = new FormData();
    data.append("title", title);
    data.append("propertyType", propertyType);
    data.append("description", description);
    data.append("area", area);
    data.append("areaMeasureType", areaMeasureType);
    data.append("rentPrice", rentPrice);
    data.append("securityAmount", securityAmount);
    data.append("bedRooms", bedRooms);
    data.append("bathRooms", bathRooms);
    data.append("floors", floors);
    data.append("policies", JSON.stringify(policies));
    data.append("facilities", JSON.stringify(facilities));
    data.append("country", country);
    data.append("state", state);
    data.append("city", city);
    data.append("sector", sector);
    data.append("street", street);
    data.append("houseNo", houseNo);

    images.forEach((file) => {
      if (file instanceof File) {
        data.append("images", file);
      }
    });
    if (contractPaper instanceof File) {
      data.append("contractPaper", contractPaper);
    }

      const response = await updateProperty(id,data);
      
    setLoading(true);
    if (response.status === 200) {
      setLoading(false);
      navigate("/landowner/");
      toast.success("Property Updated successfully");
    } else if (response.status === 400) {
      toast.error(response.response.data.message);
      setLoading(false);
    } else {
      toast.error("Something went wrong please try again");
      setLoading(false);
    }
  };
  const handleDeleteContract = () => {
    setContractPaper(null); // Removes the image at the specified index
  };
  return (
    <div className="flex flex-col items-center h-screen px-4 pt-20 pb-4">
      <div className="w-[60%] p-6 bg-white">
        <h2 className="mb-4 text-2xl font-bold">Update property</h2>
        <div className="mb-6">
          <label className="block font-semibold text-gray-700">Title</label>
          <div className="relative w-full">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Type your title"
              className="w-full p-4 pr-10 mt-1 bg-gray-100 border rounded-lg focus:outline-none"
            />
          </div>
        </div>
        {/* Property Type Dropdown */}
        <div className="mb-6">
          <label className="block font-semibold text-gray-700">
            Property type
          </label>
          <div className="relative w-full">
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="w-full p-4 pr-10 mt-1 bg-gray-100 border rounded-lg cursor-pointer focus:outline-none"
            >
              {propertyType}
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {isOpen && (
              <div className="absolute left-0 z-50 w-full mt-2 bg-white border rounded-lg shadow-lg">
                {options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className={`p-4 cursor-pointer hover:bg-gray-100 ${
                      propertyType === option ? "bg-gray-200" : ""
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upload Images Button */}
        <div className="relative mb-6">
          <div className="flex items-center gap-2 p-3 bg-gray-100 border rounded-lg w-max">
            <PiImage size={20} />
            <p className="font-semibold">Upload Images</p>
          </div>
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            className="absolute top-0 left-0 w-full h-full opacity-0"
          />
        </div>

        {/* Image Gallery */}
        <div className="grid items-center grid-cols-1 gap-2 mb-8 md:grid-cols-4 h-[10rem]">
          {images.length > 0 &&
            images.map((item, index) => (
              <div
                className="w-full h-full overflow-hidden rounded-lg"
                key={index}
              >
                <div className="relative size-full">
                  <img
                    src={
                      item instanceof File ? URL.createObjectURL(item) : item
                    }
                    alt="Uploaded"
                    className="object-cover w-full h-full"
                  />
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute p-2 text-white bg-red-500 rounded-full top-2 right-2"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
        </div>
        {!contractPaper && (
          <div className="relative mb-6">
            <div className="flex items-center gap-2 p-3 bg-gray-100 border rounded-lg w-max">
              <PiFile size={20} />
              <p className="font-semibold">Upload Contract</p>
            </div>
            <input
              type="file"
              onChange={handleContractUpload}
              className="absolute top-0 left-0 w-full h-full opacity-0"
            />
          </div>
        )}
         {previewSrc && contractPaper && (
          <div className="">
            <h2>Uploaded Contract</h2>
            <div className="relative w-max">
              {previewSrc && previewSrc.startsWith("data:image/") ? (
                <img
                  src={previewSrc}
                  alt="File Preview"
                  className="object-contain w-48 h-auto border border-gray-300"
                />
              ) : (
                <object
                  data={previewSrc}
                  type="application/pdf"
                  className="w-48 h-64"
                >
                  <p>Your browser does not support PDFs.</p>
                </object>
              )}
              <button
                onClick={handleDeleteContract}
                className="absolute p-2 text-white bg-red-500 rounded-full top-2 right-2"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>
        )}
        {/* Property Description */}
        <span className="block mt-4 mb-2">Property description</span>
        <div className="relative mb-6">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Start with basic details of your property. What makes it unique?"
            className="p-4 mt-1 bg-gray-100 border rounded-lg w-[60%] focus:outline-none"
          />
        </div>

        {/* Property Features Section */}
        <h3 className="mb-2 text-2xl font-bold">Property features</h3>
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="p-4 mt-1 bg-gray-100 border rounded-lg w-max focus:outline-none"
            placeholder="Area"
            type="number"
          />

          <input
            value={areaMeasureType}
            onChange={(e) => setAreaMeasureType(e.target.value)}
            className="p-4 mt-1 bg-gray-100 border rounded-lg w-max focus:outline-none"
            placeholder="Area type"
            type="text"
          />
          <input
            value={rentPrice}
            onChange={(e) => setRentPrice(e.target.value)}
            className="p-4 mt-1 bg-gray-100 border rounded-lg w-max focus:outline-none"
            placeholder="Rent Price/month"
            type="number"
          />
          <input
            value={securityAmount}
            onChange={(e) => setSecurityAmount(e.target.value)}
            className="p-4 mt-1 bg-gray-100 border rounded-lg w-max focus:outline-none"
            placeholder="Security amount"
            type="number"
          />
          <input
            value={bedRooms}
            onChange={(e) => setBedRooms(e.target.value)}
            className="p-4 mt-1 bg-gray-100 border rounded-lg w-max focus:outline-none"
            placeholder="Bedrooms"
            type="number"
          />
          <input
            value={bathRooms}
            onChange={(e) => setBathRooms(e.target.value)}
            className="p-4 mt-1 bg-gray-100 border rounded-lg w-max focus:outline-none"
            placeholder="Bathrooms"
            type="number"
          />
          <input
            value={floors}
            onChange={(e) => setFloors(e.target.value)}
            className="p-4 mt-1 bg-gray-100 border rounded-lg w-max focus:outline-none"
            placeholder="Floors"
            type="number"
          />
        </div>

        {/* Property Policies Section */}

        <div className="relative mb-6">
          <h3 className="mb-2 text-2xl font-bold">Policies</h3>
          <div className="my-3 field-container d-flex align-items-start align-items-md-center flex-column flex-md-row column-gap-2 rounded-4">
            <label htmlFor="policies">Policy</label>
            <div className="flex flex-wrap items-center w-full p-2 pr-10 mt-2 bg-gray-100 border rounded-lg ">
              {policies.map((policy, index) => (
                <div
                  key={index}
                  className="p-1 mb-2 rounded-lg tag-container d-flex align-items-center me-2"
                  style={{ backgroundColor: "#c5c5c5c5" }}
                >
                  <span className="tag">{policy}</span>
                  <button
                    type="button"
                    className="text-primaryColor "
                    onClick={() => removePolicy(policy)}
                    aria-label="Remove policy"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <input
                type="text"
                id="policy"
                value={inputValue} // Bind input value
                onChange={handleInputChange} // Update input value on change
                onKeyPress={handleKeyPress} // Handle Enter key press
                placeholder="Enter policy and hit enter"
                className="flex-grow bg-gray-100 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Property facility Section */}
        <div className="relative mb-6">
          <h3 className="mb-2 text-2xl font-bold">Facilities</h3>
          <div className="my-3 field-container d-flex align-items-start align-items-md-center flex-column flex-md-row column-gap-2 rounded-4">
            <label htmlFor="facilities">Facility</label>
            <div className="flex flex-wrap items-center w-full p-2 pr-10 mt-2 bg-gray-100 border rounded-lg ">
              {facilities.map((facility, index) => (
                <div
                  key={index}
                  className="p-1 mb-2 rounded-lg tag-container d-flex align-items-center me-2"
                  style={{ backgroundColor: "#c5c5c5c5" }}
                >
                  <span>{facility}</span>
                  <button
                    type="button"
                    className="text-primaryColor "
                    onClick={() => removeFacility(facility)}
                    aria-label="Remove facility"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <input
                type="text"
                id="policy"
                value={facilityInputValue} // Bind input value
                onChange={handleFacilityInputChange} // Update input value on change
                onKeyPress={handleFacilityKeyPress} // Handle Enter key press
                placeholder="Enter facility and hit enter"
                className="flex-grow bg-gray-100 outline-none"
              />
            </div>
          </div>
        </div>
        {/* Property Location */}
        <h3 className="mb-2 text-2xl font-bold">Property Location</h3>
        <span className="block mt-4 mb-2">
          Enter the address of the property
        </span>
        <div className="relative flex flex-wrap items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter country name"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="p-4 mt-1 bg-gray-100 border rounded-lg focus:outline-none"
          />
          <input
            type="text"
            placeholder="Enter State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="p-4 mt-1 bg-gray-100 border rounded-lg focus:outline-none"
          />
          <input
            type="text"
            placeholder="Enter State"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-4 mt-1 bg-gray-100 border rounded-lg focus:outline-none"
          />
          <input
            type="text"
            placeholder="Enter Sector"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="p-4 mt-1 bg-gray-100 border rounded-lg focus:outline-none"
          />
          <input
            type="text"
            placeholder="Enter Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="p-4 mt-1 bg-gray-100 border rounded-lg focus:outline-none"
          />
          <input
            type="text"
            placeholder="Enter House Number"
            value={houseNo}
            onChange={(e) => setHouseNo(e.target.value)}
            className="p-4 mt-1 bg-gray-100 border rounded-lg focus:outline-none"
          />
        </div>

        <div className="flex justify-end w-full mt-8">
          <button
            disabled={loading}
            onClick={UpdateProperty}
            className="flex items-center gap-2 px-4 py-2 font-semibold text-white rounded-lg bg-primaryColor"
          >
            {loading ? "loading ... " : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateProperty;
