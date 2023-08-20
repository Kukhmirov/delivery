FROM node:alpine
WORKDIR /app

# ARG NODE_ENV=production
COPY ./package*.json ./
RUN npm install
COPY *.js ./
COPY ./src src/

ENV MONGODB_URL=${MONGODBURL}
RUN mkdir ./filestorage


CMD [ "npm", "run", "dev" ]
