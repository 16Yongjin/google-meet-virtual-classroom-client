import { useFBX } from '@react-three/drei'
import { getUrl } from '../config'

export const Classroom = () => {
  const fbx = useFBX(getUrl('/assets/classroom.fbx'))

  return <primitive object={fbx} scale={0.015} />
}
