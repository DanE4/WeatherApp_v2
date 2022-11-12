"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var city_1 = __importDefault(require("./city"));
var services = __importStar(require("./city_services"));
var express = require("express");
var app = express();
var port = 8080;
app.get("/hello", function (req, res) {
    res.send('Hello Weather App!');
});
app.get("/hello/:name", function (req, res) {
    res.send('Hello ' + req.params.name);
});
app.get("/add/:city", function (req, res) {
    var cityObj = services.fetchData(req.params.city);
    services.addCity(new city_1.default(cityObj.name, cityObj.temperature, cityObj.time));
    res.send("Added " + req.params.city);
});
app.listen(port, function () {
    console.log("Now listening on port http://localhost:${port}/hello/");
});
