import React, { useState, useEffect, useRef } from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Top from './components/Top'
import Footer from './components/Footer'
import GoTop from './components/GoTop'

import Homepage from './pages/Homepage'
import Login from './pages/Login'
import ProductPage from './pages/ProductPage'
import Cart from './pages/Cart'
import NotFound from './pages/NotFound'
import Orders from './pages/Orders'

function App () {
  const newLang = 'it'
  document.documentElement.lang = newLang
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
      <a className='skip-link' href='#main' ref={refScrollUp}>Passa al contenuto principale</a>
      <Top />
      <main id="main">
        <Routes>
          <Route path='/' element={ <Homepage /> } />
          <Route path='/login' element={ <Login isLogging /> } />
          <Route path='/register' element={ <Login isLogging={false}/> } />
          <Route path='/product' element={ <ProductPage /> } />
          <Route path='/cart' element={ <Cart /> } />
          <Route path='/productpage' element={ <ProductPage />} />
          <Route path='/orders' element={ <Orders />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      <GoTop showGoTop={showGoTop} scrollUp={handleScrollUp}/>
      <Footer />
      </Router>
    </>
  )
}

export default App
