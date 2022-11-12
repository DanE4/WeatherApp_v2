"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDB = exports.eraseDB = exports.cityProps = exports.updateCity = exports.listCities = exports.deleteCity = exports.addCity = exports.fetchData = exports.getCity = void 0;
//request data from postgres database
var city_1 = require("./city");
var Client = require('pg').Client;
var client = new Client({
    user: 'DanE',
    host: 'SG-PostgreNoSSL-14-pgsql-master.devservers.scalegrid.io',
    database: 'weather',
    password: 'topsecret',
    port: 5432,
});
client.connect(function (err) {
    if (err)
        throw err;
    console.log("Connected!");
});
var apiKey = '3e9375c46981cc9b81782c9a5daf7f1b';
//return city object
function getCity(name) {
    var city = new city_1.City(name, 0, new Date());
    client.query("SELECT * FROM weather WHERE name = $1", [name], function (err, result, fields) {
        if (err)
            throw err;
        console.log(result);
        city.temperature = result.rows[0].temperature;
        city.time = result.rows[0].time;
    });
    return city;
}
exports.getCity = getCity;
function fetchData(city) {
    var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    var request = require('request');
    var cityObj = new city_1.City(city, 0, new Date());
    request(url, function (err, response, body) {
        if (err) {
            console.log('error:', err);
        }
        else {
            var weather = JSON.parse(body);
            var message = "It's ".concat(weather.main.temp, " degrees in ").concat(weather.name, "!");
            console.log(message);
            cityObj.temperature = weather.main.temp;
            cityObj.time = new Date();
            updateCity(cityObj);
        }
    });
    return cityObj;
}
exports.fetchData = fetchData;
function addCity(city) {
    var cityObj = fetchData(city.name);
    //check if there is already a city with the same name
    client.query("SELECT * FROM weather WHERE name = $1", [city.name], function (err, result) {
        if (err)
            throw err;
        if (result.rows.length == 0) {
            client.query("INSERT INTO weather (name, temperature, time) VALUES ($1, $2, $3)", [city.name, city.temperature, city.time], function (err, result, fields) {
                if (err)
                    throw err;
                console.log("1 record inserted");
            });
        }
        else {
            console.log("City already exists, updating");
            updateCity(cityObj);
        }
    });
}
exports.addCity = addCity;
function deleteCity(city) {
    client.query("DELETE FROM cities WHERE name = $1", [city.name], function (err) {
        if (err)
            throw err;
        console.log("1 record deleted: " + city.name);
    });
}
exports.deleteCity = deleteCity;
function listCities() {
    var list = [];
    client.query("SELECT * FROM weather", function (err, result, fields) {
        if (err)
            throw err;
        console.log(result);
        for (var i = 0; i < result.rows.length; i++) {
            var cityObj = new city_1.City(result.rows[i].name, result.rows[i].temperature, result.rows[i].time);
            list.push(cityObj);
        }
    });
    return list;
}
exports.listCities = listCities;
function updateCity(city) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            client.query("UPDATE cities SET temperature = ".concat(city.temperature, " WHERE name = '").concat(city.name, "'"), function (err) {
                if (err)
                    throw err;
                console.log("1 record updated: " + city.name);
            });
            return [2 /*return*/];
        });
    });
}
exports.updateCity = updateCity;
function cityProps(name) {
    client.query("SELECT * FROM cities WHERE name = '".concat(name, "'"), function (err, result) {
        if (err)
            throw err;
        console.log(result.rows);
    });
}
exports.cityProps = cityProps;
function eraseDB() {
    client.query("DELETE FROM cities", function (err) {
        if (err)
            throw err;
        console.log("Database erased");
    });
}
exports.eraseDB = eraseDB;
function closeDB() {
    client.end(function (err) {
        if (err)
            throw err;
        console.log("Connection to the database closed!");
    });
}
exports.closeDB = closeDB;
