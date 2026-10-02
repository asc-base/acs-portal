# Use the official Node.js 22 image as the base image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
ARG MEDIA_PUBLIC_ORIGINS=https://acs.kmutt.ac.th,https://**.kmutt.ac.th,http://localhost:3000
ENV MEDIA_PUBLIC_ORIGINS=${MEDIA_PUBLIC_ORIGINS}
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
