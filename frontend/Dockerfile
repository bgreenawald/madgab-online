# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM tiangolo/node-frontend:10 as build-stage
WORKDIR /app
COPY ./ /app/

# Install frontend packages
RUN npm install

# Install GSAP
RUN npm install ./gsap-bonus.tgz

RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
COPY --from=build-stage /app/build/ /usr/share/nginx/html

EXPOSE 80

COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
