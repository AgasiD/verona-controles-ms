import { Injectable } from '@nestjs/common';
import { EtapasService } from './etapas/etapas.service';
import { SubetapasService } from './subetapas/subetapas.service';
import { TareasService } from './tareas/tareas.service';
import { SubEtapa } from './subetapas/entities/subetapa.entity';
import { Tarea } from './tareas/entities/tarea.entity';
import { Etapa } from './etapas/entities/etapa.entity';

@Injectable()
export class ControlesService {
 
  constructor(
    private readonly etapaService: EtapasService,
    private readonly subetapaService: SubetapasService,
    private readonly tareaService: TareasService,
  ) {

  }

  //============ ETAPAS =======

  async obtenerEtapasDefault() {
    return await this.etapaService.obtenerEtapasDefault();
  }

  async obtenerEtapas() {
    return await this.etapaService.obtenerEtapas();
  }

  async obtenerEtapa(etapaId: string) {
    return await this.etapaService.obtenerEtapa(etapaId);
  }

  async obtenerEtapaCompleta(etapaId: string) {
    return await this.etapaService.obtenerEtapaCompleta(etapaId);
  }

  async obtenerEtapasExtras() {
    return await this.etapaService.obtenerEtapasExtra();
  }

  //============ SUBETAPAS =======


 
  async obtenerSubtapasExtras(etapaId: string) {
    return await this.subetapaService.obtenerSubEtapasExtrastByEtapa(etapaId);
  }
  async obtenerSubetapaCompleta(subetapaId: any) {
    return await this.subetapaService.obtenerSubetapaCompleta(subetapaId)
  }


   async obtenerSubetapas() {
     const subetapas = await this.subetapaService.obtenerSubEtapas();
    return subetapas?.map( sub => ({ id: sub.id, descripcion: sub.descripcion }))
  }

  //============ TAREAS =======

  async obtenerTarea(tareaId: string) {
    return await this.tareaService.obtenerTarea(tareaId);
  }

  async obtenerTareasDefault() {
    return this.tareaService.obtenerTareasDefault()
  }

  async obtenerTareasExtras(subetapaId) {
    return await this.tareaService.obtenerTareasExtras(subetapaId)
  }

  async grabarTarea(tarea: Tarea) {
    return await this.tareaService.grabarTarea(tarea);
  }

  async grabarSubetapa(subetapa: SubEtapa) {
    return await this.subetapaService.grabarSubEtapa(subetapa);
  }

  async grabarEtapa(etapa: Etapa) {
    return await this.etapaService.grabarEtapa(etapa);
  }

  

}
