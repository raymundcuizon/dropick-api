export class SigninResponse {
  accessToken: string;
  tokenType?: string = 'bearer';
  expiresIn?: number | string;
  refreshToken?: string;
  type?: string;
}
