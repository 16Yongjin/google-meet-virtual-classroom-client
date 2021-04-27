import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Box3, Vector3 } from 'three'
import { TransformControls } from '@react-three/drei'
import { useStore } from '../../store'

/**
 * 자식 노드의 위치, 회전, 크기를 조절할 수 있는 제어 UI를 제공합니다.
 *
 * @param {{
 *  children: JSXNode,
 *  initPosition: number[]
 *  initScale: number[]
 * }} param0
 * @returns
 */
const Transformable = ({
  children,
  initPosition = [0, 1, 0],
  initScale = [1, 1, 1],
  initQuatern = [0, 0, 0, 1],
}) => {
  const transformControls = useRef()
  const cameraControl = useStore((state) => state.cameraControl)
  const [active, setActive] = useState(false)

  /**
   * 자식 노드를 마우스로 조작하는 동안 카메라가 움직이는 것을 막기 위해
   * cameraControl.enabled를 설정하는 코드인데
   * dragging-changed 이벤트가 작동을 안 함;;
   *
   */
  useEffect(() => {
    if (transformControls.current) {
      const controls = transformControls.current
      const callback = (event) => {
        console.log('control move')
        cameraControl.enabled = !event.value
      }
      controls.addEventListener('dragging-changed', callback)
      return () => controls.removeEventListener('dragging-changed', callback)
    }
  })

  /**
   * r 키 누르면 회전, t 키 누르면 위치, s 키 누르면 크기 조절할 수 있는 모드로 변경
   */
  useEffect(() => {
    const onKeydown = ({ key }) => {
      if (key === 'r') transformControls.current?.setMode('rotate')
      if (key === 't') transformControls.current?.setMode('translate')
      if (key === 'g') transformControls.current?.setMode('scale')
    }
    window.addEventListener('keypress', onKeydown)
    return () => window.removeEventListener('keypress', onKeydown)
  })

  /**
   * active일 때만 TransformControls을 보여주고, 아니면 그냥 mesh를 보여줌
   * TransformControls의 좌표계와 모델의 좌표계가 따로 놀아서
   * TransformControls의 좌표 변경을 기억하고 있다가
   * active가 아닐 때 mesh에 해당 좌표를 보여줌
   */

  // Position 동기화
  const [position, setPosition] = useState(initPosition)
  const { x: px, y: py, z: pz } =
    transformControls.current?._worldPosition || {}
  useEffect(() => {
    if (px !== undefined) setPosition([px, py, pz])
  }, [px, py, pz])

  // Scale 동기화
  const [scale, setScale] = useState(initScale)
  const { x: sx, y: sy, z: sz } = transformControls.current?._worldScale || {}
  useEffect(() => {
    if (sx !== undefined) setScale([sx, sy, sz])
  }, [sx, sy, sz])

  // Quaternion (Rotation) 동기화
  const [quaternion, setQuaternion] = useState(initQuatern)
  const { x: qx, y: qy, z: qz, w: qw } =
    transformControls.current?._worldQuaternion || {}
  useEffect(() => {
    if (qx !== undefined) setQuaternion([qx, qy, qz, qw])
  }, [qx, qy, qz, qw])

  if (!active)
    return (
      <mesh
        position={position}
        scale={scale}
        quaternion={quaternion}
        onClick={() => setActive(!active)}
      >
        {children}
      </mesh>
    )

  return (
    <TransformControls
      ref={transformControls}
      position={position}
      scale={scale}
      quaternion={quaternion}
    >
      <mesh onClick={() => setActive(!active)}>{children}</mesh>
    </TransformControls>
  )
}

export const SketchFabModel = ({ uid }) => {
  const modelUrl = `http://localhost:2002/models/${uid}/scene.gltf`
  const { scene } = useLoader(GLTFLoader, modelUrl)
  const box = useMemo(() => new Box3().setFromObject(scene.children[0]), [
    scene,
  ])

  // 모델이 1m 크기를 가질 수 있는 비율을 구합니다.
  const initialScale = useMemo(() => {
    const size = box.getSize(new Vector3())
    const maxLength = Math.max(size.x, size.y, size.z) || 0
    return 1 / maxLength
  }, [box])

  // 모델이 TransformControls의 중간에 올 수 있도록 움직입니다.
  const modelCenter = useMemo(() => {
    return box
      .getCenter(new Vector3())
      .toArray()
      .map((p) => -p * initialScale)
  }, [box, initialScale])

  return (
    <Transformable>
      <primitive
        key="model"
        position={modelCenter}
        object={scene}
        scale={initialScale}
      />
    </Transformable>
  )
}
