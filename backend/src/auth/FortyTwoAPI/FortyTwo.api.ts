import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios"
import axios, { AxiosError } from 'axios';
import { TokenDTO } from "./42DTO/access42.dto";


@Injectable()
export class FortyTwoApi {
  private _tokenDTO: TokenDTO;
  constructor(private http: HttpService) {
    this._tokenDTO = new TokenDTO();
  }

  private _code: string;

  get code(): string {
    return this._code;
  }

  set code(code: string) {
    this._code = code;
  }

  set tokenDTO(token: TokenDTO) {
    this._tokenDTO = token;
  }

  async retriveAccessToken(): Promise<TokenDTO> {
    const headers = {
      'Content-Type': 'application/json',
    };

    const data = {
      grant_type: 'authorization_code',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: this.code,
      redirect_uri: process.env.REDIRECT_URI,
    };

    try {
      const response = await axios.post(
        'https://api.intra.42.fr/oauth/token',
        JSON.stringify(data),
        { headers },
      );
      const responseData = response.data;
      const dto: TokenDTO = {
        access_token: responseData.access_token,
        token_type: responseData.token_type,
        expires_in: responseData.expires_in,
        refresh_token: responseData.refresh_token,
        scope: responseData.scope,
        created_at: responseData.created_at
      };
      return dto;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  fetchUser() {
    let bearer: string = 'Bearer ' + this._tokenDTO.access_token;
    const headers = {
    'Authorization': bearer
    };

    console.log(headers);

    axios.get('https://api.intra.42.fr/v2/me', { headers })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    }
}
