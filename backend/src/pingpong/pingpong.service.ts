import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { JwtService } from '@nestjs/jwt';
import { CreatePingpongDto } from './dto/create-pingpong.dto';
import { UpdatePingpongDto } from './dto/update-pingpong.dto';

@Injectable()
export class PingpongService {

  constructor(private jwtService: JwtService) {}

  setUserToSocket(socket: Socket) {
    const jwt = parse(socket.handshake.auth.jwt);
    if (!jwt) {
      socket.disconnect();
      return ;
    }

    const payload: any = this.jwtService.verify(jwt, {
      secret: process.env.JWT_SECRET,
    });

    const { userID } = payload;
    socket.data.userID = userID;
  }

	create(createPingpongDto: CreatePingpongDto) {
		return 'This action adds a new pingpong';
	}

	findAll() {
		return `This action returns all pingpong`;
	}

	findOne(id: number) {
		return `This action returns a #${id} pingpong`;
	}

	update(id: number, updatePingpongDto: UpdatePingpongDto) {
		return `This action updates a #${id} pingpong`;
	}

	remove(id: number) {
		return `This action removes a #${id} pingpong`;
	}
}
