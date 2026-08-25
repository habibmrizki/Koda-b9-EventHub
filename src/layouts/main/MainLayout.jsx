import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import AuthModal from "../../components/auth/AuthModal";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-200">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <AuthModal />
    </div>
  );
};

export default MainLayout;
