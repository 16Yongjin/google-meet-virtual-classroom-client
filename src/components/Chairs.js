import { useMemo, useState } from 'react'
import MessageDelivery from './MessageInteractions'

const MD = new MessageDelivery()

export const Chair = ({ position }) => {
  const [active, setActive] = useState(false)

  return (
    <mesh
      position={position}
      scale={0.3}
      visible={active}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onClick={() => MD.deliver('sit', position)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'orange'} />
    </mesh>
  )
}

const chairStart = { x: 5.18, y: 0.5, z: 3.5 }
const chairCount = { x: 5, z: 5 }
const chairOffset = { x: -1.79, z: -1.48 }

export const Chairs = () => {
  const positions = useMemo(
    () =>
      Array.from({ length: chairCount.x }).flatMap((_, x) =>
        Array.from({ length: chairCount.z }).map((_, z) => [
          chairStart.x + chairOffset.x * x,
          chairStart.y,
          chairStart.z + chairOffset.z * z,
        ])
      ),
    []
  )

  return (
    <>
      {positions.map((position, idx) => (
        <Chair key={idx} position={position} />
      ))}
    </>
  )
}
