import { PieceMetadata } from '@activepieces/pieces-framework';
import { AppSystemProp } from '@activepieces/server-shared';
import { ApEnvironment } from '@activepieces/shared';
import swagger from '@fastify/swagger';
import { createAdapter } from '@socket.io/redis-adapter';
import { FastifyInstance, FastifyRequest, HTTPMethods } from 'fastify';

import { appConnectionModule } from './app-connection/app-connection.module';

import { getRedisConnection } from './database/redis-connection';

import { openapiModule } from './helper/openapi/openapi.module';
import { QueueMode, system } from './helper/system/system';
import { systemJobsSchedule } from './helper/system-jobs';
import { SystemJobName } from './helper/system-jobs/common';
import { systemJobHandlers } from './helper/system-jobs/job-handlers';
import { validateEnvPropsOnStartup } from './helper/system-validator';

import { pieceModule } from './pieces/base-piece-module';
import { pieceMetadataServiceHooks } from './pieces/piece-metadata-service/hooks';

export const setupApp = async (
  app: FastifyInstance
): Promise<FastifyInstance> => {
  app.addHook('onResponse', async (request, reply) => {
    // eslint-disable-next-line
    reply.header('x-request-id', request.id);
  });
  app.addHook('onRequest', async (request, reply) => {
    const route = app.hasRoute({
      method: request.method as HTTPMethods,
      url: request.url,
    });
    console.log(route, 'dolat');
    if (!route) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Route not found',
      });
    }
  });

  await systemJobsSchedule(app.log).init();
  await app.register(pieceModule);
  await app.register(appConnectionModule);
  await app.register(openapiModule);

  app.get(
    '/redirect',
    async (
      request: FastifyRequest<{ Querystring: { code: string } }>,
      reply
    ) => {
      const params = {
        code: request.query.code,
      };
      if (!params.code) {
        return reply.send('The code is missing in url');
      } else {
        return reply
          .type('text/html')
          .send(
            `<script>if(window.opener){window.opener.postMessage({ 'code': '${encodeURIComponent(
              params.code
            )}' },'*')}</script> <html>Redirect succuesfully, this window should close now</html>`
          );
      }
    }
  );

  await validateEnvPropsOnStartup(app.log);

  const edition = system.getEdition();
  app.log.info(
    {
      edition,
    },
    'Activepieces Edition'
  );

  app.addHook('onClose', async () => {
    app.log.info('Shutting down');
    await systemJobsSchedule(app.log).close();
  });

  return app;
};

async function getAdapter() {
  const queue = system.getOrThrow<QueueMode>(AppSystemProp.QUEUE_MODE);
  switch (queue) {
    case QueueMode.MEMORY: {
      return undefined;
    }
    case QueueMode.REDIS: {
      const sub = getRedisConnection().duplicate();
      const pub = getRedisConnection().duplicate();
      return createAdapter(pub, sub);
    }
  }
}

export async function appPostBoot(app: FastifyInstance): Promise<void> {
  app.log.info(`
             _____   _______   _____  __      __  ______   _____    _____   ______    _____   ______    _____
    /\\      / ____| |__   __| |_   _| \\ \\    / / |  ____| |  __ \\  |_   _| |  ____|  / ____| |  ____|  / ____|
   /  \\    | |         | |      | |    \\ \\  / /  | |__    | |__) |   | |   | |__    | |      | |__    | (___
  / /\\ \\   | |         | |      | |     \\ \\/ /   |  __|   |  ___/    | |   |  __|   | |      |  __|    \\___ \\
 / ____ \\  | |____     | |     _| |_     \\  /    | |____  | |       _| |_  | |____  | |____  | |____   ____) |
/_/    \\_\\  \\_____|    |_|    |_____|     \\/     |______| |_|      |_____| |______|  \\_____| |______| |_____/

The application started on  provided url, as specified by the AP_FRONTEND_URL variables.`);

  const environment = system.get(AppSystemProp.ENVIRONMENT);
  const piecesSource = system.getOrThrow(AppSystemProp.PIECES_SOURCE);
  const pieces = process.env.AP_DEV_PIECES;

  app.log.warn(
    `[WARNING]: Pieces will be loaded from source type ${piecesSource}`
  );
  if (environment === ApEnvironment.DEVELOPMENT) {
    app.log.warn(
      `[WARNING]: The application is running in ${environment} mode.`
    );
    app.log.warn(
      `[WARNING]: This is only shows pieces specified in AP_DEV_PIECES ${pieces} environment variable.`
    );
  }
  const key = system.get<string>(AppSystemProp.LICENSE_KEY);
}
