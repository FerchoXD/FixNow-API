import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../database/Config/MySQL/database';
import UserModel from './User';

export class UserImageModel extends Model {
    public id!: string;
    public userId!: string; 
    public images!: string[]; 
}

UserImageModel.init({
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
    images: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'UserImage',
    tableName: 'images',
    timestamps: true,
});

export const associateUserImageModel = () => {
    UserImageModel.belongsTo(UserModel, { foreignKey: 'userUuid' });
};


export default UserImageModel;
