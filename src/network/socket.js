import io from 'socket.io-client'
localStorage.debug = '*'

export const socket = io.connect('http://localhost:2002')
export let id = null

/**
 *
 * @param {{
 * model: string,
 * x: number,
 * y: number,
 * z: number,
 * h: number,
 * ph: number,
 * }} data
 */
export const initSocket = (data) => {
  console.log('PlayerLocal.initSocket')
  socket.emit('init', data)
}

/**
 *
 * @param {{
 * x: number,
 * y: number,
 * z: number,
 * h: number,
 * ph: number,
 * action: number,
 * }} data
 */
export const updateSocket = (data) => {
  console.log('PlayerLocal.initSocket')
  socket.emit('update', data)
}

socket.on('connection', () => {
  console.log('connect', socket)
})

socket.on('connect', () => {
  console.log('connect', socket)
})

socket.on('connect_failed', function () {
  console.log('Connection Failed')
})

socket.on('disconnect', () => {
  console.log('disconnect')
})

socket.on('setId', (data) => {
  id = data.id
})
