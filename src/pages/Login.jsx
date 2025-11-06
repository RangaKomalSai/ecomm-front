import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OTPVerification from "../components/OTPVerification";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpData, setOtpData] = useState(null);

  const { token, loginUser, registerUser, verifyOTP } = useContext(ShopContext);

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Validate password strength
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
        if (currentState === "Sign Up") {
        // Validate password strength
        if (!validatePassword(password)) {
          toast.error("Password must be at least 8 characters long");
          setIsLoading(false);
          return;
        }

        if (!phone || phone.trim().length < 10) {
          toast.error("Please enter a valid phone number");
          setIsLoading(false);
          return;
        }

        // Send OTP for registration using context function
        const response = await registerUser(name, email, password, phone);

        if (response.success) {
          setOtpSent(true);
          setOtpData({ name, email, password, phone });
          // Toast is already shown in context
        }
      } else {
        // Login using context function
        const response = await loginUser(email, password);

        if (response.success) {
          // Context handles token and navigation
          // Toast is already shown in context
        }
      }
    } catch (error) {
      // Error handling is done in context functions
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSuccess = async (otp) => {
    const response = await verifyOTP(otpData.email, otp);
    if (response.success) {
      // Context handles token storage and navigation
      return true;
    }
    return false;
  };

  const handleOTPBack = () => {
    setOtpSent(false);
    setOtpData(null);
  };

  const resendOTP = async () => {
    const response = await registerUser(
      otpData.name,
      otpData.email,
      otpData.password,
      otpData.phone
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to resend OTP");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  // If OTP is sent, show OTP verification component
  if (otpSent) {
    return (
      <OTPVerification
        email={otpData?.email}
        onSuccess={handleOTPSuccess}
        onBack={handleOTPBack}
        onResend={resendOTP}
      />
    );
  }

  return (
    <div className="bg-[#fdf7f0] min-h-screen flex items-center justify-center py-10">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center w-[90%] sm:max-w-md m-auto gap-4 text-[#3d2b1f] bg-white p-8 rounded-xl shadow-xl border border-[#e8dccf]"
      >
        <div className="inline-flex items-center gap-2 mb-4 mt-4">
          <p className="prata-regular text-3xl text-[#3d2b1f]">
            {currentState}
          </p>
          <hr className="border-none h-[1.5px] w-8 bg-[#3d2b1f]" />
        </div>

        {currentState === "Sign Up" && (
          <div className="w-full">
            <label className="text-sm font-medium text-[#3d2b1f] mb-1 block">
              Full Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              className="w-full px-4 py-3 border-2 border-[#e8dccf] rounded-lg bg-[#fdf7f0] text-[#3d2b1f] placeholder-[#3d2b1f] placeholder-opacity-60 focus:border-[#3d2b1f] focus:outline-none transition-colors"
              placeholder="Enter your full name"
              required
            />
          </div>
        )}

        {currentState === "Sign Up" && (
          <div className="w-full">
            <label className="text-sm font-medium text-[#3d2b1f] mb-1 block">
              Phone Number
            </label>
            <input
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              type="tel"
              className="w-full px-4 py-3 border-2 border-[#e8dccf] rounded-lg bg-[#fdf7f0] text-[#3d2b1f] placeholder-[#3d2b1f] placeholder-opacity-60 focus:border-[#3d2b1f] focus:outline-none transition-colors"
              placeholder="Enter your phone number"
              required={currentState === "Sign Up"}
            />
          </div>
        )}

        <div className="w-full">
          <label className="text-sm font-medium text-[#3d2b1f] mb-1 block">
            Email Address
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className="w-full px-4 py-3 border-2 border-[#e8dccf] rounded-lg bg-[#fdf7f0] text-[#3d2b1f] placeholder-[#3d2b1f] placeholder-opacity-60 focus:border-[#3d2b1f] focus:outline-none transition-colors"
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="w-full">
          <label className="text-sm font-medium text-[#3d2b1f] mb-1 block">
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className="w-full px-4 py-3 border-2 border-[#e8dccf] rounded-lg bg-[#fdf7f0] text-[#3d2b1f] placeholder-[#3d2b1f] placeholder-opacity-60 focus:border-[#3d2b1f] focus:outline-none transition-colors"
            placeholder="Enter your password"
            required
          />
          {currentState === "Sign Up" && (
            <p className="text-xs text-[#3d2b1f] opacity-60 mt-2">
              Password must be at least 8 characters long
            </p>
          )}
        </div>

        <div className="w-full flex justify-between text-sm mt-1">
          <button
            type="button"
            className="text-[#3d2b1f] opacity-60 hover:opacity-100 transition-opacity"
            onClick={() => toast.info("Password reset feature coming soon!")}
          >
            Forgot password?
          </button>
          {currentState === "Login" ? (
            <button
              type="button"
              onClick={() => setCurrentState("Sign Up")}
              className="text-[#5a3c2c] hover:text-[#3d2b1f] transition-colors font-medium"
            >
              Create account
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentState("Login")}
              className="text-[#5a3c2c] hover:text-[#3d2b1f] transition-colors font-medium"
            >
              Login here
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-8 py-3 mt-4 rounded-lg font-semibold transition-all ${
            isLoading
              ? "bg-[#e8dccf] cursor-not-allowed text-[#3d2b1f] opacity-60"
              : "bg-[#3d2b1f] hover:bg-[#5a3c2c] text-[#fdf7f0] active:scale-95"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fillll="none"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : currentState === "Login" ? (
            "Log In"
          ) : (
            "Send OTP"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
