import { response } from "express";
import { Calendar } from "../../domain/entities/calendar";
import { HistoryInterface } from "../../domain/repositories/HistoryInterface";
import HistoryCalendarModel from "../models/MySQL/HistoryCalendarModel";

export class HistoryMySqlRepository implements HistoryInterface {
    async historyCustomer(fullname: string, customerUuid: string): Promise<any> {
        try{
            const history = await HistoryCalendarModel.findAll({
                where: { supplierUuid: customerUuid },
                attributes: ['uuid','title', 'description', 'status', 'createdAt']
            });

            console.log('Historial de citas:', history);
    
            // Validar si no se encontraron registros
            if (!history || history.length === 0) {
                return {
                    status: 404,
                    message: 'No se encontraron citas.'
                };
            }
    
            // Transformar resultados en un formato limpio
            const historyData = history.map(record => record.toJSON());
    
            // Retornar el historial procesado
            return {
                status: 200,
                message: 'Historial de citas encontrado.',
                data: {
                    fullname: fullname,
                    history: historyData
                }
            };
        } catch (error) {
            console.error('Error en historySupplier:', (error as Error).message);
    
            // Manejar error interno
            return {
                status: 500,
                message: 'Error interno del servidor.',
                error: (error as Error).message
            };
        }
    }

    async historySupplier(fullname: string, supplierUuid: string): Promise<any> {
        try {
            // Buscar historial en la base de datos
            const history = await HistoryCalendarModel.findAll({
                where: { supplierUuid: supplierUuid },
                attributes: ['uuid','title', 'description', 'status', 'createdAt']
            });
    
            console.log('Historial de citas:', history);
    
            // Validar si no se encontraron registros
            if (!history || history.length === 0) {
                return {
                    status: 404,
                    message: 'No se encontraron citas.'
                };
            }
    
            // Transformar resultados en un formato limpio
            const historyData = history.map(record => record.toJSON());
    
            // Retornar el historial procesado
            return {
                status: 200,
                message: 'Historial de citas encontrado.',
                data: {
                    fullname: fullname,
                    history: historyData
                }
            };
        } catch (error) {
            console.error('Error en historySupplier:', (error as Error).message);
    
            // Manejar error interno
            return {
                status: 500,
                message: 'Error interno del servidor.',
                error: (error as Error).message
            };
        }
    }
    

    async create(customerUuid:string,supplierUuid:string,title: string, description: string, agreedPrice: number, agreedDate: Date): Promise<any> {
        try {

            const existingHistory = await HistoryCalendarModel.findOne({
                where: {
                    customerUuid: customerUuid,
                    supplierUuid: supplierUuid,
                    title: title,
                    description: description,
                    agreedPrice: agreedPrice,
                    agreedDate: agreedDate
                }
            });
    
            if (existingHistory) {
                return {
                    status: 400,
                    message: 'Ya ha sido creada una cita con esos mismos datos.',
                };
            }
    
            const historyCreated = await HistoryCalendarModel.create({
                customerUuid: customerUuid,
                supplierUuid: supplierUuid,
                title: title,
                description: description,
                agreedPrice: agreedPrice,
                agreedDate: agreedDate,
            });
    
            return {
                message: 'Cita creada con éxito.',
                data: historyCreated
            };
    
        } catch (error) {
            console.error(error);
            return {
                message: 'Ocurrió un error en el servidor.',
                error: (error as Error).message || error,
            };
        }
    }
    
}