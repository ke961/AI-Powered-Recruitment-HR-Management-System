import { Module } from '@nestjs/common';
import { AiScreeningService } from './ai-screening.service.js';
import { AiScreeningController } from './ai-screening.controller.js';

@Module({
  controllers: [AiScreeningController],
  providers: [AiScreeningService],
  exports: [AiScreeningService],
})
export class AiScreeningModule {}
