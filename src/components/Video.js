import React, { useState } from 'react'
import { useAspect } from '@react-three/drei'
import { DoubleSide } from 'three'

export const Video = () => {
  const [x, y] = useAspect('cover', 1800, 1000)
  const [video] = useState(() => {
    const vid = document.createElement('video')
    vid.src = '/assets/video.mp4'
    vid.crossOrigin = 'Anonymous'
    vid.loop = true
    vid.play()
    return vid
  })

  return (
    <mesh
      onClick={() => video.play()}
      position={[1.52, 1.55, 6.6]}
      rotation={[0, -Math.PI, 0]}
    >
      <planeBufferGeometry args={[4.1, 2.4]} />
      <meshStandardMaterial side={DoubleSide}>
        <videoTexture attach="map" args={[video]} />
      </meshStandardMaterial>
    </mesh>
  )
}
