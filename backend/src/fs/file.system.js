import fs from "fs"
import errExep from "../errExep";
const unlink = (path) => {
      fs.unlink(path, (err) => {
        if (err) {
          throw new Error(errExep.FILE_DELETE_FAIL);
        }
      });
}
export default {unlink}