import './App.css';
import { func } from "prop-types";
import io from "socket.io-client";
import React, { useEffect,useRef } from "react";
import Chatwindow from './components/chat';



function App() {
  const [roomid, setroomid] = React.useState("");
  const [username, setusername] = React.useState("");
  const [showchat, setshowchat] = React.useState(false);
  const socketRef = useRef(); 
  useEffect(() => { 
    socketRef.current = io.connect("http://localhost:3001");
    // return () => {
    //   socketRef.current.disconnect(); // Clean up when the component unmounts
    // };
  },[])
  function joinroom() { 
    if (username !== "" && roomid !== "") { 
      socketRef.current.emit("joinroom", roomid);
      setshowchat(true);
    }
    
  }
  return (
    <div style={{
      textAlign: "center"
    }}>
      <h1>
        Live Chat App
      </h1>
      {!showchat ? (  <>
      <input type="text" placeholder="your name" name="user" onChange={(e) => setusername(e.target.value)} />
      <br />
      <br />
    
      <input type="text" placeholder="Room Id" name="room" onChange={(e) => setroomid(e.target.value)} />
      <br />
      <br />
      <button onClick={joinroom} >Join Room..</button>
      <br />
        <br />
        </>
      ):(
      <Chatwindow socket={socketRef.current } username={username} roomid={roomid} />
      )}
    </div>
  );
}

export default App
