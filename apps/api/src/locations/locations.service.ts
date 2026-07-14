import { Inject, Injectable } from '@nestjs/common';
import {
  CreateLocation,
  type CreateLocationInput,
  type Location,
  type LocationRepository,
} from '@ananya/inventory';
import { LOCATION_REPOSITORY } from './location.tokens';

@Injectable()
export class LocationsService {
  private readonly createLocation: CreateLocation;

  constructor(
    @Inject(LOCATION_REPOSITORY)
    repository: LocationRepository,
  ) {
    this.createLocation = new CreateLocation(repository);
  }

  create(input: CreateLocationInput): Promise<Location> {
    return this.createLocation.execute(input);
  }
}
