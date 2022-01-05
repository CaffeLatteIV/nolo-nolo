import React, { useState } from 'react'

function Account() {
  const mail = useState('janedoe@example.com')
  return (
    <div className="container p-2">
      <div className="md-04dp mt-3 p-2 rounded">
        <div className="p-2">
          <h1>Il mio account</h1>
          <h4 className="mt-4 mb-0">Email:</h4>
          <span> { mail } </span>
          {/* add change mail and change pw */}
        </div>
      </div>
    </div>
  )
}

export default Account
