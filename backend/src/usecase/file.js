import multer from "multer";
import fileRepo from "../repo/file.js"
import queueRepo from "../repo/queue.js"
import fileSystem from "../fs/file.system.js";
import errExep from "../errExep.js";


const file_path = "files/"

// กำหนดตำแหน่งและชื่อไฟล์ตอนบันทึก
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, file_path);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").pop();
    cb(null, unique + "." + ext);
  },
});

const uploading = multer({ storage });

const single = (part) => { return uploading.single(part); }

const upload = async (auth_id,queue_id, originalname, filename, mimetype, size) => {
  const queue = await queueRepo.get_by_id(queue_id);
  if (queue.length === 0) {
    throw new Error(errExep.QUEUE_NOT_FOUND);
  }
  if (queue[0].auth_id !== auth_id && auth_id !== 0) {
    throw new Error(errExep.NO_PERMISSION_UPLOAD_FILE);
  }
  const file_id = await fileRepo.create(queue_id, originalname, filename, mimetype, size);
  return { file_id, file_url: file_path + filename };
}

const listing = async (queue_id) => {
  return await fileRepo.listing(queue_id);
}
const delete_by_id = async (auth_id,file_id) => {
    const file = await fileRepo.get_by_id(file_id);
  if (file.length === 0) {
    throw new Error(errExep.FILE_NOT_FOUND);
  }
  const queue = await queueRepo.get_by_id(file[0].queue_id);
  if (queue.length === 0) {
    throw new Error(errExep.QUEUE_NOT_FOUND);
  }
  if (queue[0].auth_id !== auth_id && auth_id !== 0) {
    throw new Error(errExep.NO_PERMISSION_DELETE_FILE);
  }

  await fileRepo.delete_by_id(file_id);
  const path = file_path + file[0].file_name;
  fileSystem.unlink(path);
 // console.log(path);
}

const get_by_id = async (file_id) => {
  const result = await fileRepo.get_by_id(file_id);
  if (result.length === 0) {
    throw new Error(errExep.FILE_NOT_FOUND);
  }
  return {path: file_path + result[0].file_name, original_name: result[0].original_name, mime_type: result[0].mime_type};
}

export default  {
  single,
  upload,
  listing,
  delete_by_id,
  get_by_id
};