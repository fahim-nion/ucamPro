# Use the updated version required by your logs
FROM mcr.microsoft.com/playwright:v1.61.1-jammy

# The rest of the file stays exactly the same
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "main.js"]