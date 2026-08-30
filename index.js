require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/config');
const bookRoutes = require('./src/routes/bookRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/books', bookRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

app.get('/', (req, res) => {
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
      <title>API de Livros</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
          }
          .container {
              background: #fff;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
              padding: 20px 40px;
              text-align: center;
          }
          h1 {
              color: #333;
              margin-bottom: 20px;
              font-size: 2.5em;
          }
          p {
              font-size: 1.2em;
              color: #666;
              line-height: 1.6;
          }
          .btn {
              display: inline-block;
              margin-top: 20px;
              padding: 10px 20px;
              font-size: 1em;
              color: #fff;
              background-color: #007BFF;
              border: none;
              border-radius: 5px;
              text-decoration: none;
              transition: background-color 0.3s;
          }
          .btn:hover {
              background-color: #0056b3;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Bem-vindo à minha API de Livros &#128218;</h1>
          <p>Criei essa API para listar os livros que li em 2024. Fiz para treinar meus conhecimentos em Node.js.</p>
          <a href="#" class="btn">Saiba mais</a>
      </div>
  </body>
  </html>
  `;

  res.send(htmlContent);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
