import { Author } from "./post";

export interface NotificationItem {
  _id: string;
  id?: string;
  recipient: string;
  sender: Author;
  type: "reaction" | "comment";
  post: {
    _id: string;
    id?: string;
    title: string;
  };
  comment?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponseData {
  notifications: NotificationItem[];
}
