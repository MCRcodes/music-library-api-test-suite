const Artist = require('../src/models/artist');
const Album = require('../src/models/album');
const Song = require('../src/models/song');

describe('Songs', () => {
  let artistId;
  let albumId;

  beforeEach((done) => {
    chai.request(server)
      .post('/artists')
      .send({
        name: 'Tame Impala',
        genre: 'Rock',
      })
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(201);
        artistId = res.body._id;
        chai.request(server)
          .post(`/artists/${artistId}/albums`)
          .send({
            name: 'InnerSpeaker',
            year: 2010,
          }).end((postAlbumError, postAlbumResponse) => {
            expect(postAlbumError).to.equal(null);
            expect(postAlbumResponse.status).to.equal(201);
            albumId = postAlbumResponse.body._id;
            done();
          });
      });
  });

  describe('POST /album/:albumId/song', () => {
    it('creates a new song under an album', (done) => {
      chai.request(server)
        .post(`/albums/${albumId}/song`)
        .send({
          artistId: artistId,
          name: 'Solitude Is Bliss',
        })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(201);
          const songId = res.body._id;
          expect(res.body).to.deep.equal({
            name: 'Solitude Is Bliss',
            _id: songId,
            artist:
           {
             _id: artistId,
             name: 'Tame Impala',
             genre: 'Rock',
             __v: 0,
           },
            album:
           {
             _id: albumId,
             artist: artistId,
             name: 'InnerSpeaker',
             year: 2010,
             __v: 0,
           },
            __v: 0,
          });
          done();
        });
    });
  });

  it('returns a 404 and does not create a song if the album does not exist', (done) => {
    chai.request(server)
      .post('/albums/1234/song')
      .send({
        artistId: artistId,
        name: 'This is not a song',
      })
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The album could not be found');
        done();
      });
  });

  afterEach((done) => {
    Artist.deleteMany({}, () => {
      Album.deleteMany({}, () => {
        Song.deleteMany({}, () => {
          done();
        });
      });
    });
  });
});
