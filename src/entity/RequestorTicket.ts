import { Entity, ObjectIdColumn, ObjectID, Column } from "typeorm";
import { Product } from "./Product";

@Entity()
export class RequestorTicket {
   
    @ObjectIdColumn()
    id: ObjectID;
    @Column()
    name: string;
    @Column()
    address: string;
    @Column()
    contactPerson: string;
    @Column()
    contactNumber: string;
    @Column()
    products: Product[];
    @Column()
    status: string;
}