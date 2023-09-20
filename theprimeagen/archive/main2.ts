import { flattenArray } from "../utils/utilsFile.js";
import { dataArr } from "../data/dataFile.js";

// console.log(dataArr.forEach(arr => flattenArray(arr)));
const flatArr = dataArr.forEach((arr) => {
  console.log(arr);
  let flattened = [];
  flattened = flattened.concat(flattenArray(arr));
  return flattened;
});
console.log(flatArr);
