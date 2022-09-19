const axios = require("axios");

class JphPostsApi {
    constructor() {

    }
    fetchPosts() {
        return axios.get("https://jsonplaceholder.typicode.com/posts");
    }
}

module.exports = new JphPostsApi();