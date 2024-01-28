import { FormEvent, useState } from "react";
import { IoMdSend } from "react-icons/io";

const ChatInput = (props: { handleMessage: (arg0: string) => void }) => {
  const [msg, setMsg] = useState("");

  const handelSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (msg.trim().length > 0) {
      props.handleMessage(msg.trim());
      setMsg("");
    }
  };

  return (
    <div className="emojimsgInput flex flex-row w-full">
      <form
        className="messageInputContainer flex flex-row w-[99%] p-3"
        onSubmit={(event) => handelSubmit(event)}
      >
        <input
          className="messageInput w-[95%] px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          placeholder="enter the message here"
          value={msg}
          onChange={(event) => {
            setMsg(event.target.value);
          }}
        ></input>
        <button
          className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-lg"
          type="submit"
        >
          <IoMdSend />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
