[![Java CI with Maven](https://github.com/ishmum123/studentlog/actions/workflows/maven.yml/badge.svg)](https://github.com/ishmum123/studentlog/actions/workflows/maven.yml)

## Student Log
This project implements a student logging mechanism with the hopes of being an ideal (small-scale) spring boot structure


## Keycloak command to run
1. Go to keyclaok folder
2. To start run

sudo docker build -t my-keycloak .
 
sudo docker run -dp 8000:8080 my-keycloak

3. To stop the docker image

sudo docker stop $(sudo docker ps -q --filter ancestor='my-keycloak' )

