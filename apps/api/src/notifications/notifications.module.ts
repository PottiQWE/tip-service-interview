import { Module } from '@nestjs/common';
import { CreatorsModule } from '../creators/creators.module';
import { EmailClient } from './email.client';
import { NotificationsService } from './notifications.service';
import { PushClient } from './push.client';

@Module({
  imports: [CreatorsModule],
  providers: [NotificationsService, EmailClient, PushClient],
  exports: [NotificationsService],
})
export class NotificationsModule {}
