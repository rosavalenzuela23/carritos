import { Carga } from "./Carga";
import { Posicion } from "./clases/Posicion";

export class Vehiculo {

    public posicion: Posicion;
    public carga: Carga;
    public identificador: string;
    public velocidad: number;
    private static instance: Vehiculo = undefined;

    static obtenerInstancia(): Vehiculo {
        if(Vehiculo.instance === undefined) {
            Vehiculo.instance = new Vehiculo();
        }
        
        return Vehiculo.instance;
    }


    private constructor() {}

    mover(vx: number, vy: number) {
        this.posicion.x += this.velocidad * vx;
        this.posicion.y += this.velocidad * vy;
    }

    convertirADto(): any {
        const aux: any = {};
        aux['posicion'] = {
            x: Vehiculo.instance.posicion.x,
            y: Vehiculo.instance.posicion.y
        } 

        aux['identificador'] = Vehiculo.instance.identificador;

        //falta agregarle mas cosas 

        return aux;
    }

}