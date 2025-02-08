import { useState } from "react";
import {toast} from "react-toastify"
import { forgotPassword } from "../../../api/auth/auth";
function ForgotPassword() {
  const [email, setEmail] = useState("")
  async function handleSumbit() {
    if (!email) {
      toast.warn("Please fill the email field!")
      return;
    }
    const response = await forgotPassword({ email: email });
    if (response.status===201) {
      toast.success("Please Check your email")
      setEmail("")
    }else if (response.status===404) {
      toast.error(response.response.data.message)

    }
    
  }
  return (
    <>
      <div className="flex justify-center min-h-screen text-gray-900 pt-28">
        <div className="flex justify-center flex-1 max-w-screen-xl m-0 sm:m-10">
          <div className="p-6 lg:w-1/2 xl:w-6/12 sm:p-12">
            <div className="flex flex-col mt-6">
              <h2 className="text-4xl font-bold">Forget Password</h2>
              <p className="mt-4 text-2xl font-semibold text-gray-400">
                Enter your email address to reset password
              </p>
              <div className="flex-1 w-full mt-4">
                <div className="">
                 
                  <input
                    className="w-full px-8 py-4 mt-5 text-sm font-medium placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                  />
                
                 
                  <button  onClick={handleSumbit}  className="flex items-center justify-center w-full py-4 mt-5 font-semibold tracking-wide text-white transition-all duration-300 ease-in-out rounded-lg bg-primaryColor text-white-500 hover:bg-primaryColor/90 focus:shadow-outline focus:outline-none">
                    <span className="ml-">Forgot Password</span>
                  </button>
                </div>
              
                
              </div>
            </div>
          </div>
         
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
