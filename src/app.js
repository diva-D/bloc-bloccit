const express = require("express");
const app = express();

const appConfig = require("./config/route-config");
const routeConfig = require("./config/route-config");

appConfig.init();
routeConfig.init(app);

module.exports = app;