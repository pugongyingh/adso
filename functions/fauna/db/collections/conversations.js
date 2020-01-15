const conversationsCollection = {
  name: "conversations",
  create: true,
  update: true,
  params: {
    history_days: 1,
    permissions: {
      read: "public",
      write: "public",
      create: "public"
    }
  }
};

module.exports = conversationsCollection;
