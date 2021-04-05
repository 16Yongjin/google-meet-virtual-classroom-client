import { useFBX } from '@react-three/drei'
import { useState } from 'react'
import {
  DoubleSide,
  MeshBasicMaterial,
  PlaneBufferGeometry,
  VideoTexture,
} from 'three'

export const Classroom = () => {
  const fbx = useFBX('/assets/classroom.fbx')

  // const [video] = useState(() => {
  //   const vid = document.createElement('video')
  //   vid.src = '/assets/video.mp4'
  //   // vid.crossOrigin = 'Anonymous'
  //   vid.loop = true
  //   vid.play().catch(console.error)
  //   return vid
  // })

  // fbx.traverse((object) => {
  //   if (object.name === 'Blackboard') {
  //     object.geometry = new PlaneBufferGeometry(16, 9)

  //     object.material = new MeshBasicMaterial({
  //       map: new VideoTexture(video),
  //       side: DoubleSide,
  //     })

  //     object.scale.set(18, 18, 18)
  //   }
  // })

  return <primitive object={fbx} scale={0.015} />
}
