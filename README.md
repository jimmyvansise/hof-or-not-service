# hof-or-not-service
Backend service for HOF OR NOT

The best way to run the project locally, is to:

1 `npm run docker:db:start` to start the database in docker and run migrations

2 `npm run docker:service:build` to build the service in docker

3 `npm run docker:service:start` to start the service in docker

Note for steps 2 and 3: You can also just run the service through terminal by doing `npm run build` and `npm run start` if you don't feel like running the service in docker.


After the DB is running you will have to insert the values into the database by running a command from the docker terminal:

1 `docker exec -it hof-or-not-service-db bash;` will connect you to the docker terminal

2 go to the root directory `cd ../../../`

3 run this `psql -U postgres -d hofornot -c "COPY hofornot.players (player_id, first_name, last_name, nickname, position, super_bowl_wins, pro_bowls, mvps, year_retired, picture) FROM '/app/player-data.csv' DELIMITER '|' CSV HEADER NULL 'NULL'"`



When running flyway, if you want to completely wipe out the database, including values (not recommended, players/votes will be lost), add this to commands before the migrate line in docker-compose.yaml:

`flyway -url=jdbc:postgresql://db/${POSTGRES_DB} -schemas=${POSTGRES_DB} -user=${POSTGRES_USER} -password=${POSTGRES_PASSWORD} -locations=filesystem:/flyway/sql -cleanDisabled=false clean;`


Production notes:
* The environment variables are stored in AWS, under the task definition in ECS. Whatever .env you publish to ECR won't actually matter.

* To run flyway migrations on production, modify the .env file with the production database values,
and then modify the docker-compose.yaml with this line for flyway
`flyway -url=jdbc:postgresql://hofornot.cz2y86moc6n3.us-east-2.rds.amazonaws.com:5432/${POSTGRES_DB} -schemas=${POSTGRES_DB} -user=${POSTGRES_USER} -password=${POSTGRES_PASSWORD} -locations=filesystem:/flyway/sql migrate"`
After that, if you need to insert values (like new players), use the .csv file at 
`db/player-data.csv` and import values using TablePlus after connecting to production

* To update the ECS service:
Push to ECR guide

// dont worry about changing .env, it is on AWS
npm run docker:service:build

aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 537124955171.dkr.ecr.us-east-2.amazonaws.com

docker tag jimmyvansise-hof-or-not-service:latest 537124955171.dkr.ecr.us-east-2.amazonaws.com/hofornot/hofornotservice:latest

docker push 537124955171.dkr.ecr.us-east-2.amazonaws.com/hofornot/hofornotservice:latest

force a new deployment from ECS -> Service -> Update Service, dont need to change any settings except checkbox force