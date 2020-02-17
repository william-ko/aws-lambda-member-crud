const axios = require('axios');

class APIBase {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
    };

    this.axios = axios.create({baseURL: this.baseUrl, headers: this.headers});
  }
}

module.exports = APIBase;
