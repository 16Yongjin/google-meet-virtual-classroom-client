import React from 'react'
import { Html } from '@react-three/drei'

export const ObjectInterface = (num) => {
    /**JH   오브젝트를 누르면 인터페이스 버튼을 띄운다.
     *      버튼의 위치는 예를 들어 6개의 버튼이 있으면 각각 0, 60, 120, 180, 240, 300도의 각도로 배치한다.
     *      인자로 지금은 숫자를 받았지만 나중에는 기능을 받아서 그 숫자를 세서 버튼을 추가할 것임.
     */
    const css_btn = { backgroundColor: "yellow", }
    const generate_btn = (n) => {
        let ret = []
        for (let i of Array(n).keys()) {
            const r = 90
            const pos_x = String(r * Math.cos(i * Math.PI * 2 / n)) + "px"
            const pos_y = String(r * Math.sin(i * Math.PI * 2 / n)) + "px"

            ret.push((<button style={{ position: "absolute", left: pos_x, top: pos_y, ...css_btn }}> BUTTON{i}</button >))
        }
        return ret
    }

    return (
        <Html>
            {generate_btn(num)}
        </Html>
    )
}