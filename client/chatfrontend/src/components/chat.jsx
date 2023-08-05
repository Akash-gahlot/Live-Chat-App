import React, { useEffect ,useMemo ,useRef} from "react";

const Chatwindow = ({ socket, username, roomid }) => { 
    const [message, setmessage] = React.useState("");
    const [messagelist, setmessagelist] = React.useState([]);
    const memoizedSocket = useMemo(() => socket, [socket]);
    const messageContainerRef = useRef();
    async function sendmessage() { 
        if (message !== "") {
           const data = { 
            message: message,
            user: username,
            room: roomid,
            time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
        }
        await socket.emit("sendmessage", data);
        setmessagelist((olddata) => [...olddata, data]);
        setmessage(""); 
        }
        
    }
    function keyhandle(e) { 
        if (e.key == "Enter") { 
            console.log("Key hit");
            e.preventDefault();
            sendmessage();
        }
    }
    const onreceivemsg = (data) => { 
        console.log(data);
            setmessagelist((oldvalue) => [...oldvalue, data]);  
    }
    useEffect(() => {
        memoizedSocket.on("receivemessage", onreceivemsg);
              
        return () => {
            memoizedSocket.off("receivemessage");
        };
            
    }, [memoizedSocket]);
    useEffect(() => {
    // Scroll to the bottom whenever a new message is added
    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  }, [messagelist]);

    return (
        <>
             <div className="chat-window">
      <div className="message-list"  ref={messageContainerRef}>
        {messagelist.map((message, index) => (
          <div key={index} className={`message ${username==message.user ? 'outgoing' : 'incoming'}`}>
            <div className="message-content">
              <div className="username">{message.user}</div>
              <div className="text">{message.message}</div>
              <div className="time">{message.time}</div>
            </div>
          </div>
        ))}
        {/* {"" && <div className="typing-message">User is typing...</div>} */}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={message}
                        onChange={(e) => setmessage(e.target.value)}
                        onKeyDown={(e)=>keyhandle(e)}
          placeholder="Type your message.."
                    />
                    &nbsp;
        <button onClick={sendmessage} >Send</button>
      </div>
    </div>
        </>
    )
}

export default Chatwindow;