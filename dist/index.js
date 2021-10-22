"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notionhq = __importStar(require("@notionhq/client"));
const AUTH_SECRET = process.env.AUTH_SECRET || "";
const DATABASE_ID = process.env.DATABASE_ID || "";
const notion = new notionhq.Client({
    auth: AUTH_SECRET,
});
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let data = {};
    const db = yield notion.databases.retrieve({
        database_id: DATABASE_ID,
    });
    const properties = db.properties;
    const taskName = req.body.event_data.content;
    data = {
        title: taskName,
        status: {
            name: "Todo",
            id: ((_a = properties.Status) === null || _a === void 0 ? void 0 : _a.type) === "select" &&
                ((_c = (_b = properties.Status) === null || _b === void 0 ? void 0 : _b.select.options.find((el) => el.name === "Todo")) === null || _c === void 0 ? void 0 : _c.id),
        },
    };
    addToDatabase(data);
    res.sendStatus(200);
}));
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
const addToDatabase = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield notion.pages.create({
        parent: {
            database_id: DATABASE_ID,
        },
        properties: {
            Name: createTextField(data.title),
            Status: createSelectField(data.status.name, data.status.id),
        },
    });
    console.log(response);
});
app.listen(port, () => {
    console.log("--- Server started! ---");
});
