import React, { useState, useRef } from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Top from './components/Top.js'
import Footer from './components/Footer.js'
import GoTop from './components/GoTop.js'

import Homepage from './pages/Homepage.js'
import Login from './pages/Login.js'
import ProductPage from './pages/ProductPage.js'
import Cart from './pages/Cart.js'
import NotFound from './pages/NotFound.js'
import Orders from './pages/Orders.js'
import Account from './pages/Account.js'

function App() {
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
    }
    return setshowGoTop('goTopHidden')
  }
  // use effect
  window.addEventListener('scroll', handleVisibleButton)
  const refScrollUp = useRef()
  const handleScrollUp = () => {
    refScrollUp.current.scrollIntoView({ behaviour: 'smooth' })
  }

  return (
    <Router>
      <a className="skip-link" href="#main" ref={refScrollUp}>Passa al contenuto principale</a>
      <Top />
      <main id="main">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login isLogging />} />
          <Route path="/register" element={<Login isLogging={false} />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/productpage" element={<ProductPage />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <GoTop showGoTop={showGoTop} scrollUp={handleScrollUp} />
      <Footer />
    </Router>
  )
}

export default App
