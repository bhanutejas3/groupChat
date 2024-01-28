import { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

function Register() {
  const [username, SetUserName] = useState("");
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:3000/api/user/addUser", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      }).then((res) => res.json());

      if (response.status == "201") {
        console.log("User registered successfully");
        setMessage(response.message);
        Cookies.set("token", response.token);
      } else {
        console.error("Failed to register user");
        setMessage(response.message);
      }
    } catch (error) {
      setMessage(error as string);
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      <div className="box-border shadow-md flex flex-col gap-5 items-center justify-center p-6  mx-[20vw] my-[10vh] bg-yellow-50">
        <h1 className="font-bold text-4xl ">Register</h1>
        <div className="flex flex-col items-center justify-center gap-6 h-[50vh]">
          <form onSubmit={handleRegister}>
            <input
              className="w-[100%] p-3 m-2  bg-blue-100"
              type="username"
              placeholder="username"
              onChange={(e) => {
                SetUserName(e.target.value);
              }}
            />
            <input
              className="w-[100%] p-3 m-2  bg-blue-100"
              type="email"
              placeholder="email"
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
          don't have a account
          <span className="text-cyan-400 ">
            <Link to="/login">Login</Link>
          </span>
        </p>
      </div>
    </>
  );
}

export default Register;
