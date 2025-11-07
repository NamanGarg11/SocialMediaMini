const usermodel = require('../models/user')
const createUser = async ({ username, email, password }) => {
    if (!username || !email || !password) {
      throw new Error("All fields are required");
    }
  
    return await usermodel.create({
      username,
      email,
      password
    });
  };
  
  const findOne = async (filter) => {
    return await usermodel.findOne(filter);
  };
  
  module.exports = {
    createUser,
    findOne
  };