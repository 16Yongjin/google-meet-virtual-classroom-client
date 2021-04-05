import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
// import { Player } from './components/Player'
import { Physics } from '@react-three/cannon'
import { Ground } from './components/Ground'

import { Classroom } from './components/Classroom'
import { Player } from './components/Player'
import { id, socket } from './network/socket'
import { RemotePlayer } from './components/RemotePlayer'
import { getRandomCharacter } from './data/characters'

function App() {
  const [remoteData, setRemoteData] = useState([])

  const model = useMemo(getRandomCharacter, [])

  useEffect(() => {
    socket.on('remoteData', (data) => setRemoteData(data))
  }, [])

  return (
    <Canvas>
      <Sky distance={450000} />
      <ambientLight />
      <Suspense fallback={<mesh>loading</mesh>}></Suspense>
      <Physics>
        <Ground position={[0, -1, 0]} />
        <Player key="me" model={model} />

        {remoteData
          .filter((data) => data.id !== id)
          .map((data) => (
            <RemotePlayer key={data.id} {...data} />
          ))}

        <Classroom />
      </Physics>
    </Canvas>
  )
}

export default App
