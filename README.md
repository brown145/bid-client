# TODO

#. aws
#. channels
#. logout


# Build and Deploy
## Docker Dev
 #. npm run build
 #. docker build -t bid-client-dev .
 #. docker run -p 5000:4444 -d bid-client-dev

## Docker Prod
 #. npm run build
 #. docker build -t bid-client-prod -f Dockerfile.production .
 #. docker run -p 5050:4000 -d bid-client-prod
