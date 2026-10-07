import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      {/* 104px = 32px ticker + 72px bar */}
      <main className="min-h-screen pt-[104px]">
        <Outlet />
      </main>
    </>
  );
}