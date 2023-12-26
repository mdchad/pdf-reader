// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const { v4 } = require('uuid')
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://irsyad:dennisBergkamp10@myway.kmtsqbz.mongodb.net/myWay";
const options = {};

let client;
let clientPromise: Promise<typeof MongoClient>;
let cachedDb: any = null;

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
  const collection = db.collection('muslim'); // Replace with your collection name

  let prevChapterTitle = null;
  let prevChapterId = null;

  const cursor = collection.find({ number: { $gte: 2131, $lte: 2159 }});

  try {
    while (await cursor.hasNext()) {
      const doc = await cursor.next();

      if (!doc.chapter_title.ms) {
        continue;
      }

      if (doc.chapter_id) {
        // Document already has a chapter_id, so update the previous chapter info
        prevChapterTitle = doc.chapter_title.ms;
        prevChapterId = doc.chapter_id;
      } else {
        if (doc.chapter_title.ms === prevChapterTitle && prevChapterId) {
          // Same chapter as previous, assign the same chapter_id
          await collection.updateOne({ _id: doc._id }, { $set: { chapter_id: prevChapterId } });
        } else {
          // New chapter, generate a new chapter_id
          const newChapterId = v4();
          await collection.updateOne({ _id: doc._id }, { $set: { chapter_id: newChapterId } });
          prevChapterTitle = doc.chapter_title.ms;
          prevChapterId = newChapterId;
        }
      }
    }
    console.log('Script execution complete.');
  } catch (e) {
    console.error('An error occurred:', e);
  } finally {
    await db.client.close();
  }
}

runScript();
