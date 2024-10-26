#!/bin/bash

# Execute this script FROM THE ROOT PATH of the backend project 
OUTPUT_FOLDER=./prisma/data

mkdir $OUTPUT_FOLDER
cp ../research/output-orders.csv $OUTPUT_FOLDER
cp ../research/output-products.csv $OUTPUT_FOLDER