import db from "./connector.js";

const create = async (title,detail, auth_id, room, status, date) => {
  console.log(title,detail, auth_id, room, status, date);
  
  const result = await db.execute(
    "INSERT INTO queue (auth_id,room_id,status,date,title,detail) VALUES (?,?,?,?,?,?) ;",
    [auth_id, room, status, date,title,detail]
  );
  return result[0].insertId;
};

const listing = async (year, month,room, statuss) => {
  const [row] = await db.execute(
    `SELECT 
    status,
    date 
    FROM queue
    WHERE MONTH(date) = ? 
    AND YEAR(date) = ? 
    AND room_id = ?
    AND status IN (${statuss}) 
    ORDER BY date  ASC ;`,
    [month, year,room]
  );
  return row;
};

const get_by_date = async (date, room, statuss) => {
  const [row] = await db.execute(
    `SELECT queue.id,
        auth.username,
        queue.title,
        queue.detail,
        queue.auth_id,
        queue.room_id,
        queue.status,
        queue.date
        FROM queue JOIN auth ON queue.auth_id = auth.id WHERE queue.room_id = ? AND  date = ? AND status IN (${statuss}) ;`,
    [room, date]
  );
  return row;
};

const update_status = async (queue_id, status) => {
  await db.execute("UPDATE queue SET status = ? WHERE id = ? ;", [
    status,
    queue_id,
  ]);
};

const update_title_detail = async (queue_id, title, detail) => {
  await db.execute("UPDATE queue SET title = ?, detail = ? WHERE id = ? ;", [
   title,detail, queue_id
  ]);
};

const get_by_id = async (queue_id) => {
  const [row] = await db.execute("SELECT * FROM queue WHERE id = ? ;", [
    queue_id,
  ]);
  return row;
}

export default  {
  create,
  listing,
  get_by_date,
  update_status,
  update_title_detail,
  get_by_id
};