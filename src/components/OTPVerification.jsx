import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faArrowLeft,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

const OTPVerification = ({ email, onSuccess, onBack, onResend }) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds cooldown
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow numbers
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      // Call the onSuccess callback which uses context's verifyOTP
      const success = await onSuccess(otp);

      if (!success) {
        // Error toast is already shown in context
        setOtp(""); // Clear OTP on failure
      }
    } catch (error) {
      toast.error("OTP verification failed");
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsLoading(true);
    try {
      await onResend();
      setTimeLeft(60);
      setCanResend(false);
      setOtp(""); // Clear current OTP
      // Toast is shown in parent component
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#fdf7f0] min-h-screen flex items-center justify-center py-10">
      <div className="flex flex-col items-center w-[90%] sm:max-w-md m-auto gap-4 text-[#3d2b1f] bg-white p-8 rounded-xl shadow-xl border border-[#e8dccf]">
        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="self-start flex items-center gap-2 text-sm text-[#3d2b1f] opacity-60 hover:opacity-100 transition-opacity"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
          Change Email
        </button>

        <div className="inline-flex items-center gap-2 mb-2 mt-4">
          <p className="prata-regular text-3xl text-[#3d2b1f]">Verify Email</p>
          <hr className="border-none h-[1.5px] w-8 bg-[#3d2b1f]" />
        </div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-[#f5ece3] to-[#fdf7f0] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#e8dccf]">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="w-7 h-7 text-[#3d2b1f]"
            />
          </div>
          <p className="text-gray-600 mb-2">
            We've sent a verification code to
          </p>
          <p className="font-semibold text-[#3d2b1f]">{email}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full gap-4"
        >
          <div className="w-full">
            <label className="text-sm font-medium text-[#3d2b1f] mb-2 block text-center">
              Enter 6-Digit Code
            </label>
            <input
              onChange={handleOTPChange}
              value={otp}
              type="text"
              className="w-full px-4 py-4 border-2 border-[#e8dccf] rounded-lg text-center text-3xl tracking-widest bg-[#fdf7f0] text-[#3d2b1f] focus:border-[#3d2b1f] focus:outline-none transition-colors font-bold"
              placeholder="------"
              maxLength="6"
              required
              autoComplete="one-time-code"
              autoFocus
            />
            <p className="text-xs text-[#3d2b1f] opacity-60 mt-2 text-center">
              Check your email inbox and spam folder
            </p>
          </div>

          <div className="w-full text-center text-sm mt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isLoading}
              className={`font-medium ${
                canResend && !isLoading
                  ? "text-[#5a3c2c] hover:text-[#3d2b1f] cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading
                ? "Sending..."
                : canResend
                ? "🔄 Resend OTP"
                : `Resend in ${timeLeft}s`}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className={`w-full px-8 py-3 mt-4 rounded-lg font-semibold transition-all ${
              isLoading || otp.length !== 6
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
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify & Create Account"
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg w-full">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon
              icon={faLock}
              className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0"
            />
            <div className="text-sm text-purple-800">
              <p className="font-semibold mb-1">🔒 Security Notice</p>
              <p className="text-xs">
                This OTP is valid for 10 minutes. Never share your OTP with
                anyone. We will never ask for your OTP via phone or email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
