import Header from "../../components/commom/Header/Header";
import FooterComponent from "../../components/commom/FooterComponent";
import Slide from "../../components/commom/Slide";

import HeaderTop from "../../components/commom/Header/component/HeaderTop";
import Slide3 from "../../components/commom/Slide3";
import Slide2 from "../../components/commom/Slide2";
import Slide4 from "../../components/commom/Slide4";
import LaptopProductList from "./LaptopProductList";
const HomePage = () => {
  return (
    <div className="bg-white w-full overflow-hidden">
      {/* <HeaderTop /> */}
      <Header />
      <Slide />
      <Slide2 />
      <Slide3 />
      <Slide4/>
      <LaptopProductList/>
      <FooterComponent />
    </div>
  );
};

export default HomePage;
