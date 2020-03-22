import { RequestorTicket } from './../entity/RequestorTicket';
import { Request } from "express";
import { Response } from "express-serve-static-core";
import { getRepository } from "typeorm";
import { validate } from 'class-validator';
import messages from '../config/messages';
import { Product } from '../entity/Product';

class RequestorTicketController {
    
    
    public static getAllRequestorTicket = async (req: Request, res: Response) => {
        const requestorTicketRepository = getRepository(RequestorTicket);
        requestorTicketRepository.find().then((data) => {
            res.status(200).send(data);
        }).catch((error) => {
            res.status(500).send(error);
        });
    }

    
    public static createRequestorTicket = async (req: Request, res: Response) => {
        const { name, address, contactPerson, contactNumber, products } = req.body;
        const requestorTicketRepository = getRepository(RequestorTicket);
       
        const requestorTicket = new RequestorTicket();
        requestorTicket.name = name;
        requestorTicket.address = address;
        requestorTicket.contactPerson = contactPerson;
        requestorTicket.contactNumber = contactNumber;
        requestorTicket.products = products
        requestorTicket.status = 'Pending';
        const errors = await validate(RequestorTicket)
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        requestorTicketRepository.save(requestorTicket).then((data) => {
            res.status(201).send({ message: messages.success.requestorTicketCreated, data});
        }).catch(error => {
            res.status(500).send(error);
        })

    }

    public static approveRequestorTicket = async (req: Request, res: Response) => {
        const { id } = req.params;
        const requestorTicketRepository = getRepository(RequestorTicket);
        const productRepository = getRepository(Product);
        
        const requestorTicket = await requestorTicketRepository.findOne(id)
 
        if(requestorTicket) {
          if(requestorTicket.status !== "Donated") {
              requestorTicket.status = "Donated";
              requestorTicketRepository.save(requestorTicket).then(async (data) => {
                  for(const product of requestorTicket.products) {
                      const productToBeUpdated = await productRepository.findOne(product.id);
                      productToBeUpdated.quantity = productToBeUpdated.quantity - product.quantity;
                      await productRepository.save(productToBeUpdated);
                  }
                  res.status(201).send({ message: messages.success.requestorTicketApproved});
              });
          } else {
            res.status(400).send({message: messages.error.requestorTicketAlreadyApproved});
          }

        }
    }
}

export default RequestorTicketController;