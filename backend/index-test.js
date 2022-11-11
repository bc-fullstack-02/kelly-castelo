// const express = require("express");
// const app = express();

// app.use(express.json());

// // app.get("/", (req, res) => {
// //     const content = fs.readFileSync(path.join(__dirname, 'static', 'index.html'), 'utf8');
// //     res.send(content);
// // })

// // app.get("/", (req, res, next) => {
// //     console.log("Primeiro get")
// //     next()
// // })

// // app.get("/", (req, res, next) => {
// //     console.log("Segundo get")
// //     next()
// // })

// // app.use("/", express.static(path.join(__dirname, "static")));

// //example of a rest api

// let db = [
//   { id: "1", name: "A" },
//   { id: "2", name: "B" },
//   { id: "3", name: "C" },
// ];

// const router = express.Router();

// router
//   .route("/alunos")
//   .get((req, res) => {
//     return res.send(db);
//   })
//   .post((req, res) => {
//     const newAluno = req.body;
//     db.push(newAluno);
//     return res.status(201).send(newAluno);
//   });

// router
//   .route("/alunos/:id")
//   .get((req, res) => {
//     const { id } = req.params;
//     const aluno = db.find((el) => {
//       return el.id === id;
//     });
//     if (!aluno) {
//       return res.status(404).send({
//         error: `cannot find aluno by id ${id}`,
//       });
//     }
//     return res.send(aluno);
//   })
//   .put((req, res) => {
//     const { id } = req.params;
//     const aluno = db.find((el) => {
//       return el.id === id;
//     });
//     if (!aluno) {
//       return res.status(404).send({
//         error: `cannot find aluno by id ${id}`,
//       });
//     }
//     db = db.map((el) => {
//       if (el.id === req.params.id) {
//         return req.body;
//       }
//       return el;
//     });
//     return res.status(202).end();
//   })
//   .delete((req, res) => {
//     const { id } = req.params;
//     const aluno = db.find((el) => {
//       return el.id === id;
//     });
//     if (!aluno) {
//       return res.status(404).send({
//         error: `cannot find aluno by id ${id}`,
//       });
//     }
//     const alunos = db.filter((el) => el.id !== id);
//     db = alunos;
//     return res.status(204).end();
//   });

// app.use("/v1", router);

// app.listen(3000, () => {
//   console.log("Listening on http://localhost:3000");
// });
