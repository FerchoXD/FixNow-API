import mongoose from 'mongoose';
const user = process.env.MONGO_USER || 'admin';
const password = process.env.MONGO_PASSWORD || 'admin';
const cluster = process.env.MONGO_CLUSTER;
const database = process.env.MONGO_DATABASE;

const uri = `mongodb+srv://${user}:${password}@${cluster}.faonfdg.mongodb.net/${database}?retryWrites=true&w=majority&appName=${cluster}`;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Conectado a MongoDB exitosamente.');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
  }
};

export default connectMongoDB;