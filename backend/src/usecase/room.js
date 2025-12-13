import errExep from "../errExep.js";
import  roomRepo from "../repo/room.js";


const create = async (name) => {
   const room_id = await roomRepo.create(name)
   if (!room_id) throw new Error(errExep.CREATE_FAIL);
  return {room_id} ;
};
const edit = async (room_id, name) => {
  const result = await roomRepo.edit(room_id, name);
  // if (!result) throw new Error(errExep.EDIT_FAIL);
 return result ;
};
 

const listing = async (page, per_page) => {
   // console.log(await repo.listing(page, per_page));
    
  return await roomRepo.listing(page, per_page);
};

const remove = async (room_id) => {
  return await roomRepo.remove(room_id);
};

export default  {
  create,
  edit,
  listing,
  remove
};  