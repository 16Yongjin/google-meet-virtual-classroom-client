import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useKey } from 'react-use'
import { useStore } from '../store'
import { CrossIcon, IconButton } from 'evergreen-ui'
import { DoubleSide } from 'three'

export const VideoDetailView = () => {
  const expandedVideo = useStore((state) => state.expandedVideo)
  const removeExpanedVideo = useStore((state) => state.removeExpanedVideo)
  useKey('Escape', removeExpanedVideo)

  if (!expandedVideo) return null

  return (
    <>
      <Canvas style={{ backgroundColor: '#ddd' }}>
        <OrbitControls />
        <ambientLight />
        <mesh>
          <planeBufferGeometry args={[4.1, 2.4]} />
          <meshStandardMaterial side={DoubleSide}>
            {expandedVideo.autoplay && (
              <videoTexture attach="map" args={[expandedVideo]} />
            )}
          </meshStandardMaterial>
        </mesh>
      </Canvas>

      <div>
        <div className="absolute top-4 right-4">
          <IconButton
            onClick={removeExpanedVideo}
            appearance="minimal"
            icon={CrossIcon}
            iconSize={24}
          />
        </div>
      </div>
    </>
  )
}
