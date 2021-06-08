import React, { useEffect, useMemo, useState } from 'react'
import { DoubleSide } from 'three'
import { useStore } from '../store'
import MessageDelivery from './MessageInteractions'

export const Video = () => {
  const [video, setVideo] = useState(null)
  const MD = useMemo(() => new MessageDelivery(), [])
  useEffect(() => {
    MD.setAction('video', (video) => setVideo(video))
  }, [])

  const expandVideo = useStore((state) => state.expandVideo)

  if (!video)
    return (
      <mesh position={[1.52, 1.55, 6.6]} rotation={[0, -Math.PI, 0]}>
        <planeBufferGeometry args={[4.1, 2.4]} />
      </mesh>
    )

  return (
    <mesh
      position={[1.52, 1.55, 6.6]}
      rotation={[0, -Math.PI, 0]}
      onClick={() => expandVideo(video)}
    >
      <planeBufferGeometry args={[4.1, 2.4]} />
      <meshStandardMaterial side={DoubleSide}>
        {video.autoplay && <videoTexture attach="map" args={[video]} />}
      </meshStandardMaterial>
    </mesh>
  )
}
