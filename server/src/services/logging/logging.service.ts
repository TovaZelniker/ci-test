import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as util from 'util';
import * as constants from '../../utils/constants';

@Injectable()
export class LoggingService {
  private logFile = fs.createWriteStream(constants.PATH_LOGGING, { flags: 'a' });
  writeToLog(error: string): void {
    const date = new Date();
    this.logFile.write(`${date}\n`);
    this.logFile.write(`${util.format(error)}\n\n`);
  }

}
