import { SiFacebook, SiInstagram, SiX } from "@icons-pack/react-simple-icons";
import { ChevronRight } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-white font-serif font-bold">
              L
            </div>
            <span className="text-xl font-serif font-bold tracking-tight text-stone-800 uppercase">
              Len & Sợi
            </span>
          </div>
          <p className="text-stone-500 text-sm leading-relaxed">
            Cửa hàng đồ handmade len sợi mong muốn mang đến sự ấm áp và phong
            cách cá tính cho bạn.
          </p>
          <div className="flex gap-4">
            <SiInstagram
              size={20}
              className="text-stone-400 hover:text-stone-800 cursor-pointer transition-colors"
            />
            <SiFacebook
              size={20}
              className="text-stone-400 hover:text-stone-800 cursor-pointer transition-colors"
            />
            <SiX
              size={20}
              className="text-stone-400 hover:text-stone-800 cursor-pointer transition-colors"
            />
          </div>
        </div>

        <div>
          <h4 className="font-bold text-stone-800 mb-6 uppercase text-sm tracking-widest">
            Cửa Hàng
          </h4>
          <ul className="space-y-4 text-stone-500 text-sm">
            <li>
              <a href="#" className="hover:text-stone-800 transition-colors">
                Tất cả sản phẩm
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-stone-800 transition-colors">
                Hàng mới về
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-stone-800 transition-colors">
                Khuyến mãi
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-stone-800 mb-6 uppercase text-sm tracking-widest">
            Dịch Vụ Khách Hàng
          </h4>
          <ul className="space-y-4 text-stone-500 text-sm">
            <li>
              <a href="#" className="hover:text-stone-800 transition-colors">
                Liên hệ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-stone-800 transition-colors">
                Vận chuyển & Trả hàng
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-stone-800 transition-colors">
                Câu hỏi thường gặp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-stone-800 mb-6 uppercase text-sm tracking-widest">
            Đăng Ký Nhận Tin
          </h4>
          <p className="text-stone-500 text-sm mb-4 leading-relaxed italic">
            Nhận thông tin về sản phẩm mới và các ưu đãi đặc biệt.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-stone-400 transition-colors"
              id="footer_email"
            />
            <button
              className="bg-stone-800 text-white p-2 rounded-lg hover:bg-stone-700 transition-colors"
              id="footer_subscribe"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-stone-400 text-[10px] uppercase tracking-widest">
          © 2024 Len & Sợi. Crafted with care.
        </p>
        <div className="flex gap-6 text-stone-400 text-[10px] uppercase tracking-widest">
          <a href="#" className="hover:text-stone-600">
            Điều khoản
          </a>
          <a href="#" className="hover:text-stone-600">
            Bảo mật
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
