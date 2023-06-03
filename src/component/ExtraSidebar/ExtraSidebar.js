import axios from 'axios'
import { BsPersonPlus } from "react-icons/bs";
import { MdOutlineSettings, MdAdd } from "react-icons/md"
import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Popup from "../Popup/Popup"
import "./extrasidebar.css"
import clsx from 'clsx'

function ExtraSidebar({ currentGroup, setRerender, rerender }) {
  const { displayNameInChatFeed, setDisplayNameInChatFeed, groupId } = useContext(AppContext)
  const [showPopup, setShowPopup] = useState(false)
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const { showWelcome, setShowWelcome } = useContext(AppContext)
  const usersOnServer = JSON.parse(sessionStorage.getItem("userOnServer"))
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [showPopupGetOut, setShowPopupGetOut] = useState(false)
  const [showPopupForAdmin, setShowPopupForAdmin] = useState(false)
  const [showInfoUserPopup, setShowInfoUserPopup] = useState(false)
  const [userPassToPopUp, setUserPassToPopUp] = useState({})
  const [addUserPopup, setAddUserPopup] = useState(false)
  const [userNotInGroup, setUserNotIngroup ] = useState([])

  const handleShowPopup = () => {
    setShowPopup(!showPopup)
  }

  const handleDeleteGroup = () => {
    axios.delete("http://localhost:5000/api/chat/group", {
      params: {
        chat_id: currentGroup._id
      }
    })
    setShowPopup(false)
    setRerender(true)
    setShowWelcome(true)
  }

  const handleGetOutGroup = async () => {
    await axios.put("http://localhost:5000/api/chat/removeFromGroup", {
      chatId: groupId,
      userId: JSON.parse(localStorage.getItem("currentUser"))._id
    })
    setRerender(true)
    setShowWelcome(true)
  }

  const handleDeleteMember = async () => {
    await axios.put("http://localhost:5000/api/chat/removeFromGroup", {
      chatId: groupId,
      userId: userPassToPopUp._id
    })
    setRerender(true)
    // setShowWelcome(true)
    setDisplayNameInChatFeed("")
    setShowInfoUserPopup(false)
  }

 
  const handleAddMemberToGroup = async () => {
    const userNotInGroup = await usersOnServer.filter((item) => !(JSON.stringify(currentGroup.users)).includes(JSON.stringify(item)))
    await setUserNotIngroup(userNotInGroup)
  }

  const hanleAddUserToGroup = async (user_id) => {
    axios.put("http://localhost:5000/api/chat/addToGroup", {
      chatId: groupId,
      userId: user_id
    })
    setRerender(true)
    setAddUserPopup(false)
  }

  return (
    <div className='extra_sidebar_container'>
      <div className='ex_sidebar_header'>
        <h1>Thông tin</h1>
        {displayNameInChatFeed === "" ? "" : <div className='info_group'>
          <img src={currentGroup.imageGroup} alt=""
            style={{ width: "45px", height: "45px", borderRadius: "50%", objectFit: "scale-down" }} />
          <div style={{
            position: "relative",
            width: "100%"
          }}>
            <h1>{currentGroup.chatName}</h1>
            <MdOutlineSettings className='setting_btn' style={{
              position: "absolute",
              top: "50%",
              right: "0",
              transform: "translateY(-50%)",
              borderRadius: "50%",
              cursor: "pointer"
            }} onClick={() => setShowAdminPanel(!showAdminPanel)} />
          </div>
        </div>}

        <div className='groupMember'>
          {/* {displayNameInChatFeed === "" ? "" : <h1>Thành viên nhóm</h1>} */}
          <details style={{ marginBottom: "12px", maxHeight: "240px", overflow: "auto" }} open={addUserPopup}>
            <summary>Thành viên nhóm</summary>
            {displayNameInChatFeed === "" ? "" : (currentGroup.users).map((user, index) => {
              return (
                <li key={index} onClick={() => {
                  setShowInfoUserPopup(!showInfoUserPopup)
                  setUserPassToPopUp(user)
                }}>
                  <div className='info_extra_container'>
                    <img src={user.pic} alt="Please Login!" />
                    <div className={user._id === currentGroup.groupAdmin ? 'admin_key' : "not_admin_key"}></div>
                    <h3>{user.username}</h3>
                  </div>
                  <button className='btn_make_friend'>Bạn bè</button>
                </li>
              )
            })}
          </details>

          <div className='add_member'>
            <button className='add_member_btn' onClick={() => {setAddUserPopup(true); handleAddMemberToGroup()}}>
              <BsPersonPlus /> Thêm thành viên
            </button>
          </div>
        </div>
        {showAdminPanel ? (<div className='adminPanel'>
          <h2>Tính năng chỉ dành cho quản trị viên</h2>
          <button className={currentGroup.groupAdmin === currentUser._id ? "btn_delete_group" : "not_admin"}
            onClick={() => handleShowPopup()}
          >Giải tán nhóm</button>
        </div>) : ""}
        <div className='extra_sidebar_footer'>
          <button className={
            clsx("btn_get_out_group", {
              "displayNone": rerender
            })
          } onClick={() => {
            if (currentGroup.groupAdmin === currentUser._id) {
              setShowPopupForAdmin(true)
            } else {
              setShowPopupGetOut(true)
            }
          }}>Rời nhóm</button>
        </div>

        <Popup trigger={showPopup} setTrigger={setShowPopup}>
          <div className='delete_popup_header'>Giải tán nhóm</div>
          <div className='delete_popup_body'>
            Mời tất cả mọi người ra khỏi nhóm và xóa tin nhắn? Nhóm đã giải tán "Không Thể" khôi phục.
          </div>
          <div className='delete_popup_footer'>
            <button className='negative_btn' onClick={() => setShowPopup(false)}>Không</button>
            <button className='positive_btn' onClick={() => handleDeleteGroup()}>Giải tán nhóm</button>
          </div>
        </Popup>

        <Popup trigger={showPopupGetOut} setTrigger={setShowPopupGetOut}>
          <div className='delete_popup_header'>Rời khỏi nhóm</div>
          <div className='delete_popup_body'>
            Bạn sẽ không thể xem lại tin nhắn trong nhóm này sau khi rời khỏi nhóm!
          </div>
          <div className='delete_popup_footer'>
            <button className='negative_btn' onClick={() => setShowPopupGetOut(false)}>Không</button>
            <button className='positive_btn' onClick={() => handleGetOutGroup()}>Rời nhóm</button>
          </div>
        </Popup>

        <Popup trigger={showPopupForAdmin} setTrigger={setShowPopupForAdmin}>
          <div className='delete_popup_header'>Rời khỏi nhóm</div>
          <div className='delete_popup_body'>
            Bạn là trưởng nhóm, hãy trao quyền admin cho thành viên trước khi rời nhóm
          </div>
          <div className='delete_popup_footer'>
            <button className='negative_btn' onClick={() => setShowPopupForAdmin(false)}>Đóng</button>
          </div>
        </Popup>

        <Popup showInfoUserPopup={showInfoUserPopup} trigger={showInfoUserPopup} setTrigger={setShowInfoUserPopup}>
          <div className='user_popup_header'>Thông tin thành viên</div>
          <div className='user_popup_body'>
            <div className='cover_image'>
              <img className='user_avate_popup' src={userPassToPopUp.pic} alt={userPassToPopUp.username} />
            </div>
            <h3>{userPassToPopUp.username}</h3>
            <p>Ngày đăng ký : {userPassToPopUp.createdAt}</p>
            <p>Email : {userPassToPopUp.email}</p>
          </div>
          <div className='delete_popup_footer'>
            <button className={
              clsx("positive_btn delete_user_from_group", {
                "isAdminActive": currentUser._id === currentGroup.groupAdmin,
                "adminDeleteHimself": currentUser._id === userPassToPopUp._id
              })
            } onClick={() => handleDeleteMember()}>Xoá khỏi nhóm</button>
            <button className='negative_btn' onClick={() => setShowInfoUserPopup(false)}>Đóng</button>
          </div>
        </Popup>

        <Popup addUserPopup={addUserPopup} trigger={addUserPopup} setTrigger={setAddUserPopup}>
          <div className='user_popup_header'>Thêm thành viên</div>

          <div className={clsx("addUserPopup_body")}>
            <ul>
              {userNotInGroup.map((user) => (
                <li>
                  <img src={user.pic} />
                  <h3>{user.username}</h3>
                  <MdAdd  style={{
                    fontSize: "26px",
                    border: "1px solid var(--border)",
                    borderRadius: "50%",
                    cursor: "pointer"
                  }} onClick={() => hanleAddUserToGroup(user._id)}/>
                </li>
              ))}
            </ul>
          </div>

          <div className='delete_popup_footer'>
            <button className='negative_btn' onClick={() => setAddUserPopup(false)}>Đóng</button>
          </div>
        </Popup>
      </div>

    </div>
  )
}

export default ExtraSidebar