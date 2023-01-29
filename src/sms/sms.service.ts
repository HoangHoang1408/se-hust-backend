import { Inject, Injectable } from '@nestjs/common';
import { SMS_CONFIG_OPTIONS } from 'src/common/constants/constants';
import * as TwilioInit from 'twilio';
import { SMSConfigOptions } from './constants/constants';
@Injectable()
export class SMSService {
  private readonly SMSClient: TwilioInit.Twilio;
  constructor(
    @Inject(SMS_CONFIG_OPTIONS) { accountSID, authToken }: SMSConfigOptions,
  ) {
    this.SMSClient = TwilioInit(accountSID, authToken);
    // this.sendMessage();
  }
  async sendMessage() {
    const res = await this.SMSClient.messages.create({
      body: 'Hi there',
      from: '+13465212649',
      to: '+84932198916',
    });
  }
}
