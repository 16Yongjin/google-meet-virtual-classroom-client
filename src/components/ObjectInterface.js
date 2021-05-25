import React from 'react'
import { Html } from '@react-three/drei'
import { Menu } from 'evergreen-ui'
import { useKey } from 'react-use'

export const ObjectInterface = ({ actions, onRemove, setActive }) => {
  useKey('Escape', () => setActive(false))

  return (
    <Html style={{ backgroundColor: 'white', minWidth: '128px' }}>
      <Menu>
        <Menu.Group>
          {actions.map(({ name, func }) => (
            <Menu.Item key={name} onClick={func}>
              {name}
            </Menu.Item>
          ))}
        </Menu.Group>
        {onRemove && (
          <>
            <Menu.Divider />
            <Menu.Group>
              <Menu.Item intent="danger" onClick={onRemove}>
                삭제하기
              </Menu.Item>
            </Menu.Group>
          </>
        )}
      </Menu>
    </Html>
  )
}
