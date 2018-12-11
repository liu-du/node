const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class User {
    constructor(username, email) {
        this.name = username;
        this.email = email;
    }

    save() {
        const db = getDb();
        return db
            .collection('users')
            .insertOnde(this);
    }

    static findById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({_id: new mongodb.ObjectId(userId)});
    }

    static find() {
        const db = getDb();
        return db
            .collection('users')
            .find()
            .toArray();
    }
}

module.exports = User;
