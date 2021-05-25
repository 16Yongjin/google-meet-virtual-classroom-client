import { throttle } from 'lodash'
import { socket } from './socket'

const data = {
  player: {},
  models: {},
}

export const updatePlayer = (player) => {
  data.player = { ...data.player, ...player }
}

export const updateModel = (model) => {
  if (!data.models[model.uuid]) {
    data.models[model.uuid] = model
  } else {
    data.models[model.uuid] = {
      ...data.models[model.uuid],
      ...model,
    }
  }
}

export const removeModel = (uuid) => {
  delete data.models[uuid]
}

export const hasModel = (uuid) => !!data.models[uuid]

export const sendData = throttle(() => {
  // console.log(data)
  socket.emit('updateData', data)
}, 40)
