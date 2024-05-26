import { NgxLoggerLevel } from 'ngx-logger';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  logLevel: NgxLoggerLevel.TRACE,
  serverLogLevel: NgxLoggerLevel.OFF,
  URL_API_RENIEC:'https://api.apis.net.pe/v1/dni?numero=',
  URL_BASE:'https://sys-asistencia-server.ceidbot.com/api'
  // URL_BASE:'http://127.0.0.1:8000/api'
};
