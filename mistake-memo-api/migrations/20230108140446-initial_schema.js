module.exports = {
  async up(db) {
    db.createCollection('user_account');
    db.collection('user_account').createIndex({ user_id: 1 }, { unique: true });
    db.collection('user_account').createIndex(
      { 'auth_info.gmail': 1, 'auth_info.line_id': 1, 'auth_info.email': 1 },
      { unique: true },
    );

    db.createCollection('post');
    db.collection('post').createIndex({ user_account_id: 1 });
    db.collection('post').createIndex({ title: 1 });
    db.collection('post').createIndex({ tag_ids: 1 });
    db.collection('post').createIndex({ is_open: 1 });
    db.collection('post').createIndex({ occurrence_date: 1 });
    db.collection('post').createIndex({ create_date: 1 });

    db.createCollection('post_tag');
    db.collection('post_tag').createIndex({ word: 1 }, { unique: true });
    db.collection('post_tag').createIndex({ user_account_ids: 1 });
  },

  async down(db) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
