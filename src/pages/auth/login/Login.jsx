import { useState } from "react";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../redux/slices/authSlices/authSlice";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);

  const [password, setPassword] = useState("");
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [generalError, setGeneralError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const location = useLocation();

  // Pattern Regex
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*/<>]).{8,}$/;

  // Fungsi validasi password
  const validatePassword = (pwd) => {
    if (pwd.trim() === "") {
      setPasswordErrorMessage("Password wajib diisi.");
      return false;
    } else if (!passwordPattern.test(pwd)) {
      setPasswordErrorMessage(
        "Password minimal 8 karakter, mengandung huruf besar, huruf kecil, dan simbol.",
      );
      return false;
    }
    setPasswordErrorMessage("");
    return true;
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailInvalid(newEmail.trim() === "" || !emailPattern.test(newEmail));
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsPasswordInvalid(!validatePassword(newPassword));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isEmailValid = email.trim() !== "" && emailPattern.test(email);
    const isPasswordValid = validatePassword(password);

    setIsEmailInvalid(!isEmailValid);
    setIsPasswordInvalid(!isPasswordValid);

    if (!isEmailValid || !isPasswordValid) {
      toast.error("Mohon lengkapi formulir dengan benar", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }

    const result = dispatch(loginUser(email, password));

    if (result && result.success) {
      toast.success("Login Berhasil!", {
        position: "top-center",
        autoClose: 1000,
      });

      setTimeout(() => {
        navigate("/explore", { replace: true });
      }, 1200);
    } else {
      const errorMsg = result?.error || "Login gagal, silakan coba lagi";
      toast.error(errorMsg, {
        position: "top-center",
        autoClose: 1500,
      });
      setGeneralError(errorMsg);
    }
  };

  return (
    <section className="w-full">
      <h2 className="font-jakarta font-bold text-2xl text-gray-900">
        Welcome back
      </h2>
      <p className="font-inter font-normal text-sm mt-1 text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-inter font-medium text-sm text-orange-600 hover:underline"
        >
          Sign Up
        </Link>
      </p>

      {generalError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-inter font-medium">
          {generalError}
        </div>
      )}

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
              isEmailInvalid ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            type="email"
            id="email"
            placeholder="mail@example.com"
            value={email}
            onChange={handleEmailChange}
          />
          {isEmailInvalid && (
            <span className="text-red-600 text-xs font-inter font-medium mt-0.5">
              {email.trim() === ""
                ? "Email harus diisi"
                : "Format email tidak valid"}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label
              htmlFor="pwd"
              className="font-inter font-medium text-gray-700 text-sm"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-orange-600 font-inter font-normal text-xs hover:underline cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative flex items-center">
            <input
              className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-colors ${
                isPasswordInvalid
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
              type={showPassword ? "text" : "password"}
              id="pwd"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
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
          {isPasswordInvalid && (
            <span className="text-red-600 text-xs font-inter font-medium mt-0.5">
              {passwordErrorMessage}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 transition cursor-pointer py-3 rounded-lg w-full text-white font-semibold text-sm font-inter mt-2 shadow-sm"
        >
          Sign In
        </button>
      </form>

      <div className="text-gray-500 text-center mt-6 font-inter font-normal text-xs">
        Just browsing?{" "}
        <Link to="/explore" className="underline hover:text-gray-800">
          Continue as guest →
        </Link>
      </div>
    </section>
  );
}

export default Login;
