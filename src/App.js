import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
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
import { SketchFabSearch } from './components/sketchfab/Search'
import { SketchFabModel } from './components/sketchfab/Model'
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  const model = useMemo(getRandomCharacter, [])
  const [remoteData, setRemoteData] = useState([])
  useEffect(() => socket.on('remoteData', setRemoteData), [])
  const clap = useStore((state) => state.clap)
  const sketchfabModels = useStore((state) => state.sketchfabModels)

  return (
    <>
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
        {remoteData
          .filter((data) => data.id !== id)
          .map((data) => (
            <Suspense fallback={null}>
              <Player key={data.id} {...data} />
            </Suspense>
          ))}
        {sketchfabModels.map((uid) => (
          <ErrorBoundary
            key={uid}
            fallback={<mesh>Could not fetch model.</mesh>}
          >
            <Suspense fallback={null}>
              <SketchFabModel key={uid} uid={uid} />
            </Suspense>
          </ErrorBoundary>
        ))}
      </Canvas>
      <MenuBar>
        <EmotionButton text={'👏'} onClick={clap} />
        <SketchFabSearch />
      </MenuBar>
    </>
  )
}

export default App
