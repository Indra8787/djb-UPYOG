FROM delhijalboard/alpine-node-builder-18:yarn AS build
#FROM ghcr.io/egovernments/alpine-node-builder-14:yarn AS build
RUN apk update && apk upgrade
RUN apk add --no-cache git>2.30.0
RUN yarn add @djb25/digit-ui-libraries
RUN yarn add @djb25/digit-ui-module-fsm
RUN yarn add @djb25/digit-ui-module-dss
RUN yarn add @djb25/digit-ui-module-mcollect
RUN yarn add @djb25/digit-ui-module-engagement
RUN yarn add @djb25/digit-ui-module-hrms
RUN yarn add @djb25/digit-ui-module-core
RUN yarn add @djb25/digit-ui-module-common
RUN yarn add @djb25/digit-ui-module-commonpt
RUN yarn add @djb25/digit-ui-module-bills
RUN yarn add @djb25/digit-ui-module-asset
RUN yarn add @djb25/digit-ui-module-vendor
RUN yarn add @djb25/digit-ui-module-pgr

ARG WORK_DIR
WORKDIR /app
ENV NODE_OPTIONS "--max-old-space-size=8192"
ENV GENERATE_SOURCEMAP "false"

COPY ${WORK_DIR} .
RUN ls -lah

#RUN node web/envs.js
RUN cd web/ \
    && node envs.js \
    && node -e 'console.log(v8.getHeapStatistics().heap_size_limit/(8192*8192))' \
    &&  ./install-deps.sh \
    && yarn install \
    \
    # THIS LINE BUILDS THE REACT COMPONENTS IN THE MONOREPO, IF THIS IS NOT BUILT THEN THE BUILD OF THE MAIN APP FAILS AS IT DEPENDS ON THE COMPONENTS
    && cd micro-ui-internals/packages/react-components && yarn build && cd ../../../ \
    \
    && yarn build
    

FROM nginx:mainline-alpine
#FROM ghcr.io/egovernments/nginx:mainline-alpine
ENV WORK_DIR=/var/web/digit-ui

RUN mkdir -p ${WORK_DIR}

COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/docker/nginx.conf /etc/nginx/conf.d/default.conf
