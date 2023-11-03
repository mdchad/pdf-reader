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
  let prevChapterTitle = null;
  let chapterId = v4();
  const db = await connectToDatabase();

  const collection = db.collection('muslim');

  try {
    const cursor = collection.find();
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      if (!doc.chapter_title || !doc.chapter_title.ms) {
        console.log("Skipping document with _id: " + doc._id + " because chapter_title.ms is missing");
        continue;
      }

      if (doc.chapter_title.ms !== prevChapterTitle) {
        chapterId = v4();
        prevChapterTitle = doc.chapter_title.ms;
      }

      await collection.updateOne({ _id: doc._id }, { $set: { chapter_id: chapterId } });
      console.log("Updated document with _id: " + doc._id + " and set chapter_id to: " + chapterId);
    }
    console.log('All documents have been updated.');
  } catch (e) {
    console.error('An error occurred:', e);
  } finally {
    await client.close();
  }
}

runScript()
