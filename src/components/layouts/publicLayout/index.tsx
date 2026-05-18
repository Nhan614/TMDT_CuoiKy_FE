import { Outlet } from "react-router-dom";
import Header from "../../common/Header";
import Footer from "../../common/Footer";

function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default PublicLayout;
