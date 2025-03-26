import { AppSystemProp, exceptionHandler } from '@activepieces/server-shared'
import { apId, ApMultipartFile } from '@activepieces/shared'
import cors from '@fastify/cors'
import formBody from '@fastify/formbody'
import fastifyMultipart, { MultipartFile } from '@fastify/multipart'
import fastify, { FastifyBaseLogger, FastifyInstance } from 'fastify'
import fastifyFavicon from 'fastify-favicon'
import { fastifyRawBody } from 'fastify-raw-body'
import qs from 'qs'
import { setupApp } from './app'

import { errorHandler } from './helper/error-handler'
import { system } from './helper/system/system'



export const setupServer = async (): Promise<FastifyInstance> => {
    const app = await setupBaseApp()
    console.log(system.isApp(), 'dolat')
    if (system.isApp()) {
        await setupApp(app)
    }

    return app
}

async function setupBaseApp(): Promise<FastifyInstance> {
    const MAX_FILE_SIZE_MB = system.getNumberOrThrow(AppSystemProp.MAX_FILE_SIZE_MB)

    const app = fastify({
        logger: system.globalLogger() as FastifyBaseLogger,
        ignoreTrailingSlash: true,
        pluginTimeout: 30000,
        // Default 100MB, also set in nginx.conf
        bodyLimit: Math.max(25 * 1024 * 1024, (MAX_FILE_SIZE_MB + 4) * 1024 * 1024),
        genReqId: () => {
            return `req_${apId()}`
        },
        ajv: {
            customOptions: {
                removeAdditional: 'all',
                useDefaults: true,
                keywords: ['discriminator'],
                coerceTypes: 'array',
                formats: {},
            },
        },
    })


    await app.register(fastifyFavicon)
    await app.register(fastifyMultipart, {
        attachFieldsToBody: 'keyValues',
        async onFile(part: MultipartFile) {
            const apFile: ApMultipartFile = {
                filename: part.filename,
                data: await part.toBuffer(),
                type: 'file',
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (part as any).value = apFile
        },
    })


    await app.register(fastifyRawBody, {
        field: 'rawBody',
        global: false,
        encoding: 'utf8',
        runFirst: true,
        routes: [],
    })

    await app.register(formBody, { parser: (str) => qs.parse(str) })
    app.setErrorHandler(errorHandler)
    await app.register(cors, {
        origin: '*',
        exposedHeaders: ['*'],
        methods: ['*'],
    })
    // SurveyMonkey
    app.addContentTypeParser(
        'application/vnd.surveymonkey.response.v1+json',
        { parseAs: 'string' },
        app.getDefaultJsonParser('ignore', 'ignore'),
    )

    return app
}

