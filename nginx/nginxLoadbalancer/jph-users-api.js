const axios = require("axios");

class JphUsersApi {
    constructor() {

    }
    fetchUsers() {
        return axios.get("https://jsonplaceholder.typicode.com/users");
    }
}

module.exports = new JphUsersApi();