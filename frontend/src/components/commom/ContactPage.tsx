import React, { useState } from "react";
import Header from "./Header/Header";
import FooterComponent from "./FooterComponent";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/store";
import UserChatPopup from "../Chat/UserChatPopUp";

const MAPS = [
  {
    name: "Cửa hàng 1",
    address: "Số 487-489 Đường Vạn Xuân, Hoài Đức, Hà Nội",
    src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1106.8882926384133!2d105.71029854721273!3d21.068124985622802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455cabc073633%3A0xafb6a2f683283519!2zQ-G7rWEgSMOgbmcgSMO5bmcgTGFu!5e0!3m2!1svi!2s!4v1689763189269!5m2!1svi!2s",
  },
  {
    name: "Cửa hàng 2",
    address: "Nguyễn Xiển, Thanh Xuân, Hà Nội",
    src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.182543221201!2d105.80570097603304!3d20.98531858926768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ad6a90470d39%3A0x4efb1df6e73594cd!2zU2hvd3Jvb20gSMO5bmcgTGFuIE5ndXnhu4VuIFhp4buDbg!5e0!3m2!1svi!2s!4v1692256365172!5m2!1svi!2s",
  }
];

const ContactPage: React.FC = () => {
  const { token, isAdmin, username } = useSelector((state: RootState) => state.auth);
  const [selected, setSelected] = useState(0);

  return (
    <>
      <Header />
      <section className=" bg-white  ">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-6">Liên hệ</h2>
          <p className="text-lg text-gray-700 mb-8 text-center font-medium">
            Quý khách vui lòng liên hệ với chúng tôi qua thông tin dưới đây hoặc ghé thăm hệ thống cửa hàng.
          </p>

          <div className="space-y-6 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-2">Thông tin liên hệ</h3>
              <div className="text-gray-700 space-y-1">
                <div>Địa chỉ: Hà Nội</div>
                <div>Điện thoại: <a className="text-blue-700" href="tel:0123456789">0123 456 789</a></div>
                <div>Email: <a className="text-blue-700" href="mailto:contact@email.com">contact@email.com</a></div>
                <div>Website: <a className="text-blue-600 underline" href="#" target="_blank" rel="noopener">website.com</a></div>
              </div>
            </div>
          </div>

          <div>
            {/* Large Map */}
            <div className="rounded-xl overflow-hidden shadow mb-6 transition-all duration-300">
              <iframe
                src={MAPS[selected].src}
                style={{ border: 0, width: '100%', height: 400 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={MAPS[selected].name}
              />
            </div>
            {/* Small Map Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {MAPS.map((map, idx) => (
                <button
                  key={map.name}
                  onClick={() => setSelected(idx)}
                  className={`flex flex-col items-center border-2 rounded-xl p-2 w-44 transition
                    ${selected === idx
                      ? "border-orange-500 bg-orange-50 shadow text-orange-600 font-semibold"
                      : "border-gray-200 bg-white hover:border-orange-400 hover:bg-orange-50"
                    }`}
                  style={{ outline: "none" }}
                >
                  <div className="w-full h-24 rounded overflow-hidden mb-2">
                    <iframe
                      src={map.src}
                      style={{ border: 0, width: '100%', height: '100%' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={map.name + " thumb"}
                    />
                  </div>
                  <div className="text-base">{map.name}</div>
                  <div className="text-xs text-gray-600">{map.address}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      {token && !isAdmin && username && (
        <UserChatPopup authToken={token} username={username} />
      )}   
      <FooterComponent />
    </>
  );
};

export default ContactPage;