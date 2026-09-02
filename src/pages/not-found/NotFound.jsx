import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Compass, AlertCircle } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-black text-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full text-xs font-semibold font-inter">
          <AlertCircle className="w-4 h-4" />
          <span>Error 404</span>
        </div>

        
        <h1 className="font-jakarta font-black text-7xl md:text-9xl text-transparent bg-clip-text bg-linear-to-b from-white via-gray-200 to-gray-600 tracking-tight select-none">
          404
        </h1>


        <div className="space-y-2">
          <h2 className="font-jakarta font-bold text-2xl md:text-3xl text-white">
            Page Not Found
          </h2>
          <p className="font-inter text-gray-400 text-sm md:text-base leading-relaxed max-w-md mx-auto">
            Halaman yang Anda cari tidak ditemukan, telah dihapus, atau alamat URL yang dimasukkan salah.
          </p>
        </div>

   
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white font-inter text-sm font-semibold rounded-xl border border-gray-700 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <Link
            to="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-inter text-sm font-semibold rounded-xl shadow-lg shadow-orange-600/20 transition cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Ke Halaman Utama</span>
          </Link>

          <Link
            to="/events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white font-inter text-sm font-semibold rounded-xl border border-gray-800 transition cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Jelajahi Event</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
