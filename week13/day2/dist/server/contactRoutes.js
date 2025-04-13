"use strict";
import express from "express";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from "url";
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTACTS_FILE = path.join(__dirname, '../../data/contacts.json');
async function readContacts() {
    try {
        const data = await fs.readFile(CONTACTS_FILE, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}
async function writeContacts(contact) {
    await fs.writeFile(CONTACTS_FILE, JSON.stringify(contact, null, 2));
}
router.get('/', async (req, res) => {
    const contacts = await readContacts();
    res.json(contacts);
});
router.get('/:id', async (req, res) => {
    const contacts = await readContacts();
    const contact = contacts.find(c => c.id === req.params.id);
    if (contact) {
        res.json(contact);
    }
    else {
        res.status(404).json({ message: 'Not Found' });
    }
});
router.post('/', async (req, res) => {
    const contacts = await readContacts();
    const newId = (contacts.length > 0) ?
        (Math.max(...contacts.map(c => parseInt(c.id))) + 1).toString() : '1';
    const newContact = { id: newId, ...req.body };
    contacts.push(newContact);
    await writeContacts(contacts);
    res.status(200).json({ message: 'Successfully created contact' });
});
router.put('/:id', async (req, res) => {
    const contacts = await readContacts();
    const contactIndex = contacts.findIndex(c => c.id === req.params.id);
    if (contactIndex !== -1) {
        contacts[contactIndex] = { id: req.params.id, ...req.body };
        await writeContacts(contacts);
        res.json(contacts[contactIndex]);
    }
    else {
        res.status(404).json({ message: 'Contact Not Found' });
    }
});
router.delete('/:id', async (req, res) => {
    const contacts = await readContacts();
    const filteredContacts = contacts.filter(c => c.id === req.params.id);
    if (filteredContacts.length > contacts.length) {
        await writeContacts(filteredContacts);
        res.json({ message: 'Successfully deleted contact' });
    }
    else {
        res.status(404).json({ message: 'Contact Not Found' });
    }
});
export default router;
//# sourceMappingURL=contactRoutes.js.map