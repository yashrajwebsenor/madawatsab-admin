import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Right Side - Premium Illustration */}
      <div className="hidden flex-1 items-center justify-center lg:flex bg-[#05050f] m-4 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center p-12">
          <div className="max-w-[450px]">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
              Empowering Connectivity
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed font-medium">
              Manage your community platform with ease and elegance. Our
              powerful admin portal gives you total control.
            </p>
          </div>
        </div>
      </div>

      {/* Left Side - Login Form */}
      <div className="relative flex flex-1 sm:flex-[0.7] items-center justify-center p-6 sm:p-12 lg:flex-[0.8]">
        <div className="w-full max-w-[400px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
