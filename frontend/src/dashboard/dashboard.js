import React, { useState, useEffect, useRef } from 'react'
// css
import './dashboard.css'
import Top from '../components/Top'
import GoTop from '../components/GoTop'
import Content from '../components/Content'

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
      <div ref={refScrollUp}> </div>
      <Top />
      <Content/>
      <GoTop showGoTop={showGoTop} scrollUp={handleScrollUp}/>
    </>
  )
}

export default Dashboard
