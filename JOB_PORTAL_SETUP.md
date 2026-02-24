# Job Portal Implementation - Complete Setup Guide

## ✅ What Has Been Implemented

### 1. **Frontend Components (Client)**

#### JobPortalNav.jsx
- Sticky navigation bar at the top of job portal
- Shows "Welcome, {user.name}" when logged in
- Career Map and Salary Insights toggle buttons
- My Applications badge with count
- Quick Tips dropdown
- "Leave" button for job portal logout
- Completely separate from blog navbar

#### JobPortalLogin.jsx
- Modal authentication modal (separate from blog login)
- Sign In / Sign Up tabs
- Email validation, password validation (min 6 chars)
- Separate localStorage keys: `jobPortal_token`, `jobPortal_user`
- Calls: `POST /api/job-auth/login` and `POST /api/job-auth/register`
- Shows disclaimer about separate auth system

#### PostJobForm.jsx
- Multi-step job posting form (5 steps)
- Fields: jobTitle, company, location, salary, jobType, industry, description, requirements
- Validation at each step
- Calls: `POST /api/job-listings/create-employer`

### 2. **Backend Models (Server)**

#### JobPortalUser.js Model
- New MongoDB model specifically for job portal users
- Fields: name, email, password (hashed), company, role (job_seeker/employer)
- Resume storage: url, fileId, fileName, uploadedAt
- User preferences: jobTypes, industries, locations, salary range
- Notification settings: email, jobRecommendations, applicationUpdates
- Privacy settings: profileVisible, showEmail, allowEmails
- Auto-hashes passwords using bcryptjs
- Methods: comparePassword()

### 3. **Backend Controllers**

#### jobPortalAuthController.js
- `register()` - POST /api/job-auth/register
  - Creates new job portal user
  - Validates email, password (min 6)
  - Returns JWT token + user data
  
- `login()` - POST /api/job-auth/login
  - Authenticates user with email/password
  - Compares password hash
  - Returns JWT token + user data
  
- `getProfile()` - GET /api/job-auth/profile
  - Retrieves user profile via token
  
- `updateProfile()` - PUT /api/job-auth/profile/:id
  - Updates name, company, phone, role
  
- `updatePreferences()` - PUT /api/job-auth/preferences/:id
  - Updates job preferences (types, industries, locations, salary)
  
- `updateNotifications()` - PUT /api/job-auth/notifications/:id
  - Updates notification settings
  
- `updatePrivacy()` - PUT /api/job-auth/privacy/:id
  - Updates privacy settings

#### jobListingController.js
- `createJobByEmployer()` - POST /api/job-listings/create-employer
  - Allows job portal employers to post jobs
  - Maps `jobTitle` field name from frontend form
  - Accepts: company, location, salary, jobType, industry, description, requirements
  - No admin check (any employer can post)

### 4. **Backend Routes**

#### jobPortalAuthRoutes.js
- POST `/api/job-auth/register` - Register new user
- POST `/api/job-auth/login` - Login existing user
- GET `/api/job-auth/profile` - Get user profile
- PUT `/api/job-auth/profile/:id` - Update profile
- PUT `/api/job-auth/preferences/:id` - Update preferences
- PUT `/api/job-auth/notifications/:id` - Update notifications
- PUT `/api/job-auth/privacy/:id` - Update privacy

#### uploadRoutes.js (ES6 Module)
- POST `/api/uploads/resume` - Upload resume to ImageKit
  - Accepts: FormData with file, userId
  - Returns: url, fileId, fileName, size, uploadedAt
- DELETE `/api/uploads/resume/:fileId` - Delete resume from ImageKit
- GET `/api/uploads/auth-signature` - Get ImageKit auth parameters

#### jobListingRoutes.js (Updated)
- POST `/api/job-listings/create-employer` - New employer job posting endpoint
- GET `/api/job-listings/all-jobs` - Get all jobs (public)
- GET `/api/job-listings/:jobId` - Get single job (public)
- POST `/api/jobs/create` - Admin job creation (original)
- PUT `/api/job-listings/:jobId` - Update job (admin)
- DELETE `/api/job-listings/:jobId` - Delete job (admin)

### 5. **Frontend Integration (JobSearch.jsx)**

#### New State Variables
```javascript
const [jobPortalUser, setJobPortalUser] = useState(() => {
  const saved = localStorage.getItem("jobPortal_user");
  return saved ? JSON.parse(saved) : null;
});
const [jobPortalToken, setJobPortalToken] = useState(
  () => localStorage.getItem("jobPortal_token") || null
);
const [showJobPortalLogin, setShowJobPortalLogin] = useState(false);
```

#### New Handlers
- `handleJobPortalLogin(userData)` - Stores job portal session
- `handleJobPortalLogout()` - Clears job portal session (NOT blog session)
- `handlePostJobSubmit(formData)` - POST to /api/job-listings/create-employer
- `handleResumeUpload(file)` - Async upload to ImageKit via /api/uploads/resume

#### Updated Checks
- Apply button now checks: `if (!jobPortalUser)` instead of `if (!token)`
- Form initialization uses `jobPortalUser` instead of blog `user`
- Settings page renders with flex layout, sidebar always visible

#### Layout Structure
```jsx
return (
  <div>
    <JobPortalNav /> {/* Always visible */}
    <JobPortalLogin isOpen={showJobPortalLogin} onLogin={handleJobPortalLogin} />
    {jobPortalUser && <CommandCenterSidebar />} {/* Conditional */}
    <div className={jobPortalUser ? "lg:ml-80" : ""}> {/* Content with margin */}
      {/* Job content */}
    </div>
    <PostJobForm isOpen={showPostJob} onSubmit={handlePostJobSubmit} />
  </div>
);
```

### 6. **Server Configuration**

#### server.js Updates
```javascript
import jobPortalAuthRouter from "./routes/jobPortalAuthRoutes.js";
app.use("/api/job-auth", jobPortalAuthRouter);
```

## 🔄 Authentication Flow

### Sign Up Flow
1. User clicks "Sign up" in JobPortalLogin modal
2. Enters: name, email, password, confirm password
3. Frontend validates: email format, password length, matching passwords
4. POST to `/api/job-auth/register`
5. Backend: Hashes password, creates JobPortalUser in MongoDB
6. Returns: token, user object { id, name, email, role }
7. Frontend: Stores in `jobPortal_token` and `jobPortal_user` (separate from blog)
8. Modal closes, JobPortalNav shows "Welcome, {name}"

### Login Flow
1. User clicks "Sign in" tab in JobPortalLogin modal
2. Enters: email, password
3. POST to `/api/job-auth/login`
4. Backend: Finds user, compares password hash
5. Returns: token, user object
6. Frontend: Stores in localStorage with `jobPortal_*` prefix
7. JobPortalNav updates to show user name
8. Sidebar becomes visible (conditional on jobPortalUser)

### Logout Flow
1. User clicks "Leave" in JobPortalNav
2. Calls `handleJobPortalLogout()`
3. Clears `jobPortal_token` and `jobPortal_user` from localStorage
4. Redirects to home page "/"
5. Blog session remains intact (if user was logged in)

## 📄 Job Posting Flow

1. User (logged into job portal) clicks "Post a Job"
2. PostJobForm modal opens
3. User fills form across 5 steps:
   - Step 1: Job title, company name
   - Step 2: Location, job type, salary
   - Step 3: Full description
   - Step 4: Requirements, technologies
   - Step 5: Contact email, company website
4. User clicks "Post Job"
5. Frontend validates all required fields
6. POST to `/api/job-listings/create-employer` with:
   ```json
   {
     "jobTitle": "...",
     "company": "...",
     "location": "...",
     "salary": "...",
     "jobType": "Full-time",
     "industry": "...",
     "description": "...",
     "requirements": [...],
     "postedBy": "jobPortalUser.id",
     ...other fields
   }
   ```
7. Backend creates Job document in MongoDB
8. Frontend refreshes jobs list
9. Modal closes, success toast shown

## 📤 Resume Upload Flow

1. User uploads file in resume section
2. Frontend creates FormData with file and userId
3. POST to `/api/uploads/resume` with FormData
4. Backend (Express + multer):
   - Validates file type (PDF/DOC/DOCX)
   - Validates file size (max 5MB)
   - Uploads to ImageKit via ImageKit SDK
   - Returns: url, fileId, fileName, size
5. Frontend stores in local state with:
   - Local file content (for display)
   - ImageKit URL (for download)
   - ImageKit fileId (for deletion)
6. To delete: DELETE `/api/uploads/resume/:fileId`

## ⚙️ Settings Page Integration

### Privacy Settings Handler (Needs Implementation)
```javascript
// PUT /api/job-auth/privacy/:userId
{
  "profileVisible": boolean,
  "showEmail": boolean,
  "allowEmails": boolean
}
```

### Notification Settings Handler (Needs Implementation)
```javascript
// PUT /api/job-auth/notifications/:userId
{
  "email": boolean,
  "jobRecommendations": boolean,
  "applicationUpdates": boolean
}
```

## 🧪 Testing Checklist

### Frontend Tests
- [ ] JobPortalNav displays when logged in
- [ ] JobPortalLogin modal opens on "Sign in" link
- [ ] Can sign up with valid credentials
- [ ] Can login with existing credentials
- [ ] "Leave" button logs out from job portal only
- [ ] Sidebar visible when jobPortalUser exists
- [ ] PostJobForm modal opens when clicking "Post a Job"
- [ ] Can submit job posting form
- [ ] Resume upload works with ImageKit
- [ ] Settings page shows with sidebar visible
- [ ] Blog session persists after job logout

### Backend Tests
- [ ] POST /api/job-auth/register creates new user
- [ ] POST /api/job-auth/login returns token
- [ ] Password hashing works correctly
- [ ] POST /api/job-listings/create-employer creates job
- [ ] POST /api/uploads/resume uploads to ImageKit
- [ ] File validation rejects invalid types
- [ ] PUT /api/job-auth/preferences/:id updates preferences
- [ ] PUT /api/job-auth/notifications/:id updates notifications
- [ ] PUT /api/job-auth/privacy/:id updates privacy

### Integration Tests
- [ ] User can sign up, see jobs, apply to job, post job
- [ ] Resume uploads and is associated with user
- [ ] Settings changes persist to backend
- [ ] Blog and job portal auth are completely separate
- [ ] ImageKit integration is end-to-end working

## 📝 Environment Variables Needed

```
# ImageKit (already set up)
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_URL_ENDPOINT=...

# JWT (for job portal auth)
JWT_SECRET=your_jwt_secret_key

# MongoDB (already set up)
MONGODB_URI=...
```

## 🚀 Deployment Notes

1. Ensure environment variables are set
2. Run `npm install` (or `yarn`) to install dependencies
3. Restart server after deploying new routes
4. Clear browser localStorage during testing to avoid stale tokens
5. ImageKit dashboard - verify folder structure and file uploads

## 🔗 API Endpoint Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/job-auth/register | Create new job portal user |
| POST | /api/job-auth/login | Login to job portal |
| GET | /api/job-auth/profile | Get user profile |
| PUT | /api/job-auth/profile/:id | Update profile |
| PUT | /api/job-auth/preferences/:id | Update job preferences |
| PUT | /api/job-auth/notifications/:id | Update notifications |
| PUT | /api/job-auth/privacy/:id | Update privacy settings |
| POST | /api/uploads/resume | Upload resume to ImageKit |
| DELETE | /api/uploads/resume/:fileId | Delete resume from ImageKit |
| POST | /api/job-listings/create-employer | Post new job (employer) |
| GET | /api/job-listings/all-jobs | Get all available jobs |
| GET | /api/job-listings/:id | Get single job details |

## 🎯 Next Steps

1. Test the complete authentication flow
2. Connect Settings page to preference/notification/privacy endpoints
3. Add email notifications when jobs match user preferences
4. Implement job recommendations algorithm
5. Add company profile pages for employers
6. Add review/rating system for jobs
7. Analytics dashboard for employers
