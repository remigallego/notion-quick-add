import express, { Request } from "express";
import * as notionhq from "@notionhq/client";
import { TodoistWebhook, TodoistWebhookType } from "./types";
import * as notionApi from "./notion";

export const AUTH_SECRET = process.env.AUTH_SECRET || "";
export const DATABASE_ID = process.env.DATABASE_ID || "";

const notion = new notionhq.Client({
  auth: AUTH_SECRET,
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/", async (req: Request<{}, {}, TodoistWebhook>, res) => {
  if (req.body.event_name === TodoistWebhookType.NewTask)
    await addItem(req.body);
  if (req.body.event_name === TodoistWebhookType.DeletedTask)
    await deleteItem(req.body);
  res.sendStatus(200);
});

const deleteItem = async (body: TodoistWebhook) => {
  let data = {};
  removeFromDatabase(data);
};

const addItem = async (body: TodoistWebhook) => {
  let data = {};

  const db = await notion.databases.retrieve({
    database_id: DATABASE_ID,
  });
  const properties = db.properties;
  const taskName = body.event_data.content;

  /* console.log(req.body); */

  data = {
    title: taskName,
    status: {
      name: "Todo",
      id:
        properties.Status?.type === "select" &&
        properties.Status?.select.options.find((el) => el.name === "Todo")?.id,
    },
  };

  notionApi.addToDatabase(notion, data);
};

const removeFromDatabase = async (data: any) => {};

app.listen(port, () => {
  console.log("--- Server started! ---");
});
