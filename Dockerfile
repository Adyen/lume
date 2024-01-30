ARG DOCKER_IMAGE
FROM $DOCKER_IMAGE

WORKDIR /home/node/lume

EXPOSE 9002 9003

RUN curl -o ~/.npm.certs.pem https://curl.se/ca/cacert.pem
RUN npm config set registry https://registry.npmjs.org
RUN npm config set cafile ~/.npm.certs.pem

RUN npm i -g pnpm

ENV PATH="${PATH}:/root/local/bin"
