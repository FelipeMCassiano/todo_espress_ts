import pg from "pg";

async function connectDb(): Promise<pg.PoolClient> {
    const pool = new pg.Pool({
        user: "todo",
        host: "localhost",
        database: "todo",
        password: "todo",
        port: 5432,
    }).connect();

    return pool;
}

export interface ITodo {
    title: string;
    description: string;
    completed: boolean;
}

export interface ITodoRequest {
    title?: string;
    description?: string;
}

export interface ITodoResponse {
    id: number;
    title: string;
    description: string;
    completed: boolean;
}

export async function findById(id: number): Promise<ITodo | null> {
    const conn = await connectDb();

    const rows = await conn.query<ITodo>(
        "SELECT title, description, completed FROM todo WHERE id =$1",
        [id],
    );

    if (rows.rows.length === 0) return null;

    const todo = rows.rows[0];

    return todo;
}

export async function createTodo(todo: ITodoRequest): Promise<ITodoResponse | null> {
    const conn = await connectDb();

    const rows = await conn.query<ITodoResponse>(
        "INSERT INTO todo (title, description) VALUES($1, $2) RETURNING id, title, description, completed",
        [todo.title, todo.description],
    );

    if (rows.rows.length === 0) return null;

    return rows.rows[0];
}

export async function updateTodo(id: number, todo: ITodo): Promise<ITodoResponse | null> {
    const conn = await connectDb();

    const rows = await conn.query<ITodoResponse>(
        "UPDATE todo SET title =$1, description=$2, completed=$3 WHERE id =$4 RETURNING id, title, description, completed",
        [todo.title, todo.description, todo.completed, id],
    );

    if (rows.rows.length === 0) return null;

    return rows.rows[0];
}

export async function deleteTodo(id: number): Promise<void | null> {
    const conn = await connectDb();

    const rows = await conn.query("DELETE FROM todo WHERE id=$1", [id]);
    if (rows.rowCount === 0) return null;

    return;
}
