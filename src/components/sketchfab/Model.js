import React, { Suspense } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export const SketchFabModel = ({ uid }) => {
  const modelUrl = `http://localhost:2002/models/${uid}/scene.gltf`
  const { scene } = useLoader(GLTFLoader, modelUrl)
  return <primitive object={scene} position={[0, 1, 0]} scale={0.05} />
}
