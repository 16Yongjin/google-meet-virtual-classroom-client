import React, { useMemo, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Box3, Vector3 } from 'three'

export const SketchFabModel = ({ uid }) => {
  const modelUrl = `http://localhost:2002/models/${uid}/scene.gltf`
  const { scene } = useLoader(GLTFLoader, modelUrl)
  const box = useMemo(() => new Box3().setFromObject(scene.children[0]), [
    scene,
  ])

  const initialScale = useMemo(() => {
    const size = box.getSize(new Vector3())
    const maxLength = Math.max(size.x, size.y, size.z) || 0
    return 1 / maxLength
  }, [box])

  const position = useMemo(() => {
    const { x, y, z } = box.getCenter(new Vector3())
    return [x, y, z].map((p) => -p * initialScale)
  }, [box, initialScale])

  const [active, setActive] = useState(false)
  return (
    <mesh position={[0, 1, 0]}>
      <primitive
        onClick={() => setActive(!active)}
        onPointerOver={() => setActive(true)}
        onPointerOut={() => setActive(false)}
        position={position}
        object={scene}
        scale={initialScale}
      />
    </mesh>
  )
}
