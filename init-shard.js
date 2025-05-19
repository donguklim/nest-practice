sh.addShard("shardReplSet1/account-shard1:27018");
sh.addShard("shardReplSet2/account-shard2:27019");
sh.enableSharding("auth");
sh.shardCollection("auth.users", { username: "hashed" });
