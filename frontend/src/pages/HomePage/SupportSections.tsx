import React from "react";

const supportSections = [
  {
    icon: (
      // Headphones (Customer care)
      <svg width="80" height="80" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 64 64" className="transition-colors duration-200 group-hover:text-orange-500 text-gray-400">
        <path d="M10 39V32a22 22 0 1 1 44 0v7"/>
        <rect x="6" y="39" width="10" height="14" rx="5"/>
        <rect x="48" y="39" width="10" height="14" rx="5"/>
      </svg>
    ),
    title: "Chăm sóc khách hàng",
    desc: "Liên hệ với chúng tôi qua kênh chat, email và hotline"
  },
  {
    icon: (
      // Shield with check
      <svg width="80" height="80" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 64 64" className="transition-colors duration-200 group-hover:text-orange-500 text-gray-400">
        <path d="M32 56s20-6 20-20V16L32 8 12 16v20c0 14 20 20 20 20z"/>
        <path d="M24 34l6 6 10-10"/>
      </svg>
    ),
    title: "Dịch vụ bảo hành",
    desc: " Trung tâm bảo hành trên khắp Việt Nam"
  },
  {
    icon: (
      // Stack (Manual)
      <svg width="80" height="80" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 64 64" className="transition-colors duration-200 group-hover:text-orange-500 text-gray-400">
        <rect x="12" y="20" width="40" height="8" rx="4"/>
        <rect x="16" y="32" width="32" height="8" rx="4"/>
        <rect x="20" y="44" width="24" height="8" rx="4"/>
      </svg>
    ),
    title: "Hướng dẫn sử dụng",
    desc: "Tìm hiểu thêm về hướng dẫn sử dụng các sản phẩm "
  },
  {
    icon: (
      <svg width="80" height="80" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 64 64" className="transition-colors duration-200 group-hover:text-orange-500 text-gray-400">
        <rect x="10" y="32" width="30" height="20" rx="6"/>
        <rect x="24" y="12" width="30" height="20" rx="6"/>
        <text x="23" y="48" fontSize="16" fill="currentColor" fontWeight="bold">Q</text>
        <text x="37" y="28" fontSize="16" fill="currentColor" fontWeight="bold">A</text>
      </svg>
    ),
    title: "FAQ",
    desc: "Giải đáp thắc mắc của bạn bằng tệp câu hỏi thường gặp"
  }
];

const SupportSections: React.FC = () => (
  <section className="w-full bg-white py-12 px-2 md:px-0">
    <h2 className="text-4xl font-bold text-center mb-12">Bộ phận hỗ trợ</h2>
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {supportSections.map((sec, idx) => (
        <div
          className="flex flex-col items-center text-center group cursor-pointer transition"
          key={idx}
        >
          <div className="mb-6">{sec.icon}</div>
          <div className="text-2xl font-bold mb-3 transition-colors duration-200 group-hover:text-orange-500">
            {sec.title}
          </div>
          <div className="text-lg text-gray-700 leading-normal transition-colors duration-200 group-hover:text-orange-500">
            {sec.desc}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default SupportSections;