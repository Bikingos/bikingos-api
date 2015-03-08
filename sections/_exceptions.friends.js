/* jslint node: true */
'use strict';

module.exports = function (server) {
  /*jslint unparam:true */
  server.get('/v1/users/:username/friends', function (req, res) {
    res.send([
      {
        username: 'Goku',
        level: 4,
        team: 'red',
        teamId: 0,
        experience: 15000,
        nextLevel: 17800,
        avatar: 'http://nostradidifan.free.fr/Image%20DBZ/Goku%20SSJ4.jpg'
      },
      {
        username: 'Yoda',
        level: 5,
        team: 'green',
        teamId: 1,
        experience: 19870,
        nextLevel: 25000,
        avatar: 'http://www.bizarrebytes.com/wp-content/uploads/2010/09/Astonished_Yoda_by_rakufordevian.jpg'
      },
      {
        username: 'ChuckNorris',
        level: 7,
        team: 'red',
        teamId: 0,
        experience: 45000,
        nextLevel: 55000,
        avatar: 'http://www.lazotacalles.com/wp-content/uploads/2013/09/Chuck_Norris.jpg'
      },
      {
        username: 'TerryCrews',
        level: 3,
        team: 'red',
        teamId: 0,
        experience: 8000,
        nextLevel: 10000,
        avatar: 'http://i1.kym-cdn.com/photos/images/original/000/283/329/c30.jpg'
      },
      {
        username: 'MarkZuckerberg',
        level: 2,
        team: 'green',
        teamId: 1,
        experience: 4500,
        nextLevel: 7500,
        avatar: 'http://www.bellanaija.com/wp-content/uploads/2012/10/Mark-Zuckerberg-507402-1-402.jpg'
      },
      {
        username: 'Wolverine',
        level: 7,
        team: 'red',
        teamId: 0,
        experience: 54300,
        nextLevel: 55000,
        avatar: 'http://www.gaming-age.com/wp-content/uploads/2013/12/wolverine-poster-image.jpg'
      }
    ]);
  });
  /*jslint unparam:false */
};
