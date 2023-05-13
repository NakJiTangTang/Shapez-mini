class Subject {
    constructor(){this.observers=[]; }
  
    subscribe (observer){
        if (observer) this.observers.push(observer);
    }
    unsubscribeAll(){
        this.observers=[];
    }
    unsubscribe(observer){
        this.observers=this.observers.filter(o => o != observer);
    }
    notifySubscribers(source, ...others){
        for (const observer of this.observers){
            observer.update(source, ...others);
        } 
    }
  }
  
  export { Subject };