import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { Ground } from './components/Ground'
import { Classroom } from './components/Classroom'
import { MyPlayer } from './components/MyPlayer'
import { id, socket } from './network/socket'
import { Player } from './components/Player'
import { getRandomCharacter } from './data/characters'
import { EmotionButton } from './components/EmotionBar'
import { useStore } from './store'
import { Video } from './components/Video'
import { MenuBar } from './components/MenuBar'
import { SketchfabSearch } from './components/sketchfab/Search'
import {
  GltfModel,
  SketchfabModel,
  StaticModel,
} from './components/sketchfab/Model'
import { ErrorBoundary } from './components/ErrorBoundary'
import { hasModel } from './network/service'
import { ModelDetailView } from './components/ModelDetailView'

function App() {
  const model = useMemo(getRandomCharacter, [])
  const [remoteData, setRemoteData] = useState({ players: [], models: [] })
  useEffect(() => socket.on('remoteData', setRemoteData), [])
  const clap = useStore((state) => state.clap)
  const staticModels = useStore((state) => state.staticModels)
  const sketchfabModels = useStore((state) => state.sketchfabModels)
  const expandedModel = useStore((state) => state.expandedModel)

  return (
    <>
      {expandedModel && <ModelDetailView />}
      <Canvas>
        <Sky distance={450000} />
        <ambientLight />
        <Suspense fallback={null}>
          <Classroom />
        </Suspense>
        <Video />
        <Physics>
          <Ground position={[0, -1, 0]} />
          <MyPlayer model={model} />
        </Physics>
        {remoteData.players
          .filter((data) => data.id !== id)
          .map((data) => (
            <Suspense fallback={null}>
              <Player key={data.id} {...data} />
            </Suspense>
          ))}
        {sketchfabModels.map(({ uuid, uid }) => (
          <ErrorBoundary
            key={uuid}
            uuid={uuid}
            fallback={<mesh>Could not fetch model.</mesh>}
          >
            <Suspense fallback={null}>
              <SketchfabModel uid={uid} uuid={uuid} />
            </Suspense>
          </ErrorBoundary>
        ))}
        {remoteData.models
          .filter((model) => !hasModel(model.uuid))
          .map((model) => (
            <Suspense key={model.uuid} fallback={null}>
              <GltfModel {...model} />
            </Suspense>
          ))}
        {staticModels
          .filter((model) => !hasModel(model.uuid))
          .map((model) => (
            <Suspense key={model.uuid} fallback={null}>
              <StaticModel {...model} />
            </Suspense>
          ))}
      </Canvas>

      <MenuBar>
        <EmotionButton text={'👏'} onClick={clap} />
        <SketchfabSearch />
      </MenuBar>
    </>
  )
}

export default App
