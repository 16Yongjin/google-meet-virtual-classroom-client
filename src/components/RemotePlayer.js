import React, { useMemo } from 'react'
import { AnimationMixer, Clock, LoopOnce, LoopRepeat } from 'three'
import { useFBX } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils'

export const RemotePlayer = ({
  id,
  model,
  action: actionName,
  x,
  y,
  z,
  heading,
}) => {
  const fbx = useFBX(model)
  const object = useMemo(() => {
    const object = SkeletonUtils.clone(fbx)
    object.animations = fbx.animations
    return object
  }, [])
  const mixer = useMemo(() => new AnimationMixer(object), [object])
  const clock = useMemo(() => new Clock())
  const action = useMemo(() => {
    mixer.stopAllAction()
    const actionClip = object.animations.find((a) =>
      a.name.endsWith(actionName)
    )
    if (!actionClip) return
    const action = mixer.clipAction(actionClip)

    action.setLoop(actionName.endsWith('SitDown') ? LoopOnce : LoopRepeat)
    action.clampWhenFinished = actionName.endsWith('SitDown')
    action.fadeIn(0.5)
    action.play()
    return action
  }, [mixer, object, actionName])

  useFrame(() => {
    mixer.update(clock.getDelta())
  })

  return (
    <>
      <primitive
        object={object}
        scale={0.005}
        position={[x, y, z]}
        rotation={[0, heading, 0]}
      ></primitive>
    </>
  )
}
