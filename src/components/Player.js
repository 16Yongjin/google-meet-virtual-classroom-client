import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSphere } from '@react-three/cannon'
import { useThree, useFrame } from '@react-three/fiber'
import { AnimationMixer, LoopOnce, LoopRepeat, Vector3 } from 'three'
import { useKeyboardControls } from '../hooks/useKeyboardControls'
import { useFBX } from '@react-three/drei'
import { socket } from '../network/socket'
import { throttle } from 'lodash'
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils'
import { TPSCameraControls } from './TPSCameraControls'

export const Player = (props) => {
  const { model } = props // 3D 캐릭터 모델 경로
  const fbx = useFBX(model) // fbx 파일 불러오기

  // 불러온 fbx 파일 복사. 캐릭터가 다른 유저와 겹쳤을 때의 버그 방지를 위함
  const object = useMemo(() => {
    const object = SkeletonUtils.clone(fbx)
    object.animations = fbx.animations
    console.log(object.animations)

    return object
  }, [fbx])
  // 애니메이션 믹서
  const mixer = useMemo(() => new AnimationMixer(object), [object])
  // 현재 애니메이션 이름 설정
  const [actionName, setActionName] = useState('Walk')
  // 애니메이션 이름 변경 시 새 애니메이션 실행시킴
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

  const { camera } = useThree() // 카메라

  // 유저를 공으로 표현함
  const [ref, api] = useSphere(() => ({
    mass: 10,
    type: 'Dynamic',
    ...props,
  }))

  const velocity = useRef([0, 0, 0])
  useEffect(() => {
    api.velocity.subscribe((v) => (velocity.current = v))
  }, [api.velocity])

  const {
    moveBackward,
    moveForward,
    moveLeft,
    moveRight,
    jump,
    sit,
  } = useKeyboardControls() // 키 입력

  // 키 입력 여부
  const isMoving = useMemo(
    () => moveBackward || moveForward || moveLeft || moveRight,
    [moveBackward, moveForward, moveLeft, moveRight]
  )

  // 서버에 데이터 처음 데이터 보내기
  const initSocket = useCallback(() => {
    const { x, y, z } = ref.current.position
    const { y: h, x: ph } = ref.current.rotation
    const data = { model, x, y, z, h, ph }
    console.log('init', data, socket)
    socket.emit('init', data)
  })

  // 0.04초마다 서버에 현재 위치 정보 보냄
  const updateSocket = useCallback(
    throttle(() => {
      if (!ref.current) return

      const { x, y, z } = ref.current.position
      const { y: h, x: ph } = ref.current.rotation
      const data = { x, y, z, h, ph, action: actionName }
      socket.emit('update', data)
    }, 40)
  )

  // 현재 키보드 입력에 따라 캐릭터 위치 변경
  const move = useCallback(() => {
    if (!ref.current) return

    const direction = new Vector3()
    const frontVector = new Vector3(
      0,
      0,
      (moveBackward ? 1 : 0) - (moveForward ? 1 : 0)
    )
    const sideVector = new Vector3(
      (moveLeft ? 1 : 0) - (moveRight ? 1 : 0),
      0,
      0
    )

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(5)
      .applyEuler(camera.rotation)

    const position = ref.current.position.clone()

    api.position.set(
      position.x + direction.x * 0.02,
      position.y,
      position.z + direction.z * 0.02
    )

    api.velocity.set(0, velocity.current[1], 0)

    if (jump && Math.abs(velocity.current[1].toFixed(2) < 0.01)) {
      const [x, y, z] = velocity.current
      api.velocity.set(x, 4, z)
    }

    if (sit) {
      console.log('sit')
      setActionName('SitDown')
    } else {
      if (actionName !== 'SitDown' || isMoving || jump)
        setActionName(isMoving ? 'Walk' : 'Idle')
    }

    if (isMoving) ref.current.rotation.y = Math.atan2(direction.x, direction.z)
    else {
      const cameraDir = camera.getWorldDirection(new Vector3())
      ref.current.rotation.y = Math.atan2(cameraDir.x, cameraDir.z)
    }
  })

  // 처음 시작 시 실행됨
  useEffect(() => {
    initSocket() // 소켓에 초기 정보 보내기

    // 다른 캐릭터와 겹치지 않게 랜덤한 위치에 서 있기
    api.position.set(Math.random() * 3, Math.random() * 3, Math.random() * 3)
  }, [])

  useFrame((state, delta) => {
    mixer.update(delta)
    move()

    updateSocket()
  })

  return (
    <>
      <primitive ref={ref} object={object} scale={0.005}></primitive>
      {ref.current && <TPSCameraControls trackObject={ref.current} />}
    </>
  )
}
