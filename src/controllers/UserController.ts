import { User } from './../entity/User';
import { Request } from "express";
import { Response } from "express-serve-static-core";
import { getRepository } from "typeorm";
import { validate } from 'class-validator';
import messages from '../config/messages';

class UserController {
    public static createUser = async (req: Request, res: Response) => {
        const { name, username, password, role} = req.body;
        const userRepository = getRepository(User);
        const user = new User();

        user.name = name;
        user.username = username;
        user.password = password;
        user.role = role;
        const errors = await validate(user)
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        user.hashPassword();

        const userExists = await userRepository.findOne({ where: { username } });
        if (userExists) {
          res.status(500).send({ message: messages.error.usernameExists, type: 'error' });
          return;
        } 

        userRepository.save(user).then(async createdUser => {
            res.status(201).send({ message: messages.success.userCreated, type: 'success' });
        });
        
    }
}

export default UserController;