const dotenv = require("dotenv");
const http = require("http");
const https = require("https");
dotenv.config();
const API_KEY = process.env.API_KEY1;
var path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


const app = express();
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());
app.use(express.static("dist"));

app.get("/", function (req, res) {
    res.sendFile("dist/index.html");
});

app.listen(8080, function () {
    console.log("Travel app: listening on port 8080!");
});

const geoUrl = "http://api.geonames.org/searchJSON";
const weatherBitUrl = "http://api.weatherbit.io/v2.0/forecast/daily";
const pixaBayUrl = "https://pixabay.com/api/";

app.post("/result", async function (req, res) {
    try {
        const geoRes = await geoNames(req.body.destination);

        const weatherRes = await weatherBit(
            geoRes.latitude,
            geoRes.longitude,
            req.body.days
        );
        console.log("Weatherbit response:", weatherRes);
        const pixaRes = await pixaBay(req.body.destination);
        console.log("Pixabay response:", pixaRes);

        const totalResponse = {
            ...geoRes,
            ...weatherRes,
            ...pixaRes,
        };
        res.send(totalResponse);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Geonames API request
const geoNames = (destination) => {
    return new Promise((resolve, reject) => {
        http
            .get(
                `${geoUrl}?q=${destination}&username=${process.env.GEO_USERNAME}`,
                (res) => {
                    let chunks = [];
                    res
                        .on("data", (d) => {
                            chunks.push(d);
                        })
                        .on("end", () => {
                            let data = Buffer.concat(chunks);
                            const geoResponse = JSON.parse(data);

                            if (geoResponse.geonames && geoResponse.geonames.length > 0) {
                                const geoObject = geoResponse.geonames[0];
                                const geoData = {
                                    longitude: geoObject.lng,
                                    latitude: geoObject.lat,
                                    countryId: geoObject.geonameId,
                                    countryName: geoObject.countryName,
                                };
                                resolve(geoData);
                            } else {
                                reject("Invalid destination");
                            }
                        });
                    res.on("error", (error) => {
                        console.log(error);
                        reject(error);
                    });
                }
            )
            .on("error", (e) => {
                console.error(e);
                reject(e);
            });
    });
};

// Weatherbit API request
const weatherBit = (lat, lon, days) => {
    return new Promise((resolve, reject) => {
        http
            .get(
                `${weatherBitUrl}?lat=${lat}&lon=${lon}&days=${days}&key=${process.env.WEATHER_KEY}`,
                (res) => {
                    let chunks = [];
                    res
                        .on("data", (d) => {
                            chunks.push(d);
                        })
                        .on("end", () => {
                            let data = Buffer.concat(chunks);
                            const weatherResponse = JSON.parse(data);

                            if (weatherResponse.data && weatherResponse.data[days - 1]) {
                                const weatherObject = weatherResponse.data[days - 1];
                                const weatherData = {
                                    description: weatherObject.weather.description,
                                    temperature: weatherObject.temp,
                                };
                                resolve(weatherData);
                            } else {
                                reject("Weather data not available for this location and date.");
                            }
                        });
                    res.on("error", (error) => {
                        console.log(error);
                        reject(error);
                    });
                }
            )
            .on("error", (e) => {
                console.error(e);
                reject(e);
            });
    });
};

// Pixabay API request
const pixaBay = (destination) => {
    return new Promise((resolve, reject) => {
        https
            .get(
                `${pixaBayUrl}?key=${process.env.PIXA_KEY}&q=${destination}&orientation=horizontal&category=travel`,
                (res) => {
                    let chunks = [];
                    res
                        .on("data", (d) => {
                            chunks.push(d);
                        })
                        .on("end", () => {
                            let data = Buffer.concat(chunks);
                            const pixaResponse = JSON.parse(data);

                            if (pixaResponse.total > 0) {
                                const pixaObject = pixaResponse.hits[0];
                                const pixaData = {
                                    imgLink: pixaObject.webformatURL,
                                    tag: pixaObject.tags,
                                    total: pixaResponse.total,
                                };
                                resolve(pixaData);
                            } else {
                                reject("No images found for this destination.");
                            }
                        });
                    res.on("error", (error) => {
                        console.log(error);
                        reject(error);
                    });
                }
            )
            .on("error", (e) => {
                console.error(e);
                reject(e);
            });
    });
};
