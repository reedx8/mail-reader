// db/schema.ts
import * as SQLite from 'expo-sqlite';

export function setupSchema(db: SQLite.SQLiteDatabase) {
    db.execAsync(`
    CREATE TABLE IF NOT EXISTS street_loops (
    	id INTEGER PRIMARY KEY,
	    begin_num INTEGER NOT NULL,
	    end_num INTEGER NOT NULL,
	    dir TEXT NOT NULL,
	    street_name TEXT NOT NULL,
	    suffix TEXT NOT NULL,
	    loop_num INTEGER NOT NULL,
        route_num INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_street_lookup
    ON street_loops (street_name, dir, suffix, begin_num, end_num);

    INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7003, 7136, 'n', 'tyler', 'ave', 1);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7816, 7941, 'n', 'princeton', 'st', 1);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7146, 7307, 'n', 'tyler', 'ave', 2);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7824, 7921, 'n', 'syracuse', 'st', 2);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7025, 7215, 'n', 'mohawk', 'ave', 3);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7112, 7128, 'n', 'richmond', 'ave', 4);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 8008, 8233, 'n', 'syracuse', 'st', 5);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7922, 8126, 'n', 'ivanhoe', 'st', 6);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7300, 7337, 'n', 'mohawk', 'ave', 6);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7425, 7471, 'n', 'mohawk', 'ave', 7);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 8009, 8160, 'n', 'jersey', 'st', 7);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 8160, 8190, 'n', 'lombard', 'st', 7);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7410, 7480, 'n', 'oswego', 'ave', 7);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 8002, 8002, 'n', 'lombard', 'st', 7);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 8005, 8179, 'n', 'lombard', 'st', 8);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 8009, 8071, 'n', 'lombard', 'way', 8);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7529, 8032, 'n', 'oswego', 'ave', 8);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7807, 8044, 'n', 'central', 'st', 9);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7520, 8031, 'n', 'mohawk', 'ave', 9);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7522, 8016, 'n', 'tyler', 'ave', 9);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7525, 8051, 'n', 'richmond', 'ave', 10);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 8520, 8580, 'n', 'charleston', 'ave', 11);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 8044, 9119, 'n', 'richmond', 'ave', 12);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 8132, 8132, 'n', 'central', 'st', 12);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 8114, 8138, 'n', 'hudson', 'st', 12);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 8501, 9147, 'n', 'oswego', 'ave', 13);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 8025, 8038, 'n', 'hudson', 'st', 13);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 8507, 9135, 'n', 'mohawk', 'ave', 14);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7915, 8007, 'n', 'hudson', 'st', 14);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7936, 7936, 'n', 'smith', 'st', 14);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7909, 7937, 'n', 'smith', 'st', 15);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 9207, 9477, 'n', 'mohawk', 'ave', 15);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 8503, 9141, 'n', 'allegheny', 'ave', 16);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7809, 7816, 'n', 'hudson', 'st', 16);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7805, 7828, 'n', 'smith', 'st', 17);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 9210, 9342, 'n', 'allegheny', 'ave', 17);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7909, 7970, 'n', 'seneca', 'st', 17);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 8518, 9130, 'n', 'tyler', 'ave', 18);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7710, 7711, 'n', 'hudson', 'st', 18);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7730, 7730, 'n', 'smith', 'st', 18);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 7731, 7731, 'n', 'smith', 'st', 19);
INSERT INTO street_loops (route_num, begin_num, end_num, dir, street_name, suffix, loop_num) VALUES (14, 9212, 9340, 'n', 'tyler', 'ave', 19);
  `);
}
