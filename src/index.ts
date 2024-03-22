import express, { Express, Request, Response } from "express";
import {
    createTodo,
    deleteTodo,
    findById,
    ITodo,
    ITodoRequest,
    updateTodo,
} from "../repository/repository";

const app: Express = express();
const port: Number = 3000;

app.use(express.json());

app.get("/todo/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const todo = await findById(id);

    if (!todo) return res.status(404).end();

    return res.status(200).send(todo);
});

app.post("/todo/create", async (req: Request, res: Response) => {
    const todo: ITodoRequest = req.body;

    if (!todo.title || !todo.description) return res.status(400).send("param missing");

    const createdTodo = await createTodo(todo);

    if (!createTodo) return res.status(422).send("cannot create new todo").end();

    return res.status(201).json({ newTodo: createdTodo });
});

app.put("/todo/update/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const todo: ITodo = req.body;

    const updatedTodo = await updateTodo(id, todo);

    if (!updatedTodo) return res.status(422).json({ error: "cannot updated todo" });

    return res.status(200).json({ success: updatedTodo });
});

app.delete("/todo/delete/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const deleted = await deleteTodo(id);
        if (deleted === null) return res.status(422).send("todo already deleted");

        return res.status(200).send("delete successfull").end();
    } catch (err) {
        return res.status(500).json({ error: err }).end();
    }
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
