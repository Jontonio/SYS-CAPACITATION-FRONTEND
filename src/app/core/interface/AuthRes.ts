interface UserAuth {
  message: string;
  status: number;
  error: boolean;
  data: CurrentUser;
}

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  email_verified_at?: any;
  created_at: string;
  updated_at: string;
  token: string;
  roles: Role[];
}

interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: Pivot;
}

interface Pivot {
  model_type: string;
  model_id: number;
  role_id: number;
}

export {
    UserAuth,
    CurrentUser
}