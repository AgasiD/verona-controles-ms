import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as uuid from 'uuid'

import { MyResponse } from '../../common/entities/httpResponse.entity';
import { TareaDTO } from './dto/tareaDTO.entity';
import { Tarea } from './entities/tarea.entity';

import { getDataFromJSON, handlerError } from 'src/common/helpers/helper';
import { HttpService } from 'src/common/services/http/http.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TareasService {

    uri: string

    constructor(private readonly http: HttpService) {
        this.uri = process.env.GOOGLE_URI + '/tarea'
    }

    async obtenerTarea (tareaId: string) {
        let tarea = (await this.obtenerTareas())!.find(tarea => tarea.id == tareaId);    
        if(tarea == undefined) throw new NotFoundException(`Tarea ${tareaId} no encontrada`);
        return tarea;
    }

    async crearTarea (tareaDTO: TareaDTO) {
        try {
            if(tareaDTO.orden) tareaDTO.orden > 0 ? tareaDTO.orden = tareaDTO.orden - 1 : false;
            let tarea = new Tarea(uuid.v4(), {...tareaDTO, subetapa: tareaDTO.subetapaId});
            return new MyResponse(tarea);
            
        } catch (err) {
            handlerError(err)
        }
    };


    async obtenerTareasExtras( subetapaId ){
        return (await this.obtenerTareas())!.filter(tarea => !tarea.isDefault && tarea.subetapa == subetapaId);    
    }

    async obtenerTareasDefaultBySubetapa( subetapaId ){
        return (await this.obtenerTareas())!.filter(tarea => tarea.isDefault && tarea.subetapa == subetapaId);    
    }

    async obtenerTareasDefault(){
        return (await this.obtenerTareas())!.filter(tarea => tarea.isDefault);    
    }
    
    async obtenerTareas(): Promise<Tarea[]> {
        return  await this.cargarTareas();
    }
    
    async grabarTarea(tarea: Tarea) {
        
            let response = await this.http.post(`${this.uri}.json`, {}, tarea);
            if(response.status >= 300 )throw new RpcException({ status: response.status, message: response.statusText});
            return response.data;
        
    }
    async cargarTareas(): Promise<Tarea[]>{
        let tareas: Tarea[] = [];
        let datos = (await this.http.get(`${this.uri}.json`)).data;
        tareas = getDataFromJSON(datos).map(data =>  new Tarea(data.id, data.attributes));
        return tareas;
    }

    async actualizarTarea(tarea: Tarea, id: string) {
        return await this.http.put(`${this.uri}/${id}.json`, {}, tarea);

    }

}
