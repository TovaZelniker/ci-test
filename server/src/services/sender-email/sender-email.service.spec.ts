import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';

import { SenderEmailService } from './sender-email.service';


describe('SenderEmailService', () => {
  let service: SenderEmailService;
  let mailerService: MailerService;

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SenderEmailService,
        { provide: MailerService, useValue: mockMailerService },
      ],
    }).compile();

    service = module.get<SenderEmailService>(SenderEmailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an email with the correct parameters', async () => {
    const email = {
      fromAddress: 'test@example.com',
      toAddress: 'recipient@example.com',
      subject: 'Test Subject',
      text: 'This is a plain text email.',
      html: '<p>This is an HTML email.</p>',
    };

    await service.sendEmail(email);

    expect(mailerService.sendMail).toHaveBeenCalledWith({
      from: email.fromAddress,
      to: email.toAddress,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
  });

  it('should not include `text` or `html` if they are not provided', async () => {
    const email = {
      fromAddress: 'test@example.com',
      toAddress: 'recipient@example.com',
      subject: 'Test Subject',
    };

    await service.sendEmail(email);

    expect(mailerService.sendMail).toHaveBeenCalledWith({
      from: email.fromAddress,
      to: email.toAddress,
      subject: email.subject,
    });
  });
});
