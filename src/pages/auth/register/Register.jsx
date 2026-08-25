import { useState } from "react";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../redux/slices/authSlices/registerSlice";
import { toast } from "react-toastify";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
  const regexKecil = /[a-z]/;
  const regexBesar = /[A-Z]/;
  const spesialChar = /[!@#$%^&*/><]/;

  const validateForm = () => {
    const tempErrors = {};

    // Validasi Full Name
    if (!fullName.trim()) {
      tempErrors.fullName = "Nama lengkap wajib diisi";
    } else if (fullName.trim().length < 3) {
      tempErrors.fullName = "Nama lengkap minimal 3 karakter";
    }

    // Validasi Email
    if (!email.trim()) {
      tempErrors.email = "Email tidak boleh kosong";
    } else if (!emailRegex.test(email)) {
      tempErrors.email = "Format Email salah";
    }

    // Validasi Password
    if (!password.trim()) {
      tempErrors.password = "Password tidak boleh kosong";
    } else if (password.length < 8) {
      tempErrors.password = "Minimal harus 8 karakter";
    } else if (!regexKecil.test(password)) {
      tempErrors.password = "Minimal harus ada huruf kecil";
    } else if (!regexBesar.test(password)) {
      tempErrors.password = "Harus ada huruf Besar";
    } else if (!spesialChar.test(password)) {
      tempErrors.password = "Harus ada karakter spesial !@#$%^&*/<>";
    }

    // Validasi Confirm Password
    if (!confirmPassword) {
      tempErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (confirmPassword !== password) {
      tempErrors.confirmPassword =
        "Password dan konfirmasi password harus sama";
    }

    // Validasi Terms & Conditions
    if (!termsChecked) {
      tempErrors.terms = "Anda harus menyetujui syarat dan ketentuan";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = dispatch(registerUser(fullName, email, password));

    if (result.success) {
      toast.success("Register Berhasil!", {
        position: "top-center",
        autoClose: 1000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      toast.error(result.error || "Register gagal", {
        position: "top-center",
        autoClose: 1000,
      });
      setErrors({ email: result.error });
    }
  };

  return (
    <section className="w-full">
      <h2 className="font-jakarta font-bold text-2xl text-gray-900">
        Create your account
      </h2>
      <p className="font-inter font-normal text-sm mt-1 text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-inter font-medium text-sm text-orange-600 hover:underline"
        >
          Sign In
        </Link>
      </p>

      <div className="flex gap-3 pt-7">
        <button
          type="button"
          className="grow flex gap-2 justify-center items-center py-2.5 border border-gray-300 rounded-lg font-inter font-medium text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
        >
          <FaGoogle className="text-base" />
          <span>Google</span>
        </button>
        <button
          type="button"
          className="grow flex gap-2 justify-center items-center py-2.5 border border-gray-300 rounded-lg font-inter font-medium text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
        >
          <FaGithub className="text-base" />
          <span>GitHub</span>
        </button>
      </div>

      <div className="flex items-center my-6">
        <div className="grow border-t border-gray-200"></div>
        <span className="px-3 text-gray-400 text-xs font-inter">
          or continue with email
        </span>
        <div className="grow border-t border-gray-200"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Input */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="fullName"
            className="font-inter font-medium text-gray-700 text-sm"
          >
            Full Name
          </label>
          <input
            className={`px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-colors ${
              errors.fullName ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            type="text"
            id="fullName"
            placeholder="Tatang Sutarman"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName)
                setErrors((prev) => ({ ...prev, fullName: "" }));
            }}
          />
          {errors.fullName && (
            <span className="text-red-600 text-xs font-inter font-medium mt-0.5">
              {errors.fullName}
            </span>
          )}
        </div>

        {/* Email Input */}
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

        {/* Password Input  */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="pwd"
            className="font-inter font-medium text-gray-700 text-sm"
          >
            Password
          </label>
          <div className="relative flex items-center">
            <input
              className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-colors ${
                errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              type={showPassword ? "text" : "password"}
              id="pwd"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: "" }));
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
            >
              {showPassword ? (
                <FaEyeSlash className="text-lg" />
              ) : (
                <FaEye className="text-lg" />
              )}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-600 text-xs font-inter font-medium mt-0.5">
              {errors.password}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="confirm"
            className="font-inter font-medium text-gray-700 text-sm"
          >
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <input
              className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-colors ${
                errors.confirmPassword
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
              type={showConfirmPassword ? "text" : "password"}
              id="confirm"
              placeholder="Re-enter your password"
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

        {/* Terms Checkbox */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 accent-orange-600 cursor-pointer rounded"
            checked={termsChecked}
            onChange={(e) => {
              setTermsChecked(e.target.checked);
              if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }));
            }}
          />
          <div className="flex flex-col">
            <label
              htmlFor="terms"
              className="font-inter font-normal text-xs text-gray-600 leading-relaxed cursor-pointer"
            >
              I agree to the{" "}
              <span className="text-orange-600 font-medium hover:underline">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-orange-600 font-medium hover:underline">
                Privacy Policy
              </span>
            </label>
            {errors.terms && (
              <span className="text-red-600 text-xs font-inter font-medium mt-0.5">
                {errors.terms}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 transition cursor-pointer p-3 rounded-lg w-full text-white font-semibold text-sm font-inter mt-2 shadow-sm"
        >
          Create Account
        </button>
      </form>
    </section>
  );
}

export default Register;
