# TODO

1. aws
1. channels


# Build and Deploy
## Docker Dev
 1. npm run build
 1. docker build -t bid-client-dev .
 1. docker run -p 5000:4444 -d bid-client-dev

## Docker Prod
 1. npm run build
 1. docker build -t bid-client-prod -f Dockerfile.production .
 1. docker run -p 5050:4000 -d bid-client-prod
