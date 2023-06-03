import React, { useContext, useState } from 'react'
import Chatfeed from '../component/Chatfeed/Chatfeed'
import Navbar from '../component/navbar/Navbar'
import Sidebar from '../component/sidebar/Sidebar'
import { AppContext } from '../context/AppContext'

function Home() {
  const { showWelcome, setShowWelcome } = useContext(AppContext)
  return (
    <div className='home_container'>
      {showWelcome ? (
        <>
          <Navbar />
          <Sidebar />
        </>
      ) :
        (<>
          <Navbar />
          <Sidebar />
          <Chatfeed />
        </>)}
    </div>
  )
}

export default Home