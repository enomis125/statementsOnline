# Use an official Node.js runtime as a base image
FROM node:18-alpine

# Install required packages
RUN apk add --no-cache --virtual .build-deps gcc g++ make python3 libtool libodbc

# Set the working directory in the container
WORKDIR /app

# Copy the entire project to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema file
COPY prisma ./prisma/

# Install Prisma CLI
RUN npm install prisma --save-dev

# Generate Prisma client
RUN npx prisma generate

COPY . .

# Build your Next.js application
RUN npm run build

EXPOSE 3000

# Command to run your Next.js application
CMD npm, run, start
