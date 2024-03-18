import React, { useState } from "react";
import crossIcon from "../assets/icon-cross.svg";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { fetchAsyncBoards } from "../redux/boardsSliceNew";
import * as boardAPI from "../redux/api/boardAPI"

function AddEditBoardModal({ setIsBoardModalOpen, type }) {
  const dispatch = useDispatch();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [name, setName] = useState("");
  const [columns, setColumns] = useState([]);
  const [newColumns, setNewColumns] = useState([]);
  const [deleteColumns, setDeleteColumns] = useState([]);

  const currentBoard = useSelector((state) => state.boardsNew.currentBoard);

  const combinedColumns = [...columns, ...newColumns];

  if (type === "edit" && isFirstLoad) {
    setColumns(
      currentBoard.columns.map((col) => {
        return { ...col, id: col.id };
      })
    );
    setName(currentBoard.name);
    setIsFirstLoad(false);
  }

  // validate board details before submission
  const validate = () => {
    if (!name.trim()) {
      return false;
    }
    for (let i = 0; i < newColumns.length; i++) {
      if (!newColumns[i].name.trim()) {
        return false;
      }
    }
    return true;
  };

  // handle add new column
  const addNewColumn = () => {
    let newColumn = {
      name: "",
      tasks: [],
      id: uuidv4(),
      board: currentBoard.id,
    };
    setNewColumns((state) => [...state, newColumn]);
  };

  // handle board column delete
  const onDelete = (column) => {
    // Check if column.id is included in any column object within columns
    const isColumnIncluded = columns.some((el) => el.id === column.id);

    // Add the deleted subtask to the deleteSubtasks state
    if (isColumnIncluded) {
      setDeleteColumns((prevDeleteColumns) => [...prevDeleteColumns, column]);
      setColumns((prevState) => prevState.filter((el) => el.id !== column.id));
    }

    // Remove the deleted column from the newColumns state
    setNewColumns((prevState) =>
      prevState.filter((col) => col.id !== column.id)
    );
  };

  // handle board column change
  const onChange = (id, newValue) => {
    // Check if column.id is included in any column object within columns
    const oldColumn = columns.some((el) => el.id === id);

    if (oldColumn) {
      setColumns((prevState) => {
        const newState = [...prevState];
        const column = newState.find((column) => column.id === id);
        column.name = newValue;
        return newState;
      });
    } else {
      setNewColumns((prevState) => {
        const newState = [...prevState];
        const column = newState.find((column) => column.id === id);
        column.name = newValue;
        return newState;
      });
    }
  };

  // handle board submission
  const onSubmit = (type) => {
    let data = {
      name: name,
      columns: columns,
      deleteColumns: deleteColumns,
      newColumns: newColumns,
    };
    setIsBoardModalOpen(false);
    if (type === "add") {
      boardAPI.addBoard(data).then(() => dispatch(fetchAsyncBoards()));
    } else {
      boardAPI.editBoard(currentBoard.id, data).then(() => dispatch(fetchAsyncBoards()));
    }
  };

  return (
    <div
      className="  fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide  z-50 left-0 bottom-0 justify-center items-center flex dropdown "
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsBoardModalOpen(false);
      }}
    >
      <div
        className=" scrollbar-hide overflow-y-scroll max-h-[95vh]  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold
       shadow-md shadow-[#364e7e1a] max-w-md mx-auto my-auto w-full px-8  py-8 rounded-xl"
      >
        <h3 className=" text-lg ">
          {type === "edit" ? "Edit" : "Add New"} Board
        </h3>

        {/* Task Name */}

        <div className="mt-8 flex flex-col space-y-1">
          <label className="  text-sm dark:text-white text-gray-500">
            Board Name
          </label>
          <input
            className=" bg-transparent  px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1  ring-0  "
            placeholder=" e.g Web Design"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="board-name-input"
          />
        </div>

        {/* Board Columns */}

        <div className="mt-8 flex flex-col space-y-3">
          <label className=" text-sm dark:text-white text-gray-500">
            Board Columns
          </label>

          {combinedColumns.map((column, index) => (
            <div key={index} className=" flex items-center w-full ">
              <input
                className=" bg-transparent flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]  "
                onChange={(e) => {
                  onChange(column.id, e.target.value);
                }}
                type="text"
                value={column.name}
            />
              <img
                src={crossIcon}
                onClick={() => {
                  onDelete(column);
                }}
                className=" m-4 cursor-pointer "
              />
            </div>
          ))}
          <div>
            <button
              className=" w-full items-center hover:opacity-70 dark:text-[#635fc7] dark:bg-white  text-white bg-[#635fc7] py-2 rounded-full "
              onClick={() => {
                addNewColumn();
              }}
            >
              + Add New Column
            </button>
            <button
              onClick={() => {
                const isValid = validate();
                if (isValid === true) onSubmit(type);
              }}
              className=" w-full items-center hover:opacity-70 dark:text-white dark:bg-[#635fc7] mt-8 relative  text-white bg-[#635fc7] py-2 rounded-full"
            >
              {type === "add" ? "Create New Board" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEditBoardModal;
