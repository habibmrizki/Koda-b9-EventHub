function ResetPassword() {
  return (
    <main className=" h-screen flex justify-center items-center">
      <div className="w-full max-w-lg bg-white p-8 md:p-12 rounded-3xl shadow-xl mx-6">
        <div className="flex flex-col gap-6">
          <header className="flex items-center gap-3 mb-2 border-b pb-4">
            <img
              src="/belalai-wallet.png"
              alt="E-wallet icon"
              className="max-w-8"
            />
            <p className="text-blue-600 font-bold text-2xl">EventHub</p>
          </header>
          <p className="text-2xl lg:text-4xl">Set New Password</p>
          <p className="text-gray-500">
            Enter your new password and confirm it to continue.
          </p>

          <form className="space-y-6">
            {/* New Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="newpwd" className="font-medium text-gray-700">
                New Password
              </label>
              <div className="flex items-center border border-gray-300 bg-gray-50 rounded-lg px-3 h-12 gap-3 focus-within:border-blue-500 transition duration-200">
                <img src="/Logo-Password.svg" alt="" className="w-4 h-3.5" />
                <input
                  placeholder="Enter new password"
                  className="w-full outline-none bg-transparent"
                />
                <img
                  src="/sasdasd"
                  alt="toggle"
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <span className="text-red-500 text-sm">sadasdsadsa</span>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmpwd" className="font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="flex items-center border border-gray-300 bg-gray-50 rounded-lg px-3 h-12 gap-3 focus-within:border-blue-500 transition duration-200">
                <img src="/Logo-Password.svg" alt="" className="w-4 h-3.5" />
                <input
                  type="password"
                  id="confirmpwd"
                  placeholder="Confirm new password"
                  className="w-full outline-none bg-transparent"
                />
                <img
                  src="/Logo-Eye.svg"
                  alt="toggle"
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <span className="text-red-500 text-sm">asdasdasdsad</span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white h-12 rounded-lg font-semibold cursor-pointer mt-8 hover:bg-blue-700 transition duration-300"
            >
              Processing...
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ResetPassword;
