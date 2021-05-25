/*global chrome*/

import React from 'react'
import ReactDOM from 'react-dom'
import Frame, { FrameContextConsumer } from 'react-frame-component'
import App from './App'
import './content.css'

const Main = ({ myId, myName }) => {
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

  $('[data-tooltip="모든 사용자와 채팅"] span')?.click()

  const myId = $('[aria-label="참여자"] [role="listitem"]')?.dataset
    .participantId
  const myName = $('[aria-label="참여자"] [role="listitem"] span')?.textContent

  const app = document.createElement('div')
  app.id = 'my-extension-root'
  container.appendChild(app)
  ReactDOM.render(<Main myId={myId} myName={myName} />, app)
}
