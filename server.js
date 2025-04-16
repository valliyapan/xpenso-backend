import './config/env.js';
import app from './src/app.js';

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
    console.log('Server is running on port:', PORT);
});