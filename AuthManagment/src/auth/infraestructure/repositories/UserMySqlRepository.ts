import { User } from "../../domain/entities/User";
import { UserInterface } from "../../domain/repositories/UserInterface";
import { UserModel } from "../models/MySQL/User";
import bcrypt from "bcrypt";
import { JWTService } from "../../application/JWT/JWTService";
import UserImageModel from '../models/MySQL/UserImage';
import { v4 as uuidv4 } from 'uuid';
import CustomError from "../../application/errors/CustomError";

export class UserMySqlRepository implements UserInterface {
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
            console.log('Buscand:', uuid);
            const user = await UserModel.findOne({
                where: { uuid },
                //include: [{ model: UserImageModel, as: 'images' }]
            });

            if (!user) {
                return {
                    status: 404,
                    message: 'Usuario no encontrado.'
                };
            }

            const data = {
                uuid: user.uuid,
                contact: {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    phone: user.phone,
                    role: user.role
                },
                credential: {
                    email: user.email
                },
                ...(user.role === 'SUPPLIER' && {
                    userProfile: {
                        address: user.address,
                        workexperience: user.workexperience,
                        standardprice: user.standardprice,
                        hourlyrate: user.hourlyrate,
                        selectedservices: user.selectedservices
                    }
                })
            };

            return {
                status: 200,
                data: data
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
    
    async profileData(uuid: string, profileData: any, imageUrls: string[]): Promise<any> {
        try {
            console.log('profileData:', uuid, profileData, imageUrls);
            // Buscar el usuario
            const user = await UserModel.findOne({ where: { uuid } });
            if (!user) {
                throw new Error('Usuario no encontrado.');
            }

            // Actualizar datos del perfil en el usuario
            await user.update(profileData);

            // Si hay nuevas URLs de imágenes, actualizar las imágenes en UserImageModel
            
            // Eliminar imágenes antiguas
            await UserImageModel.destroy({ where: { userUuid: uuid } });


            console.log('User uuid:', uuid);
            console.log('Image urls:', imageUrls);
            // Guardar las nuevas imágenes
            for (const url of imageUrls) {
                console.log('URL:', url);
                console.log('UUID:', uuid);
                console.log("imageUrls:", imageUrls);
                await UserImageModel.create({
                    userUuid: uuid,
                    images: url,  // Guardar cada URL en una fila separada
                });
            }
            

            return user; 
        } catch (error) {
            console.error('Error actualizando el perfil:', error);
            throw error;
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
                token: token
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