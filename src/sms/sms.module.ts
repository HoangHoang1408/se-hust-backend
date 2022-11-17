import { DynamicModule, Module } from '@nestjs/common';
import { SMS_CONFIG_OPTIONS } from 'src/common/constants/constants';
import { SMSConfigOptions } from './constants/constants';
import { SMSService } from './sms.service';
@Module({})
export class SMSModule {
  static forRoot(options: SMSConfigOptions): DynamicModule {
    return {
      module: SMSModule,
      global: true,
      providers: [
        {
          provide: SMS_CONFIG_OPTIONS,
          useValue: options,
        },
        SMSService,
      ],
      exports: [SMSService],
    };
  }
}
