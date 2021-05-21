class MessageBroker{
    constructor(){
        this.members=[]
    }
    setMember(target){
        this.members.push(target)
    }
    trigger(keyword, data){
        for (let i=0;i<this.members.length;i++){
            this.members[i].get(keyword, data)
        }
    }
}
const MB=new MessageBroker()

export default class MessageDelivery{
    constructor(){
        MB.setMember(this)
        this.actions={}
    }
    setAction(keyword, action){
        this.actions[keyword]=action
    }
    deliver(keyword, data={}){       //브로커에 메세지를 전달한다.
        MB.trigger(keyword, data)
    }
    get(keyword, data){
        if(keyword in this.actions){
            this.actions[keyword](data)
        }
    }
}