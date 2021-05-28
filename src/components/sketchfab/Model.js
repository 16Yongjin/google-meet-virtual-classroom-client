import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Box3, Vector3 } from 'three'
import { TransformControls } from '@react-three/drei'
import { useStore } from '../../store'
import { removeModel, updateModel } from '../../network/service'
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils'
import { ObjectInterface } from '../ObjectInterface'
import MessageDelivery from '../MessageInteractions'

/**
 * 자식 노드의 위치, 회전, 크기를 조절할 수 있는 제어 UI를 제공합니다.
 *
 * @param {{
 *  children: JSXNode,
 *  initPosition: number[]
 *  initScale: number[]
 *  initQuatern: number[]
 * }} param0
 * @returns
 */
const Transformable = React.forwardRef(
  (
    {
      uid,
      uuid,
      children,
      initPosition = [0, 1, 0],
      initScale = [1, 1, 1],
      initQuatern = [0, 0, 0, 1],
    },
    ref
  ) => {
    const transformControls = useRef()
    const cameraControl = useStore((state) => state.cameraControl)
    const [active, setActive] = useState(false)
    const [transformActive, setTransformActive] = useState(false)
    const [transformMode, setTransformMode] = useState('translate')
    const removeSketchfabModel = useStore((state) => state.removeSketchfabModel)
    const removeModel = () => removeSketchfabModel(uuid)
    const expandModel = useStore((state) => state.expandModel)

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

    //JH    r, t, g 키로 transform하던 것을 이제 버튼으로 하도록
    useEffect(() => {
      transformControls.current?.setMode(transformMode)
    }, [transformMode])

    /**
     * active일 때만 TransformControls을 보여주고, 아니면 그냥 mesh를 보여줌
     * TransformControls의 좌표계와 모델의 좌표계가 따로 놀아서
     * TransformControls의 좌표 변경을 기억하고 있다가
     * active가 아닐 때 mesh에 해당 좌표를 보여줌
     */

    // Position 동기화
    const [position, setPosition] = useState(initPosition)
    const {
      x: px,
      y: py,
      z: pz,
    } = transformControls.current?._worldPosition || {}
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
    const {
      x: qx,
      y: qy,
      z: qz,
      w: qw,
    } = transformControls.current?._worldQuaternion || {}
    useEffect(() => {
      if (qx !== undefined) setQuaternion([qx, qy, qz, qw])
    }, [qx, qy, qz, qw])

    // 업데이트된 위치, 크기, 회전 정보를 ref에 설정함
    useEffect(() => {
      ref.current = { position, scale, quaternion }
    }, [ref, position, scale, quaternion])

    //JH    포커스 O -> 버튼 혹은 트랜스폼 인터페이스 / 포커스 X -> 3D 모델만
    if (active) {
      if (transformActive) {
        return (
          <TransformControls
            ref={transformControls}
            position={position}
            scale={scale}
            quaternion={quaternion}
          >
            <mesh onClick={() => setTransformActive(!active)}>{children}</mesh>
          </TransformControls>
        )
      } else {
        const actions = [
          //JH    테스트용으로 이름과 함수 삽입 - 각 개채마다 메서드가 정의되면 이와 같은 형태로 가져오도록 해야 함
          {
            name: '위치 변경',
            func: () => {
              setTransformActive(true)
              setTransformMode('translate')
            },
          },
          {
            name: '크기 변경',
            func: () => {
              setTransformActive(true)
              setTransformMode('scale')
            },
          },
          {
            name: '회전',
            func: () => {
              setTransformActive(true)
              setTransformMode('rotate')
            },
          },
          {
            name: '자세히 보기',
            func: () => {
              expandModel(uid)
            },
          },
          {
            name: '닫기',
            func: () => {
              setTransformActive(false)
              setActive(false)
            },
          },
        ]
        return (
          <mesh
            position={position}
            scale={scale}
            quaternion={quaternion}
            onClick={() => setActive(!active)}
          >
            {children}
            <ObjectInterface
              actions={actions}
              setActive={setActive}
              onRemove={removeModel}
            />
          </mesh>
        )
      }
    } else {
      return (
        <mesh
          position={position}
          scale={scale}
          quaternion={quaternion}
          onClick={() => {
            setActive(!active)
            setTransformActive(false)
          }}
        >
          {children}
        </mesh>
      )
    }
  }
)

export const SketchfabModel = ({ uuid, uid }) => {
  const modelUrl = `http://localhost:2002/models/${uid}/scene.gltf`
  const { scene } = useLoader(GLTFLoader, modelUrl)
  const object = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const box = useMemo(
    () => new Box3().setFromObject(object.children[0]),
    [object]
  )
  const transformControl = useRef()

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

  const updateModelData = useCallback(() => {
    if (!transformControl.current) return

    const { position, scale, quaternion } = transformControl.current
    const data = { uuid, uid, position, scale, quaternion }
    updateModel(data)
  })

  useEffect(() => {
    return () => removeModel(uuid)
  }, [])

  useFrame(() => {
    updateModelData()
  })

  return (
    <Transformable uuid={uuid} uid={uid} ref={transformControl}>
      <primitive
        key="model"
        position={modelCenter}
        object={scene}
        scale={initialScale}
      />
    </Transformable>
  )
}

export const GltfModel = ({ uid, position, scale, quaternion }) => {
  const modelUrl = `http://localhost:2002/models/${uid}/scene.gltf`
  const { scene } = useLoader(GLTFLoader, modelUrl)
  const object = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const box = useMemo(
    () => new Box3().setFromObject(object.children[0]),
    [object]
  )
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
    <mesh position={position} scale={scale} quaternion={quaternion}>
      <primitive
        key="model"
        object={object}
        position={modelCenter}
        scale={initialScale}
      />
    </mesh>
  )
}

export const StaticModel = ({ uuid, uid, position, scale, quaternion }) => {
  const modelUrl = `http://localhost:2002/models/${uid}/scene.gltf`
  const { scene } = useLoader(GLTFLoader, modelUrl)
  const [active, setActive] = useState(false)
  const object = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const box = useMemo(
    () => new Box3().setFromObject(object.children[0]),
    [object]
  )
  const MD = useMemo(() => new MessageDelivery(), [])
  const removeStaticModel = useStore((state) => state.removeStaticModel)
  const expandModel = useStore((state) => state.expandModel)

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

  const actions = [
    //JH    테스트용으로 이름과 함수 삽입 - 각 개채마다 메서드가 정의되면 이와 같은 형태로 가져오도록 해야 함
    {
      name: '앉기',
      func: () => {
        MD.deliver('sit', position)
        setActive(false)
      },
    },
    {
      name: '자세히 보기',
      func: () => {
        expandModel(uid)
        setActive(false)
      },
    },
  ]

  const removeModel = () => removeStaticModel(uuid)

  return (
    <mesh position={position} scale={scale} quaternion={quaternion}>
      <primitive
        key="model"
        object={object}
        position={modelCenter}
        scale={initialScale}
        onClick={() => setActive(!active)}
        onContextMenu={() => setActive(!active)}
      ></primitive>
      {active && (
        <ObjectInterface
          actions={actions}
          setActive={setActive}
          onRemove={removeModel}
        />
      )}
    </mesh>
  )
}
