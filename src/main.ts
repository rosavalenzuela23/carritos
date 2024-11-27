import { Vehiculo } from './model/Carro';
import { CMD_TYPES, CmdVehiculo } from './model/clases/CmdVehiculo';
import { RabbitEnvio } from './model/clases/Rabbit';
import prompt from 'prompt';

// configurar el carro
const v = Vehiculo.obtenerInstancia();
    v.identificador = 'carro'+Date.now();
    v.velocidad = 100;
    v.posicion = {
        x: 0,
        y: 10
    }

async function moverVehiculo() {
    prompt.get(['vx', 'vy'], (err, res) => {
        if (err) throw err;

        console.log('res: vx:%s vy:%s', res.vx, res.vy);
        const vx = Number(res.vx);
        const vy = Number(res.vy);

        Vehiculo.obtenerInstancia().mover(vx, vy);

        const actualizarVehiculo: CmdVehiculo = {
            cmd: CMD_TYPES.ACTUALIZAR,
            data: Vehiculo.obtenerInstancia().convertirADto()
        }

        // avisar al mvts que el carro se movio
        RabbitEnvio.obtenerInstancia()
        .enviarMensaje(
            'vehiculos.informacion',
            JSON.stringify(actualizarVehiculo), {
                durable: false,
                autoDelete: true
            }
        )

        // loop infinito
        moverVehiculo(); 
    });
}

RabbitEnvio.obtenerInstancia().setUrl('amqp://localhost').connect()
.then( err => {
    if (err) throw err;

    const crearVehiculo: CmdVehiculo = {
        cmd: CMD_TYPES.CREAR,
        data: Vehiculo.obtenerInstancia().convertirADto()
    } 

    //Avisarle al mvts que el vehiculo ha sido creado
    RabbitEnvio.obtenerInstancia().enviarMensaje('vehiculos.informacion', 
        JSON.stringify(crearVehiculo), {autoDelete: true, durable: false}
    )

    console.log('Canal abierto para envios!');
    prompt.start();
    moverVehiculo();
}).catch( err => {
    console.log(err);
});
