const user_functions_call = require("./user_functions");
const posts_call = require("./posts");
const events_call = require("./events");
const petitions_call = require("./petitions");
const emergencies_call = require("./emergencies");
const home_functions_call = require("./homefunctions");
const admin_functions_call = require("./adminfunctions");

module.exports = {
  user_function: user_functions_call,
  posts: posts_call,
  events: events_call,
  petitions: petitions_call,
  emergencies: emergencies_call,
  homefunctions: home_functions_call,
  adminfunctions: admin_functions_call
};