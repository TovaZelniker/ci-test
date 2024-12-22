import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { Email } from './email.model';


@Injectable()
export class SenderEmailService {

  constructor(private readonly mailService: MailerService){
  }
 
  async sendEmail(email:Email) {
    await this.mailService.sendMail({
      from: email.fromAddress,
      to: email.toAddress,
      subject: email.subject,
      ...(email.text && { text: email.text }),
      ...(email.html && { html: email.html })
    });
  }
}
