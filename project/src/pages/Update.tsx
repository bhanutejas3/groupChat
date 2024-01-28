import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Update() {
  const currentUserString = localStorage.getItem("currentUser");
  const currentUser = currentUserString ? JSON.parse(currentUserString) : null;

  const [username, SetUserName] = useState(currentUser.username);
  const [email, SetEmail] = useState(currentUser.email);
  const [password, SetPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const authToken = Cookies.get("token");

  const handleUpdateUser = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/api/user/updateUser`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            userId: currentUser._id,
            username,
            email,
            password,
          }),
        }
      );

      if (response.status === 200) {
        console.log(response);
        // localStorage.setItem("currentUser", JSON.stringify(response));
        navigate("/chat");
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      setMessage(error as string);
    }
  };

  return (
    <>
      <div className="box-border shadow-md flex flex-col gap-5 items-center justify-center p-6  mx-[20vw] my-[10vh] bg-yellow-50">
        <h1 className="font-bold text-4xl ">Update User</h1>
        <div className="flex flex-col items-center justify-center gap-6 h-[50vh]">
          <form onSubmit={handleUpdateUser}>
            <input
              className="w-[100%] p-3 m-2  bg-blue-100"
              type="username"
              placeholder="username"
              value={username}
              onChange={(e) => {
                SetUserName(e.target.value);
              }}
            />
            <input
              className="w-[100%] p-3 m-2  bg-blue-100"
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => {
                SetEmail(e.target.value);
              }}
            />
            <input
              className="w-[100%] p-3 m-2 bg-blue-100"
              type="password"
              placeholder="password"
              onChange={(e) => {
                SetPassword(e.target.value);
              }}
            />
            <button className="w-[100%] p-3 m-2 bg-red-200">Submit</button>
          </form>
        </div>
        <p>
          {message.length > 2 ? (
            <span className="font-semibold text-red-500">{message}</span>
          ) : (
            ""
          )}
        </p>
        <p className="capitalize text-pretty flex gap-1">
          Return to Chat
          <span className="text-cyan-400 ">
            <Link to="/chat">Chat</Link>
          </span>
        </p>
      </div>
    </>
  );
}

export default Update;
