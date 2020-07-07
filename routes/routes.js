const User = require('../controllers/controller');

module.exports = (app) => {
app.post('/user',User.createUser);
app.get('/users',User.getUsers);
app.get('/user/:name',User.getUser);

app.post('/sign',User.signIn);
//app.delete('/user/:name',User.deleteUser);
app.put('/user/:name',User.updateUser);
app.post('/auth/forgot_password',User.forgotPassword);
app.post('/auth/reset_password/:token',User.resetPassword);
app.get('/external/api',User.externalApi);    
}