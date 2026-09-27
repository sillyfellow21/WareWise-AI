.PHONY: install lint test build dev infra-up infra-down

install:
	npm install --prefix server
	npm install --prefix client

lint:
	npm run lint --prefix client

build:
	npm run build --prefix client

test:
	npm test --prefix server

infra-up:
	docker compose up -d postgres redis

infra-down:
	docker compose down

dev:
	npm run dev --prefix client
