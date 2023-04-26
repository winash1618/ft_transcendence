DOCKER-COMPOSE := docker-compose -f docker-compose.prod.yml

all: up

up:
	@printf "\033[0;31mBuild, recreate, start containers\033[0m\n"
	$(DOCKER-COMPOSE) up -d --build

prod:
	@printf "\033[0;31mBuild, recreate, start production containers\033[0m\n"
	$(DOCKER-COMPOSE) -f docker-compose.prod.yml up -d --build

build:
		@printf "\033[0;31mBuild images from dockerfiles\033[0m\n"
		$(DOCKER-COMPOSE) build

start:
		@printf "\033[0;31mStart stopped containers\033[0m\n"
		$(DOCKER-COMPOSE) start

restart:
		@printf "\033[0;31mRestart stopped containers\033[0m\n"
		$(DOCKER-COMPOSE) restart

stop:
		@printf "\033[0;31mStop containers (main process receive SIGTERM) \033[0m\n"
		$(DOCKER-COMPOSE) stop
		# $(DOCKER-COMPOSE) -f docker-compose.prod.yml stop

down:
		@printf "\033[0;31mStop and remove containers, networks\033[0m\n"
		$(DOCKER-COMPOSE) down --rmi local --volumes --remove-orphans

down-prod:
		@printf "\033[0;31mStop and remove containers, networks\033[0m\n"
		$(DOCKER-COMPOSE) -f docker-compose.prod.yml down --rmi local --volumes --remove-orphans

ps:
		@printf "\033[0;31mList containers\033[0m\n"
		$(DOCKER-COMPOSE) ps

images:
		@printf "\033[0;31mList images\033[0m\n"
		docker images

volume:
		@printf "\033[0;31mList volumes\033[0m\n"
		docker volume ls

delete:
		@printf "\033[0;31mDelete all the images\033[0m\n"
		docker rmi -f $(docker images -aq)

nest:
		@printf "\033[0;31mStart NestJS\033[0m\n"
		docker-compose exec nestjs bash

react:
		@printf "\033[0;31mStart ReactJS\033[0m\n"
		docker-compose exec reactjs bash

logs:
		@printf "\033[0;31mShow logs\033[0m\n"
		$(DOCKER-COMPOSE) logs -f

clean: down

fclean: clean
		@printf "\033[0;31mRemoves images, containers and volumes\033[0m\n"

prune:	fclean
		@printf "\033[0;31mRemoves all unused images, containers and volumes\033[0m\n"

re: fclean all

.PHONY: all up build start restart stop down ps images volume clean fclean prune re
