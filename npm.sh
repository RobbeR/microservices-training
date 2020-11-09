#!/bin/bash -x

args=("$@")
container=$1
params=("${args[@]:1}")
docker-compose exec $container npm ${params[@]}
