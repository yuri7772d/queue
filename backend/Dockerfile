FROM 192.168.100.180:5000/node:22
WORKDIR /
COPY package*.json ./ 
RUN npm config set registry http://192.168.100.180:4873
RUN npm install
COPY . .

EXPOSE 80 
CMD ["node","index.js"]