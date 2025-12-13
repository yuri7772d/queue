import db from "./connector.js";

const create = async (queue_id,originalname, filename, mimetype,size) => {
    console.log(queue_id,originalname, filename, mimetype,size);
    
    const result = await db.execute(
        `INSERT INTO file (queue_id,original_name, file_name, mime_type, size)
       VALUES (?, ?, ?, ?, ?);`,
      [queue_id,originalname, filename, mimetype,size])
    return result[0].insertId;
}

const listing = async (queue_id) => {
    const [row] = await db.execute('SELECT * FROM file WHERE queue_id = ?;', [queue_id])
    return row
}
const delete_by_id = async (file_id) => {
    const result = await db.execute('DELETE FROM file WHERE id = ? ;', [file_id])
}
const get_by_id = async (file_id) => {
    const [row] = await db.execute('SELECT * FROM file WHERE id = ? ;', [file_id])
    return row
}
export default  {
    create,
    listing,
    delete_by_id,
    get_by_id
};
