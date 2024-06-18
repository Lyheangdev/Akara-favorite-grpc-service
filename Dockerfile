#=== Using linux pre-installed node version-18+
FROM node:20-alpine

#=== Opting runner working directory
WORKDIR /usr/src/app

#=== Copying configuration project to be located in runner working directory
COPY package.json .

#=== Installing all dependencies or requred modules using Yarn
RUN npm install

#=== Copying all project files to runner working directory 
COPY . .

COPY .env ./.env
#=== Exposing external port to outside world access
EXPOSE 7000

#=== Executing API application
CMD ["node", "index.js"]
