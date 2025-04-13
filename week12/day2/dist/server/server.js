"use strict";
import express from 'express';
import path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, '../..')));
app.use('/node_modules/@fortawesome/fontawesome-free', express.static(path.join(__dirname, '../../node_modules/@fortawesome/fontawesome-free')));
app.use('/node_modules/bootstrap', express.static(path.join(__dirname, '../../node_modules/bootstrap')));
const users = [
    {
        DisplayName: "Bilbo Baggins",
        EmailAddress: "bbaggins@durhamcollege.ca",
        Username: "bbaggins",
        Password: "12345"
    },
    {
        DisplayName: "Usain Bolt",
        EmailAddress: "ubolt@durhamcollege.ca",
        Username: "usain",
        Password: "67890"
    },
    {
        DisplayName: "admin",
        EmailAddress: "admin@durhamcollege.ca",
        Username: "admin",
        Password: "password"
    }
];
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../..', 'index.html'));
});
app.get('/', (req, res) => {
    res.json({ users });
});
app.listen(port, () => {
    console.log(`[INFO] Server started on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map