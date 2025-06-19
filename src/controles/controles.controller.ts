import { Controller } from '@nestjs/common';
import { ControlesService } from './controles.service';
import { MyResponse } from '../common/entities/httpResponse.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ControlesController {
  constructor(private readonly controlService: ControlesService) { }

  // @MessagePattern()
  // create(@Body() createControleDto: CreateControleDto) {
  //   return this.controlesService.create(createControleDto);
  // }


  //------------- ETAPAS ----------------
  @MessagePattern('etapas.obtenerEtapasDefault')
  async getAllEtapasDefault(@Payload('subetapaId') subetapaId: string) {
    return await this.controlService.obtenerEtapasDefault();
  }


  @MessagePattern('etapas.extras')
  async getAllEtapasExtras() {
    return await this.controlService.obtenerEtapasExtras();
  }

  @MessagePattern('etapas.obtenerEtapaCompleta')
  async getEtapaCompleta(@Payload('etapaId') etapaId: string) {
    return await this.controlService.obtenerEtapaCompleta(etapaId);
  }
  @MessagePattern('etapas.grabarEtapa')
  async grabarEtapa(@Payload() payload: any) {
    return await this.controlService.grabarEtapa(payload);
  }



  //------------- SUBETAPAS ----------------

  @MessagePattern('subetapas/extras/:etapaid')
  async getAllSubetapasExtras(@Payload('etapaId') etapaId: string) {
    return await this.controlService.obtenerSubtapasExtras(etapaId);
  }

  @MessagePattern('subetapas.obtenerSubetapaCompleta')
  async getSubetapaCompleta(@Payload('subetapaId') subetapaId: string) {
    return await this.controlService.obtenerSubetapaCompleta(subetapaId);
  }

  @MessagePattern('subetapas.grabarSubetapa')
  async grabarSubetapa(@Payload('subetapa') subetapa: any) {
    return await this.controlService.grabarSubetapa(subetapa);
  }



  //------------- TAREAS ----------------
  @MessagePattern('tareas.obtenerTarea')
  async getTarea(@Payload('tareaId') tareaId: string) {
    return await this.controlService.obtenerTarea(tareaId);
  }

  @MessagePattern('tareas.obtenerTareasDefault')
  async getAllTareasDefault() {
    return await this.controlService.obtenerTareasDefault();
  }

  @MessagePattern('tareas.obtenerTareasExtras')
  async getAllTareasExtras(@Payload() payload: any) {
    const { subetapaId } = payload;
    return await this.controlService.obtenerTareasExtras(subetapaId);
  }

  @MessagePattern('tareas.grabarTarea')
  async grabarTarea(@Payload('tarea') tarea: any) {
    return await this.controlService.grabarTarea(tarea);
  }



  // @MessagePattern(':id')
  // findOne(@Payload('id') id: string) {
  //   return this.controlesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Payload('id') id: string, @Body() updateControleDto: UpdateControleDto) {
  //   return this.controlesService.update(+id, updateControleDto);
  // }

  // @Delete(':id')
  // remove(@Payload('id') id: string) {
  //   return this.controlesService.remove(+id);
  // }
}