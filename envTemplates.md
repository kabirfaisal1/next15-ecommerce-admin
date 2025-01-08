# Environment Variables

## NEXT
```env
# Server URL
NEXT_PUBLIC_SERVER_URL=<NEXT_PUBLIC_SERVER_URL>
```

## Clerk
```env
# Clerk Publishable Key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY>

# Clerk Secret Key
CLERK_SECRET_KEY=<CLERK_SECRET_KEY>
```

## Clerk Webhooks
```env
# Webhook Secret
WEBHOOK_SECRET=<WEBHOOK_SECRET>
```

## Clerk URLs
```env
# Sign In URL
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in

# Sign Up URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Force Redirect URL after Sign In
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/

# Force Redirect URL after Sign Up
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/
```

## ORM DB
```env
# Database URL
DATABASE_URL=postgresql://<UserName>:<Token>.cockroachlabs.cloud:<CloudID>/defaultdb?sslmode=verify-full
```

# Cloudinary
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME= <Your Cloud Name>

NEXT_PUBLIC_CLOUDINARY_API_KEY="<Your API Key>"
CLOUDINARY_API_SECRET="<Your API Secret>"
 
NEXT_PUBLIC_CLOUDINARY_SECURE_DISTRIBUTION="<Your Secure Distribution / CNAME>"
NEXT_PUBLIC_CLOUDINARY_PRIVATE_CDN="<true|false>"
```
