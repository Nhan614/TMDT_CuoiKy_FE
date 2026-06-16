import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Award,
  Loader2,
  Save,
  CheckCircle,
  FileText,
  Upload,
  X,
  Plus,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchMyProfile, updateMyProfile, submitArtisanApplication, uploadProofImage } from "../../features/user/userThunk";
import { clearUserMessages } from "../../features/user/userSlice";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser, isLoading, applicationLoading } = useAppSelector(
    (state) => state.user
  );

  // Profile Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Change Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Artisan Application states
  const [showAppModal, setShowAppModal] = useState(false);
  const [appFullName, setAppFullName] = useState("");
  const [appSkill, setAppSkill] = useState<"AMIGURUMI" | "DAN_MOC" | "THIET_KE_HOA_TIET" | "THEU_TAY" | "GOM_SU">("AMIGURUMI");
  const [appBio, setAppBio] = useState("");
  const [appQuote, setAppQuote] = useState("");
  const [appStartedCraftingDate, setAppStartedCraftingDate] = useState("");
  const [appPortfolioUrl, setAppPortfolioUrl] = useState("");
  const [appAvatarUrl, setAppAvatarUrl] = useState("");
  const [appProofUrls, setAppProofUrls] = useState<string[]>([]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingProofs, setUploadingProofs] = useState(false);

  useEffect(() => {
    dispatch(fetchMyProfile());
    return () => {
      dispatch(clearUserMessages());
    };
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || "");
      setEmail(currentUser.email || "");
      setPhone(currentUser.phone || "");
    }
  }, [currentUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(updateMyProfile({ fullName, email, phone }));
    if (updateMyProfile.fulfilled.match(result)) {
      alert("Cập nhật thông tin thành công!");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới không trùng khớp!");
      return;
    }
    const result = await dispatch(
      updateMyProfile({
        currentPassword,
        newPassword,
      })
    );
    if (updateMyProfile.fulfilled.match(result)) {
      alert("Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
    }
  };

  // Upload Avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingAvatar(true);
      try {
        const url = await uploadProofImage(file);
        setAppAvatarUrl(url);
      } catch (err: any) {
        alert(err.message || "Tải ảnh đại diện lên thất bại!");
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  // Upload Proofs
  const handleProofChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newUrls = [...appProofUrls];

      if (newUrls.length + files.length > 5) {
        alert("Chỉ được tải lên tối đa 5 ảnh minh chứng!");
        return;
      }

      setUploadingProofs(true);
      try {
        for (const file of files) {
          const url = await uploadProofImage(file);
          newUrls.push(url);
        }
        setAppProofUrls(newUrls);
      } catch (err: any) {
        alert(err.message || "Tải ảnh minh chứng lên thất bại!");
      } finally {
        setUploadingProofs(false);
      }
    }
  };

  const handleRemoveProof = (url: string) => {
    setAppProofUrls(appProofUrls.filter((u) => u !== url));
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appAvatarUrl) {
      alert("Vui lòng tải lên ảnh đại diện nghệ nhân!");
      return;
    }
    if (appProofUrls.length === 0) {
      alert("Vui lòng tải lên ít nhất 1 ảnh minh chứng kỹ năng!");
      return;
    }

    const payload = {
      fullName: appFullName,
      skill: appSkill,
      bio: appBio,
      quote: appQuote,
      startedCraftingDate: appStartedCraftingDate,
      portfolioUrl: appPortfolioUrl,
      avatarUrl: appAvatarUrl,
      proofImageUrls: appProofUrls,
    };

    const result = await dispatch(submitArtisanApplication(payload));
    if (submitArtisanApplication.fulfilled.match(result)) {
      alert("Nộp đơn ứng tuyển thành công! Vui lòng đợi Admin duyệt hồ sơ của bạn.");
      setShowAppModal(false);
      // Reset form
      setAppFullName("");
      setAppBio("");
      setAppQuote("");
      setAppStartedCraftingDate("");
      setAppPortfolioUrl("");
      setAppAvatarUrl("");
      setAppProofUrls([]);
      // Navigate to application status page
      navigate("/my-application");
    }
  };

  if (isLoading && !currentUser) {
    return (
      <div className="flex justify-center items-center py-40 flex-col gap-3">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
        <p className="text-sm text-secondary">Đang tải thông tin tài khoản...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-stone-50/55">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Card: Basic User Profile */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold mx-auto border-4 border-beige shadow-sm">
              {currentUser?.fullName ? currentUser.fullName.charAt(0).toUpperCase() : currentUser?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1b1c1c]">{currentUser?.fullName || "Chưa thiết lập tên"}</h2>
              <p className="text-sm text-stone-400 mt-0.5">@{currentUser?.username}</p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-beige text-primary uppercase">
              <User size={12} />
              {currentUser?.role === "ARTISAN" ? "Nghệ nhân" : currentUser?.role === "ADMIN" ? "Quản trị viên" : "Thành viên"}
            </div>

            {/* Navigation links */}
            <div className="border-t border-stone-100 pt-6 space-y-2 text-left">
              <Link
                to="/orders"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 text-stone-600 text-sm font-semibold transition-all"
              >
                <FileText size={16} className="text-stone-400" />
                Đơn hàng của tôi
              </Link>
              <Link
                to="/custom-orders/my"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 text-stone-600 text-sm font-semibold transition-all"
              >
                <Award size={16} className="text-stone-400" />
                Đơn gia công của tôi
              </Link>
              {currentUser?.role === "ARTISAN" && (
                <Link
                  to="/custom-orders/artisan"
                  className="flex items-center gap-3 p-3 rounded-xl bg-beige/40 text-primary text-sm font-bold transition-all"
                >
                  <Award size={16} className="text-primary" />
                  Yêu cầu gia công nhận được
                </Link>
              )}
              {currentUser?.role === "USER" && (
                <Link
                  to="/my-application"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 text-stone-600 text-sm font-semibold transition-all"
                >
                  <FileText size={16} className="text-stone-400" />
                  Đơn đăng ký nghệ nhân
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Edit Profile & Password */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-[#1b1c1c] flex items-center gap-2 border-b border-stone-100 pb-4">
              Thông tin cá nhân
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase">Họ và tên</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nhập họ tên đầy đủ"
                      className="w-full bg-stone-50 border border-stone-100 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl pl-10 pr-4 py-3 outline-none transition-all text-sm text-[#1b1c1c]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="w-full bg-stone-50 border border-stone-100 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl pl-10 pr-4 py-3 outline-none transition-all text-sm text-[#1b1c1c]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500 uppercase">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                    className="w-full bg-stone-50 border border-stone-100 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl pl-10 pr-4 py-3 outline-none transition-all text-sm text-[#1b1c1c]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all text-sm shadow-md shadow-primary/20 cursor-pointer"
                >
                  {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />}
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>

          {/* Changing Password Card */}
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="w-full flex items-center justify-between font-bold text-[#1b1c1c] text-lg cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Lock size={18} className="text-stone-400" />
                Đổi mật khẩu
              </span>
              <span className="text-xs text-primary font-bold">
                {isChangingPassword ? "Thu gọn" : "Mở rộng"}
              </span>
            </button>

            {isChangingPassword && (
              <form onSubmit={handleChangePassword} className="space-y-4 pt-4 border-t border-stone-100">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-100 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-sm text-[#1b1c1c]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-500 uppercase">Mật khẩu mới</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-100 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-sm text-[#1b1c1c]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-500 uppercase">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-100 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-sm text-[#1b1c1c]"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all text-sm shadow-md shadow-primary/20 cursor-pointer"
                  >
                    Xác nhận đổi mật khẩu
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Artisan Section */}
          {currentUser?.role === "USER" && (
            <div className="bg-gradient-to-br from-beige/40 to-white rounded-3xl border border-primary/10 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-[#1b1c1c] flex items-center justify-center sm:justify-start gap-2">
                  <Award className="text-primary" />
                  Bạn muốn bán sản phẩm thủ công?
                </h3>
                <p className="text-sm text-stone-500 max-w-md">
                  Hãy đăng ký trở thành Nghệ nhân của Atelier để mở rộng kinh doanh, nhận đơn hàng gia công riêng và giới thiệu tác phẩm nghệ thuật đến hàng ngàn khách hàng.
                </p>
              </div>
              <button
                onClick={() => {
                  setAppFullName(currentUser.fullName);
                  setShowAppModal(true);
                }}
                className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:brightness-105 active:scale-95 transition-all text-sm whitespace-nowrap shadow-lg shadow-primary/25 cursor-pointer"
              >
                Đăng ký làm Nghệ nhân
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Artisan Application Modal */}
      {showAppModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between shrink-0 bg-stone-50/60">
              <h2 className="text-xl font-bold text-[#1b1c1c] flex items-center gap-2">
                <Award className="text-primary" />
                Đăng ký làm Nghệ nhân
              </h2>
              <button
                onClick={() => setShowAppModal(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitApplication} className="flex-grow overflow-y-auto p-6 space-y-6">

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-stone-700">Tên hiển thị nghệ nhân <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={appFullName}
                  onChange={(e) => setAppFullName(e.target.value)}
                  placeholder="VD: Nguyễn Văn Thợ"
                  className="w-full bg-stone-50 border border-stone-100 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-sm text-[#1b1c1c]"
                />
              </div>

              {/* Skill & StartedCraftingDate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-700">Kỹ năng chính <span className="text-red-500">*</span></label>
                  <select
                    value={appSkill}
                    onChange={(e) => setAppSkill(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-100 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-sm text-[#1b1c1c]"
                  >
                    <option value="AMIGURUMI">Amigurumi (Thú bông)</option>
                    <option value="DAN_MOC">Đan móc len</option>
                    <option value="THIET_KE_HOA_TIET">Thiết kế họa tiết</option>
                    <option value="THEU_TAY">Thêu tay thủ công</option>
                    <option value="GOM_SU">Gốm sứ nghệ thuật</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-700">Ngày làm nghề <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    required
                    max={new Date().toISOString().split("T")[0]}
                    value={appStartedCraftingDate}
                    onChange={(e) => setAppStartedCraftingDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-100 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-sm text-[#1b1c1c]"
                  />
                </div>
              </div>

              {/* Bio & Quote */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-700">Tiểu sử nghệ nhân (Bio)</label>
                  <textarea
                    rows={3}
                    value={appBio}
                    onChange={(e) => setAppBio(e.target.value)}
                    placeholder="Giới thiệu bản thân và phong cách làm đồ handmade của bạn..."
                    className="w-full bg-stone-50 border border-stone-100 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-sm text-[#1b1c1c] resize-y"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-700">Châm ngôn sáng tạo (Quote)</label>
                  <input
                    type="text"
                    value={appQuote}
                    onChange={(e) => setAppQuote(e.target.value)}
                    placeholder="VD: Tỉ mỉ thổi hồn vào từng sản phẩm"
                    className="w-full bg-stone-50 border border-stone-100 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-sm text-[#1b1c1c]"
                  />
                </div>
              </div>

              {/* Portfolio URL */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-stone-700">Link Portfolio (Facebook, Instagram, Web cá nhân...)</label>
                <input
                  type="url"
                  value={appPortfolioUrl}
                  onChange={(e) => setAppPortfolioUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-stone-50 border border-stone-100 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-sm text-[#1b1c1c]"
                />
              </div>

              {/* Avatar Upload */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700">Ảnh đại diện nghệ nhân <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-4">
                  {appAvatarUrl ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border border-stone-200 shadow-sm">
                      <img src={appAvatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setAppAvatarUrl("")}
                        className="absolute inset-0 bg-black/45 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-stone-300 flex items-center justify-center text-stone-400 bg-stone-50">
                      {uploadingAvatar ? (
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      ) : (
                        <Plus size={20} />
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleAvatarChange}
                        disabled={uploadingAvatar}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                  <div className="text-xs text-stone-400">
                    <p className="font-semibold text-stone-600">Chọn ảnh đại diện nghệ nhân</p>
                    <p>Hỗ trợ: JPG, PNG, WEBP. Tối đa 5MB</p>
                  </div>
                </div>
              </div>

              {/* Proofs Uploader */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-stone-700">
                  Ảnh minh chứng sản phẩm <span className="text-red-500">*</span>
                </label>
                <div className="text-xs text-stone-400 mb-2">
                  Tải lên từ 1 đến 5 ảnh chụp sản phẩm bạn tự làm để chứng minh tay nghề.
                </div>

                {appProofUrls.length < 5 && (
                  <div className="relative border-2 border-dashed border-stone-200 rounded-xl p-6 text-center hover:bg-stone-50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleProofChange}
                      disabled={uploadingProofs}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-1.5">
                      {uploadingProofs ? (
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      ) : (
                        <Upload className="w-8 h-8 text-stone-400" />
                      )}
                      <p className="text-sm font-semibold text-stone-700">Tải ảnh minh chứng lên</p>
                    </div>
                  </div>
                )}

                {/* Previews */}
                {appProofUrls.length > 0 && (
                  <div className="grid grid-cols-5 gap-3 mt-3">
                    {appProofUrls.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-stone-200">
                        <img src={url} alt={`Proof ${i}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveProof(url)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-white/90 hover:bg-red-500 hover:text-white text-stone-600 shadow-sm transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Section */}
              <div className="pt-4 border-t border-stone-100 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAppModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 transition-colors text-sm cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={applicationLoading || uploadingAvatar || uploadingProofs}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-all text-sm shadow-md shadow-primary/25 cursor-pointer flex items-center gap-1.5"
                >
                  {applicationLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang nộp...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Nộp đơn ứng tuyển
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
