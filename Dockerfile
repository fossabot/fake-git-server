FROM node:slim

RUN apt-get update
RUN apt-get install -yy git

COPY yarn.lock /
COPY package.json /
RUN yarn install

COPY . /

ENTRYPOINT ["node"]
CMD ["index.js"]