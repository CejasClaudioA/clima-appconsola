const fs = require('fs');
const axios = require('axios');

class Busquedas {
    historial = [];
    dataPath = './src/data/data.json'

    constructor() {
        this.leerData();

    }

    get historialCapitalizado() {
        return this.historial.map(lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ')

        })
    }

    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }
    get paramsWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async ciudad(lugar = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox,

            });
            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));
        } catch (error) {
            return [];
        }

    }

    async climaLugar(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon }
            });
            const resp = await instance.get();
            const { weather, main } = resp.data

            return {
                desc: weather[0].description,
                temp: main.temp,
                min: main.temp_min,
                max: main.temp_max,
            }
        } catch (error) {
            console.log('error');
        }
    }


    agregarHistorial(lugar = '') {
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }
        this.historial = this.historial.splice(0, 5);

        this.historial.unshift(lugar.toLocaleLowerCase());
        this.persistirData();
    }

    persistirData() {
        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dataPath, JSON.stringify(payload));
    }

    leerData() {
        if (!fs.existsSync(this.dataPath)) return null;

        const info = fs.readFileSync(this.dataPath, { encoding: 'utf-8' });
        if (!info) return;

        const { historial } = JSON.parse(info);
        this.historial = [...historial];
    }

}


module.exports = Busquedas;