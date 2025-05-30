import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { UseUser } from "../../../context/UserContext";
import { updateProfile } from "../../../api/auth/auth";
import { toast } from "react-toastify";

// Add these constants at the top
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

// Add this constant with the services list
const SERVICE_TYPES = [
  "Plumber",
  "Electrician",
  "Ac Technician"
];

// Add this helper function after the constants
const extractPhoneNumber = (fullPhone) => {
  for (const { code } of COUNTRY_CODES) {
    if (fullPhone.startsWith(code)) {
      return {
        countryCode: code,
        number: fullPhone.substring(code.length),
      };
    }
  }
  return { countryCode: "+92", number: fullPhone };
};

function Profile() {
  const { user, setUser } = UseUser();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState(""); // State to store the selected role
  const [addressForm, setAddressForm] = useState({
    country: "",
    state: "",
    city: "",
    sector: "",
    street: "",
    houseNo: "",
  });

  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+92");
  const [serviceType, setServiceType] = useState("");

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setFullName(user.name);
      // Parse the phone number when user data is loaded
      const { countryCode, number } = extractPhoneNumber(user.phone || "");
      setSelectedCountryCode(countryCode);
      setPhoneNumber(number);
      setRole(user.role);
      setAddressForm(user.address);
      setImagePreview(user.image || "");
      setServiceType(user.serviceType || "");
    }
  }, [user]);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setAddressForm({
      ...addressForm,
      state: selectedProvince,
      city: "",
      sector: "",
    });
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setAddressForm({
      ...addressForm,
      city: selectedCity,
      sector: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add validation for full name
    if (!fullName.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    try {
      setLoading(true);

      // Prepare FormData
      const data = new FormData();

      // Append simple fields
      data.append("name", fullName);
      data.append("email", email);
      data.append("role", role);
      // Only append phone number if it doesn't already include country code
      const phoneWithCode = phoneNumber.startsWith("+")
        ? phoneNumber
        : `${selectedCountryCode}${phoneNumber}`;
      data.append("phone", phoneWithCode);

      Object.keys(addressForm).forEach((key) => {
        data.append(`address[${key}]`, addressForm[key]);
      });

      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      // Add serviceType to form data if role is serviceman
      if (role === "serviceman") {
        if (!serviceType) {
          toast.error("Please select a service type");
          return;
        }
        data.append("serviceType", serviceType);
      }

      const response = await updateProfile(data);

      if (response.status === 200) {
        toast.success("Profile Updated");
        const userData = JSON.stringify(response.data.data.updatedUser);
        localStorage.setItem("userData", userData);
        setUser(response.data.data.updatedUser);
      } else if (response.status === 404) {
        toast.warn(response.response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false); // This ensures loading is set to false regardless of success or failure
    }
  };

  return (
    <div className="pt-28">
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
          <h2 className="mb-6 text-2xl font-semibold">
            Edit your personal info
          </h2>

          {/* Disclaimer for tenant users - Moved to top of form */}
          {role === "tenant" && (
            <div className="p-4 mb-6 border-l-4 border-blue-500 bg-blue-50 rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Want to list a property?</h3>
                  <div className="mt-1 text-sm text-blue-700">
                    To list properties on our platform, please change your role to "Landowner" using the role dropdown below and save your profile.
                  </div>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative overflow-hidden border rounded-full w-52 h-52">
                {imagePreview ? (
                  <img
                    src={imagePreview}
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

            {/* Full Name */}
            <div>
              <label className="block text-gray-700">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-gray-700">Email address</label>
              <input
                value={email}
                type="email"
                placeholder="johndoe@gmail.com"
                className="w-full px-4 py-2 mt-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                disabled
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
                  value={phoneNumber}
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
                    value={addressForm.state}
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
                    value={addressForm.city}
                    onChange={handleCityChange}
                    disabled={!addressForm.state}
                    className={`w-full p-3 mt-1 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent appearance-none
                      ${
                        !addressForm.state
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer"
                      }`}
                  >
                    <option value="">Select City</option>
                    {addressForm.state &&
                      CITIES_BY_PROVINCE[addressForm.state].map((cityName) => (
                        <option key={cityName} value={cityName}>
                          {cityName}
                        </option>
                      ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mt-7">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 24 24"
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

                {addressForm.city === "Islamabad" && (
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sector
                    </label>
                    <select
                      value={addressForm.sector}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          sector: e.target.value,
                        })
                      }
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
                    value={addressForm.street}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, street: e.target.value })
                    }
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
                    value={addressForm.houseNo}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        houseNo: e.target.value,
                      })
                    }
                    className="w-full p-3 mt-1 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Role Dropdown */}
            {role !== "admin" && (
              <div className="flex flex-col items-start w-full">
                <label className="block text-gray-700">Role</label>
                <select
                  value={role}
                  onChange={handleRoleChange}
                  className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-600"
                >
                  <option value="tenant">Tenant</option>
                  <option value="landowner">Landowner</option>
                  <option value="serviceman">Serviceman</option>
                </select>
              </div>
            )}

            {/* Service Type Dropdown - Only show when role is serviceman */}
            {role === "serviceman" && (
              <div className="flex flex-col items-start w-full">
                <label className="block text-gray-700">Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-600"
                >
                  <option value="">Select Service Type</option>
                  {SERVICE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            )}

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

export default Profile;
