import { Module } from '@nestjs/common';
import { CreatorsModule } from '../creators/creators.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { TipCounterService } from './tip-counter.service';
import { TipsController } from './tips.controller';
import { TipsRepository } from './tips.repository';
import { TipsService } from './tips.service';

@Module({
  imports: [CreatorsModule, NotificationsModule],
  controllers: [TipsController],
  providers: [TipsService, TipsRepository, TipCounterService],
})
export class TipsModule {}
