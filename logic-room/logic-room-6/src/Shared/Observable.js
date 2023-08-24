export default class Observable {
  _value = null;
  subscribers = [];
  parent = {};

  constructor(parent) {
    this.value = parent;
  }

  set value(newValue) {
    this._value = newValue;
  }

  get value() {
    return this._value;
  }

  subscribe = (func) => {
    this.subscribers.push(func);
    this.notify();
  };

  publish = () => {
    this.subscribers.forEach((handler) => {
      handler(this._value);
    });
  };
  
  notify = () => {
    this.subscribers.forEach((observer) => {
      observer(this._value);
    });
  };
}
