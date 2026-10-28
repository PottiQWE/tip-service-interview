import { Module } from '@nestjs/common';
import { InfraModule } from './infra/infra.module';
import { CreatorsModule } from './creators/creators.module';
import { TipsModule } from './tips/tips.module';

@Module({
  imports: [InfraModule, CreatorsModule, TipsModule],
})
export class AppModule {}
