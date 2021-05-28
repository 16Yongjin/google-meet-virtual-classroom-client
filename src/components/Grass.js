import React, { useMemo } from 'react'
import grass from '../textures/grass.jpg'
import {
  TextureLoader,
  RepeatWrapping,
  NearestFilter,
  LinearMipMapLinearFilter,
} from 'three'

export const Grass = (props) => {
  const texture = useMemo(() => {
    const texture = new TextureLoader().load(grass)
    texture.magFilter = NearestFilter
    texture.minFilter = LinearMipMapLinearFilter
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(100, 100)

    return texture
  }, [])

  return (
    <mesh
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.04, 0]}
    >
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial map={texture} attach="material" />
    </mesh>
  )
}
