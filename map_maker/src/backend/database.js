import { MongoClient } from "mongodb";
import http from "http";

// TO DO
// Set up node backend
//const http = require("http");
const hostname = process.env.HOST;
const port = process.env.PORT;
const server = http.createServer((req, res) => {
  const { method, url, headers } = req;
  let body = [];
  req
    .on("error", (err) => {
      console.error(err.stack);
    })
    .on("data", (chunk) => {
      body.push(chunk);
    })
    .on("end", async () => {
      body = Buffer.concat(body).toString();
      res.on("error", (err) => {
        console.error(err);
      });
      res.statusCode = 200;
      const responseBody = { headers, method, url, body };
      try {
        await main(JSON.parse(body));
      } catch (e) {
        console.log(e);
      }
      res.setHeader("Content-Type", "text/plain"); // 'application/json'
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.write(JSON.stringify(responseBody));
      res.end("Hello, World!\n");
    });
});
//server.listen(port);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const uri =
  process.env.URI_FIRST +
  encodeURIComponent(process.env.PASSWORD) +
  process.env.URI_LAST;

export async function main(collection) {
  const client = new MongoClient(uri);
  try {
    client.connect((err, db) => {
      const database = db.db("Game");
      database.collection("maps").insertOne(collection);
      console.log("success");
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
