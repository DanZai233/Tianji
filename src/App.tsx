import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Astrology from "./pages/Astrology";
import Tarot from "./pages/Tarot";
import QiMen from "./pages/QiMen";
import IChing from "./pages/IChing";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="astrology" element={<Astrology />} />
          <Route path="tarot" element={<Tarot />} />
          <Route path="qimen" element={<QiMen />} />
          <Route path="iching" element={<IChing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
