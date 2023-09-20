const pipe =
  (...funcs) =>
  (initialVal) =>
    funcs.reduce((acc, fun) => fun(acc), initialVal);

const curry =
  (func) =>
  (...args) => {
    if (args.length >= func.length) {
      return func.apply(null, args);
    }
    return func.bind(null, ...args);
  };

const split = curry((delimiter, string) => string.split(delimiter));
const map = curry((func, arr) => arr.map(func));
const join = curry((delimiter, arr) => arr.join(delimiter));

const util = (string) => string.toLowerCase();

const slugify = pipe(split(" "), map(util), join("-"));
console.log(slugify("Super Burger with Fries and Coke"));

const slugifyAndCall = pipe(
  split(" "),
  map(util),
  join("-")
)("YES HELLO THIS IS DOG");
console.log(slugifyAndCall);
