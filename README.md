## Tech Stack

### Frontend
- React Native with Expo
- TypeScript
- NativeWind (TailwindCSS for React Native)
- Recoil for state management
- React Native Paper for UI components
- Solana Web3.js for blockchain integration
- Reclaim protocol

### Backend
- Node.js
- Express
- Prisma
- PostgreSQL
- TypeScript
- JWT for authentication
- Reclaim Protocol

### Common
- Zod for schema validation
- Shared types between frontend and backend

## Setup Instructions

1. Clone the repository

2. Install dependencies
   ```bash
   # Install frontend dependencies
   cd swifey-fe
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Environment Setup
   - Create a `.env` file in the backend directory with the following variables:
     ```
     JWT_SECRET=your_jwt_secret
     APP_ID=your_reclaim_app_id
     APP_SECRET=your_reclaim_app_secret
     PROVIDER_ID=your_reclaim_provider_id
     ```

4. Start the development servers
   ```bash
   # Start frontend
   cd swifey-fe
   npx expo start

   # Start backend
   cd ../backend
   npm run dev
   ```

5. Setup instructions 

    For Mobile(Physical Devuces)
   - Install Expo Go on your mobile device
   - Scan the QR code from the Expo development server
   - Use ngrok or simply start your expo app using npx expo start --tunnel
   - Use npm run dev to start the backend up
   - Use to setup a ngrok tunnel for the backend
   ```bash 
   ngrok http 3000
   ``` 
   - Also use ngrok for starting the backend up, then set the base URL of your backend in the conf.ts file in swifey_fe
    ``` bash
    https://<your-ngrok-url>/api/v1
    ```

   For android emulator
   - Setup expo go on your android mobile
   - Start the server using npx expo start --tunnel 
   - Simply start the backend using npm run dev and list the following as the base URL in swifey_fe 
   ``` bash
   http://10.0.2.2:3000/api/v1/
   ```

