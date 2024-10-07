import React from 'react'

const Loading = () => {
  return (
    <div>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="spinner-border" role="status" style={{ height: '80px' ,width:'80px' }}>
                <span className="sr-only"></span>
            </div>
        </div>
    </div>
  )
}

export default Loading