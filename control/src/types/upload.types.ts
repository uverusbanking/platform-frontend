export interface IUploadResponse {
  id: string;
  filename: string;
  size: number;
  mimetype: string;
  file_url: string;
}

export interface IUploadParams {
  file: File;
  userType: "PLATFORM" | "ORGANISATION" | "CUSTOMER";
}
