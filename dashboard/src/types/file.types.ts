export interface IFileUploadResponse {
  id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
}

export interface IUploadFilePayload {
  file: File;
  documentType: string;
  userId?: string;
  fileType?: string;
}
