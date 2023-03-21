const PORT = process.env.PORT ?? 8000;
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const app = express();
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());
//Obtener todas las tareas

app.get("/tareas/:userEmail", async (req, res) => {
  const { userEmail } = req.params;

  try {
    const tareas = await pool.query(
      "SELECT * FROM tareas WHERE user_email=$1",
      [userEmail]
    );
    res.json(tareas.rows);
  } catch (error) {
    console.error(error);
  }
});

//Crear una nueva tarea

app.post("/tareas", async (req, res) => {
  const { user_email, title, progress, date } = req.body;
  console.log(user_email, title, progress, date);
  const id = uuidv4();
  try {
    const nuevaTarea = await pool.query(
      "INSERT INTO tareas(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)",
      [id, user_email, title, progress, date]
    );
    res.json(nuevaTarea);
  } catch (err) {
    console.error(err);
  }
});

// editar una nueva tarea

app.put("/tareas/:id", async (req, res) => {
  const { id } = req.params;
  const { user_email, title, progress, date } = req.body;
  try {
    const editToDo = await pool.query(
      "UPDATE tareas SET user_email=$1, title=$2, progress=$3, date=$4 WHERE id=$5;",
      [user_email, title, progress, date, id]
    );
    res.json(editToDo);
  } catch (err) {
    console.error(err);
  }
});

// eliminar una tarea

app.delete("/tareas/:id", async (req, res) => {
  const { id } = req.params;
  const deletedToDo = await pool.query("DELETE FROM tareas WHERE id=$1", [id]);
  res.json(deletedToDo);
  try {
  } catch (err) {
    console.error(err);
  }
});

//Registrarse

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const signUp = await pool.query(
      `INSERT INTO usuarios (email, hashed_password) VALUES($1, $2) `,
      [email, hashedPassword]
    );

    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

    res.json({ email, token });
  } catch (err) {
    console.error(err);
    if (err) {
      res.json({ detail: err.detail });
    }
  }
});

//Iniciar sesion

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await pool.query("SELECT * FROM usuarios WHERE email=$1", [
      email,
    ]);

    if (!users.rows.length) return res.json({ detail: "Usuario no existe" });

    const success = await bcrypt.compare(
      password,
      users.rows[0].hashed_password
    );
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

    if (success) {
      res.json({ email: users.rows[0].email, token });
    } else {
      res.json({ detail: "Inicio de sesion fallido" });
    }
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server esta iniciado en el puerto ${PORT}`);
});
