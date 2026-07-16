import { Inject, Injectable } from '@nestjs/common';
import {
  CreateLocation,
  type CreateLocationInput,
  type Location,
  type LocationRepository,
  LocationNotFoundError,
} from '@ananya/inventory';
import { LOCATION_REPOSITORY } from './location.tokens';

@Injectable()
export class LocationsService {
  private readonly createLocation: CreateLocation;

  constructor(
    @Inject(LOCATION_REPOSITORY)
    private readonly repository: LocationRepository,
  ) {
    this.createLocation = new CreateLocation(repository);
  }

  create(input: CreateLocationInput): Promise<Location> {
    return this.createLocation.execute(input);
  }

  getAllLocations(): Promise<Location[]> {
    return this.repository.findMany();
  }

  async getLocation(id: string): Promise<Location> {
    const location = await this.repository.findById(id);
    if (!location) {
      throw new LocationNotFoundError(id);
    }
    return location;
  }
}
