module.exports = {
    init(app){
        const staticRoutes = require("../routes/static");
        const topicRoutes = require("../routes/topics");
        const userRoutes = require("../routes/users");
        const postRoutes = require("../routes/posts");
        const commentRoutes = require("../routes/comments");

        if(process.env.NODE_ENV === "test") {
            const mockAuth = require("../../spec/support/mock-auth.js");
            mockAuth.fakeIt(app);
        }

        app.use(userRoutes);
        app.use(commentRoutes);
        app.use(staticRoutes);
        app.use(topicRoutes);
        app.use(postRoutes);
    }
};