const mongoose = require('mongoose');
const Artist = require('../src/models/artist');
const Album = require('../src/models/album');

describe('/albums', () => {
  let tameImpala;
  let futureIslands;
  let arianaGrande;

  beforeEach((done) => {
    Artist.create({
      name: 'Tame Impala',
      genre: 'Rock',
    }, (error, document) => {
      tameImpala = document;
    });

    Artist.create({
      name: 'Future Islands',
      genre: 'Indie',
    }, (error, document) => {
      futureIslands = document;
    });

    Artist.create({
      name: 'Ariana Grande',
      genre: 'Pop',
    }, (error, document) => {
      arianaGrande = document;
      done();
    });
  });

  afterEach((done) => {
    Artist.deleteMany({}, () => {
      Album.deleteMany({}, () => {
        done();
      });
    });
  });

  describe('POST /artists/:artistId/albums', () => {
    it('creates a new album for a given artist', (done) => {
      chai.request(server)
        .post(`/artists/${tameImpala._id}/albums`)
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .end((error, res) => {
          expect(error).to.equal(null);
          expect(res.status).to.equal(201);

          Album.findById(res.body._id, (err, album) => {
            expect(err).to.equal(null);
            expect(album.name).to.equal('InnerSpeaker');
            expect(album.year).to.equal(2010);
            expect(album.artist).to.eql(tameImpala._id);
            done();
          });
        });
    });

    it('returns a 404 and does not create an album if the artist does not exist', (done) => {
      chai.request(server)
        .post('/artists/1234/albums')
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .end((error, res) => {
          expect(error).to.equal(null);
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The artist could not be found.');

          Album.find({}, (err, albums) => {
            expect(err).to.equal(null);
            expect(albums).to.have.lengthOf(0);
            done();
          });
        });
    });
  });


  describe('with albums in the database', () => {
    let albums;
    beforeEach((done) => {
      Promise.all([
        Album.create({ name: 'InnerSpeaker', year: 2010, artist: tameImpala._id }),
        Album.create({ name: 'The Far Field', year: 2017, artist: futureIslands._id }),
        Album.create({ name: 'Sweetener', year: 2018, artist: arianaGrande._id }),
        Album.create({ name: 'Thank U, next', year: 2019, artist: arianaGrande._id }),
      ]).then((documents) => {
        albums = documents;
        done();
      });
    });
    describe('GET /albums', () => {
      it('gets all albums records', (done) => {
        chai.request(server)
          .get('/albums/')
          .end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.lengthOf(4);

            res.body.forEach((album) => {
              const expected = albums.find(a => a._id.toString() === album._id);
              expect(album.name).to.equal(expected.name);
              expect(album.year).to.equal(expected.year);
              expect(album.artist.toString()).to.equal(expected.artist.toString());
            });
            done();
          });
      });
    });

    describe('GET /albums/:albumId', () => {
      it('gets an album by id', (done) => {
        const album = albums[0];
        chai.request(server)
          .get(`/albums/${albums[0]._id}`)
          .end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal(album.name);
            expect(res.body.year).to.equal(album.year);
            done();
          });
      });

      it('returns 404 if the album does not exist', (done) => {
        chai.request(server)
          .get('/albums/12345')
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The album could not be found.');
            done();
          });
      });
    });

    describe('GET /artists/:artistId/albums', () => {
      it('gets all album records for an artist ', (done) => {
        chai.request(server)
          .get(`/artists/${arianaGrande._id}/albums`)
          .end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            expect(res.body[0].name).to.equal(albums[2].name);
            expect(res.body[1].name).to.equal(albums[3].name);
            done();
          });
      });
      it('returns a 404 if the artist does not exist', (done) => {
        chai.request(server)
          .get('/artists/12345/albums')
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The artist could not be found.');
            done();
          });
      });
    });

    describe('PATCH /albums/:albumId', () => {
      it('updates an album record', (done) => {
        const album = albums[1];
        chai.request(server)
          .patch(`/albums/${album._id}`)
          .send({ name: 'Singles', year: 2014 })
          .end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            Album.findById(album._id, (err, updatedAlbum) => {
              expect(updatedAlbum.name).to.equal('Singles');
              expect(updatedAlbum.year).to.equal(2014);
              done();
            });
          });
      });

      it('returns a 404 if the album does not exist', (done) => {
        chai.request(server)
          .patch('/albums/12345')
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The album could not be found');
            done();
          });
      });
    });

    describe('DELETE /albums/:albumId', () => {
      it('deletes an album record by id', (done) => {
        const album = albums[0];
        chai.request(server)
          .delete(`/albums/${album._id}`)
          .end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            Album.findById(album._id, (error, updatedAlbum) => {
              expect(error).to.equal(null);
              expect(updatedAlbum).to.equal(null);
              done();
            });
          });
      });
    });
  });
});
