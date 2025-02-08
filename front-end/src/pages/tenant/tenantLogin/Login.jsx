import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, loginWithGoogle } from "../../../api/auth/auth";
import { toast } from "react-toastify";
import { UseUser } from "../../../context/UserContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser, googleSignIn } = UseUser();

  // Validate form
  const validateForm = ({ email, password }) => {
    const errors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    try {
      if (Object.keys(validationErrors).length === 0) {
        // Proceed with form submission (e.g., API call)

        const response = await login({
          email: formData.email,
          password: formData.password,
        });

        if (response.status === 200) {
          localStorage.setItem(
            "userData",
            JSON.stringify(response.data.data.user)
          );
          localStorage.setItem("token", response.data.token);
          setUser(response.data.data.user);
          setLoading(false);
          toast.success("Logged In successfully");
          if (response.data.data.user.role === "tenant") {
            navigate("/");
          } else if (response.data.data.user.role === "landowner") {
            navigate("/landowner/");
          } else if (response.data.data.user.role === "admin") {
            navigate("/admin/");
          } else if (response.data.data.user.role === "serviceman") {
            navigate("/serviceman/");
          }
        } else if (response.status === 404) {
          setLoading(false);
          toast.error(response.response.data.message);
        }
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Something went wrong try later");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  async function handleGoogleLogin() {
    try {
      const response = await googleSignIn();
      const userData = response.user;
      const name = userData.displayName;
      const email = userData.email;
      const googleId = userData.providerData[0].uid;
      const image = userData.photoURL; // Add this line to get profile image

      const Data = {
        email: email,
        name: name,
        googleId: googleId,
        image: image, // Add the image to the data being sent
      };
      const res = await loginWithGoogle(Data);
      if (res.status === 200) {
        localStorage.setItem("userData", JSON.stringify(res.data.data.user));
        navigate("/addProfileInfo");
        localStorage.setItem("token", res.data.token);
        setUser(res.data.data.user);
        toast.success("Successfully registered");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className="flex justify-center min-h-screen text-gray-900 pt-28">
        <div className="flex justify-center flex-1 max-w-screen-xl m-0 sm:m-10">
          <div className="p-6 lg:w-1/2 xl:w-4/12 sm:p-12">
            <div className="flex flex-col mt-12">
              <h2 className="text-4xl font-bold">Let&apos;s Sign You In</h2>
              <p className="mt-4 text-2xl font-semibold text-gray-400">
                Welcome back,you&apos;ve been missed
              </p>
              <div className="flex-1 w-full mt-8">
                <form onSubmit={handleSubmit} className="mt-8">
                  <div>
                    <input
                      className={`w-full px-4 py-4 mt-5 text-sm font-medium placeholder-gray-500 bg-gray-100 border rounded-lg ${
                        errors.email ? "border-red-600" : "border-gray-200"
                      }`}
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      className={`w-full px-4 py-4 mt-5 text-sm font-medium placeholder-gray-500 bg-gray-100 border rounded-lg ${
                        errors.password ? "border-red-600" : "border-gray-200"
                      }`}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                      className="absolute text-gray-600 bg-transparent top-[50%] right-4 hover:text-primary-yellow-dark focus:outline-none"
                    >
                      {/* Conditional rendering of icons */}
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          version="1.1"
                          id="Capa_1"
                          width="24px"
                          height="24px"
                          viewBox="0 0 442.04 442.04"
                        >
                          <g>
                            <g>
                              <path d="M221.02,341.304c-49.708,0-103.206-19.44-154.71-56.22C27.808,257.59,4.044,230.351,3.051,229.203    c-4.068-4.697-4.068-11.669,0-16.367c0.993-1.146,24.756-28.387,63.259-55.881c51.505-36.777,105.003-56.219,154.71-56.219    c49.708,0,103.207,19.441,154.71,56.219c38.502,27.494,62.266,54.734,63.259,55.881c4.068,4.697,4.068,11.669,0,16.367    c-0.993,1.146-24.756,28.387-63.259,55.881C324.227,321.863,270.729,341.304,221.02,341.304z M29.638,221.021    c9.61,9.799,27.747,27.03,51.694,44.071c32.83,23.361,83.714,51.212,139.688,51.212s106.859-27.851,139.688-51.212    c23.944-17.038,42.082-34.271,51.694-44.071c-9.609-9.799-27.747-27.03-51.694-44.071    c-32.829-23.362-83.714-51.212-139.688-51.212s-106.858,27.85-139.688,51.212C57.388,193.988,39.25,211.219,29.638,221.021z" />
                            </g>
                            <g>
                              <path d="M221.02,298.521c-42.734,0-77.5-34.767-77.5-77.5c0-42.733,34.766-77.5,77.5-77.5c18.794,0,36.924,6.814,51.048,19.188    c5.193,4.549,5.715,12.446,1.166,17.639c-4.549,5.193-12.447,5.714-17.639,1.166c-9.564-8.379-21.844-12.993-34.576-12.993    c-28.949,0-52.5,23.552-52.5,52.5s23.551,52.5,52.5,52.5c28.95,0,52.5-23.552,52.5-52.5c0-6.903,5.597-12.5,12.5-12.5    s12.5,5.597,12.5,12.5C298.521,263.754,263.754,298.521,221.02,298.521z" />
                            </g>
                            <g>
                              <path d="M221.02,246.021c-13.785,0-25-11.215-25-25s11.215-25,25-25c13.786,0,25,11.215,25,25S234.806,246.021,221.02,246.021z" />
                            </g>
                          </g>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M19.7071 5.70711C20.0976 5.31658 20.0976 4.68342 19.7071 4.29289C19.3166 3.90237 18.6834 3.90237 18.2929 4.29289L14.032 8.55382C13.4365 8.20193 12.7418 8 12 8C9.79086 8 8 9.79086 8 12C8 12.7418 8.20193 13.4365 8.55382 14.032L4.29289 18.2929C3.90237 18.6834 3.90237 19.3166 4.29289 19.7071C4.68342 20.0976 5.31658 20.0976 5.70711 19.7071L9.96803 15.4462C10.5635 15.7981 11.2582 16 12 16C14.2091 16 16 14.2091 16 12C16 11.2582 15.7981 10.5635 15.4462 9.96803L19.7071 5.70711ZM12.518 10.0677C12.3528 10.0236 12.1792 10 12 10C10.8954 10 10 10.8954 10 12C10 12.1792 10.0236 12.3528 10.0677 12.518L12.518 10.0677ZM11.482 13.9323L13.9323 11.482C13.9764 11.6472 14 11.8208 14 12C14 13.1046 13.1046 14 12 14C11.8208 14 11.6472 13.9764 11.482 13.9323ZM15.7651 4.8207C14.6287 4.32049 13.3675 4 12 4C9.14754 4 6.75717 5.39462 4.99812 6.90595C3.23268 8.42276 2.00757 10.1376 1.46387 10.9698C1.05306 11.5985 1.05306 12.4015 1.46387 13.0302C1.92276 13.7326 2.86706 15.0637 4.21194 16.3739L5.62626 14.9596C4.4555 13.8229 3.61144 12.6531 3.18002 12C3.6904 11.2274 4.77832 9.73158 6.30147 8.42294C7.87402 7.07185 9.81574 6 12 6C12.7719 6 13.5135 6.13385 14.2193 6.36658L15.7651 4.8207ZM12 18C11.2282 18 10.4866 17.8661 9.78083 17.6334L8.23496 19.1793C9.37136 19.6795 10.6326 20 12 20C14.8525 20 17.2429 18.6054 19.002 17.0941C20.7674 15.5772 21.9925 13.8624 22.5362 13.0302C22.947 12.4015 22.947 11.5985 22.5362 10.9698C22.0773 10.2674 21.133 8.93627 19.7881 7.62611L18.3738 9.04043C19.5446 10.1771 20.3887 11.3469 20.8201 12C20.3097 12.7726 19.2218 14.2684 17.6986 15.5771C16.1261 16.9282 14.1843 18 12 18Z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                    </button>

                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <Link
                    to="/forget-password"
                    className="flex justify-end w-full mt-1 text-xs font-bold text-gray-600"
                  >
                    Forgot Password?
                  </Link>
                  <div className="flex items-center justify-center w-full mt-5 font-semibold tracking-wide text-white transition-all duration-300 ease-in-out rounded-lg bg-primaryColor hover:bg-primaryColor/80 focus:shadow-outline focus:outline-none">
                    <button
                      disabled={loading}
                      type="submit"
                      className="w-full h-full py-4 text-center"
                    >
                      {loading ? "loading" : "Login In"}
                    </button>
                  </div>
                </form>
                <div className="my-6 text-center border-b">
                  <div className="inline-block px-2 text-sm font-medium leading-none tracking-wide text-gray-600 transform translate-y-1/2 bg-white">
                    OR
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <button
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center w-full py-3 font-bold text-gray-800 transition-all duration-300 ease-in-out bg-gray-200 rounded-lg shadow-sm focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                  >
                    <div className="p-2 bg-white rounded-full">
                      <svg className="w-4" viewBox="0 0 533.5 544.3">
                        <path
                          d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                          fill="#4285f4"
                        />
                        <path
                          d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                          fill="#34a853"
                        />
                        <path
                          d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                          fill="#fbbc04"
                        />
                        <path
                          d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                          fill="#ea4335"
                        />
                      </svg>
                    </div>
                    <span className="ml-4">Continue with Google</span>
                  </button>
                  <p className="mt-4">
                    Don&apos;t have Account? <Link to="/register">Sign up</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 hidden text-center lg:flex lg:w-1/2 xl:w-6/12">
            <div
              className="w-full bg-center bg-no-repeat bg-contain"
              style={{
                backgroundImage: "url('/static-images/house.png')",
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;