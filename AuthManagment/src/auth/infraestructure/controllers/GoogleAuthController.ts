import { Request, Response } from 'express';
import { GoogleAuthService } from '../Services/GoogleAuth/GoogleAuthService';

export class GoogleAuthController {
  constructor(private googleAuthService: GoogleAuthService) {}

  public async run(req: Request, res: Response) {
    try {
        const googleToken = req.body.token as string;

        console.log("googleToken desde controller", googleToken);

        if (!googleToken) {
            return res.status(400).json({ error: 'Token de Google requerido' });
        }

        const user = await this.googleAuthService.authenticateWithToken(googleToken);
        console.log("user desde controller", user);
      return res.status(200).json({ user });  // Responder con un nuevo token
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Error desconocido' });
      }
    }
  }
}

export default GoogleAuthController;
