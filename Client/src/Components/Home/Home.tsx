import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { authSelector } from "../Auth/AuthSlice";
import Dashboard from "../Dashboard/Dashboard";
import Navigation from "../Navigation/Navigation";
import QueryEditor from "../QueryEditor/QueryEditor";
import Question from "../Question/Question";

export default function Home() {
    const [navState, setNavState] = useState("0");
    const [navQuestionId, setNavQuestionId]=useState(0);
    const authDetails = useSelector(authSelector);
    return (
        <div className="home">
            {(authDetails.loginResult===undefined || authDetails.loginResult===false) && 
            <div>
                <Navigate to="/" replace/>
            </div>}
            {authDetails.loginResult===true && 
            <div>
                <Navigation navState={navState} setNavState={setNavState}/>
            {navState=='0' && <Dashboard />}
            {navState=='1' && <Question navState={navState} setNavState={setNavState} navQuestionId={navQuestionId} setNavQuestionId={setNavQuestionId}/>}
            {navState=='-1' && <QueryEditor questionId={navQuestionId}/>}
            </div>}
        </div>
    );
}