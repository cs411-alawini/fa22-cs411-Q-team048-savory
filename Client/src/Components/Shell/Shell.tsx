import Routing from "../Routing/Rounting";
import { BrowserRouter } from "react-router-dom";
import Header from "../Header/Header";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getQuestions } from "../Question/QuestionSlice";
export default function Shell() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getQuestions());
  }, [])
  return (
    <BrowserRouter>
      <div>
      <Header />
      <Routing />
      </div>
    </BrowserRouter>
  );
}
