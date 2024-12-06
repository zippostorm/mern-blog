import { Client, Storage } from "appwrite";

const client = new Client();
client.setProject("6751f02300346c4aaccb");

const storage = new Storage(client);

export { client, storage };

export const bucketId = "6751f8f50016d01eb3ad";
export const projectId = "6751f02300346c4aaccb";
