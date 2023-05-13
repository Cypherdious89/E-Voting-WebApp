import { Drizzle, generateStore } from "@drizzle/store";
import Election from "./contracts/Election.json";

// import x from "@drizzle/react-plugin";

const options = {
  contracts: [Election],
  web3: {
    fallback: {
      type: "http",
      url: "http://127.0.0.1:7545", // Ganache network URL
    },
  },
};

const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options , drizzleStore);
export default drizzle;
