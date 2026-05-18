import { useState } from "react";
import type { LoginRequestDTO } from "./authType";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "./authThunk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGoogle, faInstagram } from "@fortawesome/free-brands-svg-icons";


function LoginForm() {
  // States
  const [formData, setFormData] = useState<LoginRequestDTO>({
    username: "",
    password: "",
  });
  const [validationError, setValidationError] = useState<string>();

  // Redux
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  // Handle login
  const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate
    if (formData.username.trim() === "") {
      setValidationError("Vui lòng nhập tên đăng nhập.");
      return;
    }

    if (formData.username.includes(" ")) {
      setValidationError("Tên đăng nhập không được chứa khoảng trắng.");
      return;
    }

    if (formData.password.length < 6) {
      setValidationError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setValidationError("");

    // send data
    const response = await dispatch(loginUser({ ...formData })).unwrap();

    if (response.success) {
      navigate("/");
    }
  };

  return (
    <>
      {/* Right Side: Login Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center relative h-full">
        {/* Form Container */}
        <div className="w-full max-w-90 flex flex-col gap-8 z-10">
          {/* Welcome Text */}
          <div className="flex flex-col gap-1">
            <h2 className="text-[#6f0001] text-3xl font-serif">Welcome Back</h2>
            <p className="text-sm opacity-80">
              Sign in to access your curated selection.
            </p>
          </div>

          {/* Error alert */}
          {(validationError || error) && (
            <div className="p-3 mb-6 text-sm text-red-200 bg-red-900/50 border border-red-500/50 rounded-lg text-center">
              {validationError || error}
            </div>
          )}

          {/* Form login */}
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider">
                User name
              </label>
              <input
                type="text"
                placeholder="coco@xuongphepthuat.com"
                className="w-full px-5 py-3.5 bg-[#fbf2ea] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#6f0001]/10 transition-all"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider">
                  Password
                </label>
                <button className="text-[#6f0001] text-[10px] hover:underline cursor-pointer">
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-3.5 bg-[#fbf2ea] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#6f0001]/10 transition-all"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-3.5 h-3.5 accent-[#6f0001] cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs cursor-pointer">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-2 bg-[#9a0002] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg hover:bg-[#8a0001] transition-all active:scale-[0.98] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-5 h-5 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Sign in"
              )}
            </button>

            <div className="text-center text-xs pt-2 opacity-60">
              <span>New here? </span>
              <Link
                to="/register"
                className="text-[#6f0001] font-semibold hover:underline cursor-pointer"
              >
                Create an account
              </Link>
            </div>
          </form>

          {/* Social Logins */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#6f0001]/10"></div>
              <span className="text-[10px] uppercase tracking-tighter opacity-40">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-[#6f0001]/10"></div>
            </div>

            <div className="flex justify-center gap-5">
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#fbf2ea] text-[#5b403c] hover:bg-[#6f0001] hover:text-white transition-all shadow-sm cursor-pointer">
                <FontAwesomeIcon icon={faGoogle} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#fbf2ea] text-[#5b403c] hover:bg-[#6f0001] hover:text-white transition-all shadow-sm cursor-pointer">
                <FontAwesomeIcon icon={faFacebookF} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#fbf2ea] text-[#5b403c] hover:bg-[#6f0001] hover:text-white transition-all shadow-sm cursor-pointer">
                <FontAwesomeIcon icon={faInstagram} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;