FROM node:15.8.0

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN yarn install
RUN npm run build

RUN cp -r build/src/* build/
RUN rm -R build/src
RUN rm build/package.json

CMD [ "npm", "start" ]
