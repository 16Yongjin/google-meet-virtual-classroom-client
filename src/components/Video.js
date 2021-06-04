import React, { useEffect, useMemo, useState } from 'react'
import { DoubleSide } from 'three'
import { GlobalData } from '../data/global'
import MessageDelivery from './MessageInteractions'

export const Video = () => {
  const [video, setVideo] = useState(null)
  const MD = useMemo(() => new MessageDelivery(), [])
  useEffect(() => {
    MD.setAction('video', (video) => setVideo(video))
  }, [])

  if (!video)
    return (
      <mesh
        onClick={() => GlobalData?.video?.play()}
        position={[1.52, 1.55, 6.6]}
        rotation={[0, -Math.PI, 0]}
      >
        <planeBufferGeometry args={[4.1, 2.4]} />
      </mesh>
    )

  return (
    <mesh
      onClick={() => GlobalData?.video?.play()}
      position={[1.52, 1.55, 6.6]}
      rotation={[0, -Math.PI, 0]}
    >
      <planeBufferGeometry args={[4.1, 2.4]} />
      <meshStandardMaterial side={DoubleSide}>
        {video.autoplay && <videoTexture attach="map" args={[video]} />}
      </meshStandardMaterial>
    </mesh>
  )
}
