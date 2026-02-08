import app from './app';
import { config } from './app/config/env';

const startServer = async () => {
    app.listen(config.port, () => {
        console.log(`Alhamdulillah....Server is running on port:${config.port}`);
    })
}

startServer();