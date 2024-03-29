import React, { useContext, useState } from "react";
import axios from "axios";
import AuthContext from '../context/AuthContext'

function SigninModel({ setIsSigninModalOpen, type }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formType, setFormType] = useState(type);
  const {loginUser, user} = useContext(AuthContext);

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
      loginUser(data);
    }
    setIsSigninModalOpen(false);
  }

  const changeFormType = () => {
    setFormType("Register");
  }

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
          {formType === "Register" ? "Register" : "Login"}
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

        {formType === "Register" && 
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

        <button onClick={() => changeFormType()}>Create Account!!!</button>

        {/* Board Columns */}
        <div className="mt-8 flex flex-col space-y-3">
          <div>
            <button
              onClick={() => Register()}
              className=" w-full items-center hover:opacity-70 dark:text-white dark:bg-[#635fc7] mt-8 relative  text-white bg-[#635fc7] py-2 rounded-full"
            >
              {formType === "Register" ? "Create Account" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SigninModel;
