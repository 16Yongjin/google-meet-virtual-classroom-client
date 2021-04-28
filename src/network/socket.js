import io from 'socket.io-client'

export const socket = io.connect('http://localhost:2002')
export let id = null

socket.on('setId', (data) => {
  id = data.id
})
