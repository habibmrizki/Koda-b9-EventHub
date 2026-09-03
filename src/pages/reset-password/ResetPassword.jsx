import { useState } from "react";
import { FaEye, FaEyeSlash, FaArrowLeft, FaKey } from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateRegisteredUser } from "../../redux/slices/authSlices/registerSlice";
import { toast } from "react-toastify";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Retrieve email passed from Forgot Password page, if available
  const initialEmail = location.state?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});

  // Validation Patterns
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
  const regexKecil = /[a-z]/;
  const regexBesar = /[A-Z]/;
  const spesialChar = /[!@#$%^&*/><]/;

  const validate = () => {
    const tempErrors = {};

    if (!email.trim()) {
      tempErrors.email = "Email wajib diisi";
    } else if (!emailRegex.test(email)) {
      tempErrors.email = "Format email tidak valid";
    }

    if (!newPassword.trim()) {
      tempErrors.newPassword = "Password baru tidak boleh kosong";
    } else if (newPassword.length < 8) {
      tempErrors.newPassword = "Password minimal 8 karakter";
    } else if (!regexKecil.test(newPassword)) {
      tempErrors.newPassword = "Password harus mengandung huruf kecil";
    } else if (!regexBesar.test(newPassword)) {
      tempErrors.newPassword = "Password harus mengandung huruf besar";
    } else if (!spesialChar.test(newPassword)) {
      tempErrors.newPassword =
        "Password harus mengandung karakter spesial (!@#$%^&*/<>)";
    }

    if (!confirmPassword) {
      tempErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (confirmPassword !== newPassword) {
      tempErrors.confirmPassword = "Konfirmasi password tidak cocok";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Mohon lengkapi formulir dengan benar", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }

    // Dispatch update user password to Redux
    dispatch(
      updateRegisteredUser({
        email,
        data: { password: newPassword },
      })
    );

    toast.success("Password berhasil diperbarui! Silakan login.", {
      position: "top-center",
      autoClose: 1500,
    });

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1800);
  };

  return (
    <section className="w-full">
      <div className="mb-6">
        <Link
          to="/forgot-password"
          className="inline-flex items-center gap-2 text-xs font-inter text-gray-500 hover:text-orange-600 transition-colors mb-4"
        >
          <FaArrowLeft /> Kembali ke Lupa Password
        </Link>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
            <FaKey className="text-base" />
          </div>
          <h2 className="font-jakarta font-bold text-2xl text-gray-900">
            Set New Password
          </h2>
        </div>
        <p className="font-inter font-normal text-sm text-gray-600">
          Masukkan password baru Anda di bawah ini untuk mengamankan akun Anda.
        </p>
      </div>

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
              errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            type="email"
            id="email"
            placeholder="mail@example.com"
            value={email}
            disabled={!!initialEmail} 
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
          />
          {errors.email && (
            <span className="text-red-600 text-xs font-inter font-medium mt-0.5">
              {errors.email}
            </span>
          )}
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="newPassword"
            className="font-inter font-medium text-gray-700 text-sm"
          >
            New Password
          </label>
          <div className="relative flex items-center">
            <input
              className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-colors ${
                errors.newPassword
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              placeholder="Minimal 8 karakter"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errors.newPassword)
                  setErrors((prev) => ({ ...prev, newPassword: "" }));
              }}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
            >
              {showNewPassword ? (
                <FaEyeSlash className="text-lg" />
              ) : (
                <FaEye className="text-lg" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <span className="text-red-600 text-xs font-inter font-medium mt-0.5">
              {errors.newPassword}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="confirmPassword"
            className="font-inter font-medium text-gray-700 text-sm"
          >
            Confirm New Password
          </label>
          <div className="relative flex items-center">
            <input
              className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-colors ${
                errors.confirmPassword
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Konfirmasi password baru"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
            >
              {showConfirmPassword ? (
                <FaEyeSlash className="text-lg" />
              ) : (
                <FaEye className="text-lg" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-red-600 text-xs font-inter font-medium mt-0.5">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 transition cursor-pointer py-3 rounded-lg w-full text-white font-semibold text-sm font-inter mt-4 shadow-sm"
        >
          Reset Password
        </button>
      </form>

      <div className="text-center font-inter text-xs text-gray-500 mt-6">
        Sudah ingat password Anda?{" "}
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

export default ResetPassword;
