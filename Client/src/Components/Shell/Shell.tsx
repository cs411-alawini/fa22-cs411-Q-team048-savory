import Auth from "../Auth/Auth";
import Routing from "../Routing/Rounting";
import { BrowserRouter } from "react-router-dom";
import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";
export default function Shell() {
  return (
    <BrowserRouter>
      <div>
      <Header />
      <Routing />
      </div>
    </BrowserRouter>
  );
}
