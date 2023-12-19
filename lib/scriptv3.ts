// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const { v4 } = require('uuid')
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://irsyad:dennisBergkamp10@myway.kmtsqbz.mongodb.net/myWay";
const options = {};

let client;
let clientPromise: Promise<MongoClient>;
let cachedDb = null;

console.log(MongoClient)

async function connectToDatabase() {
  if (!uri) {
    throw new Error('Please add your Mongo URI to .env.local');
  }

  if (cachedDb) {
    return cachedDb;
  } else {
    if (process.env.NODE_ENV === 'development') {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      client = new MongoClient(uri, options);
      // @ts-ignore
      if (!global._mongoClientPromise) {
        // @ts-ignore
        global._mongoClientPromise = client.connect();
        cachedDb = client.db('myWay');
        return cachedDb;
      }
      // @ts-ignore
      clientPromise = global._mongoClientPromise;
      cachedDb = client.db('myWay');
      return cachedDb;
    } else {
      // In production mode, it's best to not use a global variable.
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
      cachedDb = client.db('myWay');

      return cachedDb;
    }
  }
}

async function runScript() {
  const db = await connectToDatabase();

  const collection = db.collection('muslim-volume');

  try {
    const rename = db.renameCollection('muslim-volume', 'muslimVolume');
  } catch (e) {
    console.error('An error occurred:', e);
  } finally {
    await client.close();
  }
}

runScript()
