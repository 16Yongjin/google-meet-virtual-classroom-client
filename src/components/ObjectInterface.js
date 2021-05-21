import React from 'react'
import { Html } from '@react-three/drei'

export const ObjectInterface = (props) => {
    const { btn_funcs, setActive, setTransformActive } = props
    const defaultFunctions = {
        "delete": (e) => { console.log("JH//    DELETE 아직 구현하지 못함.") },
        "cancel": (e) => { setActive(false) },
    }

    /**JH   오브젝트를 누르면 인터페이스 버튼을 띄운다. */
    const num = btn_funcs.length
    const css_btn = { backgroundColor: "yellow", }
    const generate_btn = (n) => {
        let ret = []
        for (let i of Array(n).keys()) {

            /** 버튼의 위치는 예를 들어 6개의 버튼이 있으면 각각 0, 60, 120, 180, 240, 300도의 각도로 배치한다.
             * const r = 90
             * const pos_x = String(r * Math.cos((1.5 + i * 2 / n) * Math.PI)) + "px"
             * const pos_y = String(r * Math.sin((1.5 + i * 2 / n) * Math.PI)) + "px"*/

            let name = btn_funcs[i].name
            let func = btn_funcs[i].func
            func = (func in defaultFunctions) ? defaultFunctions[func] : func

            ret.push((<button style={{ ...css_btn }} onClick={func}>{name}</button >))
        }
        return ret
    }

    const div_top = window.innerHeight / 2
    const div_left = window.innerWidth / 2
    return (
        <Html>
            {generate_btn(num)}
        </Html>
    )
}