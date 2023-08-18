const calculator = {
  add: function (a, b) {
    return a + b;
  },
  subtract: function (a, b) {
    return a - b;
  },
};
const proxy = {
  get(target, property) {
    if (property === "add") {
      return function (...args) {
        console.log(`Add method called with arguments: ${args.join(", ")}`);
        return target[property](...args);
      };
    }
    return target[property];
  },
};
const proxiedCalculator = new Proxy(calculator, proxy);
console.log(proxiedCalculator.add(5, 3));
console.log(proxiedCalculator.subtract(5, 3));
