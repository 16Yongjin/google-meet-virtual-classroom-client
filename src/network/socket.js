import io from 'socket.io-client'
localStorage.debug = '*'

export const socket = io.connect('http://localhost:2002')
export let id = null

socket.on('setId', (data) => {
  id = data.id
})
