import { createContext, useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [displayNameInChatFeed, setDisplayNameInChatFeed] = useState("");
  const [groupId, setGroupId] = useState("");
  const [usersOnServer, setUsersOnServer] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);

  const getAllUserOnServer = async () => {
    const users = await axios.get("http://localhost:5000/api/auth/users");
    setUsersOnServer(users.data);
    const usersOnServer = users.data.filter(
      (user) => user._id !== JSON.parse(localStorage.getItem("currentUser"))._id
    );
    sessionStorage.setItem("userOnServer", JSON.stringify(usersOnServer));
  };

  useEffect(() => {
    if (email !== "") {
      getAllUserOnServer();
    }
  }, [email]);

  return (
    <AppContext.Provider
      value={{
        email,
        displayNameInChatFeed,
        setEmail,
        setDisplayNameInChatFeed,
        socket,
        setGroupId,
        groupId,
        usersOnServer,
        showWelcome,
        setShowWelcome,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
