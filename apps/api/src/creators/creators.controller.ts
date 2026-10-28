import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { CreatorsRepository } from './creators.repository';
import { toPublicCreator } from './creator';

@Controller('creators')
export class CreatorsController {
  constructor(private readonly creators: CreatorsRepository) {}

  @Get(':handle')
  async getByHandle(@Param('handle') handle: string) {
    const creator = await this.creators.findByHandle(handle);
    if (!creator) throw new NotFoundException();
    return toPublicCreator(creator);
  }
}
