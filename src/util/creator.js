// Takes a property (from the state) and
// returns a function that sets that property's value
const createSetter = property => (state, value) => {
  state[property] = value;
};

// Same as above but toggle
const createToggler = property => (state) => {
  state[property] = !state[property];
};

export { createSetter, createToggler };