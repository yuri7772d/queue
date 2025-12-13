import authRepo from "../repo/auth.js";
import configEnv from "../config.load.js";
const {root,jwt:jwtConf} = configEnv
import errExep from "../errExep.js";
//import {sign,verify} from "jsonwebtoken";
import jwthas from "../jwt/jwt.has.js";

const create_root = async () => {
  try {
    
   const result =  await authRepo.create_by_id(-1, root.username, root.password, 0);
   // console.log(result);
  } catch (error) {
   // console.log("Root user already exists");
  }
};



const create = async (username, password, role) => {
  if (!(role == 2 || role == 1)) {
    throw new Error(errExep.ROLE_INVALID);
  }
  const userCheck = await authRepo.get_by_username(username); 
    if (userCheck.length > 0) {
      throw new Error(errExep.USER_USED);
    }

  let auth_id;
  try {
    auth_id = await authRepo.create(username, password, role);
   // console.log(auth_id);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error(errExep.USER_USED);
    }
  }
  return { id: auth_id, username: username, role };
};

const login = async (username, password) => {
 

    const userDB = await authRepo.get_by_username(username);

    if (userDB.length == 0) {
      throw new Error(errExep.USER_NOT_FOUND);
    }
    if (password != userDB[0].password) {
      throw new Error(errExep.PASSWORD_INVALID);
    }
  const payload = { id: userDB[0].id, username: username, role: userDB[0].role };
  

  const token =  jwthas.sign(payload, jwtConf.secret, { expiresIn: "1d" });

  return { payload, token: token };
};

const me = async (token) => {
  let decode;
  try {
    decode = jwthas.verify(token, jwtConf.secret);
  } catch (error) {
   // console.log(error);
    throw new Error(errExep.TOKEN_INVALID);
  }

  if (decode.username != root.username) {
    const userDB = await authRepo.get_by_id(decode.id);

    if (userDB.length == 0) {
      throw new Error(errExep.USER_NOT_FOUND);
    }
  }
  return decode;
};

const listing = async (page, per_page) => {
  return await authRepo.listing(page, per_page);
};

const remove = async (auth_id) => {
  return await authRepo.remove_by_id(auth_id);
};

const update = async (auth_id, username, password, role) => {
  if (!(role == 2 || role == 1)) {
    throw new Error(errExep.ROLE_INVALID);
  }
    const userCheck = await authRepo.get_by_username(username); 
    //console.log(userCheck)
    if (userCheck.length > 0 && userCheck[0].id != auth_id) {
      throw new Error(errExep.USER_USED);
    }



  return await authRepo.update( auth_id, username, password, role);
};

export default  {
  create_root,
  create, 
  login,
  me,
  listing,
  remove,
  update
};