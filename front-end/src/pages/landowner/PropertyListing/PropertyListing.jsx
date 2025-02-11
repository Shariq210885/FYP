import { useState } from "react";
import { FaGlobe, FaTimes } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { PiFile, PiImage } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { listProperty } from "../../../api/property/property";

const AVAILABLE_POLICIES = [
  { id: "pets", label: "Pets Allowed" },
  { id: "smoking", label: "Smoking Allowed" },
  { id: "parking", label: "Parking Available" },
  { id: "furnished", label: "Furnished" },
  { id: "shortTerm", label: "Short-Term Available" },
  { id: "utilities", label: "Utilities Included" },
  { id: "cooking", label: "Cooking Allowed" },
  { id: "visitors", label: "Visitors Allowed" },
  { id: "students", label: "Students Welcome" },
  { id: "couples", label: "Couples Allowed" },
  { id: "wifi", label: "WiFi Included" },
  { id: "laundry", label: "Laundry Available" },
];

const AVAILABLE_FACILITIES = [
  { id: "electricity", label: "Electricity Backup" },
  { id: "water", label: "Water Supply 24/7" },
  { id: "internet", label: "High Speed Internet" },
  { id: "ac", label: "Air Conditioning" },
  { id: "heater", label: "Water Heater" },
  { id: "kitchen", label: "Kitchen" },
  { id: "laundry", label: "Laundry Room" },
  { id: "security", label: "Security Guard" },
  { id: "cctv", label: "CCTV Cameras" },
  { id: "elevator", label: "Elevator" },
  { id: "gym", label: "Gym" },
  { id: "garden", label: "Garden/Terrace" },
  { id: "cleaning", label: "Cleaning Service" },
  { id: "maintenance", label: "Maintenance Staff" },
  { id: "dining", label: "Common Dining Area" },
];

const CITIES = [
  "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot",
  "Karachi", "Hyderabad", "Sukkur", "Larkana",
  "Peshawar", "Mardan", "Abbottabad", "Swat",
  "Quetta", "Gwadar", "Turbat",
  "Islamabad"
];

const ISLAMABAD_SECTORS = [
  "E-7", "E-8", "E-9", "E-10", "E-11",
  "F-6", "F-7", "F-8", "F-9", "F-10", "F-11",
  "G-6", "G-7", "G-8", "G-9", "G-10", "G-11",
  "H-8", "H-9", "H-10", "H-11",
  "I-8", "I-9", "I-10", "I-11"
];

function PropertyListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [propertyType, setPropertyType] = useState("Choose one");
  const [isOpen, setIsOpen] = useState(false);
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
  const [floors, setfloors] = useState("");
  const [policies, setPolicies] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [contractPaper, setContractPaper] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [areaInKanal, setAreaInKanal] = useState("");
  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Update input value
  };


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault(); // Prevent form submission

      setPolicies((prevPolicies) => [...prevPolicies, inputValue.trim()]); // Add tag to the array
      setInputValue(""); // Clear the input
    }
  };

  const removePolicy = (policyToRemove) => {
    setPolicies(policies.filter((policy) => policy !== policyToRemove)); // Remove tag from the array
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

  const handleDeleteContract = () => {
    setContractPaper(null); // Removes the image at the specified index
  };
  const options = ["Apartment", "House", "Villa"];

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

  // Add this validation function
  const handleNumberInput = (value, setter) => {
    const num = parseInt(value);
    if (num < 0) {
      setter(0);
    } else {
      setter(value);
    }
  };

  // Add this conversion function
  const convertMarlasToKanal = (marlas) => {
    return (marlas / 20).toFixed(2);
  };

  // Modify the area input handler
  const handleAreaChange = (value) => {
    if (value < 0) {
      setArea(0);
      setAreaInKanal(0);
    } else {
      setArea(value);
      setAreaInKanal(convertMarlasToKanal(value));
    }
  };

  

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    setSector(""); // Reset sector when city changes
  };

  const postProperty = async () => {
    // Validate required fields
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (propertyType === "Choose one") {
      toast.error("Please select a property type");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one property image");
      return;
    }

    if (!contractPaper) {
      toast.error("Please upload contract paper");
      return;
    }

    if (!description.trim()) {
      toast.error("Property description is required");
      return;
    }

    if (!area || area <= 0) {
      toast.error("Valid area is required");
      return;
    }

    if (!rentPrice || rentPrice <= 0) {
      toast.error("Valid rent price is required");
      return;
    }

    if (!securityAmount || securityAmount <= 0) {
      toast.error("Valid security amount is required");
      return;
    }

    if (!bedRooms || bedRooms <= 0) {
      toast.error("Number of bedrooms is required");
      return;
    }

    if (!bathRooms || bathRooms <= 0) {
      toast.error("Number of bathrooms is required");
      return;
    }

    if (!floors || floors <= 0) {
      toast.error("Number of floors is required");
      return;
    }

    if (!city) {
      toast.error("City is required");
      return;
    }

    if (city === "Islamabad" && !sector) {
      toast.error("Sector is required for properties in Islamabad");
      return;
    }

    if (!street.trim()) {
      toast.error("Street address is required");
      return;
    }

    if (!houseNo.trim()) {
      toast.error("House number is required");
      return;
    }

    const data = new FormData();

    // Convert marlas to kanal before sending
    const areaInKanal = convertMarlasToKanal(area);

    // Append simple fields
    data.append("title", title);
    data.append("propertyType", propertyType);
    data.append("description", description);
    data.append("area", area); // Send the converted value
    data.append("areaMeasureType", "Marla"); // Change measure type to Kanal
    data.append("rentPrice", rentPrice);
    data.append("securityAmount", securityAmount);
    data.append("bedRooms", bedRooms);
    data.append("bathRooms", bathRooms);
    data.append("floors", floors);
    data.append("policies", JSON.stringify(policies));
    data.append("facilities", JSON.stringify(facilities));
    data.append("country", "Pakistan");
    data.append("state", "Tempo");
    data.append("city", city);
    data.append("sector", sector);
    data.append("street", street);
    data.append("houseNo", houseNo);

    images.forEach((file) => {
      data.append("images", file);
    });
    data.append("contractPaper", contractPaper);

    const response = await listProperty(data);
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value}`);
    }
    setLoading(true);
    if (response.status === 201) {
      setLoading(false);
      navigate("/landowner/");
      toast.success("Property listed successfully");
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
        <h2 className="mb-4 text-2xl font-bold">List your property</h2>
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
        <div className="grid items-center grid-cols-1 gap-2 md:grid-cols-4">
          {images.length > 0 &&
            images.map((item, index) => (
              <div
                className="w-full h-full mb-8 overflow-hidden rounded-lg"
                key={index}
              >
                <div className="relative">
                  <img
                    src={URL.createObjectURL(item)}
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

        {/* Preview */}
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

<h3 className="mb-2 text-2xl font-bold">Property Features</h3>
<div className="flex flex-wrap gap-4 mb-6">
  
  <div className="flex flex-col gap-2">
    <label className="block font-bold text-gray-700">Area</label>
    <input
      value={area}
      onChange={(e) => handleAreaChange(e.target.value)}
      className="p-4 mt-1 bg-gray-100 border rounded-lg w-max focus:outline-none"
      placeholder="Area in Marlas *"
      type="number"
      min="0"
      onKeyDown={(e) => {
        if (e.key === "-") e.preventDefault();
      }}
      required
    />
    {area && (
      <span className="text-sm text-gray-600">
        Equivalent to {areaInKanal} Kanal
      </span>
    )}
  </div>

  <div className="flex flex-col gap-2">
    <label className="block font-bold text-gray-700">Rent Price</label>
    <input
      value={rentPrice}
      onChange={(e) => handleNumberInput(e.target.value, setRentPrice)}
      className="p-4 mt-1 bg-gray-100 border rounded-lg w-max focus:outline-none"
      placeholder="Rent Price/month *"
      type="number"
      min="0"
      onKeyDown={(e) => {
        if (e.key === "-") e.preventDefault();
      }}
      required
    />
  </div>

  <div className="flex flex-col gap-2">
    <label className="block font-bold text-gray-700">Security Amount</label>
    <input
      value={securityAmount}
      onChange={(e) => handleNumberInput(e.target.value, setSecurityAmount)}
      className="p-4 mt-1 bg-gray-100 border rounded-lg w-max focus:outline-none"
      placeholder="Security amount *"
      type="number"
      min="0"
      onKeyDown={(e) => {
        if (e.key === "-") e.preventDefault();
      }}
      required
    />
  </div>

  <div className="flex flex-col gap-2">
    <label className="block font-bold text-gray-700">Bedrooms</label>
    <input
      value={bedRooms}
      onChange={(e) => handleNumberInput(e.target.value, setBedRooms)}
      className="p-4 mt-1 bg-gray-100 border rounded-lg w-max focus:outline-none"
      placeholder="Bedrooms *"
      type="number"
      min="0"
      onKeyDown={(e) => {
        if (e.key === "-") e.preventDefault();
      }}
      required
    />
  </div>

  <div className="flex flex-col gap-2">
    <label className="block font-bold text-gray-700">Bathrooms</label>
    <input
      value={bathRooms}
      onChange={(e) => handleNumberInput(e.target.value, setBathRooms)}
      className="p-4 mt-1 bg-gray-100 border rounded-lg w-max focus:outline-none"
      placeholder="Bathrooms *"
      type="number"
      min="0"
      onKeyDown={(e) => {
        if (e.key === "-") e.preventDefault();
      }}
      required
    />
  </div>

  <div className="flex flex-col gap-2">
    <label className="block font-bold text-gray-700">Floors</label>
    <input
      value={floors}
      onChange={(e) => handleNumberInput(e.target.value, setfloors)}
      className="p-4 mt-1 bg-gray-100 border rounded-lg w-max focus:outline-none"
      placeholder="Floors *"
      type="number"
      min="0"
      onKeyDown={(e) => {
        if (e.key === "-") e.preventDefault();
      }}
      required
    />
  </div>

</div>

        {/* Property Policies Section */}
        <div className="relative mb-6">
          <h3 className="mb-2 text-2xl font-bold">Policies</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {AVAILABLE_POLICIES.map((policy) => (
              <div
                key={policy.id}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={policies.includes(policy.label)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPolicies([...policies, policy.label]);
                      } else {
                        setPolicies(
                          policies.filter((item) => item !== policy.label)
                        );
                      }
                    }}
                    className="w-4 h-4 rounded text-primaryColor focus:ring-primaryColor"
                  />
                  <span className="text-sm">{policy.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Property Facilities Section */}
        <div className="relative mb-6">
          <h3 className="mb-2 text-2xl font-bold">Facilities</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {AVAILABLE_FACILITIES.map((facility) => (
              <div
                key={facility.id}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={facilities.includes(facility.label)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFacilities([...facilities, facility.label]);
                      } else {
                        setFacilities(
                          facilities.filter((item) => item !== facility.label)
                        );
                      }
                    }}
                    className="w-4 h-4 rounded text-primaryColor focus:ring-primaryColor"
                  />
                  <span className="text-sm">{facility.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Property Location */}
        <h3 className="mb-2 text-2xl font-bold">Property Location</h3>
        <span className="block mt-4 mb-2">Enter the address of the property</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              value="Pakistan"
              disabled
              className="w-full p-3 mt-1 bg-gray-200 border rounded-lg focus:outline-none text-gray-700"
            />
          </div>

          

          <div className="relative">
  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
  <select
    value={city}
    onChange={handleCityChange}
    className="w-full p-3 mt-1 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent appearance-none cursor-pointer"
  >
    <option value="">Select City</option>
    {CITIES.map(cityName => (
      <option key={cityName} value={cityName}>{cityName}</option>
    ))}
  </select>
  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mt-7">
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>

{city === "Islamabad" && (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
    <select
      value={sector}
      onChange={(e) => setSector(e.target.value)}
      className="w-full p-3 mt-1 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent appearance-none cursor-pointer"
    >
      <option value="">Select Sector</option>
      {ISLAMABAD_SECTORS.map(sect => (
        <option key={sect} value={sect}>{sect}</option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mt-7">
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
)}

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
            <input
              type="text"
              placeholder="Enter Street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full p-3 mt-1 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">House Number</label>
            <input
              type="text"
              placeholder="Enter House Number"
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
              className="w-full p-3 mt-1 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end w-full mt-8">
          <button
            disabled={loading}
            onClick={postProperty}
            className="flex items-center gap-2 px-4 py-2 font-semibold text-white rounded-lg bg-primaryColor"
          >
            <FaGlobe />
            {loading ? "loading ... " : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyListing;