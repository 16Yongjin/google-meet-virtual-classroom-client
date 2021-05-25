class MessageBroker {
  constructor() {
    /** @type {MessageDelivery[]} */
    this.members = []
  }

  /**
   * 메시지 대상자 추가
   * @param {MessageDelivery} target
   */
  setMember(target) {
    this.members.push(target)
  }

  /**
   * 이벤트 발생
   *
   * @param {string} keyword
   * @param {any} data
   */
  trigger(keyword, data) {
    this.members.forEach((member) => member.get(keyword, data))
  }
}

const MB = new MessageBroker()

export default class MessageDelivery {
  constructor() {
    MB.setMember(this)
    /** @type { Record<string, function>} */
    this.actions = {}
  }

  /**
   * 이벤트 리스닝
   *
   * @param {string} keyword
   * @param {function} action
   */
  setAction(keyword, action) {
    this.actions[keyword] = action
  }

  /**
   * 브로커에 메시지를 전달한다.
   *
   * @param {string} keyword
   * @param {any} data
   */
  deliver(keyword, data = {}) {
    MB.trigger(keyword, data)
  }

  /**
   * 등록된 액션 실행
   *
   * @param {string} keyword
   * @param {function} data
   */
  get(keyword, data) {
    if (keyword in this.actions) {
      this.actions[keyword](data)
    }
  }
}
