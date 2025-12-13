import jwtHas from "../../jwt/jwt.has.js"
import errExep from "../../errExep.js";
import configEnv from "../../config.load.js";
const {jwt:jwtConf} = configEnv
export default  (roles) => {
   return  (req, res, next) => {
  const toket = req.cookies?.token ;
  if (!toket) {
    return  res.status(401).json({ msg: errExep.TOKEN_INVALID});
  }
    let decode;
    try {
        decode = jwtHas.verify(toket,jwtConf.secret)
    } catch (error) {
       // console.log(error);
       return res.status(401).json({ msg: errExep.TOKEN_INVALID});
    }
let isUse = false ;
  for (const role of roles) {
     if (decode.role == role){
          isUse =true ;
          break;
     }
  }
   if(!isUse) {
    return  res.status(401).json({ msg: errExep.TOKEN_INVALID});
   }
   req.payload = decode ;
  next();
};
}