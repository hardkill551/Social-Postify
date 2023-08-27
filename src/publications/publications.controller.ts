import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post()
  async create(@Body() createPublicationDto: CreatePublicationDto) {
    return await this.publicationsService.create(createPublicationDto);
  }

  @Get()
  async findAll() {
    return await this.publicationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.publicationsService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePublicationDto: UpdatePublicationDto) {
    try {
      return await this.publicationsService.update(+id, updatePublicationDto);
    } catch (error) {
      if(error.message === "Forbidden") throw new ForbiddenException()
      throw new NotFoundException()
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.publicationsService.remove(+id);
  }
}
