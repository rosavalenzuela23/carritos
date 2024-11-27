import * as amqp from 'amqplib/callback_api';
import * as fs from 'node:fs';

const opts = {
    cert: fs.readFileSync('./llaves/client_natsu_certificate.pem'),
    key: fs.readFileSync('./llaves/client_natsu_key.pem'),
    passphrase: 'hola123',
    ca: [fs.readFileSync('./llaves/ca_certificate.pem')]
};

export class RabbitEnvio {

    setUrl(url: string): RabbitEnvio {
        this.url = url;
        return this;
    }

    async connect(): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            amqp.connect(this.url, opts, (err, connection) => {
                if (err) {
                    resolve(err);
                    return;
                };
                connection.createChannel((err1, channel) => {
                    if (err1) {
                        resolve(err1);
                        return;
                    };
                    resolve(err)
                    this.channel = channel;
                })

            })
        });


        return await promise;
    }

    private constructor() { };

    static obtenerInstancia(): RabbitEnvio {
        if (RabbitEnvio.instance === undefined) {
            RabbitEnvio.instance = new RabbitEnvio();
        }

        return RabbitEnvio.instance;
    }

    enviarMensaje(queue: string, mensaje: string, headers?: {}) {
        this.channel.assertQueue(queue, headers);
        this.channel.sendToQueue(
            queue, Buffer.from(mensaje)
        );

        console.log('mensaje enviado!');
    }

    private static instance: RabbitEnvio = undefined;
    private url: string;
    private channel: amqp.Channel | undefined;

}