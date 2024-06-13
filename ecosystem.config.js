'use strict'

module.exports = {
  apps: [
    {
      name: "my-app",
      script: "src/index.js",
      env: {
        NODE_ENV: "development",
        DATABASE_URL: "postgres://postgres.sekztvgifxuecxmcxiji:ourair8-km6@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres",
        SERVER_HOST: "smtp.gmail.com",
        SERVER_PORT: 587,
        SERVER_EMAIL: "andyakuliah@gmail.com",
        SERVER_PASS: "fnqsiufadjogfxun",
        JWT_SECRET_KEY: "by2gbiyhgiyufihgi2uyfby2bfyb2yfgb94fubousoucwipoxipwmenpiwnfu0fj2f"
      },
      env_production: {
        NODE_ENV: "production",
        // tambahkan variabel lingkungan produksi lainnya jika diperlukan
      }
    }
  ]
};
