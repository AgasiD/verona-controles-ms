import { Injectable, NotFoundException } from '@nestjs/common';
import { TareasService } from '../tareas/tareas.service';
import { SubetapasService } from '../subetapas/subetapas.service';
import { Etapa } from './entities/etapa.entity';

import { getDataFromJSON, handlerHttpError } from '../../common/helpers/helper';
import { Tarea } from '../tareas/entities/tarea.entity';
import { HttpService } from 'src/common/services/http/http.service';


@Injectable()
export class EtapasService {


    uri: string;
    constructor(
        private readonly http: HttpService,
        private readonly tareasService: TareasService,
        private readonly subetapasService: SubetapasService) {
        this.uri = process.env.GOOGLE_URI + '/etapa'

    }

    async grabarEtapa(etapa: Etapa) {
        let response = await this.http.post(`${this.uri}.json`, {}, etapa);
        if (response.status >= 300) handlerHttpError(response)
        return response.data;
    }


    async obtenerEtapasExtra() {
        let etapasExtras = (await this.cargarEtapas()).filter(e => e.isDefault == false);
        return etapasExtras
    }


    async obtenerEtapasDefault() {
        let etapas = (await this.obtenerEtapas());
        let subetapas = (await this.subetapasService.obtenerSubEtapasDefault());
        let tareas = await this.tareasService.obtenerTareasDefault();
        etapas.forEach(etapa => {
            let subs = subetapas.filter(sub => sub.etapa.includes(etapa.id)).sort((a, b) => {
                return a.orden - b.orden;
            })
            subs.forEach(sub => {
                let tareasSubEtapa = tareas
                    .filter(tarea => tarea.subetapa.includes(sub.id))
                    .sort((a, b) => a.orden - b.orden)
                    .map(tarea => new Tarea(
                        tarea.id,
                        {
                            subetapa: sub.id,
                            descripcion: tarea.descripcion,
                            isDefault: tarea.isDefault
                        }));
                sub.tareas = tareasSubEtapa;
            })
            etapa.subetapas = subs
        });
        return etapas;
    }

    async obtenerEtapaCompleta(etapaId) {
        let etapa = (await this.obtenerEtapa(etapaId));
        let subetapas = (await this.subetapasService.obtenerSubEtapasDefaultByEtapa(etapaId));
        let tareas = await this.tareasService.obtenerTareasDefault();
        let subs = subetapas.filter(sub => sub.etapa.includes(etapa.id)).sort((a, b) => { return a.orden - b.orden; })
        subs.forEach(sub => {
            let tareasSubEtapa = tareas
                .filter(tarea => tarea.subetapa.includes(sub.id))
                .sort((a, b) => a.orden - b.orden)
                .map(tarea => new Tarea(
                    tarea.id,
                    {
                        subetapa: sub.id,
                        descripcion: tarea.descripcion,
                        isDefault: tarea.isDefault
                    }));
            sub.tareas = tareasSubEtapa;
        })
        etapa.subetapas = subs
        return etapa;
    }


    async obtenerEtapas() {
        return await this.cargarEtapas();
    }

    async obtenerEtapa(id) {
        let etapa = (await this.cargarEtapas()).find(etapa => etapa.id === id);
        if (etapa == undefined) throw new NotFoundException(`Etapa ${id} no encontrada`)
        return etapa;
    }


    cargarEtapas = async () => {
        let etapas: Etapa[] = [];
        let response = await this.http.get(`${this.uri}.json`);
        if (response.status > 210) handlerHttpError(response)
        let datos = response.data;
        if (datos != null) {
            etapas = getDataFromJSON(datos)
                .map(data => new Etapa({
                    id: data.id,
                    ...data.attributes,
                }));
        }
        return etapas
    }
}
