import jwt from "jsonwebtoken"
const verify = (token) => {
    return jwt.verify(token)
}
const sign = (token,secret,exp) => {
    
    console.log("++++++")
    return jwt.sign(token,secret,exp)}

export default {sign,verify}