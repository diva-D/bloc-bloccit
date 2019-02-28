module.exports = {
    init(app){
        const staticRoutes = require("../routes/static");
        const topicRoutes = require("../routes/topics");
        const advertisementRoutes = require("../routes/advertisments");

        app.use(staticRoutes);
        app.use(topicRoutes);
        app.use(advertisementRoutes);
    }
};