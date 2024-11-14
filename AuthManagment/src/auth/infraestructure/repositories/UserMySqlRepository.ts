import { User } from "../../domain/entities/User";
import { UserInterface } from "../../domain/repositories/UserInterface";
import { UserModel } from "../models/MySQL/User";
import bcrypt from "bcrypt";
import { JWTService } from "../../application/JWT/JWTService";
import UserImageModel from "../models/MySQL/UserImage";

export class UserMySqlRepository implements UserInterface {
    
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
                ...(user.role === 'supplier' && {
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
            const user = await UserModel.findOne({ where: { uuid } });
            if (!user) {
                return {
                    status: 404,
                    message: 'Usuario no encontrado.'
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