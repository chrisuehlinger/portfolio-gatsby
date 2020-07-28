#!/bin/bash

cached_videos=(`aws s3 ls s3://cdn.chrisuehlinger.com/show-videos/ | awk '{ print $4 }'`)

for f in "${cached_videos[@]}"; do
  echo "https://cdn.chrisuehlinger.com/show-videos/${f}"
  curl -so /dev/null -w "%{time_connect} - %{time_starttransfer} - %{time_total}  " "https://cdn.chrisuehlinger.com/show-videos/${f}"
  echo ""
done