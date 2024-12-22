export class Email {
  fromAddress: string | undefined;
  toAddress: string | undefined;
  subject:string;
  html?:string;
  text?:string;
}
