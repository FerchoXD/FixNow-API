import { Request, Response } from 'express';
import { RegisterUserUseCase } from "../../application/usecases/RegisterUserUseCase";
import { EmailService } from '../Services/Email/Email';
import { LoginUserUseCase } from '../../application/usecases/loginUserUseCase';

export class RegisterUserController {
    public emailService:EmailService;

    constructor(readonly registerUserUseCase:RegisterUserUseCase, emailService:EmailService){
        this.emailService = emailService;
    }

    async run(req:Request, res:Response){

        console.log(req.body.firstname);

        if(!req.body.firstname || !req.body.lastname || !req.body.phone || !req.body.email || !req.body.password || !req.body.role){
            return res.status(400).json({
                error: "Bad Request",
                message: "Faltan campos obligatorios."
            });
        }

        /*if(!this.isNumberValid(req.body.phone)){
            return res.status(400).json({
                error: "Bad Request",
                message: "El número telefonico debe de tener una longitud de 10 caracteres."
            });
        }*/

        if(!this.emailIsValid(req.body.email)){
            return res.status(400).json({
                error: "Bad Request",
                message: "Estructura del email incorrecta."
            });
        }

        /*if(!this.nameIsValid(req.body.firstname + " " + req.body.lastname)){
            return res.status(400).json({
                error: "Bad Request",
                message: "No tienes un nombre valido."
            });
        }*/

        if(!this.passwordIsValid(req.body.password)){
            return res.status(400).json({
                error: "Bad Request",
                message: "La contraseña debe tener al menos 8 caracteres, incluir un número y un carácter especial."
            });
        }

        const user = await this.registerUserUseCase.run(req.body.firstname, req.body.lastname, req.body.phone, req.body.email, req.body.password, req.body.role);
        if(user.error === true){
            return res.status(500).json(user)
        }
        await this.emailService.run(user);
        return res.status(200).json(user);
    }

    /*private isNumberValid(number:string): boolean{
        if(number.length != 10){
            return false;
        }
        return true;
    }*/

    private emailIsValid(email: string): boolean {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email.toLowerCase());
    }
    
    private nameIsValid(name: string): boolean {
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s-]+$/;
        return regex.test(name);
    }

    private passwordIsValid(password: string): boolean {
        // Explicación de la expresión regular:
        // ^(?=.*\d)             : Debe contener al menos un dígito
        // (?=.*[!@#$%^&*])      : Debe contener al menos un carácter especial
        // (?=.*[A-Za-z])        : Debe contener al menos una letra (mayúscula o minúscula)
        // .{8,}                 : Debe tener al menos 8 caracteres de longitud
        const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Za-z]).{8,}$/;
        return regex.test(password);
    }
        
}