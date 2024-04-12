import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  production: true,
  logLevel: NgxLoggerLevel.OFF,
  serverLogLevel: NgxLoggerLevel.ERROR,
  URL_API_RENIEC:'https://api.apis.net.pe/v1/dni?numero=',
  URL_BASE:'https://sys-asistencia-server.ceidbot.com/api'
};
