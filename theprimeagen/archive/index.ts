const schema = {
  name: 'string',
  age: 'number',
  address: {
    street: 'string',
    city: 'string',
    coordinates: ['number', 'number']
  }
};
const data = ['John Doe', 30, ['123 Main St', 'Some City', [52.5200, 13.4050]]];
function buildObject(schema: any, data: any): any {
  if (Array.isArray(schema)) {
    // check for array then map and call self recursively passing in index 0
    return data.map((item, index) => buildObject(schema[0], item));
  } else if (typeof schema === 'object') {
    // if object (eg schema per se and address), loop over keys and reduce (1st set of keys are name age address, 2nd are street city coords); obj is acc
    return Object.keys(schema).reduce((obj, key, index) => {
      // 1st loop looks like obj/acc ({name: result of recursive call to data with 1st index ('John Doe') }); obj[key] maintains a reference/pointer to the object whose value will be returned by the next run of buildObject, which will be simply the value 'John Doe', since it will fall through the if and else if blocks (since the value is not an array or object) 
      obj[key] = buildObject(schema[key], data[index]);
      return obj;
    }, {});
  } else {
    // 1st loop returns obj/acc = {name: 'John Doe'} (the return data; stanza is giving the return value to the key referred to in the reduce on the subsequent pass)
    return data;
  }
}
const result = buildObject(schema, data);
console.log(result);


