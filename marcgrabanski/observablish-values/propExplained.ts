// prop[key] = observable[key];  means prop is acting as the observable object instance here and it's saying the property of the observable instance key is assigned to the value of the observable at the index of key
// here is an example where prop is essentially actiing as the 'target'; this is a workaround for functions before classes were available
// const source = {
//   a: 1,
//   b: 2,
//   c: 3
// };
// const target = {};
// for (const key in source) {
//   target[key] = source[key];
// }
// console.log(target); // { a: 1, b: 2, c: 3 }

function ObservableValue() {
  this.a = 1;
  this.b = function () {
    return 2;
  };
  this.c = 3;
}

const observable = new ObservableValue();

function prop(...args) {
  // Implementation details
}

for (const key in observable) {
  if (typeof observable[key] === "function") {
    prop[key] = observable[key];
  } else {
    Object.defineProperty(prop, key, {
      get: () => observable[key],
      set: (value) => {
        observable[key] = value;
      },
    });
  }
}

console.log(prop.a); // 1
console.log(prop.b()); // 2
console.log(prop.c); // 3

prop.a = 5;
console.log(prop.a); // 5
console.log(observable.a); // 5
