import 'reflect-metadata';
import { Container } from 'inversify';
import { DriverQueryRepository } from './drivers/repositories/driver.query.repository';
import { DriversRepository } from './drivers/repositories/drivers.repository';
import { DriverQueryService } from './drivers/application/driver.query.service';
import { DriversService } from './drivers/application/drivers.service';
import { DriversController } from './drivers/routes/controllers/drivers.controller';
import { RideQueryRepository } from './rides/repositories/ride.query.repository';
import { RidesRepository } from './rides/repositories/rides.repository';
import { RidesService } from './rides/application/rides.service';
import { RidesQueryService } from './rides/application/rides.query.service';
import { RidesController } from './rides/routes/controllers/rides.controller';

export const container = new Container();

container.bind(DriverQueryRepository).to(DriverQueryRepository);
container.bind(DriversRepository).to(DriversRepository);

container.bind(DriverQueryService).to(DriverQueryService);
container.bind(DriversService).to(DriversService);

container.bind(DriversController).to(DriversController);

container.bind(RideQueryRepository).to(RideQueryRepository);
container.bind(RidesRepository).to(RidesRepository);

container.bind(RidesService).to(RidesService);
container.bind(RidesQueryService).to(RidesQueryService);

container.bind(RidesController).to(RidesController);
