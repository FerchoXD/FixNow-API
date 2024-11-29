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

    async rabbitRaiting(userUuid: any, polaridad :any): Promise<any> {
        console.log('Datos recibidos de pagos:', userUuid);
        console.log('Datos recibidos de pagos:', polaridad );
        
        await UserModel.update({ relevance: polaridad }, { where: { uuid: userUuid } });

        const userdata = await UserModel.findOne({ 
            where: { uuid: userUuid },
            attributes:['fullname']
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
            where: { uuid: data, role: 'SUPPLIER'},
            attributes: ['uuid', 'firstname','lastname', 'email', 'phone', 'role', ]
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

    async rabbitHistory(uuid: string): Promise<any> {
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
    
        console.log('Historial:', typeof(history.fullname));
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

            // const data = {
            //     uuid: user.uuid,
            //     contact: {
            //         firstname: user.firstname,
            //         lastname: user.lastname,
            //         phone: user.phone,
            //         role: user.role
            //     },
            //     credential: {
            //         email: user.email
            //     },
            //     ...(user.role === 'SUPPLIER' && {
            //         userProfile: {
            //             address: user.address,
            //             workexperience: user.workexperience,
            //             standardprice: user.standardprice,
            //             hourlyrate: user.hourlyrate,
            //             selectedservices: user.selectedservices
            //         }
            //     })
            // };

            return {
                status: 200,
                data: user,
                images: images,
                calendar: calendar
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
            if(!uuid || uuid === "undefined"){
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
        try {
            // Buscar el usuario
            const user = await UserModel.findOne({ where: { uuid } });
            if (!user) {
                throw new Error('Usuario no encontrado.');
            }
    
            // Actualizar datos del perfil en el usuario
            await this.updateUserProfile(user, profileData);
    
            // Actualizar el calendario si se pasa un nuevo calendario
            if (calendar && calendar.length > 0) {
                await this.updateUserCalendar(uuid, calendar);
            }
    
            // Si hay nuevas URLs de imágenes, actualizar las imágenes en UserImageModel
            if (imageUrls && imageUrls.length > 0) {
                await this.updateUserImages(uuid, imageUrls);
            }
    
            // Recuperar los datos actualizados del usuario
            const updatedUser = await UserModel.findOne({
                where: { uuid },
                include: [
                    { model: UserImageModel, as: 'images', required: false }, // Incluye imágenes del usuario
                    { model: UserCalendarModel, as: 'calendar', required: false } // Incluye calendario del usuario
                ]
            });
    
            if (!updatedUser) {
                throw new Error('No se pudo recuperar el usuario actualizado.');
            }
    
            // Devolver los datos actualizados (usuario, calendario, imágenes)
            return {
                data: updatedUser,
            };
        } catch (error) {
            console.error('Error actualizando el perfil:', error);
            throw error;
        }
    }
    

    async updateUserCalendar(uuid: string, calendar: any[]): Promise<void> {
        try {
            // Eliminar el calendario existente para este usuario
            await UserCalendarModel.destroy({ where: { userUuid : uuid } });
    
            const calendarEntries = calendar.map((day) => ({
                uuid: uuidv4(),
                userUuid:uuid,
                day: day.day, 
                active: day.activo, 
                start: day.inicio, 
                end: day.fin, 
            }));
    
            await UserCalendarModel.bulkCreate(calendarEntries);
        } catch (error) {
            console.error('Error actualizando el calendario del usuario:', error);
            throw new Error('No se pudo actualizar el calendario del usuario.');
        }
    }
    
    
    private async updateUserProfile(user: any, profileData: any): Promise<void> {
        try {
            await user.update(profileData);
        } catch (error) {
            console.error('Error actualizando los datos del usuario:', error);
            throw new Error('No se pudo actualizar el perfil del usuario.');
        }
    }
    
    async updateUserImages(uuid: string, imageUrls: string[]): Promise<void> {
        try {
            // Eliminar imágenes antiguas
            await UserImageModel.destroy({ where: { userUuid: uuid } });
    
            // Guardar las nuevas imágenes
            for (const url of imageUrls) {
                await UserImageModel.create({
                    userUuid: uuid,
                    images: url, // Guardar cada URL en una fila separada
                });
            }
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
        try{
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
        }catch(error){
            console.error('Error al cerrar sesión:', error);
            return {
                status: 500,
                message: 'Error interno del servidor.'
            };
        }
    }
}