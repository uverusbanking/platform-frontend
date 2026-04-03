export interface ILocation {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  type: "country" | "region" | "state" | "lga";
  level: number;
  children?: ILocation[];
}

export interface IKYCDocumentType {
  label: string;
  value: string;
}

export interface IEmploymentStatus {
  label: string;
  value: string;
}

export interface IKinRelationship {
  label: string;
  value: string;
}
