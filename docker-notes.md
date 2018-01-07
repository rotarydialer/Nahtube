#App container (node):#

1. `git pull` to refresh the code
2. `cp ~/config.js config/`
3. `docker build -t "nah_node:0.4" .`
4. `docker run --name nahtube-node -p 3000:3000 -d nah_node:0.4

#Database container (postgres):#

1) Similar steps for the database container (but do the build in the `database/` directory):

	`docker build -t "nah_pg:0.1" .`
	`docker run --name nahtube-db -p 5432:5432 -e POSTGRES_PASSWORD=thinkofarealpasswordokay? -d postgres nah_pg:0.1`
