# =========================
# 1) BUILD STAGE
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

# ติดตั้ง dependency ก่อน (cache ดี)
COPY package.json package-lock.json ./
RUN npm ci

# copy source
COPY . .

# build nuxt
RUN npm run build


# =========================
# 2) PRODUCTION STAGE
# =========================
FROM 192.168.100.180:5000/node:22 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

# copy output จาก build
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json
RUN npm config set registry http://192.168.100.180:4873
# production ไม่ต้อง devDependencies
RUN npm install --omit=dev --ignore-scripts

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
