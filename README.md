# Nahtube

Init Postgres:

  `docker swarm init`
  `docker stack deploy -c stack.yml`

# Result:

CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS               NAMES
9bde3e4f8dbe        postgres:latest     "docker-entrypoint..."   9 seconds ago       Up 3 seconds        5432/tcp            postgres_db.1.k1czxb37sv8rqv1h7pqo04b54
21c1aced9dfc        adminer:latest      "entrypoint.sh doc..."   3 minutes ago       Up 3 minutes        8080/tcp            postgres_adminer.1.kql67iz40jznczsdygsls768x