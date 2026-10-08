import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";

const Placeholder = ({ title }) => (
  <section className="px-8 py-24">
    <p className="label opacity-60">Placeholder</p>
    <h1 className="display mt-4 text-7xl">{title}</h1>
  </section>
);

// const Flavor = () => <Placeholder title={`Flavor: ${useParams().id}`} />;

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* <Route path="/" element={<div className="h-[200vh] px-8 py-24"><Placeholder title="Hero goes here" /></div>} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Placeholder title="Shop" />} />
        <Route
          path="/shop/:type"
          element={<Placeholder title="Shop category" />}
        />
        {/* <Route path="/flavor/:id" element={<Flavor />} /> */}
        {/* <Route path="/flavor/:id" element={<Product />} /> */}
        <Route path="/flavor/:id" element={<Product />} />
        <Route path="/story" element={<Placeholder title="Story" />} />
        <Route
          path="/ingredients"
          element={<Placeholder title="Ingredients" />}
        />
        <Route path="/contact" element={<Placeholder title="Contact" />} />
        <Route
          path="/heat-guide"
          element={<Placeholder title="Heat guide" />}
        />
        // replace the temporary checkout placeholder, and add the confirmation
        route:
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:no" element={<Confirmation />} />
      </Route>
    </Routes>
  );
}
