const APIBase = require('./api-base');

class RandomUserService extends APIBase {
  constructor(config) {
    super(config);
  }

  async get(query, parameters = {}) {
    return this.axios.get(query, parameters);
  }
}

module.exports = RandomUserService;
