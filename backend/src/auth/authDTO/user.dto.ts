export interface userData {
  id: string;
  username: string;
  displayName: string;
  lastName: string;
  firstName: string | null;
  secret_code: string | null;
  is_authenticated: boolean;
  profile_picture: string | null;
}
