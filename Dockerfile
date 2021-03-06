FROM node:8
ENV NODE_ENV development
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN npm -g config set user root
RUN npm install -g serve
COPY build/ .
EXPOSE 4444
CMD [ "serve", "-l", "4444", "-s", "./", "-n" ]
