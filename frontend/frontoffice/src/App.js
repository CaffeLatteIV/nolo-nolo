import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'

import Cookies from 'universal-cookie'
import Top from './components/Top.js'
import Footer from './components/Footer.js'
import GoTop from './components/GoTop.js'

import Homepage from './pages/Homepage.js'
import LogPage from './pages/LogPage.js'
import ProductPage from './pages/ProductPage.js'
import Receipt from './pages/Receipt.js'
import NotFound from './pages/NotFound.js'
import Orders from './pages/Orders.js'
import CategoryPage from './pages/CategoryPage.js'
import Account from './pages/Account.js'
import SearchPage from './pages/SearchPage.js'
import Payment from './pages/Payment.js'

function App() {
  const newLang = 'it'
  document.documentElement.lang = newLang
  // All below handles the back to top functionality
  const [scrollPosition, setScrollPosition] = useState(0)
  const [showGoTop, setshowGoTop] = useState('goTopHidden')
  const [isLogged, setIsLogged] = useState(false)
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
      <Top updateLogged={isLogged} />
      <main id="main">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/login" element={<LogPage isLogging setLogged={(logged) => { setIsLogged(logged) }} />} />
          <Route path="/register" element={<LogPage isLogging={false} setLogged={(logged) => { setIsLogged(logged) }} />} />
          <Route path="/product" element={<RequireAuth><ProductPage /></RequireAuth>} />
          <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
          <Route path="/receipt" element={<RequireAuth><Receipt /></RequireAuth>} />
          <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
          <Route path="/payment" element={<Payment />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <GoTop showGoTop={showGoTop} scrollUp={handleScrollUp} />
      <Footer />
    </Router>
  )
}
function RequireAuth({ children }) {
  const cookies = new Cookies()
  const auth = cookies.get('client')
  const location = useLocation()

  if (!auth) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
RequireAuth.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.object.isRequired,
}
export default App
