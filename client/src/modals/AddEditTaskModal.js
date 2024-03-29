import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import crossIcon from "../assets/icon-cross.svg";
import { fetchAsyncBoards } from "../redux/boardsSliceNew";
import * as taskAPI from "../redux/api/taskAPI"

function AddEditTaskModal({
  type,
  device,
  setIsTaskModalOpen,
  setIsAddTaskModalOpen,
  taskIndex,
  prevColIndex = 0,
  taskDetails
}) {
  const dispatch = useDispatch();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtasks, setNewSubtasks] = useState([]);
  const [deleteSubtasks, setDeleteSubtasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const board = useSelector((state) => state.boards).find(
    (board) => board.isActive
  );

  const columns = board.columns;
  const col = columns.find((col, index) => index === prevColIndex);
  const task = col ? col.tasks.find((task, index) => index === taskIndex) : [];
  const [status, setStatus] = useState(columns[prevColIndex].name);

  const combinedSubtasks = [...subtasks, ...newSubtasks];
  const currentBoard = useSelector((state) => state.boardsNew.currentBoard);

  if (type === "edit" && isFirstLoad) {
    setSubtasks(
      taskDetails.subtasks.map((subtask) => {
        return { ...subtask, id: subtask.id };
      })
    );
    setTitle(taskDetails.title);
    setDescription(taskDetails.description);
    setIsFirstLoad(false);
  }

  // handle subTasks change
  const onChangeSubtasks = (id, newValue) => {
    // Check if subtask.id is included in any subtask object within subtasks
    const oldSubtask = subtasks.some((el) => el.id === id);

    if(oldSubtask) {
      setSubtasks((prevState) => {
        const newState = [...prevState];
        const subtask = newState.find((subtask) => subtask.id === id);
        subtask.title = newValue;
        return newState;
      });
    } else{
      setNewSubtasks((prevState) => {
        const newState = [...prevState];
        const subtask = newState.find((subtask) => subtask.id === id);
        subtask.title = newValue;
        return newState;
      });
    }
  };

  const onChangeStatus = (e) => {
    setStatus(e.target.value);
  };

  // validate details before submission
  const validate = () => {
    if (!title.trim()) {
      return false;
    }
    for (let i = 0; i < subtasks.length; i++) {
      if (!subtasks[i].title.trim()) {
        return false;
      }
    }
    return true;
  };
  
  // handle add new subTask
  const addNewSubtask = () => {
    let newSubtask = {
      title: "", is_completed: false, id: uuidv4(), task: taskDetails?.id
    }
    setNewSubtasks((state) => [
      ...state,
      newSubtask
    ]);
  }

  // handle delete subtask
  const onDelete = (subtask) => {
    // Check if subtask.id is included in any subtask object within subtasks
    const isSubtaskIncluded = subtasks.some((el) => el.id === subtask.id);

    // Add the deleted subtask to the deleteSubtasks state
    if(isSubtaskIncluded){
      setDeleteSubtasks((prevDeleteSubtasks) => [...prevDeleteSubtasks, subtask]);
      setSubtasks((prevState) => 
        prevState.filter((el) => el.id !== subtask.id)
      );
    }

    // Remove the deleted subtask from the newSubtasks state
    setNewSubtasks((prevState) => 
      prevState.filter((el) => el.id !== subtask.id)
    );
  };

  // handle task submission
  const onSubmit = (type) => {
    let data = {
      title : title,
      description : description,
      status: status,
      assigned_to: null,
      board: currentBoard.id,
      column: currentBoard.columns[0].id,
      subtasks: subtasks,
      deleteSubtasks: deleteSubtasks,
      newSubtasks: newSubtasks
    }
    if(type == "add"){
      taskAPI.addTask(data).then(() => dispatch(fetchAsyncBoards()));
    }else{
      taskAPI.editTask(taskDetails.id, data).then(() => dispatch(fetchAsyncBoards()));
    }
  };

  return (
    <div
      className={
        device === "mobile"
          ? "  py-6 px-6 pb-40  absolute overflow-y-scroll  left-0 flex  right-0 bottom-[-100vh] top-0 dropdown "
          : "  py-6 px-6 pb-40  absolute overflow-y-scroll  left-0 flex  right-0 bottom-0 top-0 dropdown "
      }
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsAddTaskModalOpen(false);
      }}
    >
      {/* Modal Section */}

      <div
        className=" scrollbar-hide overflow-y-scroll max-h-[95vh]  my-auto  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold
       shadow-md shadow-[#364e7e1a] max-w-md mx-auto  w-full px-8  py-8 rounded-xl"
      >
        <h3 className=" text-lg ">
          {type === "edit" ? "Edit" : "Add New"} Task
        </h3>

        {/* Task Name */}

        <div className="mt-8 flex flex-col space-y-1">
          <label className="  text-sm dark:text-white text-gray-500">
            Task Name
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="task-name-input"
            type="text"
            className=" bg-transparent  px-4 py-2 outline-none focus:border-0 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1  ring-0  "
            placeholder=" e.g Take coffee break"
          />
        </div>

        {/* Description */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="  text-sm dark:text-white text-gray-500">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="task-description-input"
            className=" bg-transparent outline-none min-h-[200px] focus:border-0 px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px] "
            placeholder="e.g. It's always good to take a break. This 
            15 minute break will  recharge the batteries 
            a little."
          />
        </div>

        {/* Subtasks */}

        <div className="mt-8 flex flex-col space-y-3">
          <label className="  text-sm dark:text-white text-gray-500">
            Subtasks
          </label>

          {combinedSubtasks.map((subtask, index) => (
            <div key={index} className=" flex items-center w-full ">
              <input
                onChange={(e) => {
                  onChangeSubtasks(subtask.id, e.target.value);
                }}
                type="text"
                value={subtask.title}
                className=" bg-transparent outline-none focus:border-0 flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]  "
                placeholder=" e.g Take coffee break"
              />
              <img
                src={crossIcon}
                onClick={() => {
                  onDelete(subtask);
                }}
                className=" m-4 cursor-pointer "
              />
            </div>
          ))}

          <button
            className=" w-full items-center dark:text-[#635fc7] dark:bg-white  text-white bg-[#635fc7] py-2 rounded-full "
            onClick={() => {
              addNewSubtask()
            }}
          >
            + Add New Subtask
          </button>
        </div>

        {/* current Status  */}
        <div className="mt-8 flex flex-col space-y-3">
          <label className="  text-sm dark:text-white text-gray-500">
            Current Status
          </label>
          <select
            value={status}
            onChange={onChangeStatus}
            className=" select-status flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0  border-[1px] border-gray-300 focus:outline-[#635fc7] outline-none"
          >
            {columns.map((column, index) => (
              <option key={index}>{column.name}</option>
            ))}
          </select>
          <button
            onClick={() => {
              const isValid = validate();
              if (isValid) {
                onSubmit(type);
                setIsAddTaskModalOpen(false);
                type === "edit" && setIsTaskModalOpen(false);
              }
            }}
            className=" w-full items-center text-white bg-[#635fc7] py-2 rounded-full "
          >
           {type === "edit" ? " save edit" : "Create task"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEditTaskModal;
