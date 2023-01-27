all:
	docker-compose -f ./docker/docker-compose.yml up

build:
	docker-compose -f ./docker/docker-compose.yml --build

down:
	docker-compose -f ./docker/docker-compose.yml down

re: down
	docker-compose -f ./docker/docker-compose.yml up --build

clean: down
	docker system prune -a

fclean: down
	docker system prune --all --force --volumes
	docker network prune --force
	docker volume prune --force
	rm -rf ./srcs/backend
	rm -rm ./srcs/postgress

.PHONY	: all build down re clean fclean