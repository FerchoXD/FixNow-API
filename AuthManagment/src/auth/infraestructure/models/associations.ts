import { associateUserCalendarModel } from '../models/MySQL/UserCalendar';
import { associateUserImageModel } from '../models/MySQL/UserImage';
import {associateUserModelWithImages, associateUserModelWithCalendars}  from '../models/MySQL/User';

export const associateModels = () => {
    associateUserCalendarModel();
    associateUserImageModel();
    associateUserModelWithImages();
    associateUserModelWithCalendars();
};
