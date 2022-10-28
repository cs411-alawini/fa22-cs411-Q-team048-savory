import { useState } from "react";
import Dashboard from "../Dashboard/Dashboard";
import Navigation from "../Navigation/Navigation";
import Query from "../Query/Query";

export default function Home() {
    const [navState, setNavState] = useState("0");
    return (
        <div className="home">
            <Navigation navState={navState} setNavState={setNavState}/>
            {navState=='0' && <Dashboard />}
            {navState=='1' && <Query />}
        </div>
    );
}