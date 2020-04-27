const dbConnection = require("./connection");

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
const getCollectionFn = collection => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

/* Now, you can list your collections here: */
module.exports = {
    user_reg_data: getCollectionFn("user_reg_data"),
    posts: getCollectionFn("posts"),
    events: getCollectionFn("events"),
    petitions: getCollectionFn("petitions"),
    emg: getCollectionFn("emg"),
    creation_data: getCollectionFn("creation_data"),
    admin_data: getCollectionFn("admin_data")
};