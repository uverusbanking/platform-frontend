export interface ICompany {
  id: string;
  platform_id: string;
  organisation_name: string;
  cac_registration_number: string;
  tin: string;
  business_email: string;
  business_phone: string;
  registered_address_street: string;
  registered_address_city: string;
  registered_address_state: string;
  registered_address_postal_code: string;
  registered_address_country: string;
  document_cac_certificate: string;
  document_memorandum: string;
  document_board_resolution: string;
  document_proof_of_address: string;
  document_ubo_declaration: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  metadata: Record<string, unknown>;
  kYCId: string;
}

export interface IApiKey {
  id: string;
  name: string;
  key: string;
  environment: "LIVE" | "SANDBOX";
  created_at: string;
  updated_at: string;
}

export interface ICreateApiKeyPayload {
  name: string;
  environment: "LIVE" | "SANDBOX";
}

export interface IGenerateApiKeyResponse {
  id: string;
  name: string;
  key: string;
  environment: "LIVE" | "SANDBOX";
}
