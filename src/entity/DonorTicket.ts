import { Entity, ObjectIdColumn, ObjectID, Column } from "typeorm";
import { Product } from "./Product";

@Entity()
export class DonorTicket {
   
    @ObjectIdColumn()
    id: ObjectID;
    @Column()
    name: string
    @Column()
    contactPerson: string;
    @Column()
    contactNumber: string;
    @Column()
    products: {id: string, quantity: number}[]
    @Column()
    status: string;
}