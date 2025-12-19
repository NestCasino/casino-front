# API Endpoints Documentation

This document describes all API endpoints implemented in the frontend, the features that use them, what those features do, and how to test them.

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Player Management Endpoints](#player-management-endpoints)
3. [Currency Endpoints](#currency-endpoints)
4. [Wallet Endpoints](#wallet-endpoints)
5. [Coin Network Endpoints](#coin-network-endpoints)
6. [Country & Language Endpoints](#country--language-endpoints)
7. [Notification Endpoints](#notification-endpoints)
8. [Session Management Endpoints](#session-management-endpoints)
9. [Game Endpoints](#game-endpoints)
10. [Category Endpoints](#category-endpoints)
11. [Provider Endpoints](#provider-endpoints)

---

## Authentication Endpoints

### 1. POST `/api/v1/auth/register`

**Purpose:** Register a new player account

**Used In:**
- `lib/auth-context.tsx` - `register()` function
- `components/auth-forms/register-form.tsx` - Registration form submission

**Feature Description:**
The registration feature allows new users to create an account on the casino platform. It includes:
- Username validation with real-time availability checking
- Email validation with real-time availability checking
- Password strength validation
- Currency selection (fiat currencies)
- Terms of service acceptance
- Age confirmation (18+)

**Request Body:**
```typescript
{
  username: string;
  email: string;
  password: string;
  currency?: string;
  country?: string;
  lang?: string;
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    access_token: string;
    refresh_token: string;
    expires_in?: number;
    player: Player;
  }
}
```

**How to Test:**
1. Open the application in your browser
2. Click on "Login/Register" button in the header
3. Switch to the "Register" tab
4. Fill in the registration form:
   - Enter a unique username (min 3 characters)
   - Enter a valid email address
   - Create a password (min 8 chars, must include uppercase, lowercase, and number)
   - Select your preferred currency
   - Check the terms agreement checkbox
5. Click "Create Account"
6. Verify that:
   - Success toast notification appears
   - User is logged in automatically
   - User is redirected to the homepage
   - Access and refresh tokens are stored in localStorage

---

### 2. POST `/api/v1/auth/login`

**Purpose:** Authenticate an existing user

**Used In:**
- `lib/auth-context.tsx` - `login()` function
- `components/auth-forms/login-form.tsx` - Login form submission

**Feature Description:**
The login feature authenticates existing users and establishes a session. It includes:
- Email and password authentication
- "Remember me" functionality
- Automatic token storage
- Session restoration on page reload
- Redirect to intended page after login (e.g., from email verification)

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    access_token: string;
    refresh_token: string;
    expires_in?: number;
    player: Player;
  }
}
```

**How to Test:**
1. Open the application
2. Click "Login/Register" button
3. Stay on the "Login" tab
4. Enter your email and password
5. Optionally check "Remember me"
6. Click "Log In"
7. Verify that:
   - Success toast notification appears
   - User is logged in
   - User data loads in the header
   - Tokens are stored in localStorage

---

### 3. POST `/api/v1/auth/logout`

**Purpose:** Invalidate user session and blacklist access token

**Used In:**
- `lib/auth-context.tsx` - `logout()` function
- `components/header/user-menu.tsx` - Logout menu item

**Feature Description:**
The logout feature safely terminates the user session by:
- Blacklisting the access token on the backend
- Clearing all tokens from localStorage
- Clearing user state from contexts
- Redirecting to homepage

**Request Body:**
```typescript
{
  access_token: string;
}
```

**How to Test:**
1. Log in to the application
2. Click on your avatar in the top-right corner
3. Click "Log Out" from the dropdown menu
4. Verify that:
   - Success toast notification appears
   - User is logged out
   - UI returns to logged-out state
   - All tokens are removed from localStorage

---

### 4. POST `/api/v1/auth/refresh`

**Purpose:** Refresh expired access token using refresh token

**Used In:**
- `lib/api-client.ts` - Axios response interceptor (automatic)
- Triggered automatically when access token expires (401 response)

**Feature Description:**
The token refresh mechanism provides seamless authentication by:
- Automatically detecting expired access tokens
- Requesting a new access token using the refresh token
- Retrying failed requests with the new token
- Queuing multiple simultaneous requests during refresh
- Logging out user if refresh token is also expired

**Request Body:**
```typescript
{
  refresh_token: string;
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    access_token: string;
  }
}
```

**How to Test:**
1. Log in to the application
2. Wait for the access token to expire (check expires_in value)
3. Make any authenticated request (e.g., navigate to settings)
4. Verify that:
   - Request succeeds without user intervention
   - New access token is stored in localStorage
   - User remains logged in
   - No logout occurs

**Manual Testing (Advanced):**
1. Open browser DevTools > Application > Local Storage
2. Manually change the `access_token` to an invalid value
3. Navigate to Settings or another protected route
4. Verify automatic token refresh occurs

---

### 5. POST `/api/v1/auth/forgot-password`

**Purpose:** Request a password reset email

**Used In:**
- `lib/auth-context.tsx` - `forgotPassword()` function
- `components/auth-forms/forgot-password-form.tsx` - Forgot password form

**Feature Description:**
The forgot password feature allows users to reset their password by:
- Sending a password reset link to their email
- Generating a secure reset token
- Setting token expiration time

**Request Body:**
```typescript
{
  email: string;
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    message: string;
  }
}
```

**How to Test:**
1. Click "Login/Register" in the header
2. Click "Forgot Password?" link
3. Enter your email address
4. Click "Send Reset Link"
5. Verify that:
   - Success toast appears
   - Email is sent (check your email inbox)
   - Email contains reset link with token

---

### 6. POST `/api/v1/auth/reset-password`

**Purpose:** Reset user password using reset token from email

**Used In:**
- `lib/auth-context.tsx` - `resetPassword()` function
- `app/reset-password/page.tsx` - Password reset page

**Feature Description:**
The password reset feature allows users to set a new password by:
- Validating the reset token from email
- Requiring strong password (8+ chars, uppercase, lowercase, number)
- Confirming password match
- Updating password in database
- Providing success/error feedback

**Request Body:**
```typescript
{
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    message: string;
  }
}
```

**How to Test:**
1. Request a password reset email (see step 5)
2. Click the reset link in the email
3. You'll be redirected to `/reset-password?token=xxx&email=xxx`
4. Enter a new password and confirm it
5. Click "Reset Password"
6. Verify that:
   - Password strength indicator shows
   - Success message appears
   - Auto-redirect to home page after 3 seconds
   - Can log in with new password

---

### 7. POST `/api/v1/auth/email/verify`

**Purpose:** Request email verification link (authenticated users)

**Used In:**
- `lib/auth-context.tsx` - `requestEmailVerification()` function
- `components/header/user-menu.tsx` - Email verification banner

**Feature Description:**
Authenticated users can request an email verification link to verify their email address. The system:
- Generates a verification token
- Sends verification email with link
- Displays verification status in UI

**Request Body:** (Empty - user identified by access token)

**Response:**
```typescript
{
  success: true;
  data: {
    message: string;
  }
}
```

**How to Test:**
1. Log in with an unverified account
2. Notice the yellow banner indicating email is not verified
3. Click "Resend verification email" button
4. Verify that:
   - Success toast appears
   - Email is sent
   - Email contains verification link

---

### 8. POST `/api/v1/auth/email/verify/{token}`

**Purpose:** Verify email using token from email link

**Used In:**
- `app/verify-email/page.tsx` - Email verification page

**Feature Description:**
The email verification feature confirms user's email address by:
- Validating verification token
- Marking email as verified in database
- Updating UI to show verified status
- Requiring user to be logged in

**How to Test:**
1. Register a new account or request verification email
2. Check your email inbox
3. Click the verification link
4. You'll be redirected to `/verify-email?token=xxx`
5. Verify that:
   - If not logged in: prompted to log in first
   - If logged in: verification succeeds
   - Success message appears
   - Auto-redirect after 3 seconds
   - Email verified status shows in user menu

---

### 9. GET `/api/v1/auth/email-verification/{id}/{hash}`

**Purpose:** Alternative email verification endpoint using ID and hash

**Used In:**
- `lib/api-client.ts` - `auth.verifyEmailByHash()` function
- Available but not currently implemented in UI

**Feature Description:**
This is an alternative verification endpoint that uses a combination of user ID and hash for verification instead of just a token.

---

## Player Management Endpoints

### 10. POST `/api/v1/players/check-email`

**Purpose:** Check if email is already registered

**Used In:**
- `lib/auth-context.tsx` - `checkEmailAvailability()` function
- `components/auth-forms/register-form.tsx` - Real-time email validation

**Feature Description:**
Real-time email availability checking during registration:
- Checks as user types (with debouncing)
- Shows visual feedback (check/X icon)
- Prevents duplicate registrations
- Improves user experience

**Request Body:**
```typescript
{
  email: string;
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    exists: boolean;  // true = email taken, false = available
  }
}
```

**How to Test:**
1. Open registration form
2. Start typing an email address
3. Wait 500ms (debounce delay)
4. Observe:
   - Loading spinner appears during check
   - Green checkmark if email is available
   - Red X if email is taken
   - Appropriate message below field

---

### 11. POST `/api/v1/players/check-username`

**Purpose:** Check if username is already taken

**Used In:**
- `lib/auth-context.tsx` - `checkUsernameAvailability()` function
- `components/auth-forms/register-form.tsx` - Real-time username validation

**Feature Description:**
Real-time username availability checking during registration:
- Checks as user types (with debouncing)
- Validates format (alphanumeric, underscores, hyphens)
- Shows visual feedback
- Prevents duplicate usernames

**Request Body:**
```typescript
{
  username: string;
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    exists: boolean;  // true = username taken, false = available
  }
}
```

**How to Test:**
1. Open registration form
2. Start typing a username (min 3 chars)
3. Wait 500ms (debounce delay)
4. Observe:
   - Loading spinner during check
   - Green checkmark if available
   - Red X if taken
   - Appropriate message below field

---

### 12. GET `/api/v1/players/{playerId}`

**Purpose:** Get player profile by ID

**Used In:**
- `lib/api-client.ts` - `players.getProfile()` function
- Available but not currently used in UI (uses /me instead)

**Feature Description:**
Retrieve any player's profile information by their player ID. This could be used for:
- Viewing other players' public profiles
- Admin functionality
- Leaderboards

---

### 13. GET `/api/v1/players/me`

**Purpose:** Get current authenticated user's profile

**Used In:**
- `lib/user-context.tsx` - `loadUserProfile()` function
- Called automatically when user logs in
- Called when refreshing user data

**Feature Description:**
Loads the current user's complete profile including:
- Basic information (username, email, etc.)
- Personal details (name, country, language, etc.)
- KYC status and documents
- Email verification status
- Combined with wallet balance data

**Response:**
```typescript
{
  success: true;
  data: {
    id: string;
    playerUuid: string;
    username: string;
    email: string;
    emailVerified: boolean;
    firstName?: string;
    lastName?: string;
    country?: string;
    lang?: string;
    currency: string;
    phone?: string;
    birthDate?: string;
    gender?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    avatar?: string;
    kycStatus?: string;
    kycFront?: string;
    kycBack?: string;
    kycSelfie?: string;
    kycAddress?: string;
    addressProofStatus?: string;
  }
}
```

**How to Test:**
1. Log in to the application
2. Open browser DevTools > Network tab
3. Observe the `/api/v1/players/me` request
4. Verify that:
   - Request succeeds with 200 status
   - User data loads correctly
   - Username and balance appear in header
   - User data is available in Settings page

---

### 14. POST `/api/v1/players` (Update Profile)

**Purpose:** Update current user's profile with multipart form data support

**Used In:**
- `lib/api-client.ts` - `players.updateProfile()` function
- `components/settings/account-section.tsx` - Account information updates
- `components/settings/security-section.tsx` - Password changes
- `components/settings/preferences-section.tsx` - Language preferences
- `components/settings/verification-section.tsx` - KYC document uploads

**Feature Description:**
Comprehensive profile update functionality supporting:
- **Account Section:**
  - Phone number
  - Email address
  - Personal details (first name, last name, birthdate, gender)
  - Address information (country, city, postal code, address)
  
- **Security Section:**
  - Password changes (with current password verification)
  
- **Preferences Section:**
  - Language selection
  
- **Verification Section:**
  - KYC document uploads (ID front, ID back, selfie)
  - Address proof document upload
  - Avatar image upload

**Request:** Multipart form data with optional files

**Fields:**
```typescript
{
  // Password change
  password?: string;
  new_password?: string;
  repeat_password?: string;
  
  // Personal info
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  birthday?: string;
  country?: string;
  lang?: string;
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
  city?: string;
  postal_code?: string;
  
  // Files (multipart)
  avatar?: File;
  kyc_front?: File;
  kyc_back?: File;
  kyc_selfie?: File;
  kyc_address?: File;
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    message: string;
    data: Player;
  }
}
```

**How to Test - Account Section:**
1. Log in and navigate to Settings
2. Click "Account" tab
3. Update phone number and save
4. Update personal information (name, birthdate, gender) and save
5. Update address information and save
6. Verify:
   - Success toast appears
   - Changes are saved
   - Page reloads showing updated data

**How to Test - Security Section:**
1. Navigate to Settings > Security tab
2. Enter current password
3. Enter new password and confirmation
4. Click "Change Password"
5. Verify:
   - Success toast appears
   - Can log in with new password
   - Cannot log in with old password

**How to Test - Preferences Section:**
1. Navigate to Settings > Preferences tab
2. Select a different language from dropdown
3. Click "Save Changes"
4. Verify:
   - Success toast appears
   - Language preference is saved
   - (Language UI changes if implemented)

**How to Test - Verification Section:**
1. Navigate to Settings > Verification tab
2. Upload ID document (front):
   - Click upload button
   - Select an image file
   - Verify preview appears
   - Click "Upload"
3. Repeat for ID back and selfie
4. Upload address proof document
5. Verify:
   - Success toast for each upload
   - Uploaded status shows
   - Document previews display
   - KYC status updates if all documents uploaded

---

## Currency Endpoints

### 15. GET `/api/v1/currencies/active`

**Purpose:** Get all active currencies (both fiat and crypto)

**Used In:**
- `lib/api-client.ts` - `currencies.getActive()` function
- Available but not currently implemented in UI

**Feature Description:**
Retrieves list of all active currencies available on the platform for:
- Currency selection
- Wallet creation
- Transaction processing

---

### 16. GET `/api/v1/currencies/by-type/{type}`

**Purpose:** Get currencies filtered by type (fiat or crypto)

**Used In:**
- `lib/api-client.ts` - `currencies.getByType()` function
- `components/auth-forms/register-form.tsx` - Loads fiat currencies for registration

**Feature Description:**
The currency selection feature during registration allows users to:
- Choose their preferred fiat currency
- See currency symbol and name
- Defaults to EUR if available, otherwise first currency
- This determines their default wallet currency

**URL Parameters:**
- `type`: "fiat" or "crypto"

**Response:**
```typescript
{
  success: true;
  data: [
    {
      id: string;
      code: string;
      name: string;
      type: 'fiat' | 'crypto';
      symbol: string;
      is_active: boolean;
    }
  ]
}
```

**How to Test:**
1. Open registration form
2. Observe the "Preferred Currency" dropdown
3. Verify:
   - Dropdown shows list of fiat currencies
   - Each entry shows symbol and name (e.g., "EUR - Euro")
   - EUR is pre-selected if available
   - Can select different currency

**Test API Directly:**
```bash
# Get fiat currencies
curl http://localhost:4000/api/v1/currencies/by-type/fiat

# Get crypto currencies
curl http://localhost:4000/api/v1/currencies/by-type/crypto
```

---

## Wallet Endpoints

### 17. GET `/api/v1/wallets`

**Purpose:** Get all wallets for the authenticated user

**Used In:**
- `lib/wallet-context.tsx` - `fetchWallets()` function
- Called automatically when user logs in
- Called when `refreshWallets()` is invoked

**Feature Description:**
The wallet system manages user's multiple currency wallets:
- Loads all user's wallets (fiat and crypto)
- Shows balance and bonus balance for each
- Identifies default wallet
- Supports wallet switching
- Filters zero-balance wallets (optional setting)
- Calculates total balance across all wallets

**Response:**
```typescript
{
  success: true;
  data: [
    {
      id: string;
      playerId: string;
      currency: string;
      walletType: 'crypto' | 'fiat';
      balance: number;
      bonusBalance: number;
      isDefault: boolean;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }
  ]
}
```

**How to Test:**
1. Log in to the application
2. Click on the wallet balance in the header
3. Wallet modal opens showing:
   - List of all wallets
   - Balance for each wallet
   - Currency symbols
   - Active wallet highlighted
4. Click on a different wallet to switch
5. Verify:
   - Active wallet changes
   - Balance in header updates
   - Selected wallet persists after page reload

---

### 18. GET `/api/v1/wallets/balance`

**Purpose:** Get total balance across all wallets

**Used In:**
- `lib/user-context.tsx` - `loadUserProfile()` function
- Combined with user profile data
- Displayed in header

**Feature Description:**
Calculates and returns aggregated balance information:
- Total balance across all wallets
- Total bonus balance
- Number of wallets
- Used to display user's total balance in header

**Response:**
```typescript
{
  success: true;
  data: {
    totalBalance: number;
    totalBonusBalance: number;
    walletCount: number;
  }
}
```

**How to Test:**
1. Log in to the application
2. Observe the balance displayed in the header
3. Open wallet modal
4. Verify:
   - Header shows total balance across all wallets
   - Balance matches sum of individual wallet balances
   - Updates when wallets change

---

### 19. GET `/api/v1/wallets/transactions`

**Purpose:** Get transaction history for all user wallets

**Used In:**
- `lib/wallet-context.tsx` - `fetchTransactions()` function
- `components/wallet/transaction-tab.tsx` - Transaction history display
- Called when wallet modal is opened

**Feature Description:**
Transaction history feature provides:
- Complete list of all transactions
- Transaction details (type, amount, status, date)
- Balance before/after each transaction
- Bonus balance changes
- Transaction metadata
- Filtering and sorting capabilities
- Transaction status indicators

**Response:**
```typescript
{
  success: true;
  data: [
    {
      id: string;
      walletId: string;
      playerId: string;
      type: string;
      amount: number;
      balanceBefore: number;
      balanceAfter: number;
      bonusBalanceBefore: number;
      bonusBalanceAfter: number;
      status: string;
      currency: string;
      txid: string | null;
      provider: string | null;
      metadata: any;
      createdAt: string;
    }
  ]
}
```

**How to Test:**
1. Log in to the application
2. Click on wallet balance in header
3. Click on "Transactions" tab in wallet modal
4. Verify:
   - List of transactions displays
   - Each transaction shows:
     - Type (deposit, withdrawal, win, bet, etc.)
     - Amount with +/- indicator
     - Status
     - Date and time
     - Currency
   - Can scroll through transaction history
   - Most recent transactions appear first

---

## Coin Network Endpoints

### 20. GET `/api/v1/coin-networks/active`

**Purpose:** Get all active cryptocurrency networks

**Used In:**
- `lib/coin-networks-context.tsx` - `fetchNetworks()` function
- Called on application start
- Cached for 5 minutes
- Auto-refreshes every 5 minutes

**Feature Description:**
Coin networks management for cryptocurrency operations:
- Lists available crypto networks (Bitcoin, Ethereum, ERC-20, TRC-20, BEP-20, etc.)
- Shows network fees
- Used for crypto deposits/withdrawals
- Provides fallback data if API fails
- Caches results to reduce server load

**Response:**
```typescript
{
  success: true;
  data: [
    {
      id: string;
      name: string;
      slug: string;
      baseFee: number;
      isActive: boolean;
      createDt: string;
      modifyDt: string;
    }
  ]
}
```

**How to Test:**
1. Open browser DevTools > Network tab
2. Load or refresh the application
3. Observe `/api/v1/coin-networks/active` request
4. Verify:
   - Request succeeds
   - Returns list of networks
   - Data includes network names and fees
   - If API fails, fallback data is used
   - Subsequent requests within 5 minutes use cached data

**Test Manually:**
```bash
# Get active coin networks
curl http://localhost:4000/api/v1/coin-networks/active
```

---

## Country & Language Endpoints

### 21. GET `/api/v1/countries`

**Purpose:** Get list of all active countries

**Used In:**
- `lib/api-client.ts` - `countries.getActive()` function
- `components/settings/account-section.tsx` - Country selection dropdown

**Feature Description:**
Country selection in user settings allows users to:
- Select their country of residence
- Used for:
  - Regulatory compliance
  - Region-specific features
  - Time zone settings
  - Currency defaults
  - Geo-restrictions

**Response:**
```typescript
{
  success: true;
  data: [
    {
      id: number;
      name: string;
      iso: string;
      timeZone: string;
      utcOffset: string;
      defaultLanguage: string;
      isRestricted: boolean;
      isActive: boolean;
    }
  ]
}
```

**How to Test:**
1. Log in and navigate to Settings
2. Go to Account tab
3. Scroll to Address section
4. Click on "Country" dropdown
5. Verify:
   - List of countries appears
   - Countries are alphabetically sorted
   - Can search/filter countries
   - Selected country saves correctly

---

### 22. GET `/api/v1/languages`

**Purpose:** Get list of all active languages

**Used In:**
- `lib/api-client.ts` - `languages.getActive()` function
- `components/settings/preferences-section.tsx` - Language selection

**Feature Description:**
Language preferences allow users to:
- Select their preferred interface language
- Used for localization
- Affects UI text and communications
- Stored in user profile

**Response:**
```typescript
{
  success: true;
  data: [
    {
      id: number;
      name: string;
      iso: string;
      flag_iso: string | null;
      is_active: boolean;
    }
  ]
}
```

**How to Test:**
1. Log in and navigate to Settings
2. Go to Preferences tab
3. Find "Display Language" section
4. Click on language dropdown
5. Verify:
   - List of available languages appears
   - Each language shows name and possibly flag
   - Can select different language
   - Selection saves successfully

---

## Notification Endpoints

### 23. GET `/api/v1/notifications`

**Purpose:** Get paginated list of user notifications

**Used In:**
- `lib/notification-context.tsx` - `fetchNotifications()` function
- `components/header/notifications-button.tsx` - Notification bell
- `components/notifications/notifications-panel.tsx` - Notification list

**Feature Description:**
The notification system provides real-time and historical notifications:
- System notifications
- Financial notifications (deposits, withdrawals)
- Bonus notifications
- Promotional notifications
- Account notifications
- Success/Error notifications

Features include:
- Unread count badge on notification bell
- Notification panel with list of notifications
- Infinite scroll / load more functionality
- Mark individual notifications as read
- Mark all notifications as read
- Real-time notifications via WebSocket integration
- Persistent storage of notification history

**Query Parameters:**
- `limit`: Number of notifications to fetch (default: 50)
- `offset`: Offset for pagination (default: 0)

**Response:**
```typescript
{
  success: true;
  data: [
    {
      id: number;
      playerId: number | null;
      groupId: string | null;
      sid: string | null;
      type: string;
      channel: string;
      recipient: string | null;
      subject: string | null;
      text: string;
      templateName: string | null;
      templateData: object | null;
      status: 'pending' | 'sent' | 'failed' | 'delivered' | 'read';
      retries: number;
      maxRetries: number;
      error: string | null;
      sentAt: Date | null;
      readAt: Date | null;
      failedAt: Date | null;
      created_at: Date;
      updated_at: Date;
      metadata: object | null;
    }
  ]
}
```

**How to Test:**
1. Log in to the application
2. Look for the bell icon in the header
3. If there are notifications, a badge shows unread count
4. Click the bell icon
5. Notification panel opens showing:
   - List of notifications
   - Icons based on notification type
   - Title and message
   - Timestamp
   - Read/unread status (unread notifications highlighted)
6. Verify:
   - Can scroll through notifications
   - "Load More" button appears if more notifications exist
   - Can click to load additional notifications

---

### 24. PATCH `/api/v1/notifications/{id}/read`

**Purpose:** Mark a specific notification as read

**Used In:**
- `lib/notification-context.tsx` - `markAsRead()` function
- Triggered when:
  - User clicks on a notification
  - Notification panel opens (marks visible notifications)

**Feature Description:**
Individual notification management:
- Marks specific notification as read
- Updates read status in database
- Updates readAt timestamp
- Optimistic UI update (updates immediately, rolls back on error)
- Decreases unread count badge

**How to Test:**
1. Have some unread notifications
2. Open notification panel (bell icon)
3. Click on an unread notification (highlighted)
4. Verify:
   - Notification becomes "read" (no longer highlighted)
   - Unread count badge decreases
   - `readAt` timestamp is set
   - If notification has a link, user is redirected

**Test Optimistic Update:**
1. Open DevTools > Network tab
2. Set throttling to "Slow 3G"
3. Mark a notification as read
4. Observe:
   - UI updates immediately
   - API request happens in background
   - If request fails, UI rolls back

---

### 25. PATCH `/api/v1/notifications/read-all`

**Purpose:** Mark all notifications as read for the current user

**Used In:**
- `lib/notification-context.tsx` - `markAllAsRead()` function
- `components/notifications/notifications-panel.tsx` - "Mark all as read" button

**Feature Description:**
Bulk notification management:
- Marks all user's notifications as read in one operation
- Updates all unread notifications simultaneously
- Clears unread count badge to zero
- Optimistic UI update
- More efficient than marking individually

**Response:**
```typescript
{
  success: true;
  data: {
    message: string;
    count?: number;  // Number of notifications marked as read
  }
}
```

**How to Test:**
1. Have multiple unread notifications
2. Open notification panel
3. Click "Mark all as read" button (usually at top of panel)
4. Verify:
   - All notifications become "read"
   - Unread count badge becomes "0" or disappears
   - All notifications lose highlighted styling
   - Success feedback appears
   - Change persists after refresh

---

## Session Management Endpoints

### 26. GET `/api/v1/sessions`

**Purpose:** Get all active sessions for the authenticated user

**Used In:**
- `lib/api-client.ts` - `sessions.getSessions()` function
- `components/settings/security-section.tsx` - Active sessions list
- Called when Security settings tab is opened

**Feature Description:**
The session management feature provides visibility and control over all active login sessions:
- Lists all active sessions across devices
- Shows session details:
  - Device type and browser information
  - Operating system
  - IP address and location (country, city)
  - Last activity timestamp
  - Session creation and expiration times
- Identifies current session
- Enables security auditing
- Helps detect unauthorized access

**Response:**
```typescript
{
  success: true;
  data: [
    {
      id: string;
      playerId: string;
      ipAddress: string;
      userAgent: string;
      deviceType?: string;
      browser?: string;
      os?: string;
      country?: string;
      city?: string;
      lastActivityAt: string;
      createdAt: string;
      expiresAt: string;
      isCurrent?: boolean;
    }
  ]
}
```

**How to Test:**
1. Log in to the application
2. Navigate to Settings > Security tab
3. Scroll to "Active Sessions" section
4. Verify:
   - List of all active sessions appears
   - Each session shows:
     - Device information (Desktop/Mobile, browser, OS)
     - Location (country, city)
     - IP address
     - Last activity timestamp
     - "Current Session" badge for active session
5. Open app on another device or browser
6. Refresh sessions list
7. Verify new session appears

---

### 27. DELETE `/api/v1/sessions/{sessionId}`

**Purpose:** Revoke/logout a specific session by ID

**Used In:**
- `lib/api-client.ts` - `sessions.revokeSession()` function
- `components/settings/security-section.tsx` - Individual session logout
- Triggered when user clicks "Log Out" on a specific session

**Feature Description:**
Individual session revocation allows users to:
- Log out specific devices/browsers remotely
- Remove suspicious or unauthorized sessions
- Maintain security when device is lost/stolen
- Keep track of active sessions
- Each session (except current) has a revoke button
- Current session cannot be revoked (use regular logout instead)

**Request Parameters:**
- `sessionId` (URL parameter): The ID of the session to revoke

**Response:**
```typescript
{
  success: true;
  data: {
    message: string;
  }
}
```

**How to Test:**
1. Have multiple active sessions (login from different devices/browsers)
2. Go to Settings > Security > Active Sessions
3. Find a non-current session
4. Click "Log Out" button on that session
5. Verify:
   - Success toast appears
   - Session is removed from list
   - That device/browser is logged out
   - Current session remains active
   - Can still use the application normally

**Security Note:**
- Cannot revoke current session (must use regular logout)
- Revoked sessions are immediately invalidated
- User must log in again on revoked device

---

### 28. DELETE `/api/v1/sessions`

**Purpose:** Revoke all sessions except the current one

**Used In:**
- `lib/api-client.ts` - `sessions.revokeAllOtherSessions()` function
- `components/settings/security-section.tsx` - "End All Other Sessions" button
- Used for bulk session management

**Feature Description:**
Bulk session revocation provides:
- Quick way to log out all other devices
- Security measure if account compromise suspected
- Convenient session cleanup
- Logs out all sessions except current one
- Useful after password change
- One-click security action

**Response:**
```typescript
{
  success: true;
  data: {
    message: string;
    count?: number;  // Number of sessions revoked
  }
}
```

**How to Test:**
1. Have multiple active sessions (3+ sessions ideal)
2. Go to Settings > Security > Active Sessions
3. Click "End All Other Sessions" button
4. Confirm the action
5. Verify:
   - Success toast shows "All other sessions have been logged out"
   - Only current session remains in list
   - All other devices/browsers are logged out
   - Current session/device remains active
   - Can continue using application normally

**Use Cases:**
- Suspected unauthorized access
- After password change
- Periodic security cleanup
- Lost or stolen device
- Sharing account temporarily (not recommended)

---

## Game Endpoints

### 29. GET `/api/v1/games`

**Purpose:** Get paginated list of games with advanced filtering and sorting

**Used In:**
- `lib/api-client.ts` - `games.getGames()` function
- `hooks/use-games.ts` - Game data fetching hook
- Used across all game listing pages:
  - `app/all-games/page.tsx` - All games page
  - `app/casino/page.tsx` - Casino games
  - `app/slots/page.tsx` - Slots page
  - `app/live-casino/page.tsx` - Live casino
  - `app/blackjack/page.tsx` - Blackjack games
  - `app/roulette/page.tsx` - Roulette games
  - `app/baccarat/page.tsx` - Baccarat games
  - `app/new-releases/page.tsx` - New releases
  - `app/category/[slug]/page.tsx` - Category pages
  - `app/providers/[slug]/page.tsx` - Provider pages

**Feature Description:**
The games endpoint is the core of the casino platform, providing:
- **Pagination:** Efficient loading of large game catalogs
- **Search:** Real-time game search by title
- **Filtering:**
  - By provider (game studio)
  - By category (slots, live, table games, etc.)
  - By device support (mobile/desktop)
  - Live games only
  - Trending/popular games
  - Available games only (operational)
- **Sorting:**
  - By sort order (custom admin ordering)
  - By game title (alphabetical)
  - By launch date (newest first)
  - By popularity (most played)
- **Performance:** Optimized queries with indexes
- **Caching:** Results cached for better performance

**Query Parameters:**
```typescript
{
  page?: number;           // Page number (default: 1)
  perPage?: number;        // Items per page (default: 24)
  device?: 'mobile' | 'desktop';  // Device filter
  providerId?: number;     // Filter by provider ID
  categoryId?: number;     // Filter by category ID
  search?: string;         // Search by game title
  isLive?: boolean;        // Live games only
  isTrending?: boolean;    // Trending games only
  showAvailablesOnly?: boolean;  // Hide unavailable games
  sortBy?: 'sortOrder' | 'gameTitle' | 'launched' | 'popularity';
  sortOrder?: 'ASC' | 'DESC';  // Sort direction
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    data: Game[];  // Array of game objects
    meta: {
      total: number;      // Total number of games
      page: number;       // Current page
      perPage: number;    // Items per page
      totalPages: number; // Total pages
    };
  }
}
```

**Game Object Structure:**
```typescript
{
  id: number;
  gameId: string;
  slug: string;
  gameTitle: string;
  gameThumbnail: string;
  provider: {
    id: number;
    name: string;
    slug: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
  };
  isLive: boolean;
  isTrending: boolean;
  isAvailable: boolean;
  devices: string[];  // ['mobile', 'desktop']
  launched: string;   // ISO date
  sortOrder: number;
}
```

**How to Test - Basic Pagination:**
1. Navigate to "All Games" page
2. Scroll to bottom
3. Click "Show More" button
4. Verify:
   - More games load below
   - Loading indicator appears briefly
   - No duplicate games
   - Counter shows "Showing X of Y games"

**How to Test - Search:**
1. Go to any games page
2. Type in search box (e.g., "Book of")
3. Wait 400ms (debounce delay)
4. Verify:
   - Games filter to match search
   - Results update in real-time
   - Empty state if no matches
   - Search is case-insensitive

**How to Test - Provider Filter:**
1. Go to All Games
2. Select a provider from dropdown
3. Verify:
   - Only games from that provider show
   - Page resets to 1
   - Total count updates
   - Can clear filter to show all

**How to Test - Category Pages:**
1. Navigate to "Slots" or "Live Casino"
2. Verify page loads with category-filtered games
3. Check URL has correct category
4. Verify filtering works within category

**How to Test - Sorting:**
1. Add sort parameter to URL or implement UI
2. Test different sort options:
   - sortBy=gameTitle - Alphabetical order
   - sortBy=launched&sortOrder=DESC - Newest first
   - sortBy=popularity - Most popular first
3. Verify games reorder correctly

**Performance Notes:**
- Queries are optimized with database indexes
- Results cached on backend
- Frontend implements debouncing for search
- Pagination prevents loading all games at once

---

### 30. GET `/api/v1/games/{slug}`

**Purpose:** Get detailed information for a specific game by slug

**Used In:**
- `lib/api-client.ts` - `games.getGameBySlug()` function
- Available for future game detail pages
- Can be used for:
  - Game detail modal
  - Game information page
  - Deep linking to specific games
  - SEO-optimized game pages

**Feature Description:**
Retrieve complete details for a single game including:
- Full game information
- Provider details
- Category classification
- Device compatibility
- Availability status
- Game URL for launching
- Additional metadata

**URL Parameters:**
- `slug`: Game slug (URL-friendly identifier)

**Response:**
```typescript
{
  success: true;
  data: {
    id: number;
    gameId: string;
    slug: string;
    gameTitle: string;
    gameThumbnail: string;
    gameUrl: string;
    provider: {
      id: number;
      name: string;
      slug: string;
      logo?: string;
    };
    category: {
      id: number;
      name: string;
      slug: string;
      icon?: string;
    };
    description?: string;
    isLive: boolean;
    isTrending: boolean;
    isAvailable: boolean;
    devices: string[];
    launched: string;
    rtp?: number;  // Return to player percentage
    volatility?: string;
    minBet?: number;
    maxBet?: number;
    features?: string[];
  }
}
```

**How to Test:**
1. Get a game slug from any game listing
2. Make API call: `GET /api/v1/games/{slug}`
3. Or in code:
```typescript
const response = await api.games.getGameBySlug('book-of-dead');
```
4. Verify:
   - Returns complete game details
   - Provider information included
   - Category information included
   - All metadata present

**Use Cases:**
- Game detail pages
- SEO-optimized URLs
- Social media sharing
- Deep linking from external sources
- Game information modals

---

## Category Endpoints

### 31. GET `/api/v1/categories`

**Purpose:** Get all active game categories

**Used In:**
- `lib/api-client.ts` - `categories.getActive()` function
- `hooks/use-categories.ts` - Category data fetching
- `lib/game-data-context.tsx` - Global game data provider
- Used for:
  - Navigation menu (category links)
  - Game filtering dropdowns
  - Category pages
  - Game organization

**Feature Description:**
Categories organize games into logical groups:
- **Pre-defined Categories:**
  - Slots
  - Live Casino
  - Table Games
  - Blackjack
  - Roulette
  - Baccarat
  - Game Shows
  - New Releases
  - And more...

Features include:
- Category metadata (name, slug, icon)
- Game count per category
- Category ordering for navigation
- Active/inactive status
- Category-specific page routes

**Response:**
```typescript
{
  success: true;
  data: [
    {
      id: number;
      name: string;
      slug: string;
      icon?: string;
      description?: string;
      sortOrder: number;
      isActive: boolean;
      gameCount?: number;  // Number of games in category
      createdAt: string;
      updatedAt: string;
    }
  ]
}
```

**How to Test:**
1. Open the application
2. Check browser DevTools > Network tab
3. Look for `/api/v1/categories` request on app load
4. Verify:
   - List of categories loads
   - Categories appear in sidebar navigation
   - Each category has name, slug, and icon
   - Clicking category navigates to category page
   - Category pages show filtered games

**Test Category Navigation:**
1. Click "Slots" in sidebar
2. Verify navigates to `/slots`
3. Verify only slot games display
4. Try other categories (Live Casino, Blackjack, etc.)
5. Verify each shows appropriate games

**Test in Code:**
```typescript
import { useCategories } from '@/hooks/use-categories';

function MyComponent() {
  const { categories, loading, error } = useCategories();
  
  // Categories are available here
  return (
    <div>
      {categories?.map(cat => (
        <div key={cat.id}>{cat.name}</div>
      ))}
    </div>
  );
}
```

---

## Provider Endpoints

### 32. GET `/api/v1/providers`

**Purpose:** Get all active game providers (game studios)

**Used In:**
- `lib/api-client.ts` - `providers.getActive()` function
- `hooks/use-providers.ts` - Provider data fetching
- `lib/game-data-context.tsx` - Global game data provider
- `app/providers/page.tsx` - Providers listing page
- `app/providers/[slug]/page.tsx` - Individual provider pages
- Game filter dropdowns across the site

**Feature Description:**
Game providers are the studios/companies that create casino games:
- **Major Providers:**
  - Evolution Gaming (live casino leader)
  - Pragmatic Play
  - NetEnt
  - Play'n GO
  - Microgaming
  - Red Tiger
  - Yggdrasil
  - And many more...

Features include:
- Provider metadata (name, logo, slug)
- Game count per provider
- Provider detail pages
- Filter games by provider
- Provider branding and logos
- Active/inactive status

**Response:**
```typescript
{
  success: true;
  data: [
    {
      id: number;
      name: string;
      slug: string;
      logo?: string;
      description?: string;
      website?: string;
      sortOrder: number;
      isActive: boolean;
      gameCount?: number;  // Number of games from provider
      isFeatured?: boolean;
      createdAt: string;
      updatedAt: string;
    }
  ]
}
```

**How to Test - Providers Page:**
1. Navigate to "Providers" page (link in menu or `/providers`)
2. Verify:
   - Grid of provider cards displays
   - Each card shows:
     - Provider logo/name
     - Game count
     - Click to view games
   - Providers are sorted by importance/game count
   - All active providers display

**How to Test - Provider Filtering:**
1. Go to "All Games" page
2. Open provider filter dropdown
3. Verify:
   - List of all providers appears
   - Can search providers
   - Selecting provider filters games
   - Can clear filter

**How to Test - Provider Pages:**
1. Click on any provider card
2. Should navigate to `/providers/{slug}`
3. Verify:
   - Shows all games from that provider
   - Provider branding/logo at top
   - Can filter/search within provider games
   - Shows game count

**Test in Code:**
```typescript
import { useProviders } from '@/hooks/use-providers';

function MyComponent() {
  const { providers, loading, error } = useProviders();
  
  return (
    <select>
      {providers?.map(provider => (
        <option key={provider.id} value={provider.id}>
          {provider.name} ({provider.gameCount} games)
        </option>
      ))}
    </select>
  );
}
```

**Provider Context Usage:**
```typescript
import { useGameData } from '@/lib/game-data-context';

function MyComponent() {
  const { providers, loading } = useGameData();
  // Providers loaded globally, cached, and shared
}
```

---

## Token Management & Security

### Automatic Token Refresh

**Implementation:** `lib/api-client.ts` - Axios interceptors

**Feature Description:**
The application implements automatic token refresh for seamless authentication:

1. **Request Interceptor:**
   - Automatically attaches access token to all authenticated requests
   - Reads token from localStorage
   - Adds `Authorization: Bearer {token}` header

2. **Response Interceptor:**
   - Detects 401 Unauthorized responses
   - Automatically attempts token refresh using refresh token
   - Queues multiple simultaneous requests during refresh
   - Retries original request with new token
   - Logs out user if refresh token is invalid/expired

3. **Token Storage:**
   - Access token stored in localStorage as `access_token`
   - Refresh token stored in localStorage as `refresh_token`
   - Player ID stored as `player_id`

**How to Test Token Refresh:**
1. Log in to the application
2. Open DevTools > Application > Local Storage
3. Note the current `access_token` value
4. Wait for token to expire OR manually change it to invalid value
5. Navigate to any protected page (e.g., Settings)
6. Observe in Network tab:
   - First request fails with 401
   - Automatic refresh token request
   - Original request retries with new token
   - New access token in localStorage
7. Verify user remains logged in

**Test Expired Refresh Token:**
1. Log in to the application
2. Open DevTools > Application > Local Storage
3. Delete or corrupt the `refresh_token`
4. Navigate to any protected page
5. Verify:
   - User is automatically logged out
   - Redirected to home page
   - All tokens cleared from localStorage
   - Error indication (if appropriate)

---

## Error Handling

All API endpoints implement consistent error handling:

### Error Response Format

```typescript
{
  success: false;
  error: {
    message: string;
    code?: string;
  }
}
```

### Common Error Scenarios

1. **Network Errors:**
   - Connection timeout (10 seconds)
   - Server unavailable
   - No internet connection

2. **Authentication Errors:**
   - Invalid credentials (401)
   - Expired token (401 → auto-refresh)
   - Invalid refresh token (401 → logout)
   - Missing authentication (401)

3. **Validation Errors:**
   - Invalid input format (400)
   - Missing required fields (400)
   - Constraint violations (400)
     - Email already exists
     - Username already taken

4. **Permission Errors:**
   - Forbidden resource access (403)
   - Insufficient privileges (403)

5. **Not Found Errors:**
   - Resource not found (404)
   - Invalid endpoint (404)

6. **Server Errors:**
   - Internal server error (500)
   - Service unavailable (503)

### Error Display

- Toast notifications for user-facing errors
- Form field errors for validation issues
- Console logging for debugging
- Graceful degradation (fallback data when available)

**Test Error Handling:**
1. **Invalid Login:**
   - Try logging in with wrong password
   - Verify error toast appears

2. **Duplicate Registration:**
   - Try registering with existing email
   - Verify real-time validation catches it

3. **Network Timeout:**
   - Open DevTools > Network
   - Set throttling to "Offline"
   - Try any action
   - Verify appropriate error message

4. **Server Error:**
   - (Requires backend manipulation)
   - Verify error toast with user-friendly message

---

## Testing Checklist

### Authentication Flow
- [ ] Register new account
- [ ] Log in with credentials
- [ ] Log out
- [ ] Forgot password email
- [ ] Reset password with token
- [ ] Request email verification
- [ ] Verify email with token
- [ ] Token auto-refresh on expiry
- [ ] Email verification via hash (alternative method)

### Profile Management
- [ ] Load user profile on login
- [ ] Update phone number
- [ ] Update personal information
- [ ] Update address
- [ ] Change password
- [ ] Change language preference
- [ ] Upload KYC documents
- [ ] Upload avatar

### Wallet Operations
- [ ] View all wallets
- [ ] Switch active wallet
- [ ] View total balance
- [ ] View transaction history
- [ ] Balance updates correctly

### Notifications
- [ ] View notifications
- [ ] Unread count badge
- [ ] Mark single notification as read
- [ ] Mark all notifications as read
- [ ] Load more notifications (pagination)

### Session Management
- [ ] View all active sessions
- [ ] Session details display correctly (device, location, IP)
- [ ] Current session is identified
- [ ] Revoke specific session
- [ ] Revoke all other sessions
- [ ] Verify logged out device can't access
- [ ] Multiple sessions from different devices/browsers

### Game Features
- [ ] Browse all games with pagination
- [ ] Search games by title
- [ ] Filter games by provider
- [ ] Filter games by category
- [ ] Load more games (pagination)
- [ ] View game details by slug
- [ ] Category pages display correct games
- [ ] Provider pages display correct games
- [ ] Trending games filter
- [ ] Live games filter
- [ ] Device-specific filtering (mobile/desktop)

### Categories & Providers
- [ ] Load all active categories
- [ ] Category navigation works
- [ ] Category pages load filtered games
- [ ] Load all active providers
- [ ] Provider cards display correctly
- [ ] Provider filtering works
- [ ] Provider pages load correctly

### Data Loading
- [ ] Load currencies for registration
- [ ] Load countries for settings
- [ ] Load languages for settings
- [ ] Load coin networks
- [ ] Check email availability (real-time)
- [ ] Check username availability (real-time)
- [ ] Load categories on app start
- [ ] Load providers on app start

### Error Scenarios
- [ ] Invalid login credentials
- [ ] Duplicate email registration
- [ ] Weak password rejection
- [ ] Expired reset token
- [ ] Network timeout handling
- [ ] Token expiration and refresh
- [ ] No games found state
- [ ] Invalid game slug
- [ ] Empty category handling
- [ ] Session revocation errors

---

## API Configuration

### Environment Variables

**Location:** `.env.example` or `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

- Default: `http://localhost:4000`
- Used by: `lib/api-client.ts`
- Configures base URL for all API requests

### Axios Configuration

**Location:** `lib/api-client.ts`

```typescript
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});
```

**Key Settings:**
- Base URL from environment variable
- Default JSON content type
- 10-second request timeout
- Automatic token attachment
- Automatic token refresh on 401

---

## WebSocket Integration (Future)

**Location:** `lib/websocket-context.tsx`

The application includes a WebSocket context for real-time features:
- Real-time notifications
- Live balance updates
- Game events
- System announcements

**Note:** WebSocket implementation is prepared but requires backend WebSocket server to be running.

---

## Summary

This frontend application implements a comprehensive API integration covering:

- **9 Authentication Endpoints** - Complete auth flow including registration, login, logout, password reset, and email verification
- **5 Player Management Endpoints** - Profile management, availability checks, and updates
- **2 Currency Endpoints** - Currency listing for wallets and registration
- **3 Wallet Endpoints** - Wallet management, balance tracking, and transaction history
- **1 Coin Network Endpoint** - Cryptocurrency network information
- **2 Country/Language Endpoints** - Localization and regional settings
- **3 Notification Endpoints** - Notification management with real-time updates
- **3 Session Management Endpoints** - Active session tracking and remote logout capabilities
- **2 Game Endpoints** - Paginated game listing with advanced filtering and individual game details
- **1 Category Endpoint** - Game category organization and navigation
- **1 Provider Endpoint** - Game provider (studio) management and filtering

**Total: 32 API Endpoints**

All endpoints include:
- ✅ Proper error handling
- ✅ Loading states
- ✅ User feedback (toasts)
- ✅ Optimistic updates where appropriate
- ✅ Token-based authentication
- ✅ Automatic token refresh
- ✅ Type safety with TypeScript

The implementation follows best practices:
- Context-based state management
- Reusable API client
- Consistent error handling
- Real-time validation
- Responsive UI updates
- Secure token storage
- Graceful degradation









