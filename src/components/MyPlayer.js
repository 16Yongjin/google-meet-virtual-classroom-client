import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSphere } from '@react-three/cannon'
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { throttle } from 'lodash'
import { socket } from '../network/socket'
import { useKeyboardControls } from '../hooks/useKeyboardControls'
import { TPSCameraControls } from './TPSCameraControls'
import { Player } from './Player'
import { sendData, updatePlayer } from '../network/service'
import MessageDelivery from './MessageInteractions'
import { GlobalData } from '../data/global'

const PersistentAction = {
  SitDown: true,
  Clapping: true,
  TwistDance: true,
  Shrugging: true,
}

export const MyPlayer = ({ model }) => {
  const MD = useMemo(() => new MessageDelivery(), [])
  const { camera } = useThree() // 카메라
  // 현재 애니메이션 이름 설정
  const [actionName, setActionName] = useState('Idle')

  // 유저를 공으로 표현함
  const [player, api] = useSphere(() => ({ mass: 10, type: 'Dynamic' }))
  const velocity = useRef([0, 0, 0])
  useEffect(
    () => api.velocity.subscribe((v) => (velocity.current = v)),
    [api.velocity]
  )

  let { moveBackward, moveForward, moveLeft, moveRight, jump, sit, moving } =
    useKeyboardControls() // 키 입력

  // 서버에 데이터 처음 데이터 보내기
  const initSocket = useCallback((player, model) => {
    if (!player) return
    const { x, y, z } = player.position
    const { y: heading, x: ph } = player.rotation
    const data = {
      model,
      x,
      y,
      z,
      heading,
      ph,
      googleId: GlobalData.myId,
      username: GlobalData.myName,
    }
    updatePlayer(data)
    socket.emit('init', data)
  }, [])

  // 0.04초마다 서버에 현재 위치 정보 보냄
  const updateSocket = useCallback(
    throttle((player) => {
      if (!player) return

      const { x, y, z } = player.position
      const { y: heading, x: ph } = player.rotation
      const data = { x, y, z, heading, ph, action: actionName }
      updatePlayer(data)
    }, 40),
    [actionName]
  )

  // 현재 키보드 입력에 따라 캐릭터 위치 변경
  const move = () => {
    if (!player.current) return

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

    if (direction.x || direction.y)
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
      if (!PersistentAction[actionName] || moving)
        setActionName(moving ? 'Walk' : 'Idle')
    }

    if (moving) player.current.rotation.y = Math.atan2(direction.x, direction.z)
    else {
      const cameraDir = camera.getWorldDirection(new Vector3())
      player.current.rotation.y = Math.atan2(cameraDir.x, cameraDir.z)
    }
  }

  // 처음 시작 시 실행됨
  useEffect(() => {
    initSocket(player.current, model) // 소켓에 초기 정보 보내기
    camera.position.z *= -1 // 카메라 교실 앞에 보기

    // sit 이벤트 듣고 있기
    MD.setAction('sit', ([x, y, z]) => {
      api.position.set(x, y, z)
      setActionName('SitDown')
    })

    MD.setAction('action', (action) => setActionName(action))
  }, [])

  useFrame(() => {
    move()
    updateSocket(player.current)
    sendData()
  })

  return (
    <>
      <Player
        ref={player}
        model={model}
        action={actionName}
        username={GlobalData?.myName}
        googleId={GlobalData?.myId}
      />
      {player.current && <TPSCameraControls trackObject={player.current} />}
    </>
  )
}
