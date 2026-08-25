import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email tidak boleh kosong!", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }

    toast.success("Link reset password telah dikirim ke email Anda!", {
      position: "top-center",
      autoClose: 1500,
    });

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1800);
  };

  return (
    <section className="w-full flex flex-col gap-7">
      <div>
        <h2 className="font-jakarta font-bold text-2xl text-gray-900">
          Reset your password
        </h2>
        <p className="font-inter font-normal text-sm mt-1 text-gray-600">
          Enter your email and we'll send a link.
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
            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            type="email"
            id="email"
            placeholder="mail@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
