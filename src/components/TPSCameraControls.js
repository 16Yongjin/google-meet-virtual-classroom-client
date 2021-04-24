import CameraControls from 'camera-controls'
import * as THREE from 'three'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { useStore } from '../store'

CameraControls.install({ THREE })

/**
 * 3인칭 카메라 컨트롤
 *
 * trackObject를 따라다님
 */
export class TpsCameraControlsImpl extends CameraControls {
  constructor(camera, trackObject, domElement) {
    super(camera, domElement)
    this.minDistance = 0
    this.maxDistance = 30
    this.azimuthRotateSpeed = 0.3 // negative value to invert rotation direction
    this.polarRotateSpeed = -0.2 // negative value to invert rotation direction
    this.minPolarAngle = 30 * THREE.Math.DEG2RAD
    this.maxPolarAngle = 120 * THREE.Math.DEG2RAD
    this.draggingDampingFactor = 1

    this.mouseButtons.right = CameraControls.ACTION.NONE
    this.mouseButtons.middle = CameraControls.ACTION.NONE
    this.touches.two = CameraControls.ACTION.TOUCH_DOLLY
    this.touches.three = CameraControls.ACTION.TOUCH_DOLLY

    const offset = new THREE.Vector3(0, 1, 0)

    this.update = (delta) => {
      if (!trackObject?.position) return

      const x = trackObject.position.x + offset.x
      const y = trackObject.position.y + offset.y
      const z = trackObject.position.z + offset.z
      this.moveTo(x, y, z, false)
      super.update(delta)
    }
  }

  get frontAngle() {
    return this.azimuthAngle
  }
}

extend({ TpsCameraControlsImpl })

export const TPSCameraControls = ({ trackObject }) => {
  const { camera, gl } = useThree()
  const controls = useRef()
  const setCameraControl = useStore((state) => state.setCameraControl)

  useFrame((_, delta) => {
    controls.current?.update(delta)
  })

  useEffect(() => {
    setCameraControl(controls.current)
  }, [setCameraControl, controls])

  return (
    <tpsCameraControlsImpl
      ref={controls}
      args={[camera, trackObject, gl.domElement]}
    />
  )
}
