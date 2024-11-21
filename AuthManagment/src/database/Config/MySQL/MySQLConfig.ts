import sequelize from './database';
import { DatabaseConfig } from '../DatabaseConfig';
import { associateUserModelWithImages, associateUserModelWithCalendars } from '../../../auth/infraestructure/models/MySQL/User';
import { associateUserImageModel } from '../../../auth/infraestructure/models/MySQL/UserImage';
import { associateUserCalendarModel } from '../../../auth/infraestructure/models/MySQL/UserCalendar';

export class MySQLConfig implements DatabaseConfig {
  async initialize(): Promise<void> {
    // Inicializa las asociaciones específicas
    associateUserModelWithImages();
    associateUserModelWithCalendars();
    associateUserImageModel();
    associateUserCalendarModel();

    // Sincroniza el esquema con la base de datos
    await sequelize.sync({ force: false });
    console.log('MySQL database synchronized.');
  }
}
