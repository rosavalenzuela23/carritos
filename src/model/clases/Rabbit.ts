import * as amqp from 'amqplib/callback_api';

export class RabbitEnvio {

    setUrl(url: string): RabbitEnvio {
        this.url = url;
        return this;
    }

    async connect(): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            amqp.connect(this.url, (err, connection) => {
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