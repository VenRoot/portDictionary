# Variablen
COMPOSE_DIR = .docker
COMPOSE_FILE = $(COMPOSE_DIR)/docker-compose.yml
SERVICE_NAME = deno-compiler
OUTPUT_DIR = build
DENO_INSTALL_SCRIPT = https://deno.land/x/install/install.sh

# Sicherstellen, dass das Build-Verzeichnis existiert
$(OUTPUT_DIR):
	mkdir -p $(OUTPUT_DIR)

# Install Deno locally
install:
	curl -fsSL $(DENO_INSTALL_SCRIPT) | sh

# Temporary Deno compilation without installation
compile-temp:
	curl -fsSL $(DENO_INSTALL_SCRIPT) | DENO_INSTALL=./tmp-deno sh
	./tmp-deno/bin/deno compile -A --output ./$(OUTPUT_DIR)/portDictionary ./src/main.ts
	rm -rf ./tmp-deno

# Docker Compose: Build Image und Run Service
compile: $(OUTPUT_DIR)
	UID=$$(id -u) GID=$$(id -g) docker compose -f $(COMPOSE_FILE) up --build

compile-native: $(OUTPUT_DIR)
	deno compile -A --output ./build/portDictionary ./src/main.ts

# Aufräumen der erzeugten Dateien
clean: clean-docker
	rm -rf $(OUTPUT_DIR)
	rm -rf ./tmp-deno

# Entferne Docker-Container und Images
clean-docker:
	docker compose -f $(COMPOSE_FILE) down --rmi all --volumes --remove-orphans
