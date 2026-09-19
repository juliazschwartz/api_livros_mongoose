process.env.NODE_ENV = 'test';

import express from 'express';
import bodyParser from 'body-parser';
import * as chaiModule from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Book from '../../src/models/books.js';
import bookRoutes from '../../src/routes/bookRoutes.js';
import errorHandler from '../../src/middlewares/errorHandler.js';

const chai = chaiModule.use(chaiHttp);
chai.should();

const app = express();
app.use(bodyParser.json());
app.use('/books', bookRoutes);
app.use(errorHandler);

describe('Book Routes (unit)', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('GET /books retorna os livros resolvidos pelo model', async () => {
    const fakeBooks = [{ title: 'Dune', author: 'Frank Herbert' }];
    sinon.stub(Book, 'find').resolves(fakeBooks);

    const res = await chai.request.execute(app).get('/books');

    res.should.have.status(200);
    res.body.should.deep.equal(fakeBooks);
  });

  it('GET /books encaminha erro do model para o errorHandler', async () => {
    sinon.stub(Book, 'find').rejects(new Error('DB indisponível'));

    const res = await chai.request.execute(app).get('/books');

    res.should.have.status(500);
    res.body.should.have.property('message').eql('DB indisponível');
  });

  it('GET /books/:id retorna 404 quando o model não encontra o livro', async () => {
    sinon.stub(Book, 'findById').resolves(null);

    const res = await chai.request.execute(app).get('/books/60c72b2f9b1e8a001c8e4d3a');

    res.should.have.status(404);
  });

  it('POST /books cria o livro chamando save(), sem persistir no banco real', async () => {
    const saveStub = sinon.stub(Book.prototype, 'save').resolves();

    const res = await chai.request.execute(app)
      .post('/books')
      .send({ title: 'Neuromancer', author: 'William Gibson' });

    res.should.have.status(201);
    res.body.should.have.property('title').eql('Neuromancer');
    saveStub.calledOnce.should.be.true;
  });

  it('PUT /books/:id retorna 404 quando o livro a atualizar não existe', async () => {
    sinon.stub(Book, 'findByIdAndUpdate').resolves(null);

    const res = await chai.request.execute(app)
      .put('/books/60c72b2f9b1e8a001c8e4d3a')
      .send({ title: 'X', author: 'Y' });

    res.should.have.status(404);
  });

  it('DELETE /books/:id chama findByIdAndDelete com o id da rota e retorna 204', async () => {
    const deleteStub = sinon.stub(Book, 'findByIdAndDelete').resolves({ id: 'abc123' });

    const res = await chai.request.execute(app).delete('/books/abc123');

    res.should.have.status(204);
    deleteStub.calledWith('abc123').should.be.true;
  });
});
