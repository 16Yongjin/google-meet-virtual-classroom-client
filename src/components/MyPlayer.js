import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSphere } from '@react-three/cannon'
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { throttle } from 'lodash'
import { useStore } from '../store'
import { socket } from '../network/socket'
import { useKeyboardControls } from '../hooks/useKeyboardControls'
import { TPSCameraControls } from './TPSCameraControls'
import { Player } from './Player'

export const MyPlayer = ({ model }) => {
  const { camera } = useThree() // 카메라

  // 현재 애니메이션 이름 설정
  const [actionName, setActionName] = useState('Idle')

  const clapping = useStore((state) => state.clapping)
  const onClap = () => clapping && setActionName('Clapping')
  useEffect(onClap, [clapping])

  // 유저를 공으로 표현함
  const [player, api] = useSphere(() => ({ mass: 10, type: 'Dynamic' }))
  const velocity = useRef([0, 0, 0])

  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [
    api.velocity,
  ])

  const {
    moveBackward,
    moveForward,
    moveLeft,
    moveRight,
    jump,
    sit,
    moving,
  } = useKeyboardControls() // 키 입력

  // 서버에 데이터 처음 데이터 보내기
  const initSocket = useCallback((player, model) => {
    const { x, y, z } = player.position
    const { y: h, x: ph } = player.rotation
    const data = { model, x, y, z, h, ph }
    socket.emit('init', data)
  })

  // 0.04초마다 서버에 현재 위치 정보 보냄
  const updateSocket = useCallback(
    throttle((player) => {
      const { x, y, z } = player.position
      const { y: h, x: ph } = player.rotation
      const data = { x, y, z, h, ph, action: actionName }
      socket.emit('update', data)
    }, 40)
  )

  // 현재 키보드 입력에 따라 캐릭터 위치 변경
  const move = useCallback(() => {
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

    const position = player.current.position.clone()

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
      setActionName('SitDown')
    } else {
      if ((actionName !== 'SitDown' && actionName !== 'Clapping') || moving)
        setActionName(moving ? 'Walk' : 'Idle')
    }

    if (moving) player.current.rotation.y = Math.atan2(direction.x, direction.z)
    else {
      const cameraDir = camera.getWorldDirection(new Vector3())
      player.current.rotation.y = Math.atan2(cameraDir.x, cameraDir.z)
    }
  })

  // 처음 시작 시 실행됨
  useEffect(() => {
    initSocket(player.current, model) // 소켓에 초기 정보 보내기
    camera.position.z *= -1 // 카메라 교실 앞에 보기
  }, [])

  useFrame(() => {
    move()
    updateSocket(player.current)
  })

  return (
    <>
      <Player ref={player} model={model} action={actionName} />
      {player.current && <TPSCameraControls trackObject={player.current} />}
    </>
  )
}
