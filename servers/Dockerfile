# Use a Node.js base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

RUN yarn

COPY . .
# Expose the desired port
EXPOSE 5000

# Start the server
CMD ["node", "wserver.js"]
