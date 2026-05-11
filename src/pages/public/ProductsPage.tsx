import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../../features/products/ProductCard";
import Sidebar from "../../features/products/Sidebar";

const PRODUCTS = [
  {
    id: 1,
    title: "Áo Len Crochet Họa Tiết Hoa",
    price: "1.250.000",
    rating: 4.8,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDy3vtNPhfYDJ5UdLHXy6R7fX-K1Z15a63PoN4gn7RzPQUFmDBBtB0deZ3C7Ml3igDRbA0gYIveat5P76MA2J1VihoTnGiESXBWybTZWHn_f-IJWpudgQRa17ZwuD-dIog6-DsqG34M7HSW-l9We-xwzWBvglcSOFHtn8VpwBU3jfjeSuRhAkj164tT47v93KwwPqJ60n6ub6_8S46068kYEodOazLYEj95d_CLwKOtSjyBb1TYSinHwLiKwRvFJ_vsbjCzppht_Rk",
  },
  {
    id: 2,
    title: "Túi Xách Len Thủ Công",
    price: "850.000",
    rating: 5.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDW70S7XyijZr3gchgeO9ceCcTyCBe9CtqZFrABbOytfUg9cotFGkDNlXfs80-wGceC1PLq2OE_6ssJT7DIqfouENc9GuRI6SCmhdUPHB4xsKRfVh6BcOwDFSB9ed5ccm_MDLSzLxoaSSS9Jm-kxMwkrx8d7HED-NtpVfrkMtPIiF76VILoE8JVXJaUIi2uG_U5ybYjXIqM5TsfErg1bW31EWhIH3IFGKsMlx48LL-L6RpIO3V3gKC4Tl-e8OgaqmKQH2fklEw1ehk",
  },
  {
    id: 3,
    title: "Thú Bông Amigurumi",
    price: "420.000",
    rating: 4.9,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBW8TXZ0bbrajDur25bBdQyazvpi0I9vAHLNVIogJyAOTyMbkgVT7pwXTmrYLode-tpG7u6zvSBq0sfrZVsuYRlIozoIVuZNT7lOToORvcMeRwtrsU_sLvcpZ400U9Rgr3xfycgkRdoyTWm1-Z4Seq3ON0pqApeC0LWzeluzmeRLb01gtMOguLs-djoAIRWZOxHa5NmZTA7dDM4tWQ_fqzGI9Pb-7n-DF3h35SuaPnRGWd9hNrSPCMutoBA38kft3ZapXT1hUkTPw",
  },
  {
    id: 4,
    title: "Khăn Trải Bàn Crochet",
    price: "560.000",
    rating: 4.7,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCzIzUpdv2FzJS4VsS9U57eNkPFRqXCnazpKGU1JDAuWT6G1RABuFGoLDxemsuYZwAIwF1BZ0EM5RTi318uTO3Kob5WNGMJYjXYvgGXcV_qky2V0V7xoWYjyKkiTnrl2cgWQ9U18HzmKZOFxl7Wa-S8tFpZGtB2C3qwZhVDcXuE-X2r1J8AoJTKeDnmmzF_WJULRswItJvQxrduHuOJVbH91mw7jo_y3yadXyZ63CRabt8bUrJEJ_6sdW6ClnTYMg0ppeqV63lGJgE",
  },
  {
    id: 5,
    title: "Khăn Choàng Merino",
    price: "1.500.000",
    rating: 5.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUxlF127mXwASbyrD9jHxx-wXzYZ_nG_wrU2YKY04KlbIS7oLXDkRcpd_nAY58C7oO8tKd7oChPuUtSuYJLu75YnrX8gjnS-WAbwBmvq1HL4sVexEGtiihdQzx4vMgYMwbtBmQ_vq4yM7RTEOAxH6ueai-Vi7KmQ_lvKBJxS9cYChSoX0jPyTXyXYMf6hXEjaJ5zW3z-aEP_hZMKjolvYPyEXbeE0eoPifBfNzTIvlpN0qFG7nOzgzdcG3hscDEgsI5hj4rk8HCDc",
  },
  {
    id: 6,
    title: "Mũ Beanie Len Velvet",
    price: "290.000",
    rating: 4.6,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA1V9L5jOE0zPZXoy6dZsC3O53fE-W0WCoKyT-5bn0zYeqex9s0IpJSmQNsmUoBo8t1ru7M3dLm4dBMVaTmGmzu3_wLs8xXiQYQ7HC-CxVlNDUxIj0LmCjhX4VaaqdvK7MhKLkYVqIL3D2uljSb0tp2k8lBJL4UX-EdxgVyzwrL59un5Ps3CcNSHYrpARrKbfcXG__5QPtc_hztHAw4b3JiLKk5XPAhAhzoYhfpORf7OXInkxpVSiVswwZoWSGPpyGkplthjkCauiQ",
  },
];

function ProductsPage() {
  return (
    <main className="grow max-w-300 mx-auto mt-15 px-4 md:px-6 py-8 md:py-16 w-full">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <Sidebar />

        {/* Product Feed */}
        <section className="grow">
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-8 pb-4 border-b border-neutral-border gap-4">
            <p className="text-secondary font-medium">
              Hiển thị 12 trên 63 sản phẩm
            </p>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                Sắp xếp theo:
              </span>
              <select className="bg-transparent border-none text-on-surface font-bold focus:ring-0 cursor-pointer outline-none text-sm">
                <option>Mới nhất</option>
                <option>Giá: Thấp đến Cao</option>
                <option>Giá: Cao đến Thấp</option>
                <option>Phổ biến nhất</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-16 flex justify-center items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-border hover:border-primary hover:text-primary transition-all">
              <ChevronLeft size={20} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-border hover:border-primary hover:text-primary transition-all">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-border hover:border-primary hover:text-primary transition-all">
              3
            </button>
            <span className="px-2 text-secondary">...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-border hover:border-primary hover:text-primary transition-all">
              8
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-border hover:border-primary hover:text-primary transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProductsPage;
