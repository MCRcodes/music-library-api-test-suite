const mongoose = require('mongoose');
const Artist = require('../src/models/artist');
const Album = require('../src/models/album');

describe('/albums', () => {
  let artist;

  beforeEach((done) => {
    Artist.create({
      name: 'Tame Impala',
      genre: 'Rock',
    }, (error, document) => {
      artist = document;
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
        .post(`/artists/${artist._id}/albums`)
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
            expect(album.artist).to.eql(artist._id);
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
        Album.create({ name: 'InnerSpeaker', year: 2010 }),
      ]).then((documents) => {
        albums = documents;
        done();
      });
    });

    describe('GET /albums', () => {
      it('gets all album records', (done) => {
        chai.request(server)
          .get('/artists/:artistId/albums')
          .end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.lengthOf(1);

            res.body.forEach((album) => {
              const expected = albums.find(a => a._id.toString() === album._id);
              expect(album.name).to.equal(expected.name);
              expect(album.year).to.equal(expected.year);
            });
            done();
          });
      });
    });

    describe('PATCH /albums/:albumId', () => {
      it('updates album record by id', (done) => {
        const album = albums[0];
        chai.request(server)
          .patch(`/artists/${artist._id}/albums/${album._id}`)
          .send({ year: 1999 })
          .end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            Album.findById(album._id, (err, updatedAlbum) => {
              expect(updatedAlbum.year).to.equal(1999);
              done();
            });
          });
      });
    });
    describe('DELETE /albums/:albumId', () => {
      it('deletes artist record by id', (done) => {
        const album = albums[0];
        chai.request(server)
          .delete(`/artists/${artist._id}/albums/${album._id}`)
          .end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(204);
            Album.findById(artist._id, (error, updatedAlbum) => {
              expect(error).to.equal(null);
              expect(updatedAlbum).to.equal(null);
              done();
            });
          });
      });
    });
  });
});
