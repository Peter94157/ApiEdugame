
const express = require("express")
const mongoose = require("mongoose")
const app = express();
const port = process.env.PORT || 5500
const Category = require('./Models/Category')
app.use(express.json());
const cors = require('cors');
app.use(cors());



app.get('/category/:name', async (req, res) => {
    try {
        const { name } = req.params;
        console.log('Buscando categoria:', name);

        const category = await Category.findOne({ name: new RegExp(`^${name}$`, 'i') });

        if (!category) {
            return res.status(404).send({ message: "Categoria não encontrada" });
        }

        res.send(category);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erro ao buscar categoria" });
    }
})


mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB conectado com sucesso");
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch((err) => console.error("Erro ao conectar no MongoDB:", err));


app.post('/insert', async (req, res) => {
    try {
        const result = await seedCategories();
        res.status(200).json({ message: 'Categorias inseridas com sucesso', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao inserir categorias' });
    }
})


async function seedCategories() {
    const categories = Object.entries(categoryQuestions).map(([name, questions]) => ({
        name,
        questions
    }))
    await Category.deleteMany()
    await Category.insertMany(categories);

    console.log(categoryQuestions)
    console.log('Categoria inseriada com sucesso')
    return categoryQuestions
}

app.get("/", (req, res) => {
    res.send("API EduGame funcionando 🚀");
});

app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.send(categories);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar categorias' });
  }
});






