import app from './src/app.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env')});

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
    console.log('Server is running on port:', PORT);
});