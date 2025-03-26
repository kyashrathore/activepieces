import {
  PieceMetadata,
  PieceMetadataModel,
  PieceMetadataModelSummary,
} from '@activepieces/pieces-framework';
import {
  apVersionUtil,
  UserInteractionJobType,
} from '@activepieces/server-shared';
import {
  ALL_PRINCIPAL_TYPES,
  ApEdition,
  FileType,
  GetPieceRequestParams,
  GetPieceRequestQuery,
  GetPieceRequestWithScopeParams,
  ListPiecesRequestQuery,
  ListVersionRequestQuery,
  ListVersionsResponse,
  PieceCategory,
  PieceOptionRequest,
  PrincipalType,
} from '@activepieces/shared';
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import {
  getPiecePackageWithoutArchive,
  pieceMetadataService,
} from './piece-metadata-service';

export const pieceModule: FastifyPluginAsyncTypebox = async (app) => {
  await app.register(basePiecesController, { prefix: '/v1/pieces' });
};

const basePiecesController: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    '/categories',
    ListCategoriesRequest,
    async (): Promise<PieceCategory[]> => {
      return Object.values(PieceCategory);
    }
  );

  app.get(
    '/',
    ListPiecesRequest,
    async (req): Promise<PieceMetadataModelSummary[]> => {
      const latestRelease = await apVersionUtil.getCurrentRelease();
      const includeTags = req.query.includeTags ?? false;
      const release = req.query.release ?? latestRelease;
      const edition = req.query.edition ?? ApEdition.COMMUNITY;
      const platformId = undefined;
      const projectId = undefined;
      const pieceMetadataSummary = await pieceMetadataService(req.log).list({
        release,
        includeHidden: req.query.includeHidden ?? false,
        projectId,
        platformId,
        edition,
        includeTags,
        categories: req.query.categories,
        searchQuery: req.query.searchQuery,
        sortBy: req.query.sortBy,
        orderBy: req.query.orderBy,
        suggestionType: req.query.suggestionType,
      });
      return pieceMetadataSummary;
    }
  );

  app.get(
    '/:scope/:name',
    GetPieceParamsWithScopeRequest,
    async (req): Promise<PieceMetadata> => {
      const { name, scope } = req.params;
      const { version } = req.query;

      const decodeScope = decodeURIComponent(scope);
      const decodedName = decodeURIComponent(name);
      const projectId =
        req.principal.type === PrincipalType.UNKNOWN
          ? undefined
          : req.principal.projectId;
      const platformId =
        req.principal.type === PrincipalType.UNKNOWN
          ? undefined
          : req.principal.platform.id;
      return pieceMetadataService(req.log).getOrThrow({
        projectId,
        platformId,
        name: `${decodeScope}/${decodedName}`,
        version,
      });
    }
  );

  app.get(
    '/:name',
    GetPieceParamsRequest,
    async (req): Promise<PieceMetadataModel> => {
      const { name } = req.params;
      const { version } = req.query;

      const decodedName = decodeURIComponent(name);
      const projectId =
        req.principal.type === PrincipalType.UNKNOWN
          ? undefined
          : req.principal.projectId;
      const platformId =
        req.principal.type === PrincipalType.UNKNOWN
          ? undefined
          : req.principal.platform.id;
      return pieceMetadataService(req.log).getOrThrow({
        projectId,
        platformId,
        name: decodedName,
        version,
      });
    }
  );
};

const ListPiecesRequest = {
  config: {
    allowedPrincipals: ALL_PRINCIPAL_TYPES,
  },
  schema: {
    querystring: ListPiecesRequestQuery,
  },
};
const GetPieceParamsRequest = {
  config: {
    allowedPrincipals: ALL_PRINCIPAL_TYPES,
  },
  schema: {
    params: GetPieceRequestParams,
    querystring: GetPieceRequestQuery,
  },
};

const GetPieceParamsWithScopeRequest = {
  config: {
    allowedPrincipals: ALL_PRINCIPAL_TYPES,
  },
  schema: {
    params: GetPieceRequestWithScopeParams,
    querystring: GetPieceRequestQuery,
  },
};

const ListCategoriesRequest = {
  config: {
    allowedPrincipals: ALL_PRINCIPAL_TYPES,
  },
  schema: {
    querystring: ListPiecesRequestQuery,
  },
};

const OptionsPieceRequest = {
  schema: {
    body: PieceOptionRequest,
  },
};

const ListVersionsRequest = {
  config: {
    allowedPrincipals: ALL_PRINCIPAL_TYPES,
  },
  schema: {
    querystring: ListVersionRequestQuery,
  },
};

const SyncPiecesRequest = {
  config: {
    allowedPrincipals: [PrincipalType.USER],
  },
};
