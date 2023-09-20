// export function flattenArray(arr: any[]): any[] {
//     // Initialize the accumulator as an empty array
//     let flatArray: any[] = [];
  
//     // Iterate over each element in the input array
//     for (let i = 0; i < arr.length; i++) {
//       let element = arr[i];
  
//       // Check if the current element is an array
//       if (Array.isArray(element)) {
//         // If it is an array, flatten it recursively and append the result to the accumulator
//         let flattenedElement = flattenArray(element);
//         flatArray = flatArray.concat(flattenedElement);
//       } else {
//         // If it is not an array, append it directly to the accumulator
//         flatArray.push(element);
//       }
//     }
  
//     // Return the flattened array
//     return flatArray;
//   }
export function flattenArray(arr: any[]): any[] {
  const flatArray = arr.reduce((acc, toFlatten) => {
    if (Array.isArray(toFlatten)) {
        const flattened = flattenArray(toFlatten);
        acc = acc.concat(flattened);
    } else {
        acc = acc.concat(toFlatten)
    }
    return acc;
  }, []);
  return flatArray;
}

// let array = [1, 2, 3, 4, 5];

// let result = array.reduce((accumulator, currentValue, currentIndex, array) => {
//     // perform operation
//     return accumulator + currentValue;
// }, 0); // initial value of accumulator

// console.log(result); // Output: 15