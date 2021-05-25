/* global chrome*/

export const getUrl =
  process.env.NODE_ENV === 'production' ? chrome.runtime.getURL : (v) => v
