import { log } from "console";
import { pg_query } from "../../db/db";
import { Board, BoardPayload } from "./boards.schema";
import { query } from "express";

export const getUserBoards = async (payload: BoardPayload["body"]) => {
  const { id, onlyMe, sortBy, query } = payload;
  const searchSql = query ? `AND BRD.NAME LIKE '%' || $2 || '%'` : "";
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
	 ${onlyMe ? "BRD.CREATOR_ID" : "B_U.USER_ID"} = $1 ${searchSql}
ORDER BY ${"BRD." + sortBy.name} ${sortBy.order};
    `;
  log(sql);
  try {
    const data = await pg_query(sql, [id]);
    return {
      boardList: data.rows,
      total: data.rowCount,
    };
  } catch (error) {
    throw error;
  }
};

export const createBoard = async (payload: Board) => {

  try {
    // First, create the function
    await pg_query(`CREATE OR REPLACE FUNCTION insert_board_user() RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO board_users (board_id, user_id, role)
          VALUES (NEW.id, NEW.creator_id, 'admin');
    
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;`);

    // Second, create the trigger
    await pg_query(
      `CREATE OR REPLACE TRIGGER after_insert_boards AFTER INSERT ON boards FOR EACH ROW EXECUTE PROCEDURE insert_board_user();`
    );

    // Finally, insert the board
    const data = await pg_query(
      `
          INSERT INTO boards (name, description, creator_id)
          VALUES ($1, $2, $3);
        `,
      [payload.name, payload.description, payload.creator_id]
    );

    return { data: data.rows };
  } catch (error) {
    throw error;
  }
};
