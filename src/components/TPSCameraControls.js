import CameraControls from 'camera-controls'
import * as THREE from 'three'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'

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

    // this._trackObject = trackObject;
    // this.offset = new THREE.Vector3( 0, 1, 0 );
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

  useFrame((_, delta) => {
    controls.current.update(delta)
  })

  return (
    <tpsCameraControlsImpl
      ref={controls}
      args={[camera, trackObject, gl.domElement]}
    />
  )
}
