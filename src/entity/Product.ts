import { ObjectIdColumn, ObjectID, Column, Entity } from "typeorm";

@Entity()
export class Product {
    @ObjectIdColumn()
    id: ObjectID;
    @Column()
    name: string;
    @Column()
    description: string;
    @Column()
    quantity: number;
    @Column()
    comments: string;
}