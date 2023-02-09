import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios"
import axios, { AxiosError } from 'axios';

@Injectable()
export class FortyTwoApi {
  constructor(private http: HttpService) {}

  private code: string;
  private access_code: string;
  private refresh_token: string;

  private data = {
    'grant_type': 'authorization_code',
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET,
    'redirect_uri': process.env.REDIRECT_URI,
    'code': this.getCode
  };

  get getCode(): string {
    return this.code;
  }

  retriveAccessToken() {
    const headers = {
      'Content-Type': 'application/json',
    }

    axios.post(
      'https://api.intra.42.fr/oauth/token',
      JSON.stringify(this.data),
      { headers }
      )
      .then(function(response) {
        this.access_code = response.data.access_token;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}
