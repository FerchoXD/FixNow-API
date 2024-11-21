import { OAuth2Client } from 'google-auth-library'; // Biblioteca para validar el token de Google
import { GoogleAuthUseCase } from '../../../application/usecases/GoogleAuthUseCase';
import { JWTService } from '../../../application/JWT/JWTService';

export class GoogleAuthService {
  constructor(private googleAuthUseCase: GoogleAuthUseCase) {}

  private oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  public async authenticateWithToken(googleToken: string): Promise<any> {
    try {
      // Verificar el token de Google usando la API de Google
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID, // Tu CLIENT_ID de Google
      });

      const payload = ticket.getPayload();
      const userId = payload?.sub;
      const email = payload?.email;
      const name = payload?.name;
      const picture = payload?.picture;

      // Buscar al usuario en tu base de datos o crear uno nuevo
      const user = await this.googleAuthUseCase.authenticateWithGoogle(userId, name, email, picture);

      // Crear un nuevo JWT o cualquier otro tipo de token que tu sistema use
      const newToken = JWTService.generateToken(user.id,user.email);  // Función que generas para crear un nuevo token

      return { token: newToken }; // Devolver el nuevo token al frontend
    } catch (error) {
      throw new Error('Token de Google inválido');
    }
  }
}

