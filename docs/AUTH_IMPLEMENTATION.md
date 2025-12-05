# Authentication Implementation

This document describes the authentication system implementation for the Nest Casino frontend.

## What Was Implemented

### ✅ Complete JWT Authentication Flow
- Modal-based authentication UI with Login and Sign Up tabs
- Integration with backend JWT auth API (`/api/v1/auth/*`)
- Automatic token refresh on 401 errors
- Secure token storage in localStorage
- Real-time email/username availability checking
- Password strength indicator with visual feedback
- Social login button UI (Google, X, Telegram, Discord, VK) - non-functional placeholders

### Files Created

1. **`lib/api-client.ts`** - Axios client with JWT token interceptors
2. **`lib/auth-context.tsx`** - Authentication state management
3. **`lib/user-context.tsx`** - Updated to integrate with auth and load real user data
4. **`components/auth-modal.tsx`** - Main authentication modal with tabs
5. **`components/auth-forms/login-form.tsx`** - Login form with validation
6. **`components/auth-forms/register-form.tsx`** - Registration form with real-time validation
7. **`components/auth-forms/password-strength-indicator.tsx`** - Password strength UI
8. **`components/auth-forms/social-login-buttons.tsx`** - Social login button UI
9. **`hooks/use-debounce.ts`** - Debounce hook for availability checks

### Files Modified

1. **`components/header.tsx`** - Added Login/Sign Up buttons when not authenticated
2. **`components/profile-menu.tsx`** - Wired up logout functionality
3. **`app/layout.tsx`** - Added AuthProvider and AuthModal

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the `casino-front` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 2. Backend Requirements

Ensure your backend services are running:

```bash
# In the backend directory
npm run start:player     # Player Service on port 4002
npm run start:api-gateway # API Gateway on port 4000
```

Also ensure RabbitMQ and PostgreSQL are running via Docker:

```bash
docker ps  # Check if services are running
```

### 3. Install Frontend Dependencies

The implementation uses existing dependencies from `package.json`:
- `axios` - HTTP client (needs to be installed if not present)
- `@hookform/resolvers` - Form validation
- `zod` - Schema validation
- `react-hook-form` - Form management
- All Radix UI components are already installed

If axios is not installed, run:

```bash
cd casino-front
npm install axios
```

### 4. Start the Frontend

```bash
cd casino-front
npm run dev
```

The app should now be running on `http://localhost:3000`.

## How It Works

### Authentication Flow

1. **User clicks "Login" or "Sign Up"** → Opens authentication modal
2. **User fills form** → Real-time validation (email/username availability)
3. **Form submission** → API call to backend `/api/v1/auth/login` or `/api/v1/auth/register`
4. **Success** → Tokens stored in localStorage, user profile loaded, modal closes
5. **Authenticated state** → Header shows profile menu instead of auth buttons

### Token Management

- **Access Token**: 15 minutes expiry, used for API requests
- **Refresh Token**: 7 days expiry, used to get new access tokens
- **Auto-refresh**: When API returns 401, automatically attempts to refresh token
- **Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)

### Logout Flow

1. User clicks "Log Out" in profile menu
2. API call to `/api/v1/auth/logout` to blacklist token
3. Tokens cleared from localStorage
4. User state cleared
5. Header shows Login/Sign Up buttons again

## Features

### Login Form
- ✅ Email and password fields with validation
- ✅ "Remember Me" checkbox (stores preference)
- ✅ "Forgot Password?" link (placeholder)
- ✅ Password visibility toggle
- ✅ Loading state during submission
- ✅ Error handling with toast notifications

### Register Form
- ✅ Username, email, password, confirm password fields
- ✅ Real-time email availability check (debounced)
- ✅ Real-time username availability check (debounced)
- ✅ Password strength indicator with requirements
- ✅ Terms of service checkbox with 18+ age confirmation
- ✅ Form validation with helpful error messages
- ✅ Loading state during submission

### Auth Modal
- ✅ Beautiful design matching casino theme
- ✅ Tabs for Login/Sign Up with smooth transitions
- ✅ Branding section with welcome bonus promotion
- ✅ Mascot/character display (🦝)
- ✅ Responsive design (2-column on desktop, stacked on mobile)
- ✅ Close button and click-outside-to-close

### Security Features
- ✅ JWT tokens with expiration
- ✅ Automatic token refresh
- ✅ Token blacklisting on logout
- ✅ Password strength requirements
- ✅ Form validation and sanitization

## API Endpoints Used

### Authentication
- `POST /api/v1/auth/register` - Create new account
- `POST /api/v1/auth/login` - Login to account
- `POST /api/v1/auth/logout` - Logout and blacklist token
- `POST /api/v1/auth/refresh` - Refresh access token

### Player
- `POST /api/v1/players/check-email` - Check if email exists
- `POST /api/v1/players/check-username` - Check if username exists
- `GET /api/v1/players/:id` - Get player profile

## Testing the Implementation

### 1. Test Registration Flow

1. Open the app at `http://localhost:3000`
2. Click "Sign Up" button in header
3. Fill in the registration form:
   - Username: `testuser1` (watch real-time availability)
   - Email: `test1@example.com` (watch real-time availability)
   - Password: `TestPass123` (watch strength indicator)
   - Confirm password: `TestPass123`
   - Check "I confirm..." checkbox
4. Click "Create Account"
5. Modal should close, header should show your profile avatar

### 2. Test Login Flow

1. Click your profile avatar and select "Log Out"
2. Click "Login" button in header
3. Enter credentials:
   - Email: `test1@example.com`
   - Password: `TestPass123`
4. Optionally check "Remember Me"
5. Click "Login"
6. Modal should close, you're logged in

### 3. Test Token Refresh

1. Wait 15+ minutes (or manually delete access_token from localStorage)
2. Try to access a protected endpoint
3. Token should auto-refresh and request should succeed

### 4. Test Social Login UI

1. Open Login or Sign Up tab
2. Scroll down to social login buttons
3. Click any social button
4. Should see "Coming Soon" toast notification

## Troubleshooting

### "Network Error" or "Failed to fetch"

**Cause**: Backend API not running or wrong URL

**Solution**:
- Check `.env.local` has correct API URL
- Verify backend services are running: `npm run start:api-gateway`
- Check browser console for CORS errors

### "Email already registered" on valid email

**Cause**: Email exists in database from previous test

**Solution**:
- Use a different email
- Or clear the database and re-seed

### Tokens not persisting after refresh

**Cause**: localStorage being cleared or tokens expiring

**Solution**:
- Check browser's localStorage in DevTools
- Verify tokens exist: `access_token` and `refresh_token`
- Check token expiration hasn't passed

### Modal not opening

**Cause**: AuthModal not rendered or context not provided

**Solution**:
- Verify `AuthModal` is in `layout.tsx`
- Verify `AuthProvider` wraps `UserProvider` in `layout.tsx`
- Check console for React context errors

## Next Steps / Enhancements

1. **Email Verification** - Send verification email on registration
2. **Password Reset** - Implement forgot password flow
3. **Social Login** - Implement OAuth for Google, etc.
4. **2FA** - Add two-factor authentication
5. **Remember Me** - Implement longer-lived sessions
6. **Security** - Move to httpOnly cookies instead of localStorage
7. **Profile Completion** - Prompt users to complete profile after registration
8. **Avatar Upload** - Allow users to upload custom avatars

## Notes

- The user profile currently shows mock data for `balance`, `level`, and `levelProgress` (marked with TODO comments)
- Social login buttons are UI-only and show "Coming Soon" toast when clicked
- "Forgot Password?" link is a placeholder and does nothing yet
- Country and language fields in registration are optional but not shown in the UI yet

## Support

For issues or questions, check:
1. Backend logs in terminal running API Gateway
2. Browser console for frontend errors
3. Network tab to see API requests/responses
4. `backend/docs/guides/JWT_AUTHENTICATION_GUIDE.md` for backend details

