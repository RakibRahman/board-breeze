import { log } from "console";
import { pg_query } from "../../db/db";

export const getUserBoards = async (
  id: string,
  onlyMe: boolean = false,
  sortBy: { name: string; order: "ASC" | "DESC" },
  query: string
) => {
  const sql = `
  SELECT
	B_U.BOARD_ID,
	B_U.ROLE,
	BRD.NAME,
	BRD.CREATED_AT,
	U.ID AS CREATOR_ID,
	U.NAME AS CREATOR_NAME
FROM
	BOARD_USERS B_U
	JOIN BOARDS BRD ON BRD.ID = B_U.BOARD_ID
	JOIN USERS U ON U.ID = BRD.CREATOR_ID
WHERE
	 ${onlyMe ? "BRD.CREATOR_ID" : "B_U.USER_ID"} = $1 ${
      query && `AND BRD.NAME LIKE '%' || $2 || '%'`
    }
ORDER BY ${"BRD." + sortBy.name} ${sortBy.order};
    `;

  try {
    const data = await pg_query(sql, [id,query]);
    return {
      boardList: data.rows,
      total: data.rowCount,
    };
  } catch (error) {
    throw error;
  }
};
