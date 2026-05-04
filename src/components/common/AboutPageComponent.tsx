import { HandMetal, Palette, Sprout, History, Leaf } from "lucide-react";
import { motion } from "motion/react";

export const Hero = () => {
  return (
    <section className="py-20 px-4 md:px-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-8"
        >
          <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tighter">
            Câu chuyện của <br />
            <span className="text-primary">Len & Sợi</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
            Khởi nguồn từ niềm đam mê bất tận với những sợi len mềm mại, chúng
            tôi mang đến những sản phẩm thủ công tinh xảo, gói trọn tâm huyết
            trong từng mũi kim. Len & Sợi không chỉ bán sản phẩm, chúng tôi trao
            gửi sự ấm áp và tính nghệ thuật trong từng chi tiết.
          </p>
          <div>
            <button className="bg-[#FAA83E] text-white font-bold py-4 px-10 rounded-xl shadow-[0_10px_30px_rgba(236,91,19,0.3)] hover:translate-y-[-2px] transition-all text-lg">
              Khám phá ngay
            </button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
            <img
              src="https://congcutot.vn/uploads/store/page/article/2023/03/anh-bia-1.jpg"
              alt="Handmade wool products"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl hidden lg:block">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="size-10 rounded-full border-2 border-white bg-gray-200"
                  />
                ))}
              </div>
              <p className="text-sm font-bold text-gray-800">
                1000+ Khách hàng hài lòng
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export const Values = () => {
  const items = [
    {
      title: "Sợi Tự Nhiên",
      desc: "Sử dụng nguồn nguyên liệu tự nhiên cao cấp, an toàn cho làn da và thân thiện với môi trường.",
      icon: <Sprout className="size-6" />,
      img: "https://i.pinimg.com/1200x/ce/3e/c8/ce3ec88bd16ae5b5fa8c8a21787fc603.jpg",
    },
    {
      title: "Làm Bằng Tay 100%",
      desc: "Mỗi sản phẩm là kết quả của hàng giờ lao động tỉ mỉ, đảm bảo chất lượng và độ tinh xảo cao nhất.",
      icon: <HandMetal className="size-6" />,
      img: "https://i.pinimg.com/1200x/52/fb/0d/52fb0db6890c12ed36e88b8a39bc30da.jpg",
    },
    {
      title: "Thiết Kế Riêng",
      desc: "Chúng tôi tạo ra những thiết kế độc bản, mang đậm dấu ấn cá nhân của riêng bạn.",
      icon: <Palette className="size-6" />,
      img: "https://gryandsif.com/cdn/shop/files/22_2f845298-242b-49c2-83cd-4b2c5e099cf3.jpg?v=1735948418&width=1500",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Giá trị của chúng tôi</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-full aspect-square rounded-[2rem] overflow-hidden mb-8 shadow-lg">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="flex items-center gap-3 text-primary mb-4">
                {item.icon}
                <h3 className="text-2xl font-bold">{item.title}</h3>
              </div>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base px-4">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Craftsmanship = () => {
  return (
    <section className="py-24 bg-background-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div className="grid grid-cols-2 gap-4 h-[600px]">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden mt-12 shadow-xl shadow-black/5"
          >
            <img
              src="https://i.pinimg.com/736x/61/e9/91/61e991bc61d9078732389cf5140494a7.jpg"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden mb-12 shadow-xl shadow-black/5"
          >
            <img
              src="https://i.pinimg.com/736x/11/cb/72/11cb72e238f543f8f742bfbbb412ddee.jpg"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-8"
        >
          <h2 className="text-4xl font-bold leading-tight">
            Nghệ Thuật Thủ Công <br /> & Sự Bền Vững
          </h2>
          <div className="w-16 h-1.5 bg-primary rounded-full" />
          <p className="text-gray-600 leading-relaxed text-lg">
            Tại Len & Sợi, quy trình đan và móc thủ công không chỉ là công việc,
            mà là một nghi thức của sự kiên nhẫn. Chúng tôi lựa chọn phương pháp
            thủ công truyền thống để đảm bảo mỗi mũi kim đều chặt chẽ và chính
            xác.
          </p>
          <div className="space-y-6">
            <div className="flex gap-5 items-start">
              <div className="bg-white p-3 rounded-2xl shadow-sm text-primary shrink-0">
                <History className="size-6" />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-1">
                  Độ Bền Vượt Thời Gian
                </h4>
                <p className="text-gray-500">
                  Sản phẩm thủ công có cấu trúc bền bỉ hơn, không bị giãn hay
                  hỏng hóc nhanh như hàng công nghiệp.
                </p>
              </div>
            </div>
            <div className="flex gap-5 items-start">
              <div className="bg-white p-3 rounded-2xl shadow-sm text-primary shrink-0">
                <Leaf className="size-6" />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-1">
                  Thân Thiện Môi Trường
                </h4>
                <p className="text-gray-500">
                  Quy trình sản xuất không phát thải, ưu tiên các loại sợi có
                  nguồn gốc tự nhiên, dễ dàng phân hủy sinh học.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export const CTA = () => {
  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto bg-header-bg rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center flex flex-col items-center gap-10 shadow-2xl"
      >
        {/* Thẻ IMG làm ảnh nền */}
        <img
          src="https://i.pinimg.com/736x/ea/05/db/ea05db48e2a35ac81f69913eaa87566b.jpg"
          alt="CTA Background"
          className="absolute inset-0 w-full h-full object-cover z-0 mix-blend-overlay"
          /* Có thể điều chỉnh opacity hoặc thêm mix-blend-overlay để chữ dễ đọc hơn */
        />

        {/* Các hiệu ứng ánh sáng trang trí */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-48 -mt-48 blur-3xl z-0" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-2xl z-0" />

        {/* Nội dung (Đã thêm relative để z-10 hoạt động đè lên ảnh nền) */}
        <h2 className="text-4xl md:text-5xl font-black text-white max-w-3xl leading-tight relative z-10">
          Bạn đã sẵn sàng để sở hữu một tác phẩm độc bản?
        </h2>

        <p className="text-[#C2C2C2] text-xl max-w-2xl relative z-10">
          Khám phá các bộ sưu tập mới nhất của chúng tôi hoặc liên hệ để cùng
          tạo nên một thiết kế dành riêng cho bạn.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 relative z-10">
          <button className="bg-[#EBEBEB] text-header-bg font-bold py-5 px-12 rounded-2xl hover:bg-white transition-all text-xl shadow-lg">
            Xem bộ sưu tập
          </button>
          <button className="bg-transparent border-2 border-white/20 text-white font-bold py-5 px-12 rounded-2xl hover:bg-white/10 hover:border-white transition-all text-xl">
            Đặt làm theo yêu cầu
          </button>
        </div>
      </motion.div>
    </section>
  );
};
