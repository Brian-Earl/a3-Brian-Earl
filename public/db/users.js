

var users

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (users[idx]) {
      cb(null, users[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = users.length; i < len; i++) {
      var user = users[i];
      if (user.username === username) {
        console.log("Found Username")
        return cb(null, user);
      }
    }
    console.log("Username DNA")
    return cb(null, null);
  })
};

exports.addUser = function(username, password) {
  let newUser = {id:users.length+1, username: username, password: password, crew:[]}
   users.push(newUser)
  console.log(users)
  return newUser
}

exports.getUsers = function(){
  return users
}

exports.changeUser = function(newUser){
      for (var i = 0, len = users.length; i < len; i++) {
      var user = users[i];
      if (user.username === newUser.username) {
        users[i] = newUser
      }
    }
}

exports.loadUser = function(data){
  users = data
}

