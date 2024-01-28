import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Chat from "./pages/chat";
import Login from "./pages/login";
import Register from "./pages/register";
import Header from "./component/header";
import Update from "./pages/Update";

function App() {
  const currentUserString = localStorage.getItem("currentUser");
  const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
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
          <Route path="/update" element={<Update />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
