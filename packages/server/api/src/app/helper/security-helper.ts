import { PrincipalType } from '@activepieces/shared'
import { FastifyRequest } from 'fastify'

export const securityHelper = {
    async getUserIdFromRequest(request: FastifyRequest): Promise<string | null> {
        switch (request.principal.type) {
            case PrincipalType.SERVICE: {
                return "platformwonerid"
            }
            case PrincipalType.USER:
                return request.principal.id
            default:
                throw new Error(`Unsupported principal type: ${request.principal.type}`)
        }
    },
}