import Routing from "../Routing/Rounting";
import { BrowserRouter } from "react-router-dom";
import Header from "../Header/Header";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQuestions } from "../Question/QuestionSlice";
import { authSelector } from "../Auth/AuthSlice";
export default function Shell() {
  const dispatch = useDispatch();
  const authDetails=useSelector(authSelector);
  useEffect(() => {
    if(authDetails.userName.length>0)
    {
      dispatch(getQuestions(authDetails.userName));
    }
  }, [authDetails.userName])
  return (
    <BrowserRouter>
      <div>
      <Header />
      <Routing />
      </div>
    </BrowserRouter>
  );
}
