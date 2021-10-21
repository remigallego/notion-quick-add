const express = require("express");
const notionhq = require("@notionhq/client");
const nodeFetch = require("node-fetch");

const AUTH_SECRET = process.env.AUTH_SECRET;
const DATABASE_ID = process.env.DATABASE_ID;

const notion = new notionhq.Client({
  auth: AUTH_SECRET,
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/", async (req, res) => {
  let data = {};
  const db = await notion.databases.retrieve({
    database_id: DATABASE_ID,
  });
  const properties = db.properties;

  const taskName = req.body.event_data.content;

  data = {
    title: taskName,
    status: {
      name: "Todo",
      id: properties.Status["select"].options.find((el) => el.name === "Todo")
        .id,
    },
  };

  addToDatabase(data);

  res.sendStatus(200);
});

const createTextField = (text) => {
  return {
    title: [
      {
        text: {
          content: text,
        },
      },
    ],
  };
};

const createSelectField = (name, id) => {
  return {
    select: {
      name,
      id,
    },
  };
};

const addToDatabase = async (data) => {
  const response = await notion.pages.create({
    parent: {
      database_id: DATABASE_ID,
    },
    properties: {
      Name: createTextField(data.title),
      Status: createSelectField(data.status.name, data.status.id),
    },
  });
  console.log(response);
};

app.listen(port, () => {
  console.log("--- Server started! ---");
});
