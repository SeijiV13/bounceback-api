import { ObjectIdColumn, ObjectID, Column } from "typeorm";

export class Product {
    @ObjectIdColumn()
    id: ObjectID
    @Column()
    name: string;
    @Column()
    description: string;
    @Column()
    quantity: number;
    @Column()
    comments: string;
}