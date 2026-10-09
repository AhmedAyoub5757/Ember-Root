import { Navigate, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import Shop from "./pages/Shop";
import Trio from "./pages/Trio";
import Gifts from "./pages/Gifts";
import Doc from "./components/doc/Doc";
import Page from "./components/layout/Page";
import Story from "./components/story/Story";
import Ingredients from "./components/ingredients/Ingredients";
import HeatGuide from "./components/layout/HeatGuide";
import Track from "./pages/Track";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { docs } from "./pages/pages";
import { useEffect } from "react";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./store/auth";

// const Flavor = () => <Placeholder title={`Flavor: ${useParams().id}`} />;

function RequireAuth() {
  const user = useAuth((s) => s.user);
  const status = useAuth((s) => s.status);

  if (status === "loading") return null;
  return user ? <Layout /> : <Navigate to="/auth" replace />;
}

export default function App() {
  useEffect(() => {
    useAuth.getState().load();
  }, []);

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route
        path="/signup"
        element={<Navigate to="/auth?mode=signup" replace />}
      />
      <Route element={<RequireAuth />}>
        {/* <Route path="/" element={<div className="h-[200vh] px-8 py-24"><Placeholder title="Hero goes here" /></div>} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/trio" element={<Trio />} />
        <Route path="/shop/gifts" element={<Gifts />} />
        <Route path="/shop/:type" element={<Navigate to="/shop" replace />} />
        {/* <Route path="/flavor/:id" element={<Flavor />} /> */}
        {/* <Route path="/flavor/:id" element={<Product />} /> */}
        <Route path="/flavor/:id" element={<Product />} />
        <Route
          path="/story"
          element={
            <Page title="Our story">
              <Story />
            </Page>
          }
        />
        <Route
          path="/ingredients"
          element={
            <Page title="Ingredients">
              <Ingredients />
            </Page>
          }
        />
        <Route path="/heat-guide" element={<HeatGuide />} />
        <Route path="/faq" element={<Doc key="faq" doc={docs.faq} />} />
        <Route
          path="/shipping"
          element={<Doc key="shipping" doc={docs.shipping} />}
        />
        <Route
          path="/privacy"
          element={<Doc key="privacy" doc={docs.privacy} />}
        />
        <Route path="/terms" element={<Doc key="terms" doc={docs.terms} />} />
        <Route path="/track" element={<Track />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:no" element={<Confirmation />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/account" element={<Account />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
