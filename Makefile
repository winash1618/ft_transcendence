all:
	docker-compose -f ./docker/docker-compose.yml --env-file docker/.env up -d

build:
	docker-compose -f ./docker/docker-compose.yml --env-file docker/.env up -d --build

down:
	docker-compose -f ./docker/docker-compose.yml --env-file docker/.env down

re: down
	docker-compose -f ./docker/docker-compose.yml --env-file docker/.env up -d --build

clean: down
	docker system prune -a
	rm -rf /home/mkaruvan/data/wordpress/*
	rm -rf /home/mkaruvan/data/mariadb/*

fclean: down
	docker system prune --all --force --volumes
	docker network prune --force
	docker volume prune --force
	rm -rf /home/mkaruvan/data/wordpress/*
	rm -rf /home/mkaruvan/data/mariadb/*

.PHONY	: all build down re clean fclean