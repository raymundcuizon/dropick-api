export interface JwtPayload {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  isActivated: boolean;
  address: string;
  city: string;
  province: string;
  mobileNumber: string;
  role: string;
}
