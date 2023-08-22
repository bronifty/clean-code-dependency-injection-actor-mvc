const handler = {
  get: function(target, property) {
    console.log(`Getting property ${property}`);
    return target[property];
  },
  set: function(target, property, value) {
    console.log(`Setting property ${property} to ${value}`);
    target[property] = value;
    return true; // indicates that the setting has been done successfully
  }
};

const pizza = { name: 'Margherita', toppings: ['tomato sauce', 'mozzarella'] };
const proxiedPizza = new Proxy(pizza, handler);

console.log(proxiedPizza.name); // Outputs "Getting property name" and "Margherita"
proxiedPizza.name = 'Pepperoni'; // Outputs "Setting property name to Pepperoni"