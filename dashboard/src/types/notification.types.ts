export interface INotification {
  id: string;
  owner_type: string;
  owner_id: string;
  title: string;
  message: string;
  type: string;
  severity: "success" | "warning" | "error" | "info";
  category: string;
  read: boolean;
  metadata: any | null;
  created_at: string;
  updated_at: string;
}
