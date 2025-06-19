import { Module } from '@nestjs/common';
import { ControlesService } from './controles.service';
import { ControlesController } from './controles.controller';
import { EtapasService } from './etapas/etapas.service';
import { SubetapasService } from './subetapas/subetapas.service';
import { TareasService } from './tareas/tareas.service';
import { HttpService } from 'src/common/services/http/http.service';


@Module({
  controllers: [ControlesController],
  providers: [HttpService, ControlesService, EtapasService, SubetapasService, TareasService],
  imports: [],
  exports: [ControlesService]
})
export class ControlesModule {}
