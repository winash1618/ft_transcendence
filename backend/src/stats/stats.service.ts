import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';

@Injectable()
export class StatsService {
	constructor(private prisma: PrismaService) { }
  create(createStatDto: CreateStatDto) {
    return this.prisma.matchHistory.create({ data: createStatDto });
  }

  findAll() {
    return this.prisma.matchHistory.findMany();
  }

  findOne(id: number) {
    return this.prisma.matchHistory.findUnique({ where: { id } });
  }

  update(id: number, updateStatDto: UpdateStatDto) {
    return this.prisma.matchHistory.update({ where: { id }, data: updateStatDto });
  }

  remove(id: number) {
    return this.prisma.matchHistory.delete({ where: { id } });
  }
}
