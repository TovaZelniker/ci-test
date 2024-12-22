import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as util from 'util';
import * as constants from '../../utils/constants';

@Injectable()
export class LoggingService {
  writeToLog(error: string): void {
    const logFile = fs.createWriteStream(constants.PATH_LOGGING, { flags: 'a' });
    const date = new Date();
    logFile.write(`${date}\n`);
    logFile.write(`${util.format(error)}\n\n`);
  }

}
