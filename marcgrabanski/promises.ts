class AsyncData {
  constructor(initialData) {
    this.data = initialData;
    this.subscribers = [];
  }
  subscribe(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }
    this.subscribers.push(callback);
  }
  async set(key, value) {
    this.data[key] = value;
    const updates = this.subscribers.map(async (callback) => {
      await callback(key, value);
    });
    await Promise.allSettled(updates);
  }
}
const callback1 = async (key, value) => {
  console.log(`Callback 1: Key ${key} updated to ${value}`);
};
const callback2 = async (key, value) => {
  console.log(`Callback 2: Key ${key} updated to ${value}`);
};
const asyncData = new AsyncData({ pizza: 'Margherita', drinks: 'Soda' });
asyncData.subscribe(callback1);
asyncData.subscribe(callback2);
console.log('Initial data:', asyncData.data);
asyncData.set('pizza', 'Pepperoni')
asyncData.set('pizza', 'Pineapple Bacon')
console.log(' data:', asyncData.data);

// asyncData.set('pizza', 'Pepperoni').then(() => {
//   console.log('Updated data:', asyncData.data);
// });
// asyncData.set('drinks', 'Water').then(() => {
//   console.log('Updated data:', asyncData.data);
// });
