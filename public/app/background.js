/*global chrome*/

const onHeadersReceived = function (details) {
  if (details.initiator !== 'https://meet.google.com') return
  console.log(details)

  for (let i = 0; i < details.responseHeaders.length; i++) {
    if (
      details.responseHeaders[i].name.toLowerCase() ===
      'content-security-policy'
    ) {
      details.responseHeaders[i].value = ''
    }
  }

  return {
    responseHeaders: details.responseHeaders,
  }
}

const onHeaderFilter = { urls: ['*://*/*'], types: ['main_frame', 'sub_frame'] }

// Send a message to the active tab
chrome.webRequest.onHeadersReceived.addListener(
  onHeadersReceived,
  onHeaderFilter,
  ['blocking', 'responseHeaders']
)

chrome.browserAction.onClicked.addListener(async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0]
    chrome.tabs.sendMessage(activeTab.id, {
      message: 'clicked_browser_action',
    })
  })
})
