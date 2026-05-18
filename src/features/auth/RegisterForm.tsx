import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faFacebookF,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import type { RegisterRequestDTO } from "./authType";
import { registerUser } from "./authThunk";

function RegisterForm() {
  // States
  const [formData, setFormData] = useState<RegisterRequestDTO>({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [validationError, setValidationError] = useState<string>();

  // Redux
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  // Handle register
  const handleRegister = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate
    if (!formData.fullName.trim())
      return setValidationError("Vui lòng nhập họ và tên.");

    if (!formData.username.trim())
      return setValidationError("Vui lòng nhập tên đăng nhập.");
    if (formData.username.includes(" "))
      return setValidationError("Tên đăng nhập không được chứa khoảng trắng.");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      return setValidationError("Email không hợp lệ.");

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone))
      return setValidationError("Số điện thoại phải từ 10-11 chữ số.");

    if (formData.password.length < 6)
      return setValidationError("Mật khẩu phải có ít nhất 6 ký tự.");

    if (confirmPassword !== formData.password) {
      setValidationError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!isAgreed)
      return setValidationError("Bạn phải đồng ý với điều khoản dịch vụ.");

    setValidationError("");

    // send data
    const response = await dispatch(registerUser({ ...formData })).unwrap();

    if (response.success) {
      navigate("/login");
    }
  };

  return (
    <>
      {/* Right Side: Register Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center h-full relative">
        <div className="w-full max-w-95 flex flex-col gap-6 z-10">
          {/* Title */}
          <div>
            <h2 className="text-[#6f0001] text-3xl font-serif">
              Join the Luna Artisan
            </h2>
            <p className="text-sm opacity-70">
              Unlock artisanal rewards and collections.
            </p>
          </div>

          {/* Error alert */}
          {(validationError || error) && (
            <div className="p-3 mb-6 text-sm text-white bg-red-900/50 border border-red-500/50 rounded-lg text-center">
              {validationError || error}
            </div>
          )}

          {/* Form Register */}
          <form className="flex flex-col gap-3.5" onSubmit={handleRegister}>
            {/* Full Name & Username */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase opacity-60 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Agott"
                  className="w-full px-4 py-3 bg-[#fbf2ea] rounded-2xl text-sm outline-none"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase opacity-60 ml-1">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="agott_user"
                  className="w-full px-4 py-3 bg-[#fbf2ea] rounded-2xl text-sm outline-none"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase opacity-60 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="agott@luna.com"
                  className="w-full px-4 py-3 bg-[#fbf2ea] rounded-2xl text-sm outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase opacity-60 ml-1">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="0912345678"
                  className="w-full px-4 py-3 bg-[#fbf2ea] rounded-2xl text-sm outline-none"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase opacity-60 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#fbf2ea] rounded-2xl text-sm outline-none"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase opacity-60 ml-1">
                  Confirm
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#fbf2ea] rounded-2xl text-sm outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2.5 py-1">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-3.5 h-3.5 accent-[#6f0001] cursor-pointer"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
              <label
                htmlFor="terms"
                className="text-[11px] leading-4 opacity-80 cursor-pointer"
              >
                I agree to the{" "}
                <span className="text-[#6f0001] font-bold">
                  Terms of Service
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-2 bg-[#9a0002] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg hover:bg-[#8a0001] transition-all disabled:bg-gray-400 cursor-pointer"
            >
              {isLoading ? "Processing..." : "Create account"}
            </button>
          </form>

          {/* Link to Sign In */}
          <p className="text-center text-xs opacity-60">
            Already a member?{" "}
            <Link
              to="/login"
              className="text-[#6f0001] font-bold hover:underline cursor-pointer"
            >
              Sign In
            </Link>
          </p>

          {/* Social Logins */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#6f0001]/10"></div>
              <span className="text-[10px] uppercase opacity-30">
                Or join with
              </span>
              <div className="flex-1 h-px bg-[#6f0001]/10"></div>
            </div>
            <div className="flex justify-center gap-4">
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

export default RegisterForm;