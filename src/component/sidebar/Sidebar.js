import React, { useContext, useEffect, useState } from 'react'
import axios from "axios"
import "./sidebar.css"
import { AppContext } from '../../context/AppContext'
import Search from '../search/Search'
import ExtraSidebar from '../ExtraSidebar/ExtraSidebar'
import Welcome from '../welcome/Welcome'


function Sidebar() {
  const { setDisplayNameInChatFeed, socket, setGroupId } = useContext(AppContext)
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const [listGroupChat, setListGroupChat] = useState([])
  const [currentGroup, setCurrentGroup] = useState({})
  const [rerender, setRerender] = useState(false)
  const { showWelcome, setShowWelcome } = useContext(AppContext)
  // const ]

  const handleJoinRoom = (e) => {
    socket.emit("join_room", e)
  }

  async function getAllChatGroup() {
    const list = await axios.get("http://localhost:5000/api/chat/groups", {
      params: {
        user_id: currentUser._id
      }
    })
    setListGroupChat(list.data.reverse())
  }
  useEffect(() => {
    getAllChatGroup()
  }, [rerender])

  return (
    <>
      <div className='side_bar_container'>
        <Search setRerender={setRerender} rerender={rerender} />
        <div>
          <ul>
            {listGroupChat.map((group, index) => {
              return (
                <li key={index} className='chat_group_item'
                  onClick={() => {
                    setCurrentGroup(group)
                    setDisplayNameInChatFeed(group.chatName)
                    handleJoinRoom(group._id)
                    setGroupId(group._id)
                    setRerender(false)
                    setShowWelcome(false)
                  }}>
                  <img src={group.imageGroup} />
                  <div>
                    <h3>{group.chatName}</h3>
                    <span>{group.users.length} thành viên</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      {showWelcome ? <Welcome /> : <ExtraSidebar rerender={rerender} setRerender={setRerender} currentGroup={currentGroup} />}
    </>
  )
}

export default Sidebar