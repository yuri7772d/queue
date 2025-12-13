import express from "express"
const router = express.Router();
import fileUsecase from "../../usecase/file.js"
import { body,query } from "express-validator";
import errValidator from "../middlewere/err.validator.js";
import permit from "../middlewere/permit.js";

router.post("/upload",
    fileUsecase.single("file"),
    [
        body("queue_id").isNumeric().notEmpty()
    ],
    errValidator,
    permit([0,1,2]),
    async (req, res) => {
        try {

            const file = req.file;
            console.log(file

            );

            const { queue_id } = req.body;
            const auth_id = req.payload.id; 
            console.log(queue_id);
            if (!file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            const result = await fileUsecase.upload(auth_id,queue_id, file.originalname, file.filename, file.mimetype, file.size);

            return res.status(200).json(result);
        } catch (err) {
            console.error(err);
            res.status(400).json({ msg:err.message } );
        }
    });

router.get("/listing",
    [
        query("page").isNumeric().notEmpty(),
        query("perpage").isNumeric().notEmpty(),
    ],async (req, res) => {
        try {
            const { page, perpage } = req.query;        
            const result = await fileUsecase.listing(page, perpage);
            return  res.status(200).json(result);
        } catch (err) {
            console.error(err);
            res.status(400).json({ msg: err.message });
        }   
    });

router.delete("/delete",    [
    body("file_id").isNumeric().notEmpty(),
],
errValidator,
permit([0,1,2]),
async (req, res) => {
    try {   
        const { file_id } = req.body;    
        const auth_id = req.payload.id; 
        const result = await fileUsecase.delete_by_id(auth_id,file_id);
        return  res.status(200).json({msg: "Delete successful"});
    } catch (err) {
        console.error(err);
        res.status(400).json({ msg: err.message });
    }       
});

router.get("/download",
    [
        query("file_id").isNumeric().notEmpty(),    
    ],async (req, res) => {
        try {
            const { file_id } = req.query;
            const result = await fileUsecase.get_by_id(file_id);
            return res.status(200).download(result.path, result.original_name);
        } catch (err) {
            console.error(err);
            res.status(400).json({ msg: err.message });
        }   
    });


export default  router;
