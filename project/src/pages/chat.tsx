import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ChatInput from "../component/chatInput";
import io from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";

interface User {
  _id: string;
  username: string;
}

interface Message {
  sender: string;
  message: string;
}

function Chat() {
  const [users, setUsers] = useState<User[]>([]);
  const [originalUsers, setOriginalUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const authToken = Cookies.get("token");
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<string | null>();
  const currentUserString = localStorage.getItem("currentUser");
  const currentUser = currentUserString ? JSON.parse(currentUserString) : null;

  const socket = io("http://127.0.0.1:3000");

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    async function getUsers() {
      try {
        const response = await fetch("http://127.0.0.1:3000/api/user/allUser", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }).then((res) => res.json());

        if (response.status != 200) {
          throw new Error(`Error: ${response.status}`);
        }

        let temp = response.user;

        temp = temp.filter((id: { _id: string }) => id._id !== currentUser._id);

        setUsers(temp);
        setOriginalUsers(temp);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    getUsers();
  }, []);

  const sendMessage = (msg: string) => {
    console.log("emit");

    socket.emit("chat message", {
      sender: currentUser._id,
      recipient: otherUser,
      message: msg,
    });
  };

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  const handleInputChange = (event: { target: { value: string } }) => {
    const { value } = event.target;
    setSearchTerm(value);
    filterData(value);
  };

  const filterData = (searchTerm: string) => {
    const filteredData = originalUsers.filter((item) =>
      item.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setUsers(filteredData);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:3000/api/message/${currentUser._id}/${otherUser}`
        );

        if (response.status === 200) {
          const data = await response.json();
          setMessages(data);
        } else {
          throw new Error(`Failed to fetch messages: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (otherUser !== undefined) {
      fetchMessages();
    }
  }, [currentUser._id, otherUser]);

  const handleMessage = async (msg: string) => {
    try {
      console.log(msg, otherUser);
      const body = JSON.stringify({
        sender: currentUser._id,
        recipient: otherUser,
        message: msg,
        group: null,
      });
      sendMessage(msg);
      console.log(body);
      const response = await fetch(
        `http://127.0.0.1:3000/api/message/addMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body,
        }
      );

      if (response.status === 201) {
        // Message sent successfully, update UI or fetch messages again if needed
      } else {
        throw new Error(`Error sending message: ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <div className="box-border rounded-md flex flex-row p-6">
        <div className="w-[10%] bg-gray-200 p-2 flex flex-col gap-2 items-center">
          <Link
            to="/update"
            className="w-full flex p-4 m-2 bg-blue-500 text-white rounded-md shadow-md justify-center hover:bg-blue-600 text-nowrap"
          >
            Update User
          </Link>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          />

          <ul className="w-full">
            {users.map((user) => (
              <li key={user._id}>
                <button
                  onClick={() => setOtherUser(user._id)}
                  className={`block w-full p-2 rounded-md ${
                    otherUser === user._id ? "bg-blue-200" : "bg-slate-200"
                  }`}
                >
                  {user.username}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-orange-200 w-[80%] flex flex-col h-screen">
          <div className="w-full flex-1 overflow-auto">
            <div className="messageDisplay flex flex-col items-start justify-end h-full p-4">
              {messages.length > 1
                ? messages.map((msg, index) => {
                    return (
                      <div
                        className={`message ${
                          msg.sender === currentUser._id
                            ? "sender  self-end"
                            : "receiver"
                        } `}
                        key={index}
                      >
                        <div className="messageContent box-border rounded-lg bg-orange-50 p-2 m-2">
                          <p>{msg.message}</p>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
          <div className="w-full h-[10%] ">
            <ChatInput handleMessage={handleMessage} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
