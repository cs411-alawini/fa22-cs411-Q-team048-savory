import { Route, Routes } from "react-router-dom";
import Auth from "../Auth/Auth";
import Home from "../Home/Home";
export default function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}
