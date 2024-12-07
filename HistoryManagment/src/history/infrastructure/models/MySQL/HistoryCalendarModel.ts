import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../database/config/MySQL/database';

export enum CalendarStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    DONE = 'DONE',
    CANCELLED = 'CANCELLED',
}

export class HistoryCalendarModel extends Model {
    public uuid!: string;
    public customerUuid!: string;
    public supplierUuid!: string;
    public title!: string;
    public description!: string;
    public agreedPrice!: number;
    public agreedDate!: Date;
    public status!: CalendarStatus;
}

HistoryCalendarModel.init({
    uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    customerUuid: {
        type: new DataTypes.UUID(),
        allowNull: false,
    },
    supplierUuid: {
        type: new DataTypes.UUID(),
        allowNull: false,
    },
    title: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    description: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    agreedPrice: {
        type: new DataTypes.FLOAT(),
        allowNull: false,
    },
    agreedDate: {
        type: new DataTypes.DATE(),
        allowNull: false,
    },
    status: {
        type: new DataTypes.ENUM(CalendarStatus.PENDING, CalendarStatus.CONFIRMED,CalendarStatus.DONE, CalendarStatus.CANCELLED),
        allowNull: false,
        defaultValue: CalendarStatus.PENDING,
    },
}, {
    sequelize,
    modelName: 'HistoryCalendar',
    tableName: 'calendar',
    timestamps: true,
});

export default HistoryCalendarModel;
