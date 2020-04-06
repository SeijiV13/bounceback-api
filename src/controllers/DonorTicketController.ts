import { DonorTicket } from './../entity/DonorTicket';
import { Request } from "express";
import { Response } from "express-serve-static-core";
import { getRepository } from "typeorm";
import { validate } from 'class-validator';
import messages from '../config/messages';
import { Product } from '../entity/Product';

class DonorTicketController {
    
    
    public static getAllDonorTicket = async (req: Request, res: Response) => {
        const donorTicketRepository = getRepository(DonorTicket);
        donorTicketRepository.find().then((data) => {
            res.status(200).send(data);
        }).catch((error) => {
            res.status(500).send(error);
        });
    }

    
    public static createDonorTicket = async (req: Request, res: Response) => {
        const { name, contactPerson, address, contactNumber, products } = req.body;
        const donorTicketRepository = getRepository(DonorTicket);
       
        const donorTicket = new DonorTicket();
        donorTicket.name = name;
        donorTicket.address = address;
        donorTicket.contactPerson = contactPerson;
        donorTicket.contactNumber = contactNumber;
        donorTicket.products = products
        donorTicket.status = 'Pending';
        const errors = await validate(DonorTicket)
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        donorTicketRepository.save(donorTicket).then((data) => {
            res.status(201).send({ message: messages.success.donorTicketCreated, data});
        }).catch(error => {
            res.status(500).send(error);
        })

    }

    public static approveDonorTicket = async (req: Request, res: Response) => {
        const { id } = req.params;
        const donorTicketRepository = getRepository(DonorTicket);
        const productRepository = getRepository(Product);
        
        const donorTicket = await donorTicketRepository.findOne(id)
        if(donorTicket) {
          if(donorTicket.status !== 'Approved') {
              donorTicket.status = "Approved";
              donorTicketRepository.save(donorTicket).then(async (data) => {
                  for(const product of donorTicket.products) {
                      const productToBeUpdated = await productRepository.findOne(product.id);
                      productToBeUpdated.quantity = productToBeUpdated.quantity + product.quantity;
                      await productRepository.save(productToBeUpdated);
                  }
                  res.status(201).send({ message: messages.success.donorTicketApproved});
              });
          } else {
              res.status(400).send({message: messages.error.donorTicketAlreadyApproved});
          }

        }
    }
}

export default DonorTicketController;