import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email tidak boleh kosong");
      toast.error("Email tidak boleh kosong!", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }

    if (!emailPattern.test(email)) {
      setError("Format email tidak valid");
      toast.error("Format email tidak valid!", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }

    setError("");
    toast.success("Kode verifikasi dikirim! Mengalihkan...", {
      position: "top-center",
      autoClose: 1200,
    });

    setTimeout(() => {
      navigate("/reset-password", { state: { email } });
    }, 1200);
  };

  return (
    <section className="w-full flex flex-col gap-7">
      <div>
        <h2 className="font-jakarta font-bold text-2xl text-gray-900">
          Reset your password
        </h2>
        <p className="font-inter font-normal text-sm mt-1 text-gray-600">
          Enter your registered email to continue resetting your password.
        </p>
      </div>

      {/* Form Inputs */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Address */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="font-inter font-medium text-gray-700 text-sm"
          >
            Email Address
          </label>
          <input
            className={`px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-colors ${
              error ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            type="email"
            id="email"
            placeholder="mail@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
          />
          {error && (
            <span className="text-red-600 text-xs font-inter font-medium mt-0.5">
              {error}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 transition cursor-pointer p-3 rounded-lg w-full text-white font-semibold text-sm font-inter mt-2 shadow-sm"
        >
          Send reset link
        </button>
      </form>

      <div className="text-center font-inter text-xs text-gray-500">
        Remember your password?{" "}
        <Link
          to="/login"
          className="text-orange-600 font-medium hover:underline"
        >
          Sign In
        </Link>
      </div>
    </section>
  );
}

export default ForgotPassword;

