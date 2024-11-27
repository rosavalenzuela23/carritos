import { Vehiculo } from "../Carro"

export enum CMD_TYPES {
    CREAR = 'crear',
    ACTUALIZAR = 'actualizar'
}

export type CmdVehiculo = {
    cmd: CMD_TYPES,
    data: Vehiculo
}