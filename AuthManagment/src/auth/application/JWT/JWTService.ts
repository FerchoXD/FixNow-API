import jwt from 'jsonwebtoken';

export class JWTService {
    static generateToken(id:string, email:string): string {
        const payload = { userId: id, email: email };
        return jwt.sign(
            payload, 
            process.env.JWT_SECRET!, 
            { expiresIn: process.env.JWT_EXPIRATION });
    }

    static verifyToken(token: string): jwt.JwtPayload {
        try {
            return jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;

        } catch (error) {
            throw new Error('Token inválido o expirado');
        }
    }
}