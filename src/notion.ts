import { DATABASE_ID } from ".";
import * as notionhq from "@notionhq/client";

const generateTextField = (text: string) => {
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

const generateSelectField = (name: string, id: string) => {
  return {
    select: {
      name,
      id,
    },
  };
};

const addToDatabase = async (notion: notionhq.Client, data: any) => {
  await notion.pages.create({
    parent: {
      database_id: DATABASE_ID,
    },
    properties: {
      Name: generateTextField(data.title),
      Status: generateSelectField(data.status.name, data.status.id),
    },
  });
};

export { addToDatabase };
