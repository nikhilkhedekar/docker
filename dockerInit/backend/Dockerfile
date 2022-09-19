# ================ Data Volumes ==============================================

#with nodemon you have to use linux or use -L (long polling flag) in package json

FROM node

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

EXPOSE 8080

CMD ["npm", "start"]

# without nodemon changes will reflect for onece rendred not get updated
# FROM node

# WORKDIR /app

# COPY package.json .

# RUN npm i

# COPY . .

# EXPOSE 8080

# #VOLUME [ "/data/feedback" ] anonymous volumes 

# CMD ["node", "main.js"]

# =============================================================================

# FROM node

# WORKDIR /app

# COPY package.json /app

# RUN npm i

# COPY . /app

# EXPOSE 8080

# CMD ["node", "main.js"]


# ======it is init config=======

# FROM node:16

# WORKDIR /app

# COPY package.json .

# RUN npm i

# COPY . .

# EXPOSE 8080 # port assigned in backend node [usedport]:[exposedport]

# CMD ["node", "main.js"]


