import { MercadoPagoConfig, Payment, PaymentMethod, Preference } from 'mercadopago';
import { v4 as uuidv4 } from 'uuid';

export class ServiceMercadoPago {
    constructor() {}

    async chekout(data: any): Promise<any> {

        console.log('data en checkout', data);

        const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as string });

        const preference = new Preference(client);

        const response = await preference.create({
            body: {
                payment_methods: {
                    excluded_payment_methods: [],
                    excluded_payment_types: [
                        { id: 'atm' },
                        { id: 'credit_card' }
                    ],
                    installments: 1
                },
                items: [
                    {
                        id: 'id-sus-1',
                        title: 'Fixnow',
                        description: 'Suscripción unica a Fixnow',
                        quantity: 1,
                        unit_price: 55,
                        currency_id: 'MXN'
                    }
                ],
                payer: {
                    name: data.userData.firstname,
                    surname: data.userData.lastname,
                    email: data.userData.email,
                    phone: {
                        area_code: '52',
                        number: data.userData.phone
                    }
                },
                back_urls: {
                    success: process.env.BACK_URL_SUCCESS as string,
                    failure: process.env.BACK_URL_FAILURE as string,
                    pending: process.env.BACK_URL_PENDING as string 
                },
                auto_return: 'approved',
            }
        });
        console.log("mi response:",response);
        const result = {
            id: response.id, // ID único de la preferencia
            init_point: response.init_point, // URL para redirigir al usuario
            sandbox_init_point: response.sandbox_init_point, // URL de pruebas
            items: response.items, // Detalle de los productos o servicios
            payer: {
                name: response.payer?.name,
                surname: response.payer?.surname,
                email: response.payer?.email,
                phone: response.payer?.phone,
            },
            date_created: response.date_created, // Fecha de creación
            //collector_id: response.collector_id, // ID del vendedor
            //operation_type: response.operation_type // Tipo de operación en este caso 'regular_payment'
        };
    
        console.log('Datos extraídos para guardar en la base de datos:', result);
    
        // Retornar la información relevante
        return result;
    }

    private async CreateIdempotency(uuid:string) {
        const NewUuid = uuidv4();
        return NewUuid + uuid;
    }
        
}