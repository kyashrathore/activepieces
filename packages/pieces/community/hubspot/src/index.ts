import { createCustomApiCallAction } from '@activepieces/pieces-common';
import { OAuth2PropertyValue, PieceAuth, createPiece } from '@activepieces/pieces-framework';
import { PieceCategory } from '@activepieces/shared';
import { hubSpotListsAddContactAction } from './lib/actions/add-contact-to-list-action';
import { createHubspotContact } from './lib/actions/create-contact.action';
import { hubSpotContactsCreateOrUpdateAction } from './lib/actions/create-or-update-contact-action';
import { hubSpotGetOwnerByEmailAction } from './lib/actions/search-owner-by-email';
import { newCompanyAdded } from './lib/triggers/new-company-added';
import { newContactAdded } from './lib/triggers/new-contact-added';
import { newDealAdded } from './lib/triggers/new-deal-added';
import { newTaskAdded } from './lib/triggers/new-task-added';
import { newTicketAdded } from './lib/triggers/new-ticket-added';
import { createDealAction } from './lib/actions/create-deal';
import { updateDealAction } from './lib/actions/update-deal';
import { dealStageUpdatedTrigger } from './lib/triggers/deal-stage-updated';
import { getContactAction } from './lib/actions/get-contact';
import { getDealAction } from './lib/actions/get-deal';
import { getTicketAction } from './lib/actions/get-ticket';
import { getCompanyAction } from './lib/actions/get-company';
import { getPipelineStageDeatilsAction } from './lib/actions/get-pipeline-stage-details';
import { getProductAction } from './lib/actions/get-product';
import { addContactToWorkflowAction } from './lib/actions/add-contact-to-workflow';
import { createTicketAction } from './lib/actions/create-ticket';
import { updateTicketAction } from './lib/actions/update-ticket';
import { findTicketAction } from './lib/actions/find-ticket';
import { createContactAction } from './lib/actions/create-contact';
import { updateContactAction } from './lib/actions/update-contact';
import { findContactAction } from './lib/actions/find-contact';

export const hubspotAuth = PieceAuth.OAuth2({
	authUrl: 'https://app.hubspot.com/oauth/authorize',
	tokenUrl: 'https://api.hubapi.com/oauth/v1/token',
	required: true,
	scope: [
		'crm.lists.read',
		'crm.lists.write',
		'crm.objects.companies.read',
		'crm.objects.companies.write',
		'crm.objects.contacts.read',
		'crm.objects.contacts.write',
		'crm.objects.custom.read',
		'crm.objects.custom.write',
		'crm.objects.deals.read',
		'crm.objects.deals.write',
		'crm.objects.line_items.read',
		'crm.objects.owners.read',
		'crm.schemas.companies.read',
		'crm.schemas.contacts.read',
		'crm.schemas.custom.read',
		'crm.schemas.deals.read',
		'crm.schemas.line_items.read',
		'automation',
		'e-commerce',
		'tickets',
		'settings.users.read',
		'settings.users.teams.read',
		// 'business_units_view.read'
	],
});

export const hubspot = createPiece({
	displayName: 'HubSpot',
	description: 'Powerful CRM that offers tools for sales, customer service, and marketing automation.',
	minimumSupportedRelease: '0.5.0',
	logoUrl: 'https://cdn.activepieces.com/pieces/hubspot.png',
	authors: ['Salem-Alaa', 'kishanprmr', 'MoShizzle', 'khaledmashaly', 'abuaboud'],
	categories: [PieceCategory.SALES_AND_CRM],
	auth: hubspotAuth,
	actions: [
		createHubspotContact,
		hubSpotContactsCreateOrUpdateAction,
		hubSpotListsAddContactAction,
		hubSpotGetOwnerByEmailAction,
		createContactAction,
		updateContactAction,
		getContactAction,
		getDealAction,
		getCompanyAction,
		createTicketAction,
		updateTicketAction,
		getTicketAction,
		findContactAction,
		findTicketAction,
		getProductAction,
		getPipelineStageDeatilsAction,
		addContactToWorkflowAction,
		createDealAction,
		updateDealAction,
		createCustomApiCallAction({
			baseUrl: () => 'https://api.hubapi.com',
			auth: hubspotAuth,
			authMapping: async (auth) => ({
				Authorization: `Bearer ${(auth as OAuth2PropertyValue).access_token}`,
			}),
		}),
	],
	triggers: [
		newTaskAdded,
		newCompanyAdded,
		newContactAdded,
		newDealAdded,
		newTicketAdded,
		dealStageUpdatedTrigger,
	],
});
