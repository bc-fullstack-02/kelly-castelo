const express = require("express");
const { Client } = require('pg')

const app = express();

app.use(express.json());

const router = express.Router();

function conn() {
  const client = new Client({
    connectionString: "postgresql://postgres:postgres@localhost:5432/sysmap",
  });
  return client.connect().then(() => {
    return client;
  });
}

router
  .route("/posts")
  .all((req, res, next) => {
    console.log(new Date());
    return conn().then((client) => {
      req.db = client;
      next();
    });
  })
  .get((req, res) => {
    req.db
      .query("SELECT id, title, body FROM public.posts;")
      .then((data) => {
        res.send(data.rows);
      })
      .catch((e) => {
        console.error(e);
        res.status(500).end();
      });
  })
  .post((req, res) => {
    db.push(req.body);
    res.status(201);
    res.end();
  });

router
  .param("id", (req, res, next, id) => {
    console.log(new Date());
    return conn().then((client) => {
      req.db = client;
      next();
    });
  })
  .route("/posts/:id")
  .get((req, res) => {
    const ret = db.find((e) => e.id === req.params.id);
    if (ret) {
      res.send(ret);
    } else {
      res.status(404).end();
    }
  })
  .put((req, res) => {
    const ret = db.find((e) => e.id === req.params.id);
    if (ret) {
      db = db.map((e) => {
        if (e.id === req.params.id) {
          return req.body;
        } else {
          return e;
        }
      });
      res.status(202);
      res.end();
    } else {
      res.status(404).end();
    }
  })
  .delete((req, res) => {
    const ret = db.find((e) => e.id === req.params.id);
    if (ret) {
      db = db.filter((e) => e.id !== req.params.id);
      res.status(204);
      res.end();
    } else {
      res.status(404).end();
    }
  });

app.use("/v1", router);

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
