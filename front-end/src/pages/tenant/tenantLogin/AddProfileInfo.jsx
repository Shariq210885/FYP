import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { getUserProfile, updateProfile } from "../../../api/auth/auth";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { UseUser } from "../../../context/UserContext";

const PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
];

const CITIES_BY_PROVINCE = {
  Punjab: [
    "Lahore",
    "Faisalabad",
    "Rawalpindi",
    "Multan",
    "Gujranwala",
    "Sialkot",
  ],
  Sindh: ["Karachi", "Hyderabad", "Sukkur", "Larkana"],
  "Khyber Pakhtunkhwa": ["Peshawar", "Mardan", "Abbottabad", "Swat"],
  Balochistan: ["Quetta", "Gwadar", "Turbat"],
  "Islamabad Capital Territory": ["Islamabad"],
};

const ISLAMABAD_SECTORS = [
  "E-7",
  "E-8",
  "E-9",
  "E-10",
  "E-11",
  "F-6",
  "F-7",
  "F-8",
  "F-9",
  "F-10",
  "F-11",
  "G-6",
  "G-7",
  "G-8",
  "G-9",
  "G-10",
  "G-11",
  "H-8",
  "H-9",
  "H-10",
  "H-11",
  "I-8",
  "I-9",
  "I-10",
  "I-11",
];

const COUNTRY_CODES = [
  { code: "+92", country: "Pakistan" },
  { code: "+91", country: "India" },
  { code: "+93", country: "Afghanistan" },
  { code: "+880", country: "Bangladesh" },
  { code: "+86", country: "China" },
  { code: "+977", country: "Nepal" },
  { code: "+94", country: "Sri Lanka" },
  { code: "+971", country: "UAE" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+98", country: "Iran" },
];

// Add this helper function after the constants
const extractPhoneNumber = (fullPhone) => {
  for (const { code } of COUNTRY_CODES) {
    if (fullPhone.startsWith(code)) {
      return {
        countryCode: code,
        number: fullPhone.substring(code.length)
      };
    }
  }
  return { countryCode: "+92", number: fullPhone };
};

function AddProfileInfo() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = UseUser();
  const [formData, setFormData] = useState(null); // Initialize as null
  const [selectedCountryCode, setSelectedCountryCode] = useState("+92");

  // Initialize formData when component mounts or user changes
  useEffect(() => {
    if (user) {
      // Parse the phone number when setting initial form data
      const { countryCode, number } = extractPhoneNumber(user.phone || "");
      setSelectedCountryCode(countryCode);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "tenant",
        profileImage: null,
        cnicImage: [],
        phone: number, // Store only the number part
        address: {
          country: user.address?.country || "",
          state: user.address?.state || "",
          city: user.address?.city || "",
          sector: user.address?.sector || "",
          street: user.address?.street || "",
          houseNo: user.address?.houseNo || "",
        },
      });
    }
  }, [user]);

  // Don't render form until formData is initialized
  if (!formData) {
    return <div>Loading...</div>;
  }

  console.log(user);

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profileImage: file,
      });
    }
  };

  const handleCnicImageUpload = (e) => {
    const file = e.target.files;
    if (file && formData.cnicImage.length < 2) {
      setFormData({
        ...formData,
        cnicImage: [...formData.cnicImage, ...file],
      });
    }
  };

  const handleDeleteImage = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData, // Spread the rest of the formData
      cnicImage: prevFormData.cnicImage.filter((_, i) => i !== index),
    }));
  };

  const handleAddressChange = (e, field) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [field]: e.target.value,
      },
    });
  };

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        state: selectedProvince,
        city: "",
        sector: "",
      },
    });
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        city: selectedCity,
        sector: "",
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        phone: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Prepare FormData
      const data = new FormData();

      // Append simple fields
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("role", formData.role);
      
      // Only append phone number if it doesn't already include country code
      const phoneWithCode = formData.phone.startsWith('+') 
        ? formData.phone 
        : `${selectedCountryCode}${formData.phone}`;
      data.append("phone", phoneWithCode);

      // Append nested address fields
      Object.keys(formData.address).forEach((key) => {
        data.append(`address[${key}]`, formData.address[key]);
      });

      // Append profile image (if exists)
      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

      // Append CNIC images
      formData.cnicImage.forEach((file) => {
        data.append("cnicImage", file);
      });

      const response = await updateProfile(data);
      if (response.status === 200) {
        if (user.googleId === "") {
          navigate("/login");
          toast.success("profile completed");
          localStorage.clear();
        } else {
          const res = await getUserProfile();
          localStorage.setItem("userData", JSON.stringify(res.data.data.user));
          setUser(res.data.data.user);
          if (res.data.data.user.role === "tenant") {
            navigate("/");
          } else if (res.data.data.user.role === "landowner") {
            navigate("/landowner/");
          } else if (res.data.data.user.role === "admin") {
            navigate("/admin/");
          } else if (res.data.data.user.role === "serviceman") {
            navigate("/serviceman/");
          }
        }
      } else if (response.status === 404) {
        toast.warn(response.response.data.message);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28">
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
          <h2 className="mb-6 text-2xl font-semibold">
            Add your personal info
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative overflow-hidden border rounded-full w-52 h-52">
                {user && user.image !== "" ? (
                  <img
                    src={user.image}
                    alt="Profile Preview"
                    className="object-cover w-full h-full"
                  />
                ) : formData.profileImage ? (
                  <img
                    src={URL.createObjectURL(formData.profileImage)}
                    alt="Profile Preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-100">
                    No Image
                  </div>
                )}
                <button className="absolute flex items-center justify-center p-2 text-white rounded-full bg-primaryColor bottom-7 right-7 hover:bg-primaryColor/80">
                  <FaEdit size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </button>
              </div>
            </div>

            {/* CNIC Image Upload */}
            <div className="flex flex-col mb-6">
              <label className="mb-2 text-gray-700">CNIC Image</label>
              <div className="flex items-center w-full gap-2 mb-2 overflow-hidden border rounded-lg">
                {formData.cnicImage.length > 0 ? (
                  formData.cnicImage.map((image, index) => (
                    <div key={index} className="relative w-full h-32">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`CNIC Preview ${index + 1}`}
                        className="object-cover w-full h-full"
                      />

                      <button
                        onClick={() => handleDeleteImage(index)}
                        className="absolute p-2 text-white bg-red-500 rounded-full top-2 right-2"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center w-full h-32 text-gray-400 bg-gray-100">
                    No Image
                  </div>
                )}
              </div>

              <button className="relative flex items-center justify-center p-2 text-white bg-primaryColor hover:bg-primaryColor/80">
                <FaEdit size={16} /> Add
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleCnicImageUpload}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </button>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-gray-700">name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-gray-700">Email address</label>
              <input
                type="email"
                name="email"
                placeholder="johndoe@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700">Phone number</label>
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                    className="w-full p-3 mt-2 text-gray-800 border border-gray-300 rounded-lg appearance-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  >
                    {COUNTRY_CODES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code} ({country.country})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mt-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="flex-1 px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                  maxLength="11"
                />
              </div>
            </div>

            {/* Home Address */}
            <div className="space-y-4">
              <label className="block text-gray-700">Address</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value="Pakistan"
                    disabled
                    className="w-full p-3 mt-1 bg-gray-200 border rounded-lg focus:outline-none text-gray-700"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Province
                  </label>
                  <select
                    value={formData.address.state}
                    onChange={handleProvinceChange}
                    className="w-full p-3 mt-1 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="">Select Province</option>
                    {PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mt-7">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <select
                    value={formData.address.city}
                    onChange={handleCityChange}
                    disabled={!formData.address.state}
                    className={`w-full p-3 mt-1 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent appearance-none
                      ${
                        !formData.address.state
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer"
                      }`}
                  >
                    <option value="">Select City</option>
                    {formData.address.state &&
                      CITIES_BY_PROVINCE[formData.address.state].map(
                        (cityName) => (
                          <option key={cityName} value={cityName}>
                            {cityName}
                          </option>
                        )
                      )}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mt-7">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {formData.address.city === "Islamabad" && (
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sector
                    </label>
                    <select
                      value={formData.address.sector}
                      onChange={(e) => handleAddressChange(e, "sector")}
                      className="w-full p-3 mt-1 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent appearance-none cursor-pointer"
                    >
                      <option value="">Select Sector</option>
                      {ISLAMABAD_SECTORS.map((sect) => (
                        <option key={sect} value={sect}>
                          {sect}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mt-7">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Street"
                    value={formData.address.street}
                    onChange={(e) => handleAddressChange(e, "street")}
                    className="w-full p-3 mt-1 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    House Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter House Number"
                    value={formData.address.houseNo}
                    onChange={(e) => handleAddressChange(e, "houseNo")}
                    className="w-full p-3 mt-1 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Role Dropdown */}
            <div className="flex flex-col items-start w-full">
              <label className="block text-gray-700">Role</label>
              <select
                value={formData.role}
                onChange={handleRoleChange}
                className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-600"
              >
                <option value="tenant">Tenant</option>
                <option value="landowner">LandOwer</option>
                <option value="serviceman">Serviceman</option>
              </select>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-6">
              <button
                disabled={loading}
                type="submit"
                className="px-6 py-2 text-white rounded-lg bg-primaryColor hover:bg-primaryColor/80"
              >
                {loading ? "loading..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProfileInfo;

