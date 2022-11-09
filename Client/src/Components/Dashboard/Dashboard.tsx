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
import { Icon } from '@fluentui/react/lib/Icon';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IQuestion } from "../Question/Question";
import { questionSelector } from "../Question/QuestionSlice";
import { useId, useBoolean } from '@fluentui/react-hooks';
import React from "react";

const dialogStyles = { main: [{
    selectors: {
        [""]: { // Apply at root 
            minWidth: '750px'
        }
    }
}] };

export default function Dashboard() {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const questionDetails = useSelector(questionSelector);
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [currentQuestion, setCurrentQuestion]=useState(0);
  const [currentQuestionDescription, setCurrentQuestionDescription]=useState("");
  const handleQuestionChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) =>
  {
    if(newValue)
    {
        setCurrentQuestionDescription(newValue);
    }
  }
  const handleEdit = (questionId: number) => {
    toggleHideDialog();
    setCurrentQuestion(questionId);
    setCurrentQuestionDescription(questionDetails.questions.find(s => s.iD == questionId)?.description ?? "");
  }
  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Edit question',
    closeButtonAriaLabel: 'Close'
  };
  const labelId: string = useId('dialogLabel');
  const subTextId: string = useId('subTextLabel');
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
        id: questionDetails.questions[i].iD,
        question: questionDetails.questions[i].description,
        desription: questionDetails.questions[i].description,
        status: questionDetails.questions[i].status,
        avgAttempts: questionDetails.questions[i].avgAttempts,
        avgClauses: questionDetails.questions[i].avgClauses,
      });
    }
    setQuestions(questionList);
  }, []);
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
    setQuestions(newItems);
  }
  const cols: IColumn[] = [
    {
      key: "column1",
      name: "No",
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
        return <span>{item.question}</span>;
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
        return <span>{item.avgAttempts}</span>;
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
        return <span>{item.avgClauses}</span>;
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
          <div style={{display: "flex", gap: "10px"}}>
            <Icon style={{cursor: "pointer"}} onClick={() => console.log("Delete")} iconName="Delete" />
            <Icon style={{cursor: "pointer"}} onClick={() => handleEdit(item.id)} iconName="Edit" />
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
      {!hideDialog && 
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
      >
        <TextField multiline rows={15} value={currentQuestionDescription} onChange={handleQuestionChange}/>
        <DialogFooter>
          <PrimaryButton onClick={toggleHideDialog} text="Submit" />
          <DefaultButton onClick={toggleHideDialog} text="Cancel" />
        </DialogFooter>
      </Dialog>}
    </div>
  );
}
