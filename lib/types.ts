export type Profile = {
  id: string;
  email: string;
  display_name: string | null;
  role: "member" | "admin" | "owner";
  created_at: string;
};

export type Announcement = {
  id: string;
  text: string | null;
  creation_time: string | null;
  update_time: string | null;
  fetched_at: string;
};

export type MeetingNote = {
  id: string;
  title: string;
  content: string;
  meeting_date: string;
  created_by: string | null;
  created_at: string;
};

export type ProjectIdea = {
  id: string;
  title: string;
  description: string | null;
  submitted_by: string | null;
  pinned: boolean;
  approved: boolean;
  created_at: string;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  content: string;
  file_url: string | null;
  file_type: string | null;
  created_at: string;
  profiles?: Pick<Profile, "display_name" | "role">;
};
