ARG docker_image
FROM ${docker_image}

RUN mkdir lume

RUN curl -o ~/.npm.certs.pem https://curl.se/ca/cacert.pem
RUN npm config set registry https://registry.npmjs.org
RUN npm config set cafile ~/.npm.certs.pem
