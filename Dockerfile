FROM node:carbon

# create application directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

RUN npm run build --only=production

# bundle app source code
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
