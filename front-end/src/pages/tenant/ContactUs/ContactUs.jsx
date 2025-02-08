import { useState } from "react";
import { postQuery } from "../../../api/contact/contact";
import { toast } from "react-toastify";
function ContactUs() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    queryType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await postQuery(formData);
      if (response.status == 200) {
        setLoading(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          queryType: "",
        });
        toast.success("Query posted successfully");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("something went wrong try later");
      setLoading(false);
    }
    // Handle form submission (e.g., send the data to an API or email)
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 pt-28 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          Contact Us
        </h2>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Inquiry Type */}
          <div>
            <label
              htmlFor="queryType"
              className="block text-sm font-medium text-gray-700"
            >
              Inquiry Type
            </label>
            <select
              id="queryType"
              name="queryType"
              value={formData.queryType}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:ring-primaryColor focus:border-prring-primaryColor sm:text-sm"
            >
              <option value="Property">Property</option>
              <option value="Paying Guest">Paying guest</option>
              <option value="Service">Service</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:ring-primaryColor focus:border-prring-primaryColor sm:text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:ring-primaryColor focus:border-prring-primaryColor sm:text-sm"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:ring-primaryColor focus:border-prring-primaryColor sm:text-sm"
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:ring-primaryColor focus:border-prring-primaryColor sm:text-sm"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white rounded-md shadow-md bg-primaryColor hover:bg-primaryColor/90 focus:ring-2 focus:ring-primaryColor focus:ring-offset-2"
            >
              {loading ? "loading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
