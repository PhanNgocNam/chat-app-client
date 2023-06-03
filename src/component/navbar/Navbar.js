import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { HiOutlineChat } from "react-icons/hi";
import { MdOutlineContacts } from "react-icons/md";
import { AiOutlineSetting } from "react-icons/ai";
import "./navbar.css"

function Navbar() {
    const currentUser  = JSON.parse(localStorage.getItem("currentUser"))
    // console.log(currentUser)

    const ic_style = {
        margin: "20px 0",
        color: "#fff",
        fontSize: "26px"
    }

    return (
        <div className='nav_bar_container'>
            <div className='avatar_container'>
                <img className='logo' src={currentUser.pic} />
            </div>
            <div className='main_nav'>
                <div className='nav_above'>
                    <HiOutlineChat style={ic_style} />
                    <MdOutlineContacts style={{ ...ic_style, fontSize: "22px" }} />
                </div>
                <div className='nav_below'>
                    <AiOutlineSetting style={{ marginBottom: "20px", color: "#fff", fontSize: "22px" }} />
                </div>
            </div>
        </div>
    )
}

export default Navbar