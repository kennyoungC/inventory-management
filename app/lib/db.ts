import mongoose from 'mongoose';
declare global {
    // eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
    var mongoose: any; // This must be a `var` and not a `let / const`
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    const MONGODB_URI = process.env.MONGODB_URI!;

    if (!MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            dbName: 'inventory_management_system',
            bufferCommands: false,
        };
        cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;

export async function checkConnection() {
    try {
        const conn = await dbConnect();
        console.log(
            '✅ MongoDB Connected:',
            conn.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        );
        return conn.connection.readyState === 1;
    } catch (error) {
        console.error('❌ Connection failed:', error);
        return false;
    }
}
