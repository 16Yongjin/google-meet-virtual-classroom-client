import React, { useEffect, useMemo } from 'react'
import { AnimationMixer, LoopOnce, LoopRepeat } from 'three'
import { Html, useFBX } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils'

export const Player = React.forwardRef(
  (
    { model, action, x = 0, y = 0, z = 0, heading = 0, username = 'user' },
    ref
  ) => {
    // fbx 파일 불러오기
    const fbx = useFBX(model)
    // fbx 객체 복사해서 캐릭터 중복 시 발생하는 버그 막기
    const object = useMemo(() => {
      const object = SkeletonUtils.clone(fbx)
      object.animations = fbx.animations
      return object
    }, [])

    // 애니메이션 플레이어
    const mixer = useMemo(() => new AnimationMixer(object), [object])

    // action 변경 시 애니메이션도 변경
    const onAnimationChange = () => {
      mixer.stopAllAction()
      const actionClip = object.animations.find((a) => a.name.endsWith(action))
      if (!actionClip) return
      const _action = mixer.clipAction(actionClip)
      const loopOnce = action === 'SitDown' // 앉는 동작은 반복 ㄴㄴ
      _action.setLoop(loopOnce ? LoopOnce : LoopRepeat)
      _action.clampWhenFinished = loopOnce
      _action.fadeIn(0.5)
      _action.play()
    }
    useEffect(onAnimationChange, [mixer, object, action])

    // 박수 애니메이션 추가
    const clappingAnimation = useFBX(`/assets/anims/Clapping.fbx`)
    const addClappingAnimation = () => {
      clappingAnimation.animations[0].name = 'Clapping'
      object.animations.push(clappingAnimation.animations[0])
    }
    useEffect(addClappingAnimation, [])

    // 애니메이션 시간 경과 시켜서 움직이게 하기
    useFrame((_, delta) => mixer.update(delta))

    return (
      <primitive
        ref={ref}
        object={object}
        scale={0.005}
        position={[x, y, z]}
        rotation={[0, heading, 0]}
      >
        <Html center position={[0, 340, 0]}>
          <div style={{ userSelect: 'none' }}>{username}</div>
        </Html>
      </primitive>
    )
  }
)
