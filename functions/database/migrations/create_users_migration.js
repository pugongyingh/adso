module.exports.up = q => {
  return q.CreateCollection({ name: "Users" });
};

module.exports.down = q => {
  return q.Delete(q.Collection("Users"));
};
