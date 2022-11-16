import {
  DefaultButton,
  DetailsList,
  DetailsListLayoutMode,
  Dialog,
  DialogFooter,
  DialogType,
  IColumn,
  IModalProps,
  PrimaryButton,
  SelectionMode,
  TextField,
} from "@fluentui/react";
import { Icon } from "@fluentui/react/lib/Icon";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IQuestion } from "../Question/Question";
import {
  deleteQuestion,
  editQuestion,
  questionSelector,
  searchQuestion,
  setIsFiltered,
  setQuestions,
} from "../Question/QuestionSlice";
import { useId, useBoolean } from "@fluentui/react-hooks";
import React from "react";

const dialogStyles = {
  main: [
    {
      selectors: {
        [""]: {
          // Apply at root
          minWidth: "750px",
        },
      },
    },
  ],
};

export default function Dashboard() {
  const [questions, setQuestionsLocal] = useState<IQuestion[]>([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const questionDetails = useSelector(questionSelector);
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentQuestionDescription, setCurrentQuestionDescription] =
    useState("");
  const handleSearchChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) => {
    setSearch(newValue!);
    if(newValue?.length===0)
    {
      dispatch(searchQuestion("%"));
    }
  };
  useEffect(() => {
    if (questionDetails.isFiltered) {
      let tmp: number[] = [];
      questionDetails.filteredQuestions.forEach((x) => tmp.push(x.ID));
      let newQuestions = questionDetails.allQuestions.filter(
        (s) => tmp.indexOf(s.ID) !== -1
      );
      dispatch(setQuestions(newQuestions));
    }
  }, [questionDetails.filteredQuestions, questionDetails.isFiltered]);
  const handleSearch = () => {
    setIsFiltered(false);
    dispatch(searchQuestion(search));
  };
  const handleQuestionChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) => {
    if (newValue) {
      setCurrentQuestionDescription(newValue);
    }
  };
  const handleDelete = (questionId: number) => {
    dispatch(deleteQuestion(questionId));
  };
  const handleEdit = (questionId: number) => {
    toggleHideDialog();
    setCurrentQuestion(questionId);
    if (currentQuestionDescription.length === 0) {
      setCurrentQuestionDescription(
        questionDetails.questions.find((s) => s.ID == questionId)
          ?.Description ?? ""
      );
    } else {
      setCurrentQuestionDescription(currentQuestionDescription);
    }
  };
  const dialogContentProps = {
    type: DialogType.normal,
    title: "Edit question",
    closeButtonAriaLabel: "Close",
  };
  const labelId: string = useId("dialogLabel");
  const subTextId: string = useId("subTextLabel");
  const modalProps: IModalProps = {
    titleAriaId: labelId,
    subtitleAriaId: subTextId,
    isBlocking: false,
    styles: dialogStyles,
  };
  useEffect(() => {
    let questionList: IQuestion[] = [];
      for (let i = 0; i < questionDetails.questions.length; i++) {
        questionList.push({
          id: questionDetails.questions[i].ID,
          desription: questionDetails.questions[i].Description,
          status: questionDetails.questions[i].Status,
          avgAttempts: questionDetails.questions[i].avg_attempts,
          avgClauses: questionDetails.questions[i].avg_clauses,
        });
      }
      setQuestionsLocal(questionList);
  }, [questionDetails.questions]);
  function _copyAndSort<T>(
    items: T[],
    columnKey: string,
    isSortedDescending?: boolean
  ): T[] {
    const key = columnKey as keyof T;
    return items
      .slice(0)
      .sort((a: T, b: T) =>
        (isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1
      );
  }
  const handleSubmitEdit = () => {
    toggleHideDialog();
    dispatch(
      editQuestion({ id: currentQuestion, desc: currentQuestionDescription })
    );
  };
  function _onColumnClick(ev: React.MouseEvent<HTMLElement>, column: IColumn) {
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter(
      (currCol) => column.key === currCol.key
    )[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    const newItems = _copyAndSort(
      questions,
      currColumn.fieldName!,
      currColumn.isSortedDescending
    );
    setColumns(newColumns);
    setQuestionsLocal(newItems);
  }
  const cols: IColumn[] = [
    {
      key: "column1",
      name: "#",
      fieldName: "no",
      minWidth: 40,
      maxWidth: 60,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      onColumnClick: () => console.log("clicked"),
      onRender: (item: IQuestion) => {
        return <span>{item.id}</span>;
      },
      data: "string",
      isPadded: true,
    },
    {
      key: "column2",
      name: "Description",
      fieldName: "description",
      minWidth: 410,
      maxWidth: 550,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      onColumnClick: _onColumnClick,
      data: "number",
      onRender: (item: IQuestion) => {
        return <span>{item.desription}</span>;
      },
      isPadded: true,
    },
    {
      key: "column3",
      name: "Avg Attempts",
      fieldName: "Avg Attempts",
      minWidth: 70,
      maxWidth: 90,
      isSorted: true,
      isSortedDescending: false,
      isResizable: true,
      onColumnClick: _onColumnClick,
      data: "number",
      onRender: (item: IQuestion) => {
        return <span>{item.avgAttempts ?? "N/A"}</span>;
      },
      isPadded: true,
    },
    {
      key: "column4",
      name: "Avg Clauses",
      fieldName: "Avg Clauses",
      minWidth: 70,
      maxWidth: 90,
      isSorted: true,
      isSortedDescending: false,
      isResizable: true,
      onColumnClick: _onColumnClick,
      data: "number",
      onRender: (item: IQuestion) => {
        return <span>{item.avgClauses ?? "N/A"}</span>;
      },
      isPadded: true,
    },
    {
      key: "column5",
      name: "Action",
      fieldName: "Edit/Delete",
      minWidth: 70,
      maxWidth: 90,
      isSorted: true,
      isSortedDescending: false,
      isResizable: true,
      onColumnClick: _onColumnClick,
      onRender: (item: IQuestion) => {
        return (
          <div style={{ display: "flex", gap: "10px" }}>
            <Icon
              style={{ cursor: "pointer" }}
              onClick={() => handleDelete(item.id)}
              iconName="Delete"
            />
            <Icon
              style={{ cursor: "pointer" }}
              onClick={() => handleEdit(item.id)}
              iconName="Edit"
            />
          </div>
        );
      },
      isPadded: true,
    },
  ];
  const [columns, setColumns] = useState<IColumn[]>(cols);
  const _getKey = (item: any, index?: number): string => {
    return item.id;
  };
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TextField
          styles={{
            root: {
              width: "100%",
            },
          }}
          value={search}
          placeholder="Search"
          onChange={handleSearchChange}
        />
        <Icon
          onClick={handleSearch}
          style={{ cursor: "pointer", marginTop: "6px" }}
          iconName="Search"
        />
      </div>
      <DetailsList
        items={questions}
        columns={columns}
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
      {!hideDialog && (
        <Dialog
          hidden={hideDialog}
          onDismiss={toggleHideDialog}
          dialogContentProps={dialogContentProps}
          modalProps={modalProps}
        >
          <TextField
            multiline
            rows={10}
            value={currentQuestionDescription}
            onChange={handleQuestionChange}
          />
          <DialogFooter>
            <PrimaryButton onClick={handleSubmitEdit} text="Submit" />
            <DefaultButton onClick={toggleHideDialog} text="Cancel" />
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
}
