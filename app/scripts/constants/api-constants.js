let config = require('./config');

const API_ROOT = config.BASE_API_URL;

module.exports = {
  API_ENDPOINTS: {
    LOGIN:                              API_ROOT + "/sessions",
    LOGOUT:                             API_ROOT + "/sessions/:id",
    CITIES_INDEX:                       API_ROOT + "/cities",
    COMPANY_SIZES_INDEX:                API_ROOT + "/company_sizes",
    COMPENSATIONS_INDEX:                API_ROOT + "/salary_ranges",
    CULTURES_INDEX:                     API_ROOT + "/cultures",
    SKILL_CATEGORIES_INDEX:             API_ROOT + "/skill_categories",
    SKILLS_INDEX:                       API_ROOT + "/skills",
    ACCOUNTS_CREATE:                    API_ROOT + "/accounts",
    ACCOUNTS_SHOW:                      API_ROOT + "/accounts/:id",
    ACCOUNTS_UPDATE:                    API_ROOT + "/accounts/:id",
    EMPLOYER_CONTACTS_CREATE:           API_ROOT + "/employer_contacts",
    EMPLOYER_CONTACTS_SHOW:             API_ROOT + "/employer_contacts/:id",
    EMPLOYER_POSITIONS:                 API_ROOT + "/employer_contacts/:employer_contact_id/positions",
    EMPLOYER_POSITIONS_SHOW:            API_ROOT + "/employer_contacts/:employer_contact_id/positions/:id",
    EMPLOYER_POSITIONS_DELETE:          API_ROOT + "/employer_contacts/:employer_contact_id/positions/:id",
    EMPLOYER_SIGNUP:                    API_ROOT + "/users",
    EMPLOYER_INVITE_COWORKERS:          API_ROOT + "/employer_contacts/:id/invite_coworkers",
    EMPLOYER_RECENT_CONVERSATIONS:      API_ROOT + "/employer_contacts/:id/get_recent_conversations",
    EMPLOYMENT_TYPES_INDEX:             API_ROOT + "/employment_types",
    OFFERS_ACCEPT:                      API_ROOT + "/offers/:id/accept",
    OFFERS_REJECT:                      API_ROOT + "/offers/:id/reject",
    OFFERS_CREATE:                      API_ROOT + "/offers",
    OFFERS_INDEX:                       API_ROOT + "/offers",
    POSITIONS_CREATE:                   API_ROOT + "/employer_contacts/:employer_contact_id/positions",
    POSITIONS_GET_BY_ID:                API_ROOT + "/positions/:id",
    POSITIONS_MATCHES:                  API_ROOT + "/positions/:position_id/matches",
    TALENT_PROFILE_INDEX:               API_ROOT + "/talent_profiles",
    TALENT_PROFILE_CREATE:              API_ROOT + "/talent_profiles",
    TALENT_PROFILE_UPDATE:              API_ROOT + "/talent_profiles/:id",
    TALENT_PROFILE_MATCH_INTEREST:      API_ROOT + "/positions/:position_id/matches/:match_id/interest",
    TALENT_PROFILE_MATCH_SHOW:          API_ROOT + "/talent_profile_matches/:id",
    TALENT_PROFILE_MATCH_LIKE:          API_ROOT + "/talent_profiles/:talent_profile_id/matches/:id/like",
    TALENT_PROFILE_MATCH_REJECT:        API_ROOT + "/talent_profiles/:talent_profile_id/matches/:id/reject",
    TALENT_PROFILE_RECENT_CONVERSATIONS:API_ROOT + "/talent_profiles/:id/get_recent_conversations",
    TALENT_SIGNUP:                      API_ROOT + "/users",
    AGENT_INDEX:                        API_ROOT + "/agents",
    MESSAGES_INDEX:                     API_ROOT + "/messages",
    MESSAGES_NEW:                       API_ROOT + "/messages",
    MESSAGES_FOR_POSITION:              API_ROOT + "/messages/for_position/:position_id",
    MESSAGES_FOR_POSITION_WITH_USER:    API_ROOT + "/messages/for_position/:position_id/with_user/:with_user_id",
    MESSAGES_WITH_USER:                 API_ROOT + "/messages/with_user/:with_user_id",
    OMNIAUTH_GITHUB:                    API_ROOT + "/users/auth/github",
    OMNIAUTH_LINKEDIN:                  API_ROOT + "/users/auth/linkedin",
    CURRENT_USER:                       API_ROOT + "/users/from_token",
    SEARCH_MATCHES_BY_POSITION_ID:      API_ROOT + "/search/positions/:id/talent_profiles",
    FEE_STRUCTURE:                      API_ROOT + "/get_fees/:salary",
    USER_FORGOT_PASSWORD:               API_ROOT + "/users/forgot_password",
    USER_RESET_PASSWORD:                API_ROOT + "/users/reset_password"
  },

  OFFER_STATUS: {
    UNANSWERED: 'unanswered',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected'
  },

  ACCOUNT_ADMIN:                        'account_admin',
  EMPLOYER_USER:                        'employer_contact',
  TALENT_USER:                          'talent',

  FULL_AGREEMENT_PDF_URL:               'https://s3.amazonaws.com/fetch-api-staging/store/Fetch-FullAgreement-2015-DEMO.pdf',

  REGEX_VALIDATIONS: {
    GITHUB_URL:                         '^(http:\/\/|https:\/\/)?(www\.)?(github\.com\/)([a-z0-9-_]+)$',
    LINKED_IN_URL:                      '^(http:\/\/|https:\/\/)?(www\.)?(linkedin\.com\/)([a-zA-Z0-9-_?&=\/]+)$'
  }
};
