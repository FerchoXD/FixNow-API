import mongoose from 'mongoose';

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log('Conectado a MongoDB exitosamente.');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
  }
};

export default connectMongoDB;