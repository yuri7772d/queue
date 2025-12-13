import db from "./connector.js";

const create = async (usernsme, password, role) => {
    const result = await db.execute('INSERT INTO auth (username,password,role) VALUES (?,?,?) ;', [usernsme, password, role])
    return result[0].insertId;
}
const create_by_id = async (id,usernsme, password, role) => {
    const result = await db.execute('INSERT INTO auth (id,username,password,role) VALUES (?,?,?,?) ;', [id,usernsme, password, role])
    return result[0].insertId;
}


const remove_by_id = async (auth_id) => {
    console.log(auth_id)
    const result = await db.execute('UPDATE auth SET is_remove = true WHERE id = ? ;', [auth_id])
}

const get_by_id = async (auth_id) => {
    const [row] = await db.execute('SELECT * FROM auth WHERE id = ? ;', [auth_id])
    return row
}

const get_by_username = async (usernsme) => {
    const [row] = await db.execute('SELECT * FROM auth WHERE username = ? ;', [usernsme])
    return row
}

const listing = async (page, per_page) => {
    const limit = per_page;
    const offset = (page - 1) * per_page;
    const [row] = await db.execute(`SELECT * FROM auth WHERE is_remove = false ORDER BY id ASC LIMIT ${limit} OFFSET  ${offset};`)
    return row
}

const update = async (auth_id, username, password, role) => {
    const result = await db.execute('UPDATE auth SET username = ?, password = ?, role = ? WHERE id = ? ;', [username, password, role, auth_id])
}
export default {
    create,
    create_by_id,
    remove_by_id,
    get_by_id,
    get_by_username,
    listing,
    update
}