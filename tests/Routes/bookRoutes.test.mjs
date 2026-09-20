process.env.NODE_ENV = 'test';

import Book from '../../src/models/books.js';
import chai from '../support/chai.mjs';
import server from '../../index.js';

describe('Books', () => {
  beforeEach(async () => {
    await Book.deleteMany({});
  });

  describe('/GET books', () => {
    it('it should GET all the books', (done) => {
      chai.request.execute(server)
        .get('/books')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('/POST book', () => {
    it('it should POST a book', (done) => {
      const book = {
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien'
      };
      chai.request.execute(server)
        .post('/books')
        .send(book)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('title').eql('The Lord of the Rings');
          res.body.should.have.property('author').eql('J.R.R. Tolkien');
          done();
        });
    });
  });

  describe('/GET/:id book', () => {
    it('it should GET a book by the given id', async () => {
      const book = await new Book({ title: '1984', author: 'George Orwell' }).save();
      const res = await chai.request.execute(server).get('/books/' + book.id);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('title').eql('1984');
      res.body.should.have.property('author').eql('George Orwell');
      res.body.should.have.property('_id').eql(book.id);
    });
  });

  describe('/PUT/:id book', () => {
    it('it should UPDATE a book given the id', async () => {
      const book = await new Book({ title: 'The Chronicles of Narnia', author: 'C.S. Lewis' }).save();
      const res = await chai.request.execute(server)
        .put('/books/' + book.id)
        .send({ title: 'The Chronicles of Narnia', author: 'C.S. Lewis Updated' });
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('author').eql('C.S. Lewis Updated');
    });
  });

  describe('/DELETE/:id book', () => {
    it('it should DELETE a book given the id', async () => {
      const book = await new Book({ title: 'Harry Potter', author: 'J.K. Rowling' }).save();
      const res = await chai.request.execute(server).delete('/books/' + book.id);
      res.should.have.status(204);
    });
  });
});
