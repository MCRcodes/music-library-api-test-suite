const mongoose = require('mongoose');
const Artist = require('../src/models/artist');

describe('/artists', () => {
  afterEach((done) => {
    mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  describe('POST /artists', () => {
    it('creates a new artist in the database', (done) => {
      chai.request(server)
        .post('/artists')
        .send({
          name: 'Tame Impala',
          genre: 'Rock',
        })
        .end((error, res) => {
          expect(error).to.equal(null);
          expect(res.status).to.equal(201);

          Artist.findById(res.body._id, (err, artist) => {
            expect(err).to.equal(null);
            expect(artist.name).to.equal('Tame Impala');
            expect(artist.genre).to.equal('Rock');
            done();
          });
        });
    });
  });

  describe('with artists in the database', () => {
    let artists;
    beforeEach((done) => {
      Promise.all([
        Artist.create({ name: 'Tame Impala', genre: 'Rock' }),
        Artist.create({ name: 'Kylie Minogue', genre: 'Pop' }),
        Artist.create({ name: 'Dave Brubeck', genre: 'Jazz' }),
      ]).then((documents) => {
        artists = documents;
        done();
      });
    });

    describe('GET /artists', () => {
      xit('gets all artist records', (done) => {
        chai.request(server)
          .get('/artists')
          .end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.lengthOf(3);

            res.body.forEach((artist) => {
              const expected = artists.find(a => a._id.toString() === artist._id);
              expect(artist.name).to.equal(expected.name);
              expect(artist.genre).to.equal(expected.genre);
            });
            done();
          });
      });
    });

    describe('GET /artist/:artistId', () => {
      xit('gets artist record by id', (done) => {
        const artist = artists[0];
        chai.request(server)
          .get(`/artists/${artist._id}`)
          .end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal(artist.name);
            expect(res.body.genre).to.equal(artist.genre);
            done();
          });
      });

      xit('returns a 404 if the artist does not exist', (done) => {
        chai.request(server)
          .get('/artists/12345')
          .end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The artist could not be found.');
            done();
          });
      });
    });

    describe('PATCH /artists/:artistId', () => {
      xit('updates artist record by id', (done) => {
        const artist = artists[0];
        chai.request(server)
          .patch(`/artists/${artist._id}`)
          .send({ genre: 'Psychedelic Rock' })
          .end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            Artist.findById(artist._id, (err, updatedArtist) => {
              expect(updatedArtist.genre).to.equal('Psychedelic Rock');
              done();
            });
          });
      });

      xit('returns a 404 if the artist does not exist', (done) => {
        chai.request(server)
          .patch('/artists/12345')
          .send({ genre: 'Psychedelic Rock' })
          .end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The artist could not be found.');
            done();
          });
      });
    });

    describe('DELETE /artists/:artistId', () => {
      xit('deletes artist record by id', (done) => {
        const artist = artists[0];
        chai.request(server)
          .delete(`/artists/${artist._id}`)
          .end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(204);
            Artist.findById(artist._id, (error, updatedArtist) => {
              expect(error).to.equal(null);
              expect(updatedArtist).to.equal(null);
              done();
            });
          });
      });

      xit('returns a 404 if the artist does not exist', (done) => {
        chai.request(server)
          .delete('/artists/12345')
          .end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The artist could not be found.');
            done();
          });
      });
    });
  });
});
