import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../database/config/MySQL/database'; 
import { v4 as uuidv4 } from 'uuid';

export class PaymentModel extends Model {
    public uuid!: number;
    public userUuid!: string;
    public status!: string; // Estado de la suscripción ('active', 'cancelled', etc.)
    public paymentId!: string; // ID de pago de Mercado Pago
    public amount!: number; // Monto de la suscripción
    public createdAt!: Date;
    public updatedAt!: Date;
}

PaymentModel.init(
    {   
        uuid: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
        userUuid: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING, defaultValue: 'pending' },
        paymentId: { type: DataTypes.STRING, allowNull: false },
        amount: { type: DataTypes.FLOAT, allowNull: false },
    },
    {
        sequelize,
        tableName: 'subscriptions',
        timestamps: true,
    }
);

export default PaymentModel;
