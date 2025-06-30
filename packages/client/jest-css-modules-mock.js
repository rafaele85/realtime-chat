// Mock for CSS modules in Jest tests
// Returns the class name for any property accessed on the mock object
module.exports = new Proxy({}, {
  get: function(target, property) {
    if (property === '__esModule') {
      return true;
    }
    if (property === 'default') {
      return new Proxy({}, {
        get: function(target, prop) {
          return String(prop);
        }
      });
    }
    return String(property);
  }
});