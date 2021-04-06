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
import { EmotionBar } from './components/EmotionBar'
import { useStore } from './store'

function App() {
  const model = useMemo(getRandomCharacter, [])
  const [remoteData, setRemoteData] = useState([])
  useEffect(() => socket.on('remoteData', setRemoteData), [])
  const clap = useStore((state) => state.clap)

  return (
    <>
      <Canvas>
        <Sky distance={450000} />
        <ambientLight />
        <Suspense fallback={<mesh>loading</mesh>}></Suspense>
        <Physics>
          <Ground position={[0, -1, 0]} />
          <MyPlayer model={model} />

          {remoteData
            .filter((data) => data.id !== id)
            .map((data) => (
              <Player key={data.id} {...data} />
            ))}

          <Classroom />
        </Physics>
      </Canvas>
      <EmotionBar text={'👏'} onClick={clap} />
    </>
  )
}

export default App
