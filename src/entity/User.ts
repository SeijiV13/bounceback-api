import {Entity, ObjectIdColumn, ObjectID, Column} from "typeorm";
import * as bcrypt from 'bcryptjs';
@Entity()
export class User {

    @ObjectIdColumn()
    id: ObjectID;
    @Column()
    username: string;
    @Column()
    password: string;
    @Column()
    role: string;
    @Column()
    lastLoggedIn: Date;

    public hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }
    public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
      }
}
