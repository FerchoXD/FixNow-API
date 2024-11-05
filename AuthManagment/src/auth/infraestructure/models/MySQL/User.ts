import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../database/Config/MySQL/database';

export class UserModel extends Model {
    public id!: string;
    public firstname!: string;
    public lastName!: string;
    public phone!: string;
    public email!: string;
    public password!: string;
    public role!: string;
    public profileurl!: string;
    public profilefilenames!: string;
    public address!: string;
    public workexperience!: string;
    public standardprice!: number;
    public hourlyrate!: number;
    public selectedservices!: string[];
    public token!: string | null;
    public activationToken!: string | null;
    public verifiedAt!: Date | null;
}

UserModel.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, 
    },
    firstname: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profileurl: {
        type: DataTypes.STRING,
        allowNull: true, 
        defaultValue: 'PENDING',
    },
    profilefilenames: {
        type: DataTypes.STRING, 
        allowNull: true,
        defaultValue: 'PENDING',
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'PENDING',
    },
    workexperience: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'PENDING',
    },
    standardprice: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
    },
    hourlyrate: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
    },
    selectedservices: {
        type: DataTypes.JSON, 
        allowNull: true,
        defaultValue: [],
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    activationToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
});

export default UserModel;
