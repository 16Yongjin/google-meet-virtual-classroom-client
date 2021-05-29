import { useEffect, useState } from 'react'

const actionByKey = (key) => {
  const keys = {
    KeyW: 'moveForward',
    KeyS: 'moveBackward',
    KeyA: 'moveLeft',
    KeyD: 'moveRight',
    Space: 'jump',
    ControlLeft: 'sit',
  }

  return keys[key]
}

export const useKeyboardControls = () => {
  const [movement, setMovement] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    jump: false,
    sit: false,
    moving: false,
  })

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'TEXTAREA') return

      const action = actionByKey(e.code)
      if (action) {
        setMovement((state) => ({
          ...state,
          [action]: true,
          moving: true,
        }))
      }
    }
    const handleKeyUp = (e) => {
      if (e.target.tagName === 'TEXTAREA') return

      const action = actionByKey(e.code)
      if (action) {
        setMovement((state) => ({
          ...state,
          moving: Object.entries(state).some(
            ([k, v]) => v && k !== action && k !== 'moving'
          ),
          [action]: false,
        }))
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  })

  return movement
}
