const pubSub = {
  events: {
    // "update": [(data)=>console.log(data)]
  },
  subscribe(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  },
  publish(event, data) {
    if (this.events[event]) this.events[event].forEach(callback => callback(data));
  }
};

pubSub.subscribe('update', data => console.log(data));
pubSub.publish('update', 'Some update'); // Some update

// pubSub.publish('update', 'one two three');
// pubSub.subscribe('callback', data => console.log(data));
// pubSub.publish('callback', 'yes hello this is dog');

// pubSub.publish('update', 'this is an update to the update channel');
// pubSub.publish('update', 'test')
// pubSub.publish('update', 'publish to the update channel')