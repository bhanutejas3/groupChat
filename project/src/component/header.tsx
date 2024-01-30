import { Link, useNavigate } from "react-router-dom";

function Header() {
  const currentUserString = localStorage.getItem("currentUser");
  const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
  const navigate = useNavigate();

  const userRole = currentUser?.role || "user";
  const user = currentUser?.username || "";
  function handleLogout() {
    localStorage.removeItem("currentUser");
    navigate("/login");
  }

  return (
    <>
      <div className="flex flex-row bg-gray-400 items-center justify-between  p-3">
        <h1 className="text-3xl font-bold">Chat App</h1>
        <div className="flex flex-row gap-3 text-pretty text-amber-50">
          <Link to="/">Home</Link>
          {currentUser ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
          {userRole === "user" ? "" : <Link to="/register">Register</Link>}
        </div>
      </div>
    </>
  );
}

export default Header;
