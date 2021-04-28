import React from 'react'

export const MenuBar = ({ children }) => {
  return (
    <div className="w-full absolute bottom-4 flex justify-center">
      {children}
    </div>
  )
}
