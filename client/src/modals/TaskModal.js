import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ElipsisMenu from "../components/ElipsisMenu";
import elipsis from "../assets/icon-vertical-ellipsis.svg";
import Subtask from "../components/Subtask";
import AddEditTaskModal from "./AddEditTaskModal";
import DeleteModal from "./DeleteModal";
import { fetchAsyncBoards } from "../redux/boardsSliceNew";
import * as taskAPI from "../redux/api/taskAPI";
import * as subTaskAPI from "../redux/api/subtaskAPI";

function TaskModal({ taskIndex, colIndex, setIsTaskModalOpen, taskDetails }) {
  const dispatch = useDispatch();
  const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const boards = useSelector((state) => state.boards);
  const currentBoard = useSelector((state) => state.boardsNew.currentBoard);

  const board = boards.find((board) => board.isActive === true);
  const columns = board.columns;
  const col = columns.find((col, i) => i === colIndex);
  // const task = col.tasks.find((task, i) => i === taskIndex);
  let task = taskDetails;
  let number = 0;
  let subtasks = taskDetails.subtasks;
  let taskCurrentStatusChanged = false;
  let subtasksChanged = false;

  let completed = 0;
  subtasks.forEach((subtask) => {
    if (subtask.isCompleted) {
      completed++;
    }
  });

  const [status, setStatus] = useState(taskDetails?.status);
  const [newColIndex, setNewColIndex] = useState(columns.indexOf(col));

  useEffect(() => {
    return () => {
      if (taskCurrentStatusChanged) {
        taskAPI
          .editTask(taskDetails.id, task)
          .then(() => dispatch(fetchAsyncBoards()));
      }
    };
  }, []);

  const onChange = (e) => {
    taskCurrentStatusChanged = true;

    // Find the column object based on the name
    const column = currentBoard.columns.find(
      (column) => column.name === e.target.value
    );

    // Update the task object with the new status value
    const updatedTask = { ...task, status: e.target.value, column: column.id };
    task = updatedTask;
    number = 2;

    setStatus(e.target.value);
    // setNewColIndex(e.target.selectedIndex);
  };

  // onClose TaskModel send completed subtask call
  const onClose = (e) => {
    if (e.target !== e.currentTarget) {
      return;
    } else {
      if (subtasksChanged) {
        let data = {
          subtasks: subtasks,
        };
        subTaskAPI.editSubtask(data).then(() => dispatch(fetchAsyncBoards()));
      } else if (taskCurrentStatusChanged) {
        // taskAPI.editTask()
      }
    }
    setIsTaskModalOpen(false);
  };

  const changeSubtaskStatus = (id) => {
    const updatedSubtasks = subtasks.map((subtask) =>
      subtask.id === id
        ? { ...subtask, is_completed: !subtask.is_completed }
        : subtask
    );
    subtasksChanged = true;
    subtasks = updatedSubtasks;
  };

  const onDeleteBtnClick = (e) => {
    if (e.target.textContent === "Delete") {
      taskAPI
        .deleteTask(taskDetails.id)
        .then(() => dispatch(fetchAsyncBoards()));
      setIsTaskModalOpen(false);
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(false);
    }
  };

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const setOpenEditModal = () => {
    setIsAddTaskModalOpen(true);
    setIsElipsisMenuOpen(false);
  };

  const setOpenDeleteModal = () => {
    setIsElipsisMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  return (
    <div
      onClick={onClose}
      className=" fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide  z-50 left-0 bottom-0 justify-center items-center flex dropdown "
    >
      {/* MODAL SECTION */}

      <div className=" scrollbar-hide overflow-y-scroll max-h-[95vh]  my-auto  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto  w-full px-8  py-8 rounded-xl">
        <div className=" relative flex   justify-between w-full items-center">
          <h1 className=" text-lg">{taskDetails.title}</h1>

          <img
            onClick={() => {
              setIsElipsisMenuOpen((prevState) => !prevState);
            }}
            src={elipsis}
            alt="elipsis"
            className=" cursor-pointer h-6"
          />
          {isElipsisMenuOpen && (
            <ElipsisMenu
              setOpenEditModal={setOpenEditModal}
              setOpenDeleteModal={setOpenDeleteModal}
              type="Task"
            />
          )}
        </div>
        <p className=" text-gray-500 font-[800] tracking-wide text-sm pt-6">
          {taskDetails?.description}
        </p>

        <p className=" pt-6 text-gray-500 tracking-widest text-sm">
          Subtasks ({completed} of {subtasks.length})
        </p>

        {/* subtasks section */}

        <div className=" mt-3 space-y-2">
          {subtasks.map((subtask, index) => {
            return (
              <Subtask
                index={index}
                taskIndex={taskIndex}
                colIndex={colIndex}
                key={index}
                subtask={subtask}
                changeSubtaskStatus={changeSubtaskStatus}
              />
            );
          })}
        </div>

        {/* Current Status Section */}

        <div className="mt-8 flex flex-col space-y-3">
          <label className="  text-sm dark:text-white text-gray-500">
            Current Status
          </label>
          <select
            className=" select-status flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0  border-[1px] border-gray-300 focus:outline-[#635fc7] outline-none"
            value={status}
            onChange={onChange}
          >
            {currentBoard.columns.map((col, index) => (
              <option className="status-options" key={index}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isDeleteModalOpen && (
        <DeleteModal
          onDeleteBtnClick={onDeleteBtnClick}
          type="task"
          title={task?.title}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
        />
      )}

      {isAddTaskModalOpen && (
        <AddEditTaskModal
          setIsAddTaskModalOpen={setIsAddTaskModalOpen}
          setIsTaskModalOpen={setIsTaskModalOpen}
          type="edit"
          taskIndex={taskIndex}
          prevColIndex={colIndex}
          taskDetails={taskDetails}
        />
      )}
    </div>
  );
}

export default TaskModal;
