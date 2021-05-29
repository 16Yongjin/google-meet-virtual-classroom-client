const NO_PRESENTATION_QUERY = '[aria-label="발표 시작"]'
const MY_PRESENTATION_QUERY = '[aria-label="본인이 발표 중입니다"]'
const [NO_VIDEO, MY_VIDEO, OTHER_VIDEO] = [0, 1, 2]

/**
 * 쿼리한 돔 요소 중 가장 큰 요소 가져오기
 *
 * @param {string} query
 */
const queryBiggest = (query) => {
  let maxELement = null
  let maxSize = 0
  for (let element of document.querySelectorAll(query)) {
    const size = element.offsetHeight * element.offsetWidth
    if (maxSize < size) {
      maxSize = size
      maxELement = element
    }
  }
  return maxELement
}

/**
 * 발표 중인 비디오 요소 가져오기
 *
 * @returns {HTMLVideoElement | null}
 */
export const getVideo = () => {
  if (document.querySelector(NO_PRESENTATION_QUERY)) {
    console.log('발표중지')
    return null
  }

  if (document.querySelector(MY_PRESENTATION_QUERY)) {
    console.log('본인이 발표 중입니다')
    return document.querySelector('video')
  }

  console.log('상대방이 발표중입니다')
  return queryBiggest('video')
}

export const startVideoUpdating = (callback) => {
  let state = NO_VIDEO

  const checkVideo = () => {
    let newState = state
    if (document.querySelector(NO_PRESENTATION_QUERY)) {
      newState = NO_VIDEO
    } else if (document.querySelector(MY_PRESENTATION_QUERY)) {
      newState = MY_VIDEO
    } else {
      newState = OTHER_VIDEO
    }

    if (state !== newState) {
      state = newState
      callback(getVideo())
    }
  }

  const timer = setInterval(checkVideo, 1000)

  return () => clearInterval(timer)
}
