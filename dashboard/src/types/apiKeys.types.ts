export type ApiKeyEnvironment = "LIVE" | "SANDBOX";

export interface IApiKey {
  id: string;
  name: string;
  environment: ApiKeyEnvironment;
  key_prefix: string;
  created_at?: string;
  last_used_at: string | null;
  keySecret: string;
}

export interface ICreateApiKeyPayload {
  name: string;
  environment: ApiKeyEnvironment;
}
