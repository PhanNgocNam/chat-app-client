import React from 'react'
import "./welcome.css"
import robot from "../../assets/robot.gif"

function Welcome() {
  return (
    <div className='welcome_container'>
      <div className='welcome_inner'>
        <img src={robot} alt="Welcome!" />
        <h3>Chào mừng bạn đến với ALO!</h3>
      </div>
    </div>
  )
}

export default Welcome