import { link } from "fs";
import City from "./city";
import * as services from "./city_services"



const express = require("express");
const app = express();              
const port = 8888;                  

//app.get in typescript
app.use(function (req:any, res:any, next:any) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
//http://localhost:8080/hello
app.get("/hello" , (req:any, res:any) => {
    res.send('Hello Weather App!');
    console.log("asd")
});

//http://localhost:8080/hello/DanE
app.get("/hello/:name", (req:any, res:any) => {
    //send back json object with name and age
    res.json({name: req.params.name, age: 20}); 
});

//http://localhost:8080/add/Budapest
app.post("/add/:city", async (req:any, res:any) => {
    console.log("Adding city: " + req.params.city);
    await services.fetchData(req.params.city);
    res.send("Added " + req.params.city);
    console.log("Added " + req.params.city);
});

//http://localhost:8080/list-cities
app.get("/list-cities", async (req:any, res:any) => {
    console.log("Listing cities...");
    let cities = await services.listCities();
    res.json(cities);
    console.log("Listing cities...done");
});

//http://localhost:8080/delete/Budapest
app.delete("/delete/:city",async (req:any, res:any) => {
    console.log("Deleting city: " + req.params.city+"...");

    await services.deleteCity(req.params.city);
    res.send("Deleted " + req.params.city);

    console.log("Deleted city: " + req.params.city);
});

//http://localhost:8080/Budapest
app.get("/:city", async (req:any, res:any) => {
    console.log("Getting city: " + req.params.city+"...");
    //not good obj
    let city = await services.getCity(req.params.city);
    res.json(city!=null?city:"City not found");
    console.log("Getting city: " + req.params.city+"...done");
});

   

app.listen(port, () => {           
    console.log("Now listening on port http://localhost:"+port+"/hello/");
});
