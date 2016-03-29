db.AppUser.find().forEach(function(user){
  db.AppUser.update({_id:user._id},{$set:{password:user.password_digest}});
});
