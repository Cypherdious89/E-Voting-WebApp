
# E-voting WebApp with Blockchain Integration

This is a README file for the E-voting WebApp project that incorporates a blockchain network for secure and transparent voting. The web application is built using React.js, Material UI, and Stylized Components for the frontend, and Node.js with Express.js for the backend. The blockchain network is deployed on the Ganache local testnet using Solidity smart contracts compiled with Truffle.

## Frontend

The frontend of the E-voting WebApp is developed using React.js, Material UI, and Stylized Components. To set up the frontend locally, follow these steps:

1. Clone the project repository.
2. Open a terminal and navigate to the frontend directory.
3. Run the command `npm install --force` to install the dependencies.
4. Start the frontend server by running `npm start` in the terminal.

*The frontend server will be accessible on `http://localhost:3000`.*

## Backend

The backend of the E-voting WebApp is built using Node.js and Express.js. To set up the backend locally, perform the following steps:

1. Open a terminal and navigate to the backend directory.
2. Run the command `npm install` to install the required dependencies.
3. Configure the environmental variables by creating a `.env` file with the desired values.
4. Start the backend server by running `npm run dev` in the terminal.

*The backend server will be running on `http://localhost:5500`.*

## Database

The database for the E-voting WebApp is implemented using MongoDB. To set up the database, follow these steps:

1. Install MongoDB Compass and set the network on *`localhost:27017`*.
2. Connect the database to the backend server.
3. In the `admin-data` collection, manually sign up an admin by listing all the desired parameters, including name, email, password, mobile number, wallet address, and role.

## Blockchain

The E-voting WebApp integrates a blockchain network deployed on the Ganache local testnet. Follow these steps to set up the blockchain network:

1. Deploy the Ganache local testnet on *`localhost:7545`*.
2. Set up Ganache and assign Account 0 as the admin, Account 9 as the moderator, and Accounts 1 to 8 as users.
3. In Metamask, create a Ganache testnet network and import all the accounts using their private keys.
4. Import the `truffle-config.js` file inside the Ganache testnet to use the smart contract.
5. Manually assign the wallet addresses of Account 0 and 9 in the database to the Admin and Moderator, respectively.
6. Switch to the desired connected Metamask account for each transaction.

The smart contract is written in Solidity and compiled using Truffle. To compile the smart contract, navigate to the `blockchain/contracts` directory and run the command `truffle compile` in the terminal.

Please note that this project assumes you have a basic understanding of blockchain technology, Ethereum, and the tools mentioned in the README. Ensure you have the necessary software and configurations in place before attempting to running the WebApp with blockchain integration.
