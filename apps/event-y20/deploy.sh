#!/bin/bash

echo "🚀 Deploying Y20 Registrants Portal..."

# Build Docker image
echo "📦 Building Docker image..."
docker build -t y20-registrants:latest .

# Stop existing container
echo "🛑 Stopping existing container..."
docker stop y20-registrants-app 2>/dev/null || true
docker rm y20-registrants-app 2>/dev/null || true

# Run new container
echo "▶️  Starting new container..."
docker run -d \
  --name y20-registrants-app \
  --network dokploy-network \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  --label "traefik.enable=true" \
  --label "traefik.http.routers.y20.rule=Host(\`events.alvin.finance\`)" \
  --label "traefik.http.routers.y20.entrypoints=websecure" \
  --label "traefik.http.routers.y20.tls=true" \
  --label "traefik.http.routers.y20.tls.certresolver=letsencrypt" \
  --label "traefik.http.services.y20.loadbalancer.server.port=3000" \
  y20-registrants:latest

echo "✅ Deployment complete!"
echo "📊 Checking status..."
docker ps | grep y20-registrants

echo "📝 Viewing logs..."
docker logs -f y20-registrants-app