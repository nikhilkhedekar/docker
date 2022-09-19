const getUsers = () => {
    document.getElementById("getUsers").addEventListener("click", () => {
        const renderUsers = fetch("http://localhost:8080/jph/users");
        console.log("users", renderUsers);
    })
}

const getPosts = () => {
    document.getElementById("getPosts").addEventListener("click", () => {
        const renderPosts = fetch("http://localhost:8080/jph/posts");
        console.log("getPosts", renderPosts);
    })
}

const getComments = () => {
    document.getElementById("getComments").addEventListener("click", () => {
        const renderComments = fetch("http://localhost:8080/jph/comments");
        console.log("getComments", renderComments);
    })
}