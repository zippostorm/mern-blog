import { Client, Storage } from "appwrite";

const client = new Client();
client.setProject("6751f02300346c4aaccb");

const storage = new Storage(client);

export { client, storage };
