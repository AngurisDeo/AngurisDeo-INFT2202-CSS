"use strict"

import express, {Request, Response} from "express";
import fs from 'fs/promises';
import path from 'path';

import { fileURLToPath } from "url";

//Express router
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTACTS_FILE = path.join(__dirname, '../../data/contacts.json');


interface Contact {
    id: string;
    fullName: string;
    contactNumber: string;
    emailAddress: string;
}

async function readContacts(): Promise<Contact[]> {
    try{
        const data =  await fs.readFile(CONTACTS_FILE, 'utf8');
        return JSON.parse(data);
    }catch(error){
        //ENOENT - Error Not Entry - File Not Found
        if((error as NodeJS.ErrnoException).code === 'ENOENT'){
            return [];
        }
        throw error;
    }
}

async function writeContacts(contact: Contact[]): Promise<void> {
    await fs.writeFile(CONTACTS_FILE, JSON.stringify(contact, null, 2));
}

//Retrieve all Contacts
router.get('/', async (req: Request, res: Response) => {
    const contacts = await readContacts();
    res.json(contacts);
});

router.get('/:id', async (req: Request, res: Response) => {
    const contacts = await readContacts();
    const contact = contacts.find(c => c.id === req.params.id);
    if (contact) {
        res.json(contact);
    } else {
        res.status(404).json({ message: 'Not Found' });
    }
});

router.post('/', async (req: Request, res: Response) => {
   const contacts = await readContacts();
   const newId = (contacts.length > 0) ?
       (Math.max(...contacts.map( c =>parseInt(c.id))) + 1).toString() : '1';
   const newContact: Contact = {id:newId, ...req.body};
   contacts.push(newContact);
   await writeContacts(contacts);
   res.status(200).json({message: 'Successfully created contact'});
});

router.put('/:id', async (req: Request, res: Response) => {
   const contacts = await readContacts();
   const contactIndex = contacts.findIndex(c => c.id === req.params.id);

   if (contactIndex !== -1) {
       contacts[contactIndex] = {id: req.params.id, ...req.body};
       await writeContacts(contacts);
       res.json(contacts[contactIndex]);
   }else{
       res.status(404).json({ message: 'Contact Not Found' });
   }
});

router.delete('/:id', async (req: Request, res: Response) => {
    const contacts = await readContacts();
    const filteredContacts = contacts.filter(c => c.id === req.params.id);
    if(filteredContacts.length > contacts.length){
        await writeContacts(filteredContacts);
        res.json({message: 'Successfully deleted contact'});
    }else{
        res.status(404).json({ message: 'Contact Not Found' });
    }
});

export default router;