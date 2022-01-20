#!/bin/bash -e

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
    convert $f -resize "${res}x${res}" -quality 95 "${res}/${f}" &
    convert $f -resize "${res}x${res}" -quality 100 -define webp:method=6 -define webp:near-lossless=100 -define webp:thread-level=1 "${res}/${f%.*}.webp" &
  done
  wait
done