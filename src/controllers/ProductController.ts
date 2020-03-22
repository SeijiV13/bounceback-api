import { Request } from "express";
import { Response } from "express-serve-static-core";
import { getRepository } from "typeorm";
import { Product } from "../entity/Product";
import { validate } from "class-validator";
import messages from "../config/messages";

class ProductController {

    public static getAllProducts = async (req: Request, res: Response) => {
        const productRepository = getRepository(Product);
        productRepository.find().then((data) => {
            res.status(200).send(data);
        }).catch((error) => {
            res.status(500).send(error);
        });
    }

    public static createProduct = async (req: Request, res: Response) => {
       const { name, description, quantity, comments } = req.body;
       const productRepository = getRepository(Product);
       
       const product = new Product();
       product.name = name;
       product.description = description;
       product.quantity = quantity;
       product.comments = comments;
       const errors = await validate(product);
       if(errors.length > 0)  {
           res.status(400).send(errors);
       }

       productRepository.save(product).then((data) => {
           res.status(201).send({message: messages.success.productCreated, data});
       }).catch((error) => {
           res.status(500).send(error);
       });

    }

    public static deleteProduct = async (req: Request, res: Response) => {
        const { id } = req.params;
        const productRepository = getRepository(Product);


        const product = await productRepository.findOne(id);
        if(product) {
            productRepository.delete(id).then((data) => {
                res.status(201).send({message: messages.success.productDeleted, data});
            }).catch((error) => {
                res.status(500).send(error);
            });
        } else {
            res.status(404).send({ message: messages.error.productNotFound})
        }
    }
}

export default ProductController;