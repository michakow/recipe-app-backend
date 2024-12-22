import { KeycloakConnectOptions } from 'nest-keycloak-connect';

export const getKeycloakConfig = (): KeycloakConnectOptions => ({
  authServerUrl: process.env.KEYCLOAK_URL,
  realm: process.env.KEYCLOAK_REALM,
  clientId: process.env.KEYCLOAK_CLIENT,
  secret: process.env.KEYCLOAK_SECRET,
});
