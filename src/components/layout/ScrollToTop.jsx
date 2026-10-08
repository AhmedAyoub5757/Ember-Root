import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // "instant" overrides the global smooth scrolling in index.css
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}