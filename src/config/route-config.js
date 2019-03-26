module.exports = {
    init(app){
        const staticRoutes = require("../routes/static");
        const topicRoutes = require("../routes/topics");
        const userRoutes = require("../routes/users");
        const postRoutes = require("../routes/posts");
        const commentRoutes = require("../routes/comments");
        const voteRoutes = require("../routes/votes");
        const favoriteRoutes = require("../routes/favorites");

        if(process.env.NODE_ENV === "test") {
            const mockAuth = require("../../spec/support/mock-auth.js");
            mockAuth.fakeIt(app);
        }

        app.use(userRoutes);
        app.use(commentRoutes);
        app.use(voteRoutes);
        app.use(favoriteRoutes);
        app.use(staticRoutes);
        app.use(topicRoutes);
        app.use(postRoutes);
    }
};