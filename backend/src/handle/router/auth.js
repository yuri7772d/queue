import express from "express"
const router = express.Router();
import authUsecase from "../../usecase/auth.js";
import { body,query } from "express-validator";
import errValidator from "../middlewere/err.validator.js";
import permit from "../middlewere/permit.js";



router.post('/',
    [
        body('username')
          .isString()
          .notEmpty(),
        body('password')
          .isString()
          .notEmpty(),
        body('role')
          .isNumeric()
          .notEmpty()
    ],
    errValidator,
    permit([0]),
    async (req, res) => {
        const { username, password, role } = req.body;
        try {
            const result = await authUsecase.create(username, password, role);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    }
);

router.post('/login',
    [
        body('username')
          .isString()
          .notEmpty(),
        body('password')
          .isString()
          .notEmpty()

    ],
    errValidator,
    async (req, res) => {
        const { username, password } = req.body;
        try {
            const result = await authUsecase.login(username, password);
             console.log(result.token);
            res.cookie('token',result.token)
            res.status(200).json(result.payload);
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    }
   
);

router.get('/me',
    async (req, res) => {
        try {
            const {token} = req.cookies ; 
            console.log(token)
            const result = await authUsecase.me(token);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    }
);
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false // true ถ้าใช้ HTTPS
  })
  
  return res.json({ msg: 'logout success' })
})

router.get('/listing',
        [
        query('page')
          .isNumeric()
          .notEmpty(),
        query('per_page')
          .isNumeric()
          .notEmpty()

    ],
    errValidator,
    permit([0]),
    async (req, res) => {
        try {
            const {page, per_page} = req.query;
            const result = await authUsecase.listing(page, per_page);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    }
);

router.delete('/',
        [
        body('auth_id')
          .isNumeric()
          .notEmpty(),
    ],
    errValidator,
    permit([0]),
    async (req, res) => {
        try {
            const {auth_id} = req.body;
            const result = await authUsecase.remove(auth_id);
            res.status(200).json({msg:'ok'});
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    }
);

router.patch('/',
    [
        body('auth_id').isNumeric().notEmpty(),
        body('username').isString().notEmpty(),
        body('password').isString().notEmpty(),
        body('role').isNumeric().notEmpty()
    ],
    errValidator,
    permit([0]),    
    async (req, res) => {
        try {
            const { auth_id, username, password, role } = req.body;
            const result = await authUsecase.update( auth_id, username, password, role);
            res.status(200).json({ msg: 'Update successful' });
        }
            catch (error) { 
            res.status(400).json({ msg: error.message });
        }
    }
);

export default  router;