const axios = require("axios");

class JphCommentsApi {
    constructor() {

    }
    fetchComments() {
        return axios.get("https://jsonplaceholder.typicode.com/comments");
    }
}

module.exports = new JphCommentsApi();