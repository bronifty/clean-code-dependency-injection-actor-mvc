type ISchemaValue = string | number | ISchema | ISchemaArray;
type ISchema = { [key: string]: ISchemaValue };
type ISchemaArray = ISchemaValue[];
class ObjectBuilder {
  buildObject(schema: ISchema, data: any[]): any {
    if (Array.isArray(schema)) {
      return data.map((item, index) => this.buildObject(schema[0] as ISchema, item));
    } else if (typeof schema === 'object') {
      return Object.keys(schema).reduce((obj, key, index) => {
        obj[key] = this.buildObject(schema[key] as ISchema, data[index]);
        return obj;
      }, {});
    } else {
      return data;
    }
  }
}
interface IObjectBuilder {
  buildObject(schema: any, data: any[]): any;
}
class ObjectBuilderFactory {
  static createObjectBuilder(): IObjectBuilder {
    return new ObjectBuilder();
  }
}
const schema: ISchema = {
  name: 'string',
  age: 'number',
  address: {
    street: 'string',
    city: 'string',
    coordinates: ['number', 'number']
  }
};
const data = ['John Doe', 30, ['123 Main St', 'Some City', [52.5200, 13.4050]]];
async function main(){
  const objectBuilder = ObjectBuilderFactory.createObjectBuilder();
  const result = objectBuilder.buildObject(schema, data);
  console.log(result);
}
main();