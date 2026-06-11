# reCAPTCHA v3 Setup

To enable reCAPTCHA v3 (invisible bot protection) on your forms:

## 1. Get API Keys from Google

1. Go to **https://www.google.com/recaptcha/admin/create**
2. Sign in with your Google account
3. Fill in:
   - **Label**: e.g. "Marketing Mojito"
   - **reCAPTCHA type**: Select **"Score based (v3)"**
   - **Domains**: Add `marketingmojito.com` and `www.marketingmojito.com` (and `localhost` for local testing)
4. Accept terms and click **Submit**
5. You'll get two keys:
   - **Site Key** (public) – used in the browser
   - **Secret Key** (private) – used on the server

## 2. Add to .env.local

Add these lines to your `.env.local` file:

```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

## 3. Deploy

1. Rebuild: `npm run build`
2. Deploy: `./deploy-lightsail.sh`
3. Add the same env vars to the server's `.env.local` at `/var/www/marketing-mojito/.env.local`

## 4. Verify

- If keys are set: Forms will get a reCAPTCHA token before submit; bots without a valid token are rejected.
- If keys are not set: Forms work as before (other spam checks still apply).
