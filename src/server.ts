import app from './app';
import { envVars } from './app/config/env';
// import { config } from './app/config/env';

const startServer = async () => {
    app.listen(envVars.PORT, () => {
        console.log(`Alhamdulillah....Server is running on port:${envVars.PORT}`);
    })
}

startServer();