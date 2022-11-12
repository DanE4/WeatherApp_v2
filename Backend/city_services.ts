

//request data from postgres database
import  City from './city';
const mysql = require("mysql");
const client = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Rootpassword",
    database: "weatherapp"
});

client.connect(function(err:any) {
    if (err) throw err;
    console.log("Connected!");
});

const apiKey = '3e9375c46981cc9b81782c9a5daf7f1b';

export async function fetchData(city: string): Promise<City> {
    let url="http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    let request = require('request');
    let cityObj = new City(city, "-", "-");
    return new Promise((resolve, reject) => {
        request(url, async function (err:any, response:any, body:any) {
            if(err){
                reject(err);
            }else {
                let weather = JSON.parse(body);
                console.log(weather);
                cityObj.temperature = Math.round((weather.main.temp-273.15)*100)/100+" °C";
            
                let date=new Date();
                cityObj.time = date.getFullYear() + "-" + (date.getMonth()+1) + "-" +
                 date.getDate() + " " + date.getHours() + ":" + date.getMinutes() +
                  ":" + date.getSeconds();
                    if(date.getHours()<10){
                        cityObj.time=date.getFullYear() + "-" + (date.getMonth()+1) + "-" +
                        date.getDate() + " 0" + date.getHours() + ":" + date.getMinutes() +
                            ":" + date.getSeconds();
                    }
                    if(date.getMinutes()<10){
                        cityObj.time=date.getFullYear() + "-" + (date.getMonth()+1) + "-" +
                        date.getDate() + " " + date.getHours() + ":0" + date.getMinutes() +
                            ":" + date.getSeconds();
                    }
                    if(date.getSeconds()<10){
                        cityObj.time=date.getFullYear() + "-" + (date.getMonth()+1) + "-" +
                        date.getDate() + " " + date.getHours() + ":" + date.getMinutes() +
                            ":0" + date.getSeconds();
                    }
                console.log("It's " + cityObj.temperature + "°C in " + cityObj.name+" at: "+cityObj.time);
                if(await checkCity(cityObj.name)){
                    await updateCity(cityObj);
                }else{
                    await addCity(cityObj);
                }
                resolve(body);
            }
        });
    });
}

export async function addCity(city:City) {
    let sql = "INSERT INTO weatherdata (cityName, temperature, time) VALUES ('"+city.name+"', '"+city.temperature+"', '"+city.time+"')";
    client.query(sql, function (err:any, result:any) {
        if (err) throw err;
        console.log("1 record inserted");
    });
}


export function deleteCity(city: string) {
    
    client.query("DELETE FROM weatherdata WHERE cityName = '"+city+"'", function (err:any) {
        if (err) throw err;
        console.log("1 record deleted: "+city);
    });
}


export function listCities() {
    return new Promise((resolve, reject) => {
        client.query("SELECT * FROM weatherdata", function (err:any, result:any) {
            if (err) reject(err);
            result.forEach((element:any) => {
                fetchData(element.cityName).then((data) => {
                    client.query("UPDATE weatherdata SET temperature = '"+data.temperature+"', time = '"+
                    data.time+"' WHERE cityName = '"+data.name+"'", function (err:any, result:any) {
                        if (err) throw err;
                        console.log("1 record updated");
                    });
                });
            });
            console.log(result);
            return resolve(result);
            }
        );
    });
}

export function updateCity (city: City) {    
    client.query("UPDATE weatherdata SET temperature = '"+city.temperature+"', time = '"+city.time+
    "'WHERE cityName = '"+city.name+"'", function (err:any) {
        if (err) throw err;
        console.log("1 record updated: "+city.name);
    });
}

export function cityProps(name:string){
    client.query("SELECT * FROM weatherdata WHERE cityName = '"+name    +"'", function (err:any, result:any, fields:any) {
        if (err) throw err;
        console.log(result);
    }
    );
}

export function eraseDB() {
    client.query("DELETE FROM cities", function (err:any) {
        if (err) throw err;
        console.log("Database erased");
    });
}
export function closeDB() {
    client.end(function(err:any) {
        if (err) throw err;
        console.log("Connection to the database closed!");
    });
}
export function getCity(city: string) {
    return new Promise((resolve, reject) => {
        client.query("SELECT * FROM weatherdata WHERE cityName = '"+
        city+"'", function (err:any, result:any) {
            if (err) reject(err);
            console.log(result);
            return resolve(result);
            }
        );
    });
}

export function checkCity(city: string) {
    return new Promise((resolve, reject) => {
        client.query("SELECT * FROM weatherdata WHERE cityName = '"+
        city+"'", function (err:any, result:any) {
            if (err) reject(err);
            if(result.length==0){
                resolve(false);
            }else{
                resolve(true);
            }
            }
        );
    });
}
