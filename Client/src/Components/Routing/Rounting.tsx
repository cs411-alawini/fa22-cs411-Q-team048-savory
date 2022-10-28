import { Route, Routes } from "react-router-dom";
import Auth from "../Auth/Auth";
import Dashboard from "../Dashboard/Dashboard";
import Home from "../Home/Home";
import Query from "../Query/Query";
export default function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}
