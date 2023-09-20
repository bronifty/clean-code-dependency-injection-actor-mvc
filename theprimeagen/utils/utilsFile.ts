export const flattenArray = (arr) =>
  arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val),
    []
  );

export const compose =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);

export const curry =
  (fn) =>
  (...args) => {
    if (args.length >= fn.length) {
      return fn.apply(null, args);
    }
    return fn.bind(null, ...args);
  };

//usage
// const split = curry((separator, string) => string.split(separator));
// const map = curry((fn, arr) => arr.map(fn));
// const join = curry((separator, arr) => arr.join(separator));

// const lower = (str) => str.toLowerCase();

// const slugify = compose(join("-"), map(lower), split(" "));
// console.log(slugify("Super Burger"));
