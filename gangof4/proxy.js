const target = {
  value: 42,
};
const component = {
  render() {
    console.log(`Rendering component with value: ${this.data.value}`);
  },
  data: null, // This will be our proxy
};
function notifyCallback(prop, value) {
  console.log(`Property ${prop} has been set to ${value}`);
}
const handler = {
  get(target, prop) {
    return target[prop];
  },
  set(target, prop, value) {
    notifyCallback(prop, value);
    target[prop] = value;
    component.render();
    return true;
  },
};
component.data = new Proxy(target, handler);
component.data.value = 100;
console.log(component.data.value);
