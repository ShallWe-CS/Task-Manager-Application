import React, { useState } from "react";
import crossIcon from "../assets/icon-cross.svg";
import boardsSlice from "../redux/boardsSlice";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { login } from "../redux/authSlice";

function SigninModel({ setIsSigninModalOpen, type , }) {
  const dispatch = useDispatch();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [newColumns, setNewColumns] = useState([
    { name: "Todo", tasks: [], id: uuidv4() },
    { name: "Doing", tasks: [], id: uuidv4() },
  ]);
  const [isValid, setIsValid] = useState(true);
  const board = useSelector((state) => state.boards).find(
    (board) => board.isActive
  );

  if (type === "edit" && isFirstLoad) {
    setNewColumns(
      board.columns.map((col) => {
        return { ...col, id: uuidv4() };
      })
    );
    setName(board.name);
    setIsFirstLoad(false);
  }

  const validate = () => {
    setIsValid(false);
    if (!name.trim()) {
      return false;
    }
    for (let i = 0 ; i < newColumns.length ; i++) {
      if (!newColumns[i].name.trim()) {
        return false;
      }
    }
    setIsValid(true);
    return true;
  };

  const onChange = (id, newValue) => {
    setNewColumns((prevState) => {
      const newState = [...prevState];
      const column = newState.find((col) => col.id === id);
      column.name = newValue;
      return newState;
    });
  };

  const onDelete = (id) => {
    setNewColumns((prevState) => prevState.filter((el) => el.id !== id));
  };

  const Register = async () => {
    if (type === "Signin") {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', {
        username: username,
        email: email,
        password: password
      });
    } else {
      const data = {
        username: username,
        password: password
      }
      dispatch(login(data));
    }
    setIsSigninModalOpen(false);
  }

  const onSubmit = (type) => {
    Register()
    // setIsSigninModalOpen(false);
    // if (type === "add") {
    //   dispatch(boardsSlice.actions.addBoard({ name, newColumns }));
    // } else {
    //   dispatch(boardsSlice.actions.editBoard({ name, newColumns }));
    // }
  };

  return (
    <div
      className="  fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide  z-50 left-0 bottom-0 justify-center items-center flex dropdown "
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsSigninModalOpen(false);
      }}
    >
      <div
        className=" scrollbar-hide overflow-y-scroll max-h-[95vh]  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold
       shadow-md shadow-[#364e7e1a] max-w-md mx-auto my-auto w-full px-8  py-8 rounded-xl"
      >
        <h3 className=" text-lg ">
          {type === "Signin" ? "Signin" : "Login"}
        </h3>

        {/* Task Name */}

        <div className="mt-8 flex flex-col space-y-1">
          <label className="  text-sm dark:text-white text-gray-500">
            UserName
          </label>
          <input
            className=" bg-transparent  px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1  ring-0  "
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            id="board-name-input"
          />
        </div>

        {type === "Signin" && 
        <div className="mt-8 flex flex-col space-y-1">
          <label className="  text-sm dark:text-white text-gray-500">
            Email
          </label>
          <input
            className=" bg-transparent  px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1  ring-0  "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="board-name-input"
          />
        </div>}

        <div className="mt-8 flex flex-col space-y-1">
          <label className="  text-sm dark:text-white text-gray-500">
            Password
          </label>
          <input
            className=" bg-transparent  px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1  ring-0  "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="board-name-input"
          />
        </div>

        {/* Board Columns */}

        <div className="mt-8 flex flex-col space-y-3">
          <div>
            {type === "Signin" && 
            <li onClick={() => {}}>Has Account?</li>}
            <button
              onClick={() => Register()}
              // onClick={() => {
              //   const isValid = validate();
              //   if (isValid === true) onSubmit(type);
              // }}
              className=" w-full items-center hover:opacity-70 dark:text-white dark:bg-[#635fc7] mt-8 relative  text-white bg-[#635fc7] py-2 rounded-full"
            >
              {type === "Signin" ? "Create Account" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SigninModel;
