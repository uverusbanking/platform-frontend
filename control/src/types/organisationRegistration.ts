export interface directorInterface {
  // id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  bvn: string;
  nin: string;
  idType: string;
  idNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
  ownershipPercentage?: number;
  isBeneficialOwner: boolean;
}

export interface documentInterface {
  key: string;
  title: string;
  description: string;
  required: boolean;

  id: string;
  fileUrl: string;
  documentType: string;
  isLoading: boolean;
}
