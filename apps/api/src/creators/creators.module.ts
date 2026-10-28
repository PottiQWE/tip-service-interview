import { Module } from '@nestjs/common';
import { CreatorsController } from './creators.controller';
import { CreatorsRepository } from './creators.repository';

@Module({
  controllers: [CreatorsController],
  providers: [CreatorsRepository],
  exports: [CreatorsRepository],
})
export class CreatorsModule {}
