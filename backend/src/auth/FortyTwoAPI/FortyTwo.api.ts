import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios"
import axios, { AxiosError } from 'axios';

@Injectable()
export class FortyTwoApi {
  constructor(private http: HttpService) {}

  private code: string;
  private access_code: string = '268950f6e6926c8630573afba49eef572ac7106f4c3800b3e2b9224143c6b566';
  private refresh_token: string = '61db9fb0f7bd08cba2ca98046bda6550379193e88dc30e5f10435f8cbfe8f6a6';

  private data;

  setCode(code: string) {
    this.code = code;
  }

  get getCode(): string {
    return this.code;
  }

  formData() {
    this.data.append('grant_type', 'authorization_code');
    this.data.append('client_id', process.env.CLIENT_ID);
    this.data.append('client_secret', process.env.CLIENT_SECRET);
    this.data.append('code', this.code);
    this.data.append('redirect_uri', process.env.REDIRECT_URI);
  }

  retriveAccessToken() {
    const headers = {
      'Content-Type': 'application/json',
    }

    const data = {
      'grant_type': 'authorization_code',
      'client_id': process.env.CLIENT_ID,
      'client_secret': process.env.CLIENT_SECRET,
      'code': this.code,
      'redirect_uri': process.env.REDIRECT_URI,
    }

    axios.post(
      'https://api.intra.42.fr/oauth/token',
      JSON.stringify(data),
      { headers }
      )
      .then(function(response) {
        this.access_code = response.data.access_token;
        this.refresh_token = response.data.refresh_token;
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  fetchUser() {
    let bearer: string = 'Bearer ' + this.access_code;
    const headers = {
    'Authorization': bearer
    };

    axios.get('https://api.intra.42.fr/v2/me', { headers })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    }
}
