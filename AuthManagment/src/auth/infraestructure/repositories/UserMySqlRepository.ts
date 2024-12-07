import { User } from "../../domain/entities/User";
import { UserInterface } from "../../domain/repositories/UserInterface";
import { UserModel } from "../models/MySQL/User";
import bcrypt from "bcrypt";
import { JWTService } from "../../application/JWT/JWTService";
import UserImageModel from '../models/MySQL/UserImage';
import { v4 as uuidv4 } from 'uuid';
import CustomError from "../../application/errors/CustomError";
import UserCalendarModel from '../models/MySQL/UserCalendar';
import { Op, Sequelize } from 'sequelize';
import passport from 'passport';

export class UserMySqlRepository implements UserInterface {
    async findTokenfcmForHistory(userUuid: string): Promise<any> {
        
        const getToken = await UserModel.findOne({ 
            where: { uuid: userUuid },
            attributes: ['tokenfcm']
        });
        console.log('Token:', getToken?.tokenfcm);
        if (getToken === null) {
            return {
                status: 404,
                message: 'Token no encontrado.'
            };
        }

        return getToken.tokenfcm;
    }
    async saveTokenFcm(userUuid: string, token: string): Promise<any> {
        console.log('Datos recibidos en saveTokenFcm:', { userUuid, token });
    
        // Verifica si el usuario existe
        const userExists = await UserModel.findOne({ where: { uuid: userUuid } });
        
        console.log('Usuario encontrado:', userExists);

        if (!userExists) {
            throw new Error('Usuario no encontrado.');
        }
    
        // Intenta actualizar el token
        const [updatedRows] = await UserModel.update(
            { tokenfcm: token },
            { where: { uuid: userUuid } }
        );
    
        if (updatedRows === 0) {
            throw new Error('El token no pudo ser actualizado.');
        }
    
        return {
            status: 201,
            message: 'Token guardado correctamente.'
        };
    }
    
    
    rabbitHistorySupplier(uuid: string): Promise<any> {
        return this.rabbitHistory(uuid);
    }
    rabbitHistoryCustomer(uuid: string): Promise<any> {
        return this.rabbitHistory(uuid);
    }
    async getAllSuppliers(validField: string): Promise<User[] | { status: number; message: string }> {
        console.log('ValidField:', validField);
    
        try {
            if (validField === "All") {
                const suppliers = await UserModel.findAll({
                    where: {
                        role: 'SUPPLIER',
                        verifiedAt: { [Op.not]: null },
                    },
                    include: [
                        {
                            model: UserImageModel,
                            as: 'images',
                            attributes: ['images'], // Solo incluimos el campo 'images'
                        },
                        {
                            model: UserCalendarModel,
                            as: 'calendar',
                            attributes: ['uuid','userUuid','day', 'start', 'end', 'active','createdAt','updatedAt'], // Solo incluimos los campos 'day', 'start' y 'end'
                        },
                    ],
                });
                console.log('Proveedores encontrados:', suppliers);
                return suppliers;
            } else {
                // Si no, filtra por categoría seleccionada en selectedservices
                const suppliers = await UserModel.findAll({
                    where: {
                        role: 'SUPPLIER',
                        verifiedAt: { [Op.not]: null },
                        [Op.and]: Sequelize.literal(`JSON_CONTAINS(selectedservices, '"${validField}"')`),
                    },
                    include: [
                        {
                            model: UserImageModel,
                            as: 'images',
                            attributes: ['images'], // Solo incluimos el campo 'images'
                        },
                        {
                            model: UserCalendarModel,
                            as: 'calendar',
                            attributes: ['uuid','userUuid','day', 'start', 'end', 'active','createdAt','updatedAt'], // Solo incluimos los campos 'day', 'start' y 'end'
                        },
                    ],
                });
    
                // Si no hay proveedores, devolver 404
                if (!suppliers || suppliers.length === 0) {
                    return {
                        status: 404,
                        message: 'No se encontraron proveedores para la categoría seleccionada.',
                    };
                }
    
                // Respuesta exitosa
                return suppliers;
            }
        } catch (error) {
            console.error("Error en getAllSuppliers:", error);
            throw new Error('Error interno del servidor.'); // Se lanza el error para manejarlo a nivel del controlador
        }
    }
    

    async rabbitRaiting(userUuid: any, polaridad: any): Promise<any> {
        console.log('Datos recibidos de pagos:', userUuid);
        console.log('xd:', polaridad);

        if (polaridad === -1) {
            polaridad = 0;
        }

        await UserModel.update({ relevance: polaridad }, { where: { uuid: userUuid } });

        const userdata = await UserModel.findOne({
            where: { uuid: userUuid },
            attributes: ['fullname']
        });
        console.log('Datos recibidos de pagos:', userdata?.dataValues.fullname);

        return {
            status: 200,
            message: 'Usuario actualizado.',
            data: userdata?.dataValues.fullname
        };
    }


    async rabbitPayment(data: any): Promise<any> {

        console.log('Datos recibidos de pagos:', data);

        const payment = await UserModel.findOne({
            where: { uuid: data, role: 'SUPPLIER' },
            attributes: ['uuid', 'firstname', 'lastname', 'email', 'phone', 'role',]
        });

        if (payment?.verifiedAt === null) {
            return {
                status: 403,
                message: 'Usuario no verificado.'
            };
        }

        if (!payment) {
            return {
                status: 404,
                message: 'Usuario no encontrado.'
            };
        }

        return {
            status: 200,
            data: payment
        };

    }
    

    async findRelevantSuppliers(keyPhrases: string[]): Promise<UserModel[]> {
        try {
            const suppliers = await UserModel.findAll({
                where: {
                    role: 'SUPPLIER', // Filtrar solo usuarios con rol SUPPLIER
                    [Op.or]: keyPhrases.map((phrase) => {
                        return Sequelize.where(
                            Sequelize.fn('JSON_CONTAINS', Sequelize.col('selectedservices'), JSON.stringify(phrase)),
                            true
                        );
                    }),
                },
                order: [['relevance', 'DESC']],
            });

            console.log('Proveedores encontrados:', suppliers);

            return suppliers;
        } catch (error) {
            console.error('Error buscando proveedores relevantes:', error);
            throw new Error('No se pudo buscar proveedores relevantes.');
        }
    }

    private async rabbitHistory(uuid: string): Promise<any> {
        console.log('UUID:', uuid);

        // Buscar historial del usuario en la base de datos
        const history = await UserModel.findOne({ where: { uuid } });

        // Si no se encuentra el historial, lanzar un error
        if (!history) {
            throw new CustomError('Historial de provedor no encontrado.', 404);  // 404 Not Found
        }

        // Si la cuenta no está activada, lanzar un error
        if (!history.verifiedAt) {
            throw new CustomError('La cuenta no está activada.', 400);  // 400 Bad Request
        }

        console.log('Historial:', typeof (history.fullname));
        console.log('Historial:', history.fullname);

        return history.fullname;
    }


    async authenticateWithGoogle(googleId: string, fullname: string, email: string, profileUrl: string,): Promise<User> {
        console.log('Google ID desde repo:', googleId);
        console.log('Nombre desde repo:', fullname);
        console.log('Correo desde repo:', email);
        console.log('URL de perfil desde repo:', profileUrl);
        return UserModel.findOrCreate({
            where: { googleId },
            defaults: {
                uuid: uuidv4(),
                fullname,
                email,
                googleId,
                role: 'SUPPLIER',
                verifiedAt: new Date()
            }
        }).then(([user, created]) => {
            if (!created) {
                user.fullname = fullname;
                user.email = email;
                user.verifiedAt = new Date();
                return user.save();
            }

            UserImageModel.findOrCreate({
                where: { userUuid: user.uuid },
                defaults: {
                    userUuid: user.uuid,
                    images: profileUrl
                }
            });

            console.log('Usuario creado repo:', user);

            return user;
        }).then(user => user.toJSON());
    }

    async findByGoogleId(googleId: string): Promise<User | null> {
        const user = await UserModel.findOne({ where: { googleId } });
        return user ? user.toJSON() : null;
    }

    async createUser(user: User): Promise<User> {
        const createdUser = await UserModel.create(
        );
        return createdUser.toJSON();
    }

    getFilters(data: any): Promise<User | any> {
        const filters: any = {
            role: 'supplier',
        };

        if (data.relevance) {
            filters.relevance = data.relevance;
        }

        if (data.service) {
            filters.selectedservices = data.service;
        }

        if (data.quotation) {
            filters.quotation = data.quotation;
        }

        if (data.hourlyrate) {
            filters.hourlyrate = data.hourlyrate;
        }

        return UserModel.findAll({
            where: filters,
        });
    }

    async findProfileById(uuid: string): Promise<User | any> {
        try {

            const user = await UserModel.findOne({ where: { uuid: uuid } });

            const images = await UserImageModel.findAll({ where: { userUuid: uuid } });

            const calendar = await UserCalendarModel.findAll({ where: { userUuid: uuid } });

            if (!user) {
                return {
                    status: 404,
                    message: 'Usuario no encontrado.'
                };
            }
            return {
                status: 200,
                data: {
                    ...user.toJSON(),
                    images: images,
                    calendar: calendar
                }
            };
        } catch (error) {
            console.error('Error al obtener el perfil del cliente:', error);
            return {
                status: 500,
                message: 'Error interno del servidor.'
            };
        }
    }

    async getServices(uuid: string): Promise<any> {
        try {
            if (!uuid || uuid === "undefined") {
                return {
                    status: 400,
                    message: 'UUID no encontrado.'
                }
            }

            const user = await UserModel.findOne({ where: { uuid } });
            if (!user) {
                return {
                    status: 404,
                    message: 'Usuario no encontrado.'
                };
            }

            if (user.role !== 'SUPPLIER') {
                return {
                    status: 403,
                    message: 'No tienes permisos para acceder a este recurso.'
                };
            }

            return {
                status: 200,
                response: user.selectedservices
            };
        } catch (error) {
            console.error('Error al obtener los servicios:', error);
            return {
                status: 500,
                message: 'Error interno del servidor.'
            };
        }
    }

    async profileData(uuid: string, profileData: any, imageUrls: string[], calendar: any[]): Promise<any> {

        console.log('UUID:', uuid);
        console.log('Datos de perfil:', profileData);
        console.log('URLs de imágenes:', imageUrls);
        console.log('Calendario:', calendar);

        const isProfileDataEmpty = !profileData || Object.keys(profileData).length === 0;
        const areImageUrlsEmpty = !imageUrls || imageUrls.length === 0;
        const isCalendarEmpty = !calendar || calendar.length === 0;

        if (isProfileDataEmpty && areImageUrlsEmpty && isCalendarEmpty) {
            return "No hay datos para actualizar";
        }

        try {
            // Buscar el usuario
            const user = await UserModel.findOne({ where: { uuid } });
            if (!user) {
                throw new Error('Usuario no encontrado.',);
            }

            console.log('Usuario encontrado', profileData);
            if (profileData && Object.keys(profileData).length > 0) {
                await this.updateUserProfile(user, profileData);
            }

            if (calendar && calendar.length > 0) {
                await this.updateUserCalendar(uuid, calendar);
            }
            
            if (imageUrls && imageUrls.length > 0) {
                await this.updateUserImages(uuid, imageUrls);
            }
            
            const data = await UserModel.findOne({ 
                where: { uuid },
                include: [
                    {
                        model: UserImageModel,
                        as: 'images',
                        attributes: ['images'], 
                    },
                    {
                        model: UserCalendarModel,
                        as: 'calendar',
                        attributes: ['uuid','userUuid','day', 'start', 'end', 'active','createdAt','updatedAt'],
                    },
                ],
            });


            return {
                status: 200,
                data: data
            };
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async updateUserCalendar(uuid: string, calendar: any): Promise<any> {
        try {
            if (typeof calendar === 'string') {
                try {
                    calendar = JSON.parse(calendar);
                } catch (error: any) {
                    console.error('Error al parsear el calendario como JSON:', error.message);
                    throw new Error('El formato del calendario no es válido.');
                }
            }
    
            if (!Array.isArray(calendar) || calendar.length === 0) {
                console.error('El parámetro calendar no es un arreglo válido o está vacío:', calendar);
                throw new Error('El calendario proporcionado no es válido o está vacío.');
            }
    
            const hasAtLeastOneActiveDay = calendar.some((day: any) => day.activo === true);
            if (!hasAtLeastOneActiveDay) {
                console.error('El calendario debe tener al menos un día laboral.');
                throw new Error('El calendario debe tener al menos un día laboral.');
            }
    
            const updatedEntries = [];
    
            for (const day of calendar) {
                const startValue = day.activo ? day.inicio : null;
                const endValue = day.activo ? day.fin : null;
    
                if (typeof day.day !== 'string') {
                    console.error('El valor de "day" debe ser una cadena:', day);
                    throw new Error('Formato de entrada inválido: el día debe ser una cadena.');
                }
    
                const existingEntry = await UserCalendarModel.findOne({
                    where: { userUuid: uuid, day: day.day },
                });
    
                if (existingEntry) {
                    const updatedEntry = await existingEntry.update({
                        active: day.activo,
                        start: startValue,
                        end: endValue,
                    });
                    updatedEntries.push(updatedEntry);
                } else {
                    const newEntry = await UserCalendarModel.create({
                        uuid: uuidv4(),
                        userUuid: uuid,
                        day: day.day,
                        active: day.activo,
                        start: startValue,
                        end: endValue,
                    });
                    updatedEntries.push(newEntry);
                }
            }
    
            return updatedEntries;
        } catch (error: any) {
            console.error('Error actualizando el calendario del usuario:', error.message);

            if (error.message === 'El calendario debe tener al menos un día laboral.') {
                throw new Error('El calendario debe tener al menos un día laboral.');
            }

            if (error.message === 'El calendario proporcionado no es válido o está vacío.') {
                throw new Error('El calendario proporcionado no es válido o está vacío.');
            }

            throw new Error('No se pudo actualizar el calendario del usuario.');
        }
    }
    
    private async updateUserProfile(user: any, profileData: any): Promise<any> {
        try {
            if (typeof profileData === 'string') {
                try {
                    profileData = JSON.parse(profileData);
                } catch (error) {
                    console.error('Error al parsear profileData:', error);
                    throw new Error('El formato de profileData no es válido.');
                }
            }
            
            if (!profileData || typeof profileData !== 'object') {
                console.error('profileData no es un objeto válido:', profileData);
                throw new Error('profileData no contiene datos válidos.');
            }
            
            const dataToUpdate: Record<string, any> = {};
            if (profileData.address !== undefined) dataToUpdate.address = profileData.address;
            if (profileData.workexperience !== undefined) dataToUpdate.workexperience = profileData.workexperience;
            if (profileData.standardprice !== undefined) dataToUpdate.standardprice = profileData.standardprice;
            if (profileData.hourlyrate !== undefined) dataToUpdate.hourlyrate = profileData.hourlyrate;
            if (profileData.selectedservices !== undefined) dataToUpdate.selectedservices = profileData.selectedservices;
            
            if (Object.keys(dataToUpdate).length === 0) {
                console.log('No hay datos para actualizar.');
                return;
            }
    
            console.log('Datos a actualizar:', dataToUpdate);
            
            return await user.update(dataToUpdate);
        } catch (error) {
            console.error('Error actualizando los datos del usuario:', error);
            throw new Error('No se pudo actualizar el perfil del usuario.');
        }
    }
    
    

    async updateUserImages(uuid: string, imageUrls: string[]): Promise<any> {
        try {
            
            await UserImageModel.destroy({ where: { userUuid: uuid } });
            
            for (const url of imageUrls) {
                await UserImageModel.create({
                    userUuid: uuid,
                    images: url,
                });
            }
            
            const images = await UserImageModel.findAll({ where: { userUuid: uuid } });
            console.log('Imágenes actualizadas correctamente.');
            return images;
        } catch (error) {
            console.error('Error actualizando las imágenes del usuario:', error);
            throw new Error('No se pudo actualizar las imágenes del usuario.');
        }
    }


    async save(user: User): Promise<any> {
        try {
            const userResponse = await UserModel.create({
                id: user.uuid,
                firstname: user.contact.firstname,
                lastname: user.contact.lastname,
                tokenfcm: user.tokenfcm,
                fullname: user.contact.firstname + ' ' + user.contact.lastname,
                phone: user.contact.phone,
                email: user.credential.email,
                password: user.credential.password,
                role: user.contact.role,
                token: user.status.token,
                activationToken: user.status.activationToken,
                verifiedAt: null
            });
            return userResponse.dataValues;
        } catch (error) {
            console.error("Error en el repositorio:", error);
            if (error instanceof Error && 'errors' in error && Array.isArray(error.errors) && error.errors.length > 0) {
                return {
                    message: error.errors[0].message,
                    error: true
                };
            } else {
                return {
                    message: 'Ocurrió un error al guardar el usuario.',
                    error: true
                };
            }
        }
    }

    async update(token: string): Promise<any> {
        try {
            console.log('Token:', token);
            const user = await UserModel.findOne({
                where: {
                    activationToken: token,
                    verifiedAt: null
                }
            });

            console.log('Usuario:', user);

            if (!user) {
                return {
                    status: 404,
                    message: 'Usuario no encontrado o ya activado.'
                };
            }

            user.verifiedAt = new Date();
            await user.save();

            return {
                status: 200,
                response: user
            };
        } catch (error) {
            console.error(error);
            return {
                status: 500,
                message: 'Hubo un problema al intentar la actualización del recurso.'
            };
        }
    }

    async login(email: string, password: string): Promise<any> {
        try {
            const user = await UserModel.findOne({ where: { email: email } });
            if (!user) {
                return {
                    status: 404,
                    message: 'Usuario no encontrado.'
                };
            }

            if (!user.verifiedAt) {
                return {
                    status: 403,
                    message: 'La cuenta no está activada.'
                };
            }

            const passwordIsValid = bcrypt.compareSync(password, user.password);
            if (!passwordIsValid) {
                return {
                    status: 401,
                    message: 'Contraseña incorrecta.'
                };
            }

            const token = JWTService.generateToken(user.uuid, user.email);
            user.token = token;
            await user.save();
            return {
                status: 200,
                message: 'Inicio de sesión exitoso.',
                token: token,
                uuid: user.uuid
            };

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            return {
                status: 500,
                message: 'Error interno del servidor.'
            };
        }
    }

    async logout(email: string): Promise<any | void> {
        try {
            const user = await UserModel.findOne({ where: { email: email } });

            if (!user) {
                return {
                    status: 404,
                    message: 'Usuario no encontrado.'
                };
            }

            if (!user.verifiedAt) {
                return {
                    status: 403,
                    message: 'La cuenta no está activada.'
                };
            }

            if (!user.token) {
                return {
                    status: 403,
                    message: 'No has iniciado sesión.'
                };
            }

            user.token = null;
            await user.save();

            return {
                status: 200,
                message: 'Cierre de sesión exitoso.',
            };
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            return {
                status: 500,
                message: 'Error interno del servidor.'
            };
        }
    }
}