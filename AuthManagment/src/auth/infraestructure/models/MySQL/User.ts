import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../database/Config/MySQL/database';
import { Contact } from '../../../domain/entities/Contact';
import { Credential } from '../../../domain/entities/Credential';
import { Status } from '../../../domain/entities/Status';
import { UserProfile } from '../../../domain/entities/UserProfile';
import UserImageModel from './UserImage';
import UserCalendarModel from './UserCalendar';

export class UserModel extends Model {
    public uuid!: string;  // Agregado
    public googleId!: string;  // Agregado
    public contact!: Contact;  // Agregado
    public credential!: Credential;  // Agregado
    public status!: Status;  // Agregado
    public userProfile!: UserProfile;  // Agregado
    public firstname!: string;
    public lastname!: string;
    public fullname!: string;
    public phone!: string;
    public email!: string;
    public password!: string;
    public role!: "CUSTOMER" | "SUPPLIER";
    public address!: string;
    public workexperience!: string;
    public standardprice!: number;
    public hourlyrate!: number;
    public selectedservices!: string[];
    public token!: string | null;
    public activationToken!: string | null;
    public verifiedAt!: Date | null;
    public quotation!: number;
    public relevance!: number;
}

UserModel.init({
    uuid: { 
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    firstname: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fullname:{
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
        type: DataTypes.ENUM('CUSTOMER', 'SUPPLIER'),
        allowNull: false,
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
    quotation: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    relevance: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
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

export const associateUserModelWithImages = () => {
    UserModel.hasMany(UserImageModel, { foreignKey: 'userUuid' });
};

export const associateUserModelWithCalendars = () => {
    UserModel.hasMany(UserCalendarModel, { foreignKey: 'userUuid' });
};


export default UserModel;
