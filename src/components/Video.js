import React, { useMemo } from 'react'
import { DoubleSide } from 'three'
import { GlobalData } from '../data/global'

export const Video = () => {
  const video = useMemo(() => GlobalData.video, [GlobalData.video])

  return (
    <mesh
      onClick={() => GlobalData?.video?.play()}
      position={[1.52, 1.55, 6.6]}
      rotation={[0, -Math.PI, 0]}
    >
      <planeBufferGeometry args={[4.1, 2.4]} />
      {video && (
        <meshStandardMaterial side={DoubleSide}>
          <videoTexture attach="map" args={[video]} />
        </meshStandardMaterial>
      )}
    </mesh>
  )
}
