import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useKey } from 'react-use'
import { GltfModel } from './sketchfab/Model'
import { useStore } from '../store'
import { Button, CrossIcon, IconButton } from 'evergreen-ui'

export const ModelDetailView = () => {
  const expandedModel = useStore((state) => state.expandedModel)
  const removeExpanedModel = useStore((state) => state.removeExpanedModel)
  useKey('Escape', removeExpanedModel)

  return (
    <>
      <Canvas style={{ backgroundColor: '#ddd' }}>
        <OrbitControls />
        <ambientLight />
        <GltfModel uid={expandedModel} />
      </Canvas>

      <div>
        <div className="absolute top-4 right-4">
          <IconButton
            onClick={removeExpanedModel}
            appearance="minimal"
            icon={CrossIcon}
            iconSize={24}
          />
        </div>
      </div>
    </>
  )
}
