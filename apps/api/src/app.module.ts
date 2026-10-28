import { Module } from '@nestjs/common';
import { InfraModule } from './infra/infra.module';
import { CreatorsModule } from './creators/creators.module';

@Module({
  imports: [InfraModule, CreatorsModule],
})
export class AppModule {}
