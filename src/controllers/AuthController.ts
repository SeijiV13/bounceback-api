import { validate } from 'class-validator';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import config from '../config/config';
import messages from '../config/messages';
import { User } from '../entity/User';

class AuthController {
  public static login = async (req: Request, res: Response) => {
    // Check if username and password are set
    const { username, password } = req.body;
    // Get user and profile from database
    const userRepository = getRepository(User);

    if (!(username && password)) {
      res.status(400).send();
    }
    let user: User;
  
    user = await userRepository.findOne({ where: { username } });
    if (!user) {
        res.status(404).send({ message: messages.error.incorrecUserPassword, type: 'error' });
        return;
    }
    

    // Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(404).send({ message: messages.error.incorrecUserPassword, type: 'error' });
      return;
    }
    AuthController.signJwt(user, userRepository, res);
  };

  public static changePassword = async (req: Request, res: Response) => {
    // Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    // Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    // Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    // Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    // Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    // Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };

  public static signJwt(user: User, userRepository, res) {
    // Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.username, },
      config.jwtSecret,
      { expiresIn: '1h' }
    );
    try {
      user.lastLoggedIn = new Date();
      userRepository.save(user).then((loggedUser: User) => {
          res.send({
            jwt: token,
            // tslint:disable-next-line: object-literal-sort-keys
            lastLoggedIn: user.lastLoggedIn,
            name: user.name
          });
       
      });
    } catch (error) {
      res.status(401).send();
    }
  }
  public static testJwt = (req: Request, res: Response) =>  {

    return res.status(200).send();
  }
}

export default AuthController;
