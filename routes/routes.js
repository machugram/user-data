const User = require('../controllers/controller');

module.exports = (app) => {
app.post('/user',User.createUser);
app.get('/users',User.getUsers);
app.get('/user/:name',User.getUser);
//app.delete('/asset/:name',Asset.deleteAsset);
//app.put('/asset/:name',Asset.updateAsset);

}

