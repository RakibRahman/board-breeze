import { log } from "console";
import { pg_query } from "../../db/db";
import { updateColumnsById } from "../../utils/commons";
import { Board, BoardPatchPayload, BoardPayload } from "./boards.schema";

export const getUserBoards = async (payload: BoardPayload["body"]) => {
  const { creator_id, onlyMe, sortBy, query, page, size } = payload;
  const offset = (page - 1) * size;
  const baseSql = `
  SELECT
	B_U.BOARD_ID,
	B_U.ROLE,
	BRD.NAME,
	BRD.UPDATED_AT,
	U.ID AS CREATOR_ID,
	U.NAME AS CREATOR_NAME
FROM
	BOARD_USERS B_U
	JOIN BOARDS BRD ON BRD.ID = B_U.BOARD_ID
	JOIN USERS U ON U.ID = BRD.CREATOR_ID
WHERE
	 ${
     onlyMe ? "BRD.CREATOR_ID" : "B_U.USER_ID"
   } = $1 AND BRD.NAME LIKE '%' || $2 || '%'
ORDER BY ${"BRD." + sortBy.name} ${sortBy.order}
    `;
  const sql = `${baseSql} LIMIT $3 OFFSET $4`;

  const totalBoardsResult = await pg_query(
    `SELECT COUNT(*) FROM (${baseSql}) AS subquery;`,
    [creator_id, query || ""]
  );

  const totalBoards = totalBoardsResult.rows[0].count;
  const totalPages = Math.ceil(totalBoards / size);

  try {
    const data = await pg_query(sql, [creator_id, query || "", size, offset]);
    return {
      boardList: data.rows,
      total: +totalBoards,
      totalPages,
      nextPage: totalPages === page || totalPages === 0 ? null : page + 1,
      prevPage: page === 1 ? null : page ? page - 1 : 1,
    };
  } catch (error) {
    throw error;
  }
};

export const createBoard = async (payload: Board) => {
  try {
    await pg_query(`
      BEGIN;

CREATE
OR REPLACE FUNCTION INSERT_BOARD_USER () RETURNS TRIGGER AS $$
          BEGIN
            INSERT INTO board_users (board_id, user_id, role)
            VALUES (NEW.id, NEW.creator_id, 'admin');
      
            RETURN NEW;
          END;
          $$ LANGUAGE PLPGSQL;

CREATE
OR REPLACE TRIGGER AFTER_INSERT_BOARDS
AFTER INSERT ON BOARDS FOR EACH ROW
EXECUTE PROCEDURE INSERT_BOARD_USER ();

COMMIT;
      
      `);

    const data = await pg_query(
      `
          INSERT INTO boards (name, description, creator_id)
          VALUES ($1, $2, $3) RETURNING id,name,description;
        `,
      [payload.name, payload.description, payload.creator_id]
    );

    return data.rows[0];
  } catch (error) {
    throw error;
  }
};

export const updateBoard = async (
  boardId: string,
  payload: BoardPatchPayload
) => {
  const { sql, values } = updateColumnsById(boardId, "BOARDS", {
    ...payload,
    updated_at: "now()",
  });

  try {
    const data = await pg_query(sql, values);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
};

export const deleteBoard = async (boardId: string) => {
  const transactionSql = `
  BEGIN;
  CREATE OR REPLACE FUNCTION delete_board() RETURNS TRIGGER as $$
  BEGIN
  DELETE FROM boards WHERE id=OLD.board_id;
  RETURN OLD;
  END;
 $$ LANGUAGE PLPGSQL;

 CREATE OR REPLACE TRIGGER after_delete_board AFTER DELETE on board_users FOR EACH ROW EXECUTE PROCEDURE delete_board();
  COMMIT;
`;

const sql = `DELETE FROM board_users WHERE board_id=$1 RETURNING *;`

  try {
    await pg_query(transactionSql);
    const board = await pg_query(sql, [boardId]);

    return board.rows[0];
  } catch (error) {
    throw error;
  }
};

