import { OAuth2Client } from 'google-auth-library';
import { GoogleAuthUseCase } from '../../../application/usecases/GoogleAuthUseCase';
import { JWTService } from '../../../application/JWT/JWTService';

export class GoogleAuthService {
  private oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  constructor(private googleAuthUseCase: GoogleAuthUseCase) {}

  public async authenticateWithToken(googleToken: string): Promise<any> {
    try {
      console.log('Token recibido en el backend:', googleToken);

      // Verifica el token usando Google Auth
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID, // Coincide con el cliente configurado
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('No se pudo obtener información del token');
      }

      console.log('Payload de Google:', payload);

      const { sub: userId, email, name, picture } = payload;

      // Autentica o registra al usuario en tu base de datos
      const user = await this.googleAuthUseCase.authenticateWithGoogle(
        userId,
        name,
        email,
        picture,
      );

      // Genera un token JWT propio para el usuario
      const newToken = JWTService.generateToken(user.id, user.email);

      console.log('Token generado por el sistema:', newToken);

      return { token: newToken };
    } catch (error) {
      console.error('Error autenticando el token de Google:', (error as any).message || error);
      throw new Error('Token de Google inválido');
    }
  }
}
