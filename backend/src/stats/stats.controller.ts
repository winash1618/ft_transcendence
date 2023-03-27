import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('stats')
@ApiTags('stats')
export class StatsController {
  // constructor(private readonly statsService: StatsService) {}

  // @Post()
  // create(@Body() createStatDto: CreateStatDto) {
  //   return this.statsService.create(createStatDto);
  // }

  // @Get()
  // findAll() {
  //   return this.statsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.statsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStatDto: UpdateStatDto) {
  //   return this.statsService.update(+id, updateStatDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.statsService.remove(+id);
  // }
}
