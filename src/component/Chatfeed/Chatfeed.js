import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import ScrollToBottom from "react-scroll-to-bottom"
import "./chatfeed.css"
import axios from 'axios'

function Chatfeed() {
  const { displayNameInChatFeed, socket, groupId } = useContext(AppContext)
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  const [currentMessage, setCurrentMessage] = useState("")
  const [messageList, setMessageList] = useState([])

  const saveMessage = async (messData) => {
    await axios.post("http://localhost:5000/api/groupmessage/saveMessage", messData)
  }

  const getAllMessOfAGroup = async () => {
    const messList = await axios.get("http://localhost:5000/api/groupmessage", {
      params: {
        room: groupId
      }
    })

    setMessageList(messList.data)
  }

  const sendMessage = async () => {
    const messageData = {
      room: groupId, 
      author: currentUser.username,
      message: currentMessage,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
    }

    await socket.emit("send_message", messageData)
    saveMessage(messageData)
    setMessageList((list) => [...list, messageData])
    setCurrentMessage('')
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data])
    })
  }, [socket])

  useEffect(() => {
    getAllMessOfAGroup()
  }, [groupId])

  // console.log(messageList)

  return (
    <div className='chatfeed_container'>
      <div className='chatfeed_header'>
        {displayNameInChatFeed === "" ? "Live Chat" : displayNameInChatFeed}
      </div>

      <div className='chatfeed_body'>
        <ScrollToBottom className='message-container'>
          {messageList.map((mesContent, index) => {
            return (
              groupId === mesContent.room ? (<div key={index} className='message' id={currentUser.username === mesContent.author ? 'you' : 'other'}>
                <div className='wrap_message'>
                  <div className='message-content'>
                    <p>{mesContent.message}</p>
                  </div>
                  <div className='message-meta'>
                    <p id='time'>{mesContent.time}</p>
                    <p id='author'>{mesContent.author}</p>
                  </div>
                </div>
              </div>) : ""
            )
          })}
        </ScrollToBottom>
        
      </div>
      <div className='chatfeed_footer'>
        <input className='send_message_input' type='text' placeholder='Nhập tin nhắn...'
          value={currentMessage}
          onChange={(event) => { setCurrentMessage(event.target.value) }}
          onKeyPress={(event) => { event.key === "Enter" && sendMessage() }} />
        <button className='send_message_btn' onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  )
}

export default Chatfeed