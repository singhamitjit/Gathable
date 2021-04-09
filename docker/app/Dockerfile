FROM node:14

WORKDIR /app

COPY /app/package.json .

RUN npm install
# RUN npm install -g npm@7.8.0

COPY /app .

EXPOSE 3000

CMD [ "npm", "start" ]
# CMD [ "npm", "test" ]
# CMD [ "/bin/sh" ]
