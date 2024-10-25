# hof-or-not-service
Backend service for HOF OR NOT

The best way to run the project locally, is to:

1 `npm run docker:db:start` to start the database in docker and run migrations

2 `npm run docker:service:build` to build the service in docker

3 `npm run docker:service:start` to start the service in docker

Note: You can also just run the service through terminal by doing `npm run build` and `npm run start` after the db is running in docker.



After the DB is running you will have to insert the values into the database by running a command from the docker terminal:

1 `docker exec -it hof-or-not-service-db bash;` will connect you to the docker terminal

2 go to the root directory `cd ../../../`

3 run this `psql -U postgres -d hofornot -c "COPY hofornot.players (player_id,first_name, last_name, nickname, position, super_bowl_wins, pro_bowls, mvps, year_retired, picture) FROM '/app/player-picture-base64s.csv' DELIMITER '|'  CSV NULL 'NULL'"`

When running flyway, if you want to complete wipe out the database, including values (not recommended), add this to commands before the migrate line in docker-compose.yaml:

`flyway -url=jdbc:postgresql://db/${POSTGRES_DB} -schemas=${POSTGRES_DB} -user=${POSTGRES_USER} -password=${POSTGRES_PASSWORD} -locations=filesystem:/flyway/sql -cleanDisabled=false clean;`