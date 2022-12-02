import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  ILabelStyles,
  IStyleSet,
  Label,
  MessageBar,
  MessageBarType,
  Pivot,
  PivotItem,
  PrimaryButton,
  rgb2hex,
  SelectionMode,
  TextField,
} from "@fluentui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../Auth/AuthSlice";
import {
  executeSubmission,
  getIntermediateResult,
  questionSelector,
  setSubmissionStatus,
} from "../Question/QuestionSlice";

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
  root: { marginTop: 10 },
};

export default function QueryEditor(props: { questionId: number }) {
  const questionDetails = useSelector(questionSelector);
  const [cols, setCols] = useState<IColumn[]>([]);
  const [items, setItems] = useState<Object[]>([]);
  const authDetails = useSelector(authSelector);
  const [pivotText, setPivotText] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const handlePivotChange = (
    item?: PivotItem,
    ev?: React.MouseEvent<HTMLElement>
  ) => {
    setPage(1);
    setPivotText(item?.props.headerText!);
  };
  useEffect(() => {
    if (questionDetails.intermediateResults) {
      setPivotText(questionDetails.intermediateResults.result[0].type);
    }
  }, [questionDetails.intermediateResults]);
  useEffect(() => {
    let cols: IColumn[] = [];
    let items: object[] = [];
    let clause:
      | {
          type: string;
          order: number;
          output: {
            rows: object[];
            cols: string[];
          };
        }
      | undefined = questionDetails.intermediateResults?.result.find(
      (s) => s.type === pivotText
    );
    clause?.output.cols.forEach((result: any, i) => {
      cols.push({
        key: "column" + i.toString(),
        name: result,
        fieldName: result,
        minWidth: 40,
        maxWidth: 60,
        isRowHeader: true,
        isResizable: true,
        onRender: (item: any) => {
          return <span>{item[result]}</span>;
        },
        data: "string",
        isPadded: true,
      });
    });
    setCols(cols);
    let rowObject: object[] | undefined =
      questionDetails.intermediateResults?.result
        .find((s) => s.type === pivotText)
        ?.output.rows.slice((page - 1) * 10, page * 10);
    rowObject?.forEach((row, i) => {
      items.push(row);
    });
    setItems(items);
  }, [pivotText, page]);
  const handleQueryChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) => {
    setQuery(newValue!);
  };
  useEffect(() => {
    if(questionDetails.intermediateResults?.isCorrect)
    setMessage("Correct answer");
    else
    setMessage("Incorrect answer");
    if (questionDetails.isSubmitted) {
      dispatch(getIntermediateResult({query: query, submissionId: questionDetails.submissionID, questionID: props.questionId}));
    }
  }, [questionDetails.isSubmitted, questionDetails.intermediateResults?.isCorrect]);
  const handleSubmit = () => {
    setPage(1);
    dispatch(setSubmissionStatus(false));
    dispatch(
      executeSubmission({
        qid: props.questionId,
        query: query,
        uid: authDetails.userName,
      })
    );
  };
  const _getKey = (item: any, index?: number): string => {
    return item.id;
  };
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ width: "35%" }}>
      <div style={{display: "flex", flexDirection: "column"}}>
        <div style={{backgroundColor: "#D3D3D3", fontSize: "24px", height: "28px", fontWeight: "500"}}>
        Schema
        </div>
        <div>
        <p>Students(NetId, FirstName, LastName, Department); </p>
        <p>Enrollments(NetId, CRN, Credits, Score);</p>
        <p>Courses(CRN, Title, Department, Instructor);</p>
      </div>
      </div>
        <div
          style={{
            display: "flex",
            minHeight: "60px",
            maxHeight: "max-content",
            overflowWrap: "anywhere",
            alignItems: "center",
            backgroundColor: "#D3D3D3",
          }}
        >
          <div style={{ fontSize: "24px", fontWeight: "500" }}>
            {
              questionDetails.questions.find((s) => s.ID === props.questionId)
                ?.Description
            }
          </div>
        </div>
        <div>
          <TextField
            multiline
            styles={{
              fieldGroup: {
                minHeight: "400px",
                maxHeight: "max-content",
              },
            }}
            value={query}
            onChange={handleQueryChange}
          />
        </div>
        <div
          style={{
            minHeight: "80px",
            display: "flex",
            alignItems: "center",
            alignSelf: "flex-end",
          }}
        >
          <PrimaryButton text="Submit" onClick={handleSubmit} />
        </div>
      </div>
      <div
        style={{ width: "65%", overflowY: "scroll" }}
      >
        {questionDetails.isSubmitted && questionDetails.intermediateResults?.status && (
          <div style={{ marginBottom: "10px", width: "100%" }}>
            <MessageBar
              messageBarType={MessageBarType.success}
              isMultiline={false}
              dismissButtonAriaLabel="Close"
              styles={{
                root: {
                  backgroundColor: questionDetails.intermediateResults.isCorrect ? "#DFF6DD" : "#FED9CC"
                },
                icon: {
                  display: "none" 
                },
                text: {
                  marginLeft: "-20px"
                }
              }}
              onDismiss={() => dispatch(setSubmissionStatus(false))}
            >
              {message}
            </MessageBar>
          </div>
        )}
        {questionDetails.intermediateResults?.status && (
          <Pivot
            aria-label="intermediate results"
            onLinkClick={handlePivotChange}
          >
            {questionDetails.intermediateResults?.result.map((clause) => (
                <PivotItem headerText={clause.type}>
                  <div>
                    <DetailsList
                      items={items}
                      columns={cols}
                      selectionMode={SelectionMode.none}
                      getKey={_getKey}
                      setKey="none"
                      layoutMode={DetailsListLayoutMode.justified}
                      isHeaderVisible={true}
                      styles={{
                        headerWrapper: {
                          marginTop: "-14px",
                        },
                      }}
                    />
                    <div
                      style={{
                        marginTop: "30px",
                        display: "flex",
                        flexDirection: "row",
                        gap: "20px",
                      }}
                    >
                      <PrimaryButton
                        text="Page down"
                        onClick={() => setPage(page - 1)}
                      />
                      <div style={{ marginTop: "4px" }}>{page}/{questionDetails.intermediateResults?.result!==undefined && <>{Math.ceil(questionDetails.intermediateResults.result.find(s=> s.type===pivotText)?.output.rows.length!/10)}</>}</div>
                      <PrimaryButton
                        text="Page up"
                        onClick={() => setPage(page + 1)}
                      />
                    </div>
                  </div>
                </PivotItem>
              ))}
          </Pivot>
        )}
        {!questionDetails.intermediateResults?.status && <div>{questionDetails.intermediateResults?.error}</div>}
      </div>
    </div>
  );
}
