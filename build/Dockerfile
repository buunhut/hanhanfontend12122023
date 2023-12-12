FROM nginx

WORKDIR /usr/src/app

# Install Git
RUN apt-get update && apt-get install -y git

WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

COPY . .


# docker build ./build -t img-react
# docker run -d -p 3100:80 --name cons-react img-react 