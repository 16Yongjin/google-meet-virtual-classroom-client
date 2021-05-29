import React from 'react'
import { usePlane } from '@react-three/cannon'

export const Ground = (props) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))

  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
    </mesh>
  )
}
