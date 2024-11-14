import UserModel from '../models/MySQL/User';
import UserImageModel from '../models/MySQL/UserImage';

UserModel.hasMany(UserImageModel, { foreignKey: 'userUuid' });
UserImageModel.belongsTo(UserModel, { foreignKey: 'userUuid' });
