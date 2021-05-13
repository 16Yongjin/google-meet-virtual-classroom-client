import React, { useEffect } from 'react'
import { Html } from '@react-three/drei'

const defaultFunctions = {
    "delete": (e) => { e.target.parentNode.hidden=true },
    "cancel": (e) => { e.target.parentNode.hidden=true },
}

export const ObjectInterface = (btn_funcs, hide) => {
    /**JH   오브젝트를 누르면 인터페이스 버튼을 띄운다.
     *      버튼의 위치는 예를 들어 6개의 버튼이 있으면 각각 0, 60, 120, 180, 240, 300도의 각도로 배치한다.
     */
    const num = btn_funcs.length
    const css_btn = { backgroundColor: "yellow", }
    const generate_btn = (n) => {
        let ret = []
        for (let i of Array(n).keys()) {
            const r = 90
            const pos_x = String(r * Math.cos((1.5 + i * 2 / n) * Math.PI)) + "px"
            const pos_y = String(r * Math.sin((1.5 + i * 2 / n) * Math.PI)) + "px"

            let name = btn_funcs[i].name
            let func = btn_funcs[i].func
            func = (func in defaultFunctions) ? defaultFunctions[func] : func

            ret.push((<button style={{ position: "absolute", left: pos_x, top: pos_y, ...css_btn }} onClick={func}>{name}</button >))
        }
        return ret
    }

    return (
        <Html hidden={hide}>
            {generate_btn(num)}
        </Html>
    )
}