import React from "react";
import Header from "./Header/Header";
import FooterComponent from "./FooterComponent";

const AboutUs: React.FC = () => (
  <>
    <Header />
    <section className="w-full bg-white py-12 px-4 md:px-0">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-6">Về chúng tôi</h2>
        <p className="text-lg text-gray-700 mb-8 text-center font-medium">
          Chào mừng quý khách đến với trang web chuyên kinh doanh các sản phẩm điện tử và phụ kiện!
        </p>
        <div className="text-gray-700 space-y-6 leading-relaxed text-justify">
          <p>
            Trang web được xây dựng với mục tiêu đáp ứng nhu cầu mua sắm các sản phẩm điện tử, công nghệ và phụ kiện hiện đại cho mọi khách hàng. Chúng tôi cam kết mang đến những sản phẩm chất lượng, đa dạng mẫu mã, giá cả hợp lý cùng dịch vụ hỗ trợ tận tình, chuyên nghiệp.
          </p>
          <h3 className="text-2xl font-bold mt-8 mb-2">Tầm nhìn & Sứ mệnh</h3>
          <p>
            Với mong muốn trở thành địa chỉ mua sắm trực tuyến uy tín trong lĩnh vực điện tử, chúng tôi luôn không ngừng đổi mới, cập nhật các sản phẩm công nghệ mới nhất để phục vụ khách hàng tốt hơn mỗi ngày. Sứ mệnh của chúng tôi là mang đến giải pháp tiện ích, hiện đại giúp khách hàng dễ dàng tiếp cận và lựa chọn sản phẩm phù hợp nhất với nhu cầu sử dụng.
          </p>
          <h3 className="text-2xl font-bold mt-8 mb-2">Giá trị cốt lõi</h3>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              <b>Chất lượng:</b> Cam kết cung cấp sản phẩm chính hãng, nguồn gốc rõ ràng.
            </li>
            <li>
              <b>Đa dạng:</b> Nhiều lựa chọn về điện thoại, laptop, phụ kiện, thiết bị thông minh và linh kiện điện tử.
            </li>
            <li>
              <b>Uy tín:</b> Đặt lợi ích khách hàng lên hàng đầu, minh bạch trong giao dịch.
            </li>
            <li>
              <b>Hỗ trợ tận tâm:</b> Đội ngũ tư vấn, chăm sóc khách hàng nhiệt tình và sẵn sàng giải đáp mọi thắc mắc.
            </li>
          </ul>
          <h3 className="text-2xl font-bold mt-8 mb-2">Sản phẩm & Dịch vụ</h3>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <b>Thiết bị điện tử:</b> Điện thoại, máy tính bảng, laptop, máy tính để bàn, thiết bị âm thanh, smart TV, camera, v.v.
            </li>
            <li>
              <b>Phụ kiện:</b> Tai nghe, sạc, dây cáp, thẻ nhớ, ốp lưng, chuột, bàn phím, pin dự phòng, phụ kiện gaming, v.v.
            </li>
            <li>
              <b>Linh kiện:</b> Các loại linh kiện thay thế, nâng cấp cho thiết bị điện tử.
            </li>
            <li>
              <b>Dịch vụ hỗ trợ:</b> Tư vấn sản phẩm, hướng dẫn sử dụng, bảo hành chính hãng, hỗ trợ đổi trả và giao hàng tận nơi.
            </li>
          </ul>
          <h3 className="text-2xl font-bold mt-8 mb-2">Liên hệ</h3>
          <div className="space-y-1">
            <div>Địa chỉ: Hà Nội</div>
            <div>Website: <a className="text-blue-600 underline" href="#" target="_blank" rel="noopener">website.com</a></div>
            <div>Điện thoại: <a className="text-blue-700" href="tel:0123456789">0123 456 789</a></div>
            <div>Email: <a className="text-blue-700" href="mailto:contact@email.com">contact@email.com</a></div>
          </div>
        </div>
      </div>
    </section>
    <FooterComponent />
  </>
);

export default AboutUs;