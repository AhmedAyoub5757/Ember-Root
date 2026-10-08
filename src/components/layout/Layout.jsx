import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      {/* 104px = 32px ticker + 72px bar */}
      <main className="min-h-screen pt-[104px]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}