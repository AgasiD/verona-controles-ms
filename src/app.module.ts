import { Module } from '@nestjs/common';
import { ControlesModule } from './controles/controles.module';

@Module({
  imports: [
    ControlesModule
  ],
})
export class AppModule {}
