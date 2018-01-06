Eventually orchestrate all this with docker-compose.

#App container (node):#

1) After `git pull` to refresh the code, ensure the db connection string in config.js matches the Postgres container, e.g.:

	`config.database.connectionString = 'postgresql://postgres:supersecretpassword@172.18.0.2:5432/mydb';`

2) Build a new image with `docker build` (do this in the root directory of the project):

	`docker build -t "nah_node:0.4" .`

   Increment the version tag as desired.

3) Start a container with the new image using `docker run` like so:

	`docker run --name nahtube-node -p 3000:3000 -d nah_node:0.4

#Database container (postgres):#

1) Similar steps for the database container (but do the build in the `database/` directory):

	`docker build -t "nah_pg:0.1" .`
	`docker run --name nahtube-db -p 5432:5432 -e POSTGRES_PASSWORD=thinkofarealpasswordokay? -d postgres nah_pg:0.1`
