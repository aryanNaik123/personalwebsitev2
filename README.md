# Todo

- [x] writings
  - [x] header
  - [x] make component
  - [x] created blog
- [x] about me
  - [x] header
  - [x] component
- [x] projects
  - [x] link
  - [x] component
- [ ] cool animation
  - [ ] find inspiration
  - [ ] find library
- [x] Library
  - [ ] books I am reading rn
  - [x] quotes

# Built with

### Reactjs, tailwindcss, React Router

# Setup

## Environment Variables

1. Copy `.env.example` to create a new `.env` file:
```bash
cp .env.example .env
```

2. Update the environment variables in `.env`:
- `REACT_APP_ADMIN_PASSWORD_HASH`: SHA-256 hash of your admin password

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start
```

## Deployment on Vercel

When deploying to Vercel:

1. Add the following environment variable in your Vercel project settings:
- `REACT_APP_ADMIN_PASSWORD_HASH`: Same value as your local `.env` file

2. Important Security Notes:
- Never commit `.env` or `.env.local` files to the repository
- Keep your admin password secure and share it through secure channels
- Environment variables in `.env` are only for local development
