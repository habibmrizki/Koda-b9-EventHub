import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { HiOutlineTicket } from "react-icons/hi";
import { closeAuthModal } from "../../redux/slices/authSlices/authSlice";

export default function AuthModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthModalOpen, authModalRedirectPath } = useSelector(
    (state) => state.auth,
  );

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    dispatch(closeAuthModal());
  };

  const handleSignIn = () => {
    dispatch(closeAuthModal());
    navigate("/login", { state: { from: authModalRedirectPath } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-2xl max-w-85 w-full mx-4 shadow-xl border border-gray-100 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-jakarta font-bold text-sm text-gray-900">
            Sign in to continue
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition cursor-pointer"
            aria-label="Close"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-[#FFF2ED] rounded-2xl flex items-center justify-center mb-5">
            <div className="transform -rotate-12 bg-[#FFECE5] p-2.5 rounded-xl border border-[#FFD9CC] flex items-center justify-center">
              <HiOutlineTicket className="w-7 h-7 text-[#FF5722]" />
            </div>
          </div>

          <p className="font-inter text-gray-500 font-normal text-xs leading-relaxed text-center">
            Create a free account to register for events, save favourites, join
            communities, and get personalised recommendations.
          </p>
        </div>

        <div className="px-5 pb-5 pt-1 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-inter font-semibold text-xs transition cursor-pointer"
          >
            Keep browsing
          </button>
          <button
            type="button"
            onClick={handleSignIn}
            className="px-4 py-2 bg-[#FF5722] hover:bg-orange-700 text-white rounded-xl font-inter font-semibold text-xs shadow-xs transition cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
