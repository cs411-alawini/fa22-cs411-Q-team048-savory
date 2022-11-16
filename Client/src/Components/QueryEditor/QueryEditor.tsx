import { MessageBar, MessageBarType, PrimaryButton, TextField } from "@fluentui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../Auth/AuthSlice";
import { executeSubmission, questionSelector, setSubmissionStatus } from "../Question/QuestionSlice";

export default function QueryEditor(props: { questionId: number }) {
  const questionDetails = useSelector(questionSelector);
  const authDetails = useSelector(authSelector);
  const [message, setMessage]=useState("");
  const dispatch = useDispatch();
  const [query, setQuery]=useState("");
  const handleQueryChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => {
    if(newValue)
    {
        setQuery(newValue);
    }
  }
  useEffect(() => {
    setMessage("Successfully inserted submission!");
  }, [questionDetails.isSubmitted])
  const handleSubmit = () => {
    dispatch(setSubmissionStatus(false));
    dispatch(executeSubmission({qid: props.questionId, query: query, uid: authDetails.userName}));
  }
  return (
    <div style={{ width: "100%" }}>
      <div style={{display: "flex", minHeight: "60px", maxHeight: "max-content",overflowWrap: "anywhere" ,alignItems: "center", backgroundColor: "#D3D3D3"}}>
        <div style={{ fontSize: "24px", fontWeight: "500" }}>
          {
            questionDetails.questions.find((s) => s.ID === props.questionId)
              ?.Description
          }
        </div>
      </div>
      <div>
        <TextField multiline styles={{fieldGroup: {
            minHeight: "400px",
            maxHeight: "max-content"
        }}} value={query} onChange={handleQueryChange} />
      </div>
      <div style={{minHeight: "140px", display: "flex", alignItems: "center", alignSelf: "flex-end"}}>
        <PrimaryButton text="Submit" onClick={handleSubmit} />
      </div>
      {questionDetails.isSubmitted && (
            <div style={{marginBottom: "20px"}}>
              <MessageBar
                messageBarType={MessageBarType.success}
                isMultiline={false}
                dismissButtonAriaLabel="Close"
                onDismiss={() => dispatch(setSubmissionStatus(false))}
              >
                {message}
              </MessageBar>
            </div>
          )}
    </div>
  );
}
