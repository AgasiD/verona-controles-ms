import { Injectable } from '@nestjs/common';
import { SubEtapa } from './entities/subetapa.entity';
import { getDataFromJSON, handlerError } from '../../common/helpers/helper';
import { CreateSubetapaDTO } from './dto/create-subetapa.dto';
import { TareasService } from '../tareas/tareas.service';
import { HttpService } from 'src/common/services/http/http.service';

@Injectable()


export class SubetapasService {

    uri: string;
    subetapas: SubEtapa[] = [];
    constructor(
        private readonly http: HttpService,
        private readonly tareaService: TareasService
    ) {
        this.uri = process.env.GOOGLE_URI + '/subetapa'
    }

    async obtenerSubetapaCompleta(subetapaId) {

        let subetapa = await this.obtenerSubEtapa(subetapaId);
        let tareas = await this.tareaService.obtenerTareasDefaultBySubetapa(subetapaId)
        subetapa!.tareas = tareas;
        return subetapa

    }

    async nuevaSubetapa(subetapaDTO: CreateSubetapaDTO) {
        try {

            // //agregar subetapa a la obra
            // let obra = (await this.obraService.obtenerObra(subetapaDTO.obraId))!;
            // let etapa = obra.obtenerEtapa(subetapaDTO.etapaId);

            // let etapasLength = etapa.subetapas == undefined ? 0 : etapa.subetapas.length;
            // subetapaDTO.orden = subetapaDTO.orden || etapasLength
            // let subetapa = new SubEtapa({ id: uuid.v4(), ...subetapaDTO });
            // return subetapa;

        } catch (err) {
            handlerError(err)
        }
    }
    async obtenerSubEtapas() {
        try {
            return await this.cargarSubEtapas();
        } catch (err) {
            handlerError(err)
        }
    }

    async obtenerSubEtapasDefault() {
        try {
            return (await this.cargarSubEtapas()).filter(sub => sub.isDefault);
        } catch (err) {
            handlerError(err)
        }
    }
    async obtenerSubEtapasExtras() {
        try {
            return (await this.cargarSubEtapas()).filter(sub => !sub.isDefault);
        } catch (err) {
            handlerError(err)
        }
    }

    async obtenerSubEtapasDefaultByEtapa(etapaId) {
        try {
            return (await this.cargarSubEtapas()).filter(sub => sub.etapa === etapaId);
        } catch (err) {
            handlerError(err)
        }
    }

    async obtenerSubEtapasExtrastByEtapa(etapaId) {
        try {
            return (await this.obtenerSubEtapasExtras())!.filter(sub => sub.etapa === etapaId);
        } catch (err) {
            handlerError(err)
        }
    }

    async cargarSubEtapas() {
        
        if(this.subetapas.length > 0) return this.subetapas;
        let response = (await this.http.get(`${this.uri}.json`))
        if (response!.status > 210) handlerError(response)
        let datos = response!.data;
        if (datos != null) this.subetapas = getDataFromJSON(datos).map(data => new SubEtapa({ id: data.id, ...data.attributes }));
        return this.subetapas;
    }


    async obtenerSubEtapa(subetapaId) {
        let subetapas = await this.obtenerSubEtapas();
        return subetapas?.find(subetapa => subetapa.id == subetapaId);
    }

    async grabarSubEtapa(subetapa: SubEtapa) {
        let response = await this.http.post(`${this.uri}.json`, {}, subetapa);
        if (response!.status > 210) handlerError(response)
        return response!.data;
    }

    async modificarSubEtapa(subetapa: SubEtapa) {
        let response = await this.http.post(`${this.uri}/${subetapa.id}.json`, {}, subetapa);
        if (response!.status > 210) handlerError(response)
        return response!.data;
    }

    async eliminarSubetapa(subetapaId) {
        await this.http.delete(`${this.uri}/${subetapaId}.json`, {});
        return subetapaId;
    }

}
