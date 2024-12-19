import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../database/Config/MySQL/database';
import UserModel from './User';

export class UserCalendarModel extends Model {
    public uuid!: string;
    public userUuid!: string; 
    public day!: string; 
    public isWorking!: boolean;
    public start_time!: string;
    public end_time!: string;

}

UserCalendarModel.init({
    uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    userUuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'uuid',
        },
    },
    day: {
        type: DataTypes.STRING, // Ejemplo: "Lunes"
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    start: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    end: {
        type: DataTypes.TIME,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'UserCalendar',
    tableName: 'calendar',
    timestamps: true,
});

export const associateUserCalendarModel = () => {
    UserCalendarModel.belongsTo(UserModel, { foreignKey: 'userUuid' });
};



export default UserCalendarModel;
