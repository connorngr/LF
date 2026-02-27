# Life Frame - Implementation Tickets (Bottom-Up)

## Tier 1: Foundation & Infrastructure

### Ticket 1.1: Initialize Next.js Project
**Priority**: Critical (blocks everything)
**Effort**: 30 min

**Tasks**:
- [ ] Create Next.js project with `create-next-app`
- [ ] Configure TailwindCSS
- [ ] Set up environment variables template (`.env.local.example`)
- [ ] Create basic folder structure: `app/`, `components/`, `lib/`, `public/`
- [ ] Test Next.js dev server runs without errors

**Acceptance Criteria**:
- Next.js dev server starts on `http://localhost:3000`
- TailwindCSS loads correctly
- No build errors
- `.env.local.example` documents required variables

---

### Ticket 1.2: Set Up Supabase Project & Database Schema
**Priority**: Critical (blocks backend)
**Effort**: 45 min

**Tasks**:
- [ ] Create Supabase project
- [ ] Generate API keys (anon + service role)
- [ ] Create `images` table with schema
- [ ] Create `folders` table with schema
- [ ] Add indexes on `folder_name` and `date_taken`
- [ ] Document connection string and keys

**Acceptance Criteria**:
- Tables exist in PostgreSQL
- Can query tables via Supabase dashboard
- API keys stored securely (not in repo)
- Connection string ready for backend

---

### Ticket 1.3: Set Up Cloudflare R2 Bucket
**Priority**: Critical (blocks upload feature)
**Effort**: 20 min

**Tasks**:
- [ ] Create R2 bucket in Cloudflare dashboard
- [ ] Generate API token with R2 permissions
- [ ] Configure CORS settings
- [ ] Test bucket access with sample file
- [ ] Document bucket name and credentials

**Acceptance Criteria**:
- Bucket created and accessible
- API token has read/write permissions
- Public URL format confirmed
- Credentials stored in `.env`

---

## Tier 2: Next.js API Routes & Services

### Ticket 2.1: Create API Route Structure & Utilities
**Priority**: High (blocks all API features)
**Effort**: 40 min

**Tasks**:
- [ ] Create `app/api/` directory structure
- [ ] Create `app/lib/supabase.ts` - Supabase client initialization
- [ ] Create `app/lib/r2.ts` - Cloudflare R2 client initialization
- [ ] Create `app/lib/auth.ts` - Authentication utilities
- [ ] Install dependencies: `@supabase/supabase-js`, `@aws-sdk/client-s3`
- [ ] Create `.env.local.example` template with all required variables
- [ ] Test Supabase connection with sample query
- [ ] Test R2 connection with sample upload

**Acceptance Criteria**:
- All clients initialize without errors
- Can query Supabase tables
- Can upload to R2
- Environment variables properly documented

---

### Ticket 2.2: Implement Supabase Database Service
**Priority**: High (blocks database operations)
**Effort**: 20 min

**Tasks**:
- [ ] Create helper functions in `app/lib/supabase.ts`: `getImages()`, `getImageById()`, `createImage()`, `updateImage()`, `deleteImage()`
- [ ] Create helper functions: `getFolders()`, `createFolder()`
- [ ] Add error handling for database operations
- [ ] Test all database functions locally

**Acceptance Criteria**:
- Can query images table
- Can query folders table
- Can create/update/delete images
- Error messages are descriptive

---

### Ticket 2.3: Implement Cloudflare R2 Upload Service
**Priority**: High (blocks upload feature)
**Effort**: 25 min

**Tasks**:
- [ ] Create upload function in `app/lib/r2.ts`
- [ ] Implement `uploadImage(file, folder)` function
- [ ] Generate unique file key: `{folder}/{timestamp}-{uuid}.{ext}`
- [ ] Return public R2 URL
- [ ] Add error handling for upload failures
- [ ] Test upload with sample image

**Acceptance Criteria**:
- File uploads to R2 successfully
- Public URL is returned
- File is accessible via public URL
- Errors are caught and logged

---

### Ticket 2.4: Implement Admin Authentication Utilities
**Priority**: High (blocks admin routes)
**Effort**: 20 min

**Tasks**:
- [ ] Create `verifyAdminPassword()` function in `app/lib/auth.ts`
- [ ] Create token generation utility (simple JWT or custom)
- [ ] Create token validation utility
- [ ] Create middleware for API route protection
- [ ] Test authentication flow locally

**Acceptance Criteria**:
- Token generated on correct password
- Token validation works correctly
- Invalid password rejected
- Middleware can protect routes

---

## Tier 3: Next.js API Routes Implementation

### Ticket 3.1: Implement Public Image API Routes
**Priority**: High (core feature)
**Effort**: 30 min

**Tasks**:
- [ ] Create `app/api/images/route.ts` (GET all images, paginated)
- [ ] Create `app/api/images/[id]/route.ts` (GET single image)
- [ ] Add pagination logic (limit, offset query params)
- [ ] Add error handling
- [ ] Test with curl/Postman

**Acceptance Criteria**:
- Returns all images with pagination
- Returns single image by ID
- Pagination works correctly
- 404 on non-existent image

---

### Ticket 3.2: Implement Daily Random Image API Route
**Priority**: High (core feature)
**Effort**: 25 min

**Tasks**:
- [ ] Create `app/lib/randomSeed.ts` utility
- [ ] Implement `getDailyRandomSeed()` function (hash today's date)
- [ ] Implement `getRandomImageForDay()` function (deterministic pick)
- [ ] Create `app/api/images/random/route.ts` endpoint
- [ ] Test that same image returned all day
- [ ] Test that different image returned next day

**Acceptance Criteria**:
- Same image returned for entire day
- Different image on next day
- Deterministic (no randomness within a day)
- Works with any number of images

---

### Ticket 3.3: Implement Public Folders API Route
**Priority**: Medium (core feature)
**Effort**: 15 min

**Tasks**:
- [ ] Create `app/api/folders/route.ts` (GET all folders)
- [ ] Add image count per folder
- [ ] Add error handling
- [ ] Test with curl/Postman

**Acceptance Criteria**:
- Returns all folders with image counts
- Folders ordered by creation date
- No errors on empty database

---

### Ticket 3.4: Implement Admin Image Upload API Route
**Priority**: High (core feature)
**Effort**: 35 min

**Tasks**:
- [ ] Create `app/api/images/upload/route.ts` endpoint
- [ ] Add authentication middleware check
- [ ] Handle multipart/form-data file upload
- [ ] Validate file is image (jpg, png, webp)
- [ ] Call R2 upload service
- [ ] Create database record with R2 URL
- [ ] Return created image object
- [ ] Test with actual image file

**Acceptance Criteria**:
- File uploads to R2
- Database record created
- Returns image with all fields
- Rejects non-image files
- Requires admin auth

---

### Ticket 3.5: Implement Admin Folder Creation API Route
**Priority**: Medium (admin feature)
**Effort**: 15 min

**Tasks**:
- [ ] Create `app/api/folders/route.ts` (POST handler)
- [ ] Add authentication middleware check
- [ ] Validate folder name (unique, non-empty)
- [ ] Create folder in database
- [ ] Return created folder
- [ ] Test with curl/Postman

**Acceptance Criteria**:
- Creates folder in database
- Rejects duplicate folder names
- Requires admin auth
- Returns created folder object

---

### Ticket 3.6: Implement Admin Image Update API Route
**Priority**: Low (nice-to-have)
**Effort**: 15 min

**Tasks**:
- [ ] Create `app/api/images/[id]/route.ts` (PATCH handler)
- [ ] Add authentication middleware check
- [ ] Allow updating caption only
- [ ] Validate image exists
- [ ] Update database record
- [ ] Return updated image
- [ ] Test with curl/Postman

**Acceptance Criteria**:
- Updates caption in database
- Returns updated image
- Requires admin auth
- 404 on non-existent image

---

### Ticket 3.7: Implement Admin Image Delete API Route
**Priority**: Low (nice-to-have)
**Effort**: 20 min

**Tasks**:
- [ ] Create `app/api/images/[id]/route.ts` (DELETE handler)
- [ ] Add authentication middleware check
- [ ] Delete from R2 bucket
- [ ] Delete from database
- [ ] Return success message
- [ ] Test with curl/Postman

**Acceptance Criteria**:
- Deletes file from R2
- Deletes record from database
- Requires admin auth
- 404 on non-existent image

---

## Tier 4: Frontend Components & Pages

### Ticket 4.1: Create API Client Service
**Priority**: High (blocks all API calls)
**Effort**: 20 min

**Tasks**:
- [ ] Create `app/lib/apiClient.ts`
- [ ] Initialize fetch/axios with base URL
- [ ] Create functions: `getImages()`, `getImageById()`, `getRandomImage()`, `getFolders()`
- [ ] Create functions: `loginAdmin()`, `uploadImage()`, `updateImage()`, `deleteImage()`, `createFolder()`
- [ ] Add error handling and logging
- [ ] Test with API routes

**Acceptance Criteria**:
- All API calls work correctly
- Error messages are descriptive
- Token stored/sent in headers
- Handles network errors gracefully

---

### Ticket 4.2: Create Homepage Component
**Priority**: High (core feature)
**Effort**: 45 min

**Tasks**:
- [ ] Create `app/components/HomePage.tsx`
- [ ] Fetch random daily image on mount
- [ ] Display image in full-width, high-quality format
- [ ] Show date, folder name, caption
- [ ] Add minimal UI controls (navigation)
- [ ] Implement dark/light mode toggle
- [ ] Add loading and error states
- [ ] Make responsive for mobile/tablet

**Acceptance Criteria**:
- Displays random image
- Shows all metadata (date, folder, caption)
- Dark/light mode works
- Responsive design
- Loading states visible

---

### Ticket 4.3: Create Folder Grid View Component
**Priority**: High (core feature)
**Effort**: 50 min

**Tasks**:
- [ ] Create `app/components/FolderGrid.tsx`
- [ ] Fetch all folders on mount
- [ ] Display folders as grid
- [ ] Show image count per folder
- [ ] Implement click to view folder images
- [ ] Create `app/components/FolderDetail.tsx` for folder contents
- [ ] Paginate images within folder
- [ ] Make responsive design
- [ ] Add loading and error states

**Acceptance Criteria**:
- Displays all folders
- Shows image count
- Can click to view folder contents
- Images paginated correctly
- Responsive design

---

### Ticket 4.4: Create Admin Login Component
**Priority**: High (blocks admin features)
**Effort**: 25 min

**Tasks**:
- [ ] Create `app/components/AdminLogin.tsx`
- [ ] Create login form with password input
- [ ] Call `loginAdmin()` API
- [ ] Store token in localStorage
- [ ] Redirect to admin panel on success
- [ ] Show error message on failure
- [ ] Add loading state

**Acceptance Criteria**:
- Form submits password to backend
- Token stored in localStorage
- Redirects to admin panel
- Error message on invalid password
- Loading state visible

---

### Ticket 4.5: Create Admin Upload Component
**Priority**: High (core feature)
**Effort**: 50 min

**Tasks**:
- [ ] Create `app/components/AdminPanel.tsx`
- [ ] Create file input for image selection
- [ ] Create dropdown for folder selection
- [ ] Create textarea for caption (optional)
- [ ] Implement image preview before upload
- [ ] Call `uploadImage()` API
- [ ] Show upload progress
- [ ] Show success/error message
- [ ] Clear form on success
- [ ] Require admin auth (redirect if not logged in)

**Acceptance Criteria**:
- File input accepts images only
- Folder dropdown populated from API
- Image preview shows before upload
- Upload progress visible
- Success message on completion
- Requires admin token

---

### Ticket 4.6: Create Navigation Component
**Priority**: Medium (core feature)
**Effort**: 20 min

**Tasks**:
- [ ] Create `app/components/Navigation.tsx`
- [ ] Add links: Home, Folders, Admin Login
- [ ] Show "Admin Panel" link if logged in
- [ ] Add logout button if logged in
- [ ] Make responsive (hamburger menu on mobile)
- [ ] Add active route highlighting

**Acceptance Criteria**:
- Navigation visible on all pages
- Links work correctly
- Admin link shows only when logged in
- Responsive on mobile
- Active route highlighted

---

## Tier 5: Polish & Integration

### Ticket 5.1: Implement Dark/Light Mode Toggle
**Priority**: Medium (UX feature)
**Effort**: 20 min

**Tasks**:
- [ ] Create `app/hooks/useDarkMode.ts`
- [ ] Detect system preference on first load
- [ ] Store preference in localStorage
- [ ] Create toggle button in Navigation
- [ ] Apply dark mode to all components
- [ ] Test on different devices

**Acceptance Criteria**:
- Respects system preference initially
- Toggle works correctly
- Preference persists across sessions
- All components styled correctly

---

### Ticket 5.2: Add Error Boundary & Error Handling
**Priority**: Medium (reliability)
**Effort**: 25 min

**Tasks**:
- [ ] Create `app/components/ErrorBoundary.tsx`
- [ ] Wrap app with error boundary
- [ ] Add try-catch to all API calls
- [ ] Create user-friendly error messages
- [ ] Log errors for debugging
- [ ] Test error scenarios

**Acceptance Criteria**:
- App doesn't crash on errors
- User sees helpful error messages
- Errors logged to console
- Can recover from errors

---

### Ticket 5.3: Implement Loading Skeletons
**Priority**: Low (UX polish)
**Effort**: 20 min

**Tasks**:
- [ ] Create skeleton components for images
- [ ] Create skeleton for folder grid
- [ ] Show skeletons while loading
- [ ] Smooth transition to loaded content
- [ ] Test on slow network

**Acceptance Criteria**:
- Skeletons show while loading
- Smooth transition to content
- Looks polished on slow networks

---

### Ticket 5.4: Responsive Design Testing
**Priority**: Medium (core feature)
**Effort**: 30 min

**Tasks**:
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1920px width)
- [ ] Fix layout issues
- [ ] Test touch interactions
- [ ] Test on different browsers

**Acceptance Criteria**:
- Works on all screen sizes
- Touch interactions work on mobile
- No horizontal scrolling
- Readable text on all devices

---

## Tier 6: Deployment

### Ticket 6.1: Deploy Full Stack to Vercel
**Priority**: High (production)
**Effort**: 25 min

**Tasks**:
- [ ] Push code to GitHub
- [ ] Connect GitHub repo to Vercel
- [ ] Set environment variables in Vercel dashboard
- [ ] Configure build command: `npm run build` (default)
- [ ] Configure start command: `npm start` (default)
- [ ] Test deployed site and API routes
- [ ] Set up auto-deploy on push
- [ ] Configure custom domain (optional)

**Acceptance Criteria**:
- Full stack deployed and accessible
- Environment variables loaded correctly
- API routes respond
- Frontend and API work together
- Auto-deploy works on push

---

### Ticket 6.2: End-to-End Testing
**Priority**: High (quality)
**Effort**: 45 min

**Tasks**:
- [ ] Test homepage loads and shows random image
- [ ] Test folder view displays all folders
- [ ] Test folder detail view shows images
- [ ] Test admin login flow
- [ ] Test image upload (with actual file)
- [ ] Test image appears in gallery after upload
- [ ] Test daily random image changes next day
- [ ] Test dark/light mode toggle
- [ ] Test on mobile and desktop
- [ ] Test error scenarios

**Acceptance Criteria**:
- All features work end-to-end
- No console errors
- Performance acceptable
- Mobile experience smooth

---

## Execution Order

1. **Start with Tier 1** (Foundation) - all three tickets in parallel
2. **Then Tier 2** (Next.js API Routes & Services) - tickets 2.1 → 2.2 → 2.3 → 2.4
3. **Then Tier 3** (Next.js API Routes Implementation) - tickets 3.1 → 3.2 → 3.3 → 3.4 → 3.5 (3.6, 3.7 optional)
4. **Then Tier 4** (Frontend Components & Pages) - tickets 4.1 → 4.2 → 4.3 → 4.4 → 4.5 → 4.6
5. **Then Tier 5** (Polish) - tickets 5.1 → 5.2 → 5.3 → 5.4
6. **Finally Tier 6** (Deployment) - tickets 6.1 → 6.2

**Estimated Total Time**: 12-16 hours of focused development (reduced from 15-20 due to single deployment target)
