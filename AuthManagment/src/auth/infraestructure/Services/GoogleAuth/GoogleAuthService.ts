import { OAuth2Client } from 'google-auth-library'; // Biblioteca para validar el token de Google
import { GoogleAuthUseCase } from '../../../application/usecases/GoogleAuthUseCase';
import { JWTService } from '../../../application/JWT/JWTService';

export class GoogleAuthService {
  constructor(private googleAuthUseCase: GoogleAuthUseCase) {}

  private oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  public async authenticateWithToken(googleToken: string): Promise<any> {
    try {
        console.log("googleToken desde service", googleToken);
      // Verificar el token de Google usando la API de Google
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID, // Tu CLIENT_ID de Google
      });

    console.log("ticket desde service", ticket);

      const payload = ticket.getPayload();
      const userId = payload?.sub;
      const email = payload?.email;
      const name = payload?.name;
      const picture = payload?.picture;

      console.log("payload desde service", payload);

      // Buscar al usuario en tu base de datos o crear uno nuevo
      const user = await this.googleAuthUseCase.authenticateWithGoogle(userId, name, email, picture);

        console.log("user desde service", user);
      // Crear un nuevo JWT o cualquier otro tipo de token que tu sistema use
      const newToken = JWTService.generateToken(user.id,user.email);  // Función que generas para crear un nuevo token
      console.log("newToken desde service", newToken);

      return { token: newToken }; 
    } catch (error) {
      throw new Error('Token de Google inválido');
    }
  }
}

