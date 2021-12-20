import React from 'react'

function backToTop () {
  document.body.scrollTop = 0 // For Safari
  document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
}
function ToTopButton () {
  const mybutton = document.querySelector('.backToTopBtn')
  window.onscroll = function () { scrollFunction() }
  function scrollFunction () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      // Show button
      mybutton.classList.add('showBackToTopBtn')
    } else {
      // Hide button
      mybutton.classList.remove('showBackToTopBtn')
    }
  }
  return (
        <div>
            <button onClick={backToTop()} className="backToTopBtn" title="Go to top">
                <span className="material-icons">arrow_upward</span>
            </button>
        </div>
  )
}

export default ToTopButton
