import React, { useState, useEffect, useRef } from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Top from '../components/Top'
import GoTop from '../components/GoTop'
import Homepage from '../components/Homepage'
import Login from '../components/Login'
import ProductPage from '../components/ProductPage'
import Cart from '../components/Cart'

function Dashboard () {
  // All below handles the back to top functionality
  const [scrollPosition, setScrollPosition] = useState(0)
  const [showGoTop, setshowGoTop] = useState('goTopHidden')
  const handleVisibleButton = () => {
    const position = window.pageYOffset
    setScrollPosition(position)
    if (scrollPosition > 100) {
      return setshowGoTop('goTop')
    } else {
      return setshowGoTop('goTopHidden')
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', handleVisibleButton)
  })
  const refScrollUp = useRef()
  const handleScrollUp = () => {
    refScrollUp.current.scrollIntoView({ behaviour: 'smooth' })
  }

  return (
    <>
    <Router>
      <div ref={refScrollUp} />
      <Top />
        <Routes>
          <Route path='/' element={ <Homepage /> } />
          <Route path='/login' element={ <Login /> } />
          <Route path='/product' element={ <ProductPage /> } />
          <Route path='/cart' element={ <Cart /> } />
        </Routes>
      <GoTop showGoTop={showGoTop} scrollUp={handleScrollUp}/>
      </Router>
    </>
  )
}

export default Dashboard
