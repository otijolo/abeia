#!/usr/bin/env bash
JAVA_HOME="${JAVA_HOME:-/home/enzo/.jdks/jdk-17.0.20.1+1}"
export JAVA_HOME
export PATH="$JAVA_HOME/bin:$PATH"

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR" || exit 1

echo "=========================================="
echo "Iniciando Backend Spring Boot Abeia (Unifor)"
echo "Java Home: $JAVA_HOME"
echo "Porta: 8088"
echo "Swagger UI: http://localhost:8088/swagger-ui.html"
echo "OpenAPI JSON: http://localhost:8088/api-docs"
echo "=========================================="

./mvnw spring-boot:run
