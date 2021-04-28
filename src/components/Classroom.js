import { useFBX } from '@react-three/drei'

export const Classroom = () => {
  const fbx = useFBX('/assets/classroom.fbx')

  return <primitive object={fbx} scale={0.015} />
}
