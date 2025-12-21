# =========================
# 1) BUILD STAGE
# =========================
FROM 192.168.100.180:5000/library/node:22 AS builder

WORKDIR /app

# cache dependency
COPY package.json package-lock.json ./
RUN npm config set registry http://192.168.100.180:4873 \
 && npm ci

# copy source
COPY . .

# build nuxt
RUN npm run build


# =========================
# 2) PRODUCTION STAGE
# =========================
FROM 192.168.100.180:5000/library/node:22

WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

# copy output จาก build stage
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# install production deps only
RUN npm config set registry http://192.168.100.180:4873 \
 && npm install --omit=dev --ignore-scripts

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
