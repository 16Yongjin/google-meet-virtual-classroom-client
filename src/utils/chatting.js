export const openChatTab = () =>
  document.querySelector('[aria-label="모든 사용자와 채팅"]')?.click()

export const getChats = (myId) => {
  const result = {}
  const chatElems = document.querySelectorAll('[data-sender-id]')
  chatElems.forEach((chat) => {
    const { senderId: _senderId, timestamp } = chat.dataset
    const text = chat.lastChild.innerText
    const senderId = _senderId === '_self_' ? myId : _senderId

    result[senderId] = {
      senderId,
      text,
      timestamp: Number(timestamp),
    }
  })

  return result
}

export const startChatUpdating = (myId) => (callback) => {
  const checkChats = () => callback(getChats(myId))

  const timer = setInterval(checkChats, 500)

  return () => clearInterval(timer)
}
