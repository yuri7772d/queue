import { validationResult } from "express-validator";

export default  (req, res, next) => {
  const errors = validationResult(req);
  // ถ้ามี error จาก express-validator
if(!errors.isEmpty()) {
   return res.status(400).json({ msg: errors.array()});
}
  // ถ้าไม่ error → ไปต่อ
  next();
};