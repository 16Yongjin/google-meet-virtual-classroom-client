/*global chrome*/

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './content.css'
import { GlobalData } from './data/global'
import { startChatUpdating, startVideoUpdating } from './utils'
const Main = () => {
  return <App />
}

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'clicked_browser_action') {
    toggle()
  }
})

function toggle() {
  const container = document.querySelector(
    '[data-allocation-index]'
  ).parentElement
  if (!container) return

  const existingApp = document.querySelector('#my-extension-root')
  if (existingApp) {
    existingApp.style.display =
      existingApp.style.display === 'none' ? 'block' : 'none'

    return
  }

  /** 채팅창 열기 */
  $('[data-tooltip="모든 사용자와 채팅"] span')?.click()

  /** 구글 미트 내 ID, 이름 정보 가져오기 */
  const myId = $('[aria-label="참여자"] [role="listitem"]')?.dataset
    .participantId
  const myName = $('[aria-label="참여자"] [role="listitem"] span')?.textContent

  /** 전역 변수 초기화 */
  GlobalData.myName = myName
  GlobalData.myId = myId

  startChatUpdating(myId)((chats) => {
    GlobalData.chats = chats
  })

  startVideoUpdating((video) => {
    console.log(video)
    GlobalData.video = video
  })

  const app = document.createElement('div')
  app.id = 'my-extension-root'
  container.appendChild(app)
  ReactDOM.render(<Main />, app)
}
