import { Injectable } from '@nestjs/common';
import { SubEtapa } from './entities/subetapa.entity';
import { getDataFromJSON, handlerError, handlerHttpError } from '../../common/helpers/helper';
import { CreateSubetapaDTO } from './dto/create-subetapa.dto';
import { TareasService } from '../tareas/tareas.service';
import { HttpService } from 'src/common/services/http/http.service';

@Injectable()


export class SubetapasService {

    uri: string;

    constructor(
        private readonly http: HttpService,
        private readonly tareaService: TareasService
    ) {
        this.uri = process.env.GOOGLE_URI + '/subetapa'
    }

    async obtenerSubetapaCompleta(subetapaId: any) {

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
    async obtenerSubEtapas(): Promise<SubEtapa[]> {
        try {
            return await this.cargarSubEtapas();
        } catch (err) {
            throw err
        }
    }

    async obtenerSubEtapasDefault(): Promise<SubEtapa[]> {
        try {
            return (await this.cargarSubEtapas()).filter(sub => sub.isDefault);
        } catch (err) {
            throw err
        }
    }
    async obtenerSubEtapasExtras(): Promise<SubEtapa[]> {
        try {
            return (await this.cargarSubEtapas()).filter(sub => !sub.isDefault);
        } catch (err) {
            throw err
        }
    }

    async obtenerSubEtapasDefaultByEtapa(etapaId): Promise<SubEtapa[]> {
        try {
            return (await this.cargarSubEtapas()).filter(sub => sub.etapa === etapaId);
        } catch (err) {
            throw err
        }
    }

    async obtenerSubEtapasExtrastByEtapa(etapaId): Promise<SubEtapa[]> {
        try {
            return (await this.obtenerSubEtapasExtras()).filter(sub => sub.etapa === etapaId);
        } catch (err) {
            throw err
        }
    }

    async cargarSubEtapas(): Promise<SubEtapa[]> {
        let subetapas: SubEtapa[] = [];
        let response = (await this.http.get(`${this.uri}.json`))
        if (response.status > 210) handlerHttpError(response)
        let datos = response.data;
        if (datos != null) subetapas = getDataFromJSON(datos).map(data => new SubEtapa({ id: data.id, ...data.attributes }));
        return subetapas;
    }


    async obtenerSubEtapa(subetapaId) {
        let subetapas = await this.obtenerSubEtapas();
        return subetapas.find(subetapa => subetapa.id == subetapaId);
    }

    async grabarSubEtapa(subetapa: SubEtapa) {
        let response = await this.http.post(`${this.uri}.json`, {}, subetapa);
        if (response.status > 210) handlerHttpError(response)
        return response.data;
    }

    async modificarSubEtapa(subetapa: SubEtapa) {
        let response = await this.http.post(`${this.uri}/${subetapa.id}.json`, {}, subetapa);
        if (response.status > 210) handlerHttpError(response)
        return response.data;
    }

    async eliminarSubetapa(subetapaId) {
        await this.http.delete(`${this.uri}/${subetapaId}.json`, {});
        return subetapaId;
    }

}
