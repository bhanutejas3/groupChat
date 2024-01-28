import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Chat from "./pages/chat";
import Login from "./pages/login";
import Register from "./pages/register";
import Header from "./component/header";
import { createContext, useState } from "react";

function App() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userRole = currentUser?.role || "user";
  return (
    <>
      <BrowserRouter>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/register"
            element={userRole === "admin" ? <Register /> : <Login />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
