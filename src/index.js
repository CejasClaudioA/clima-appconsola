require('dotenv').config();

const { inquirerMenu, pausa, leerInput, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');



const main = async () => {
    const busquedas = new Busquedas();
    let opt;

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                const lugar = await leerInput('Ciudad: ');
                const lugares = await busquedas.ciudad(lugar)
                const id = await listarLugares(lugares);
                if (id === '0') continue;
                const lugarSel = lugares.find(l => l.id === id);

                busquedas.agregarHistorial(lugarSel.nombre);

                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng)
                console.log('\nInformación de la ciudad\n'.green);
                console.log(`Ciudad: ${lugarSel.nombre}`.cyan);
                console.log(`Lat: ${lugarSel.lat}`.cyan);
                console.log(`Lng:  ${lugarSel.lng}`.cyan);
                console.log(`Temperatura: ${clima.temp}`.cyan);
                console.log(`Minima: ${clima.min.cyan}`.cyan);
                console.log(`Maxima: ${clima.max.cyan}`.cyan);
                console.log(`Descripcion del clima: ${clima.desc}`.cyan);
                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.cyan;
                    console.log(`${idx} ${lugar}`);
                })
                break;
        }


        if (opt !== 0) await pausa();
    } while (opt !== 0) {
    }

}

main();