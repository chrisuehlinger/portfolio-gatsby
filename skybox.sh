#!/bin/bash -ex

cd static/3d/skybox;
directories=$(find . -mindepth 1 -maxdepth 1 -type d)
echo $directories
rm -fdr $directories

files=($(ls))
resolutions=(512 1024 2048 4096)

for res in "${resolutions[@]}"; do
  mkdir $res
  for f in "${files[@]}"; do
    echo "${res}/${f}"
    convert $f -resize "${res}x${res}" "${res}/${f}"
  done
done