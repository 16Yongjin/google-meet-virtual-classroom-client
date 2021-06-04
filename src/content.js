/*global chrome*/

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import MessageDelivery from './components/MessageInteractions'
import './content.css'
import { GlobalData } from './data/global'
import { openChatTab, startChatUpdating, startVideoUpdating } from './utils'
const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

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

async function toggle() {
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

  /** 구글 미트 내 ID, 이름 정보 가져오기 */
  $('[aria-label="모두에게 표시"]').click()

  await delay(200)

  const myId =
    $('[aria-label="참여자"] [role="listitem"]')?.dataset.participantId || '나'
  const myName = $('[aria-label="참여자"] [role="listitem"] span')?.textContent

  await delay(300)

  /** 채팅창 열기 */
  openChatTab()

  /** 전역 변수 초기화 */
  GlobalData.myName = myName
  GlobalData.myId = myId

  const MD = new MessageDelivery()

  startChatUpdating(myId)((chats) => {
    GlobalData.chats = chats
  })

  startVideoUpdating((video) => {
    console.log(video)
    GlobalData.video = video
    MD.deliver('video', video)
  })

  const app = document.createElement('div')
  app.id = 'my-extension-root'
  container.appendChild(app)
  ReactDOM.render(<Main />, app)

  window.onerror = (error) => {
    console.error(error)
  }
}
