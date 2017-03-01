let memcached = require('memcached');

module.exports = () => createMencachedClient;

function createMencachedClient(){
  let client = new memcached('localhost:11211', {
      retries: 10,
      retry: 10000,
      remove: true
  });
  return client;
}