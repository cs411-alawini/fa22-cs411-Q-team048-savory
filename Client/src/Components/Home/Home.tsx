import { useState } from "react";
import Dashboard from "../Dashboard/Dashboard";
import Navigation from "../Navigation/Navigation";
import QueryEditor from "../QueryEditor/QueryEditor";
import Question from "../Question/Question";

export default function Home() {
    const [navState, setNavState] = useState("0");
    const [navQuestionId, setNavQuestionId]=useState(0);
    return (
        <div className="home">
            <Navigation navState={navState} setNavState={setNavState}/>
            {navState=='0' && <Dashboard />}
            {navState=='1' && <Question navState={navState} setNavState={setNavState} navQuestionId={navQuestionId} setNavQuestionId={setNavQuestionId}/>}
            {navState=='-1' && <QueryEditor questionId={navQuestionId}/>}
        </div>
    );
}