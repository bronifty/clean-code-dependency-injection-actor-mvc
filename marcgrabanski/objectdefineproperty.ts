const pizza = {
  _name: 'Margherita', // Internal property
};

Object.defineProperty(pizza, 'name', {
  get: function() {
    console.log(`Getting property name`);
    return this._name;
  },
  set: function(value) {
    console.log(`Setting property name to ${value}`);
    this._name = value;
  }
});

// Example usage:
console.log(pizza.name); // Outputs "Getting property name" and "Margherita"
pizza.name = 'Pepperoni'; // Outputs "Setting property name to Pepperoni"
console.log(pizza.name); // Outputs "Getting property name" and "Margherita"