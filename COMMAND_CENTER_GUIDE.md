# Command Center Sidebar Integration Guide

**Component**: `CommandCenterSidebar.jsx`  
**Status Page**: `SettingsPage.jsx`  
**Purpose**: Unified control center for user profile, resume management, and role switching

---

## 🎯 Features Overview

### User Profile Section
- **Profile Card** with user name/email
- **Role Toggle** (Job Seeker ↔ Hiring/Employer Mode)
- **Settings** quick link
- **Sign Out** button

### Resume Hub (Job Seekers Only)
- **Drag & Drop Upload** for PDFs/TXT
- **Resume Preview** with file info
- **Multiple Resume Management**
- **Delete/View Actions**

### Posting Jobs (Employers Only)
- **Post a Job** CTA button
- Opens multi-step job posting form

### Preferences
- **Notifications** (Email, SMS, Push)
- **Privacy Settings** (profile visibility, data sharing)
- **Full Settings Page** with advanced options

---

## 📦 Import & Setup

### 1. Add to Your Main App/Layout

```jsx
// App.jsx or Layout.jsx

import CommandCenterSidebar from "@/components/job-portal/CommandCenterSidebar";
import SettingsPage from "@/components/job-portal/SettingsPage";
import PostJobForm from "@/components/job-portal/PostJobForm";
import { useState } from "react";

export default function App() {
  const [currentUser, setCurrentUser] = useState({
    fullName: "Jane Developer",
    email: "jane@example.com",
  });

  const [currentRole, setCurrentRole] = useState("seeker"); // or "employer"
  const [showSettings, setShowSettings] = useState(false);
  const [showPostJob, setShowPostJob] = useState(false);
  const [resumes, setResumes] = useState([]);

  const handleRoleToggle = (newRole) => {
    setCurrentRole(newRole);
    // In production: POST /api/user/role-toggle with newRole
  };

  const handleResumeUpload = (file, fileContent) => {
    const newResume = {
      id: Date.now(),
      name: file.name,
      size: file.size,
      content: fileContent,
      uploadedDate: new Date().toLocaleDateString(),
    };
    setResumes([...resumes, newResume]);
    
    // In production: Upload to Supabase storage bucket
    // await supabase.storage
    //   .from('resumes')
    //   .upload(`${currentUser.id}/${file.name}`, file);
  };

  const handleResumeDelete = (resumeName) => {
    setResumes(resumes.filter((r) => r.name !== resumeName));
    // In production: Delete from Supabase storage
  };

  return (
    <div className="flex">
      {/* Sidebar - Command Center */}
      <CommandCenterSidebar
        user={currentUser}
        currentRole={currentRole}
        resumes={resumes}
        onRoleToggle={handleRoleToggle}
        onPostJob={() => setShowPostJob(true)}
        onSettingsClick={() => setShowSettings(true)}
        onResumeUpload={handleResumeUpload}
        onResumeDelete={handleResumeDelete}
        onLogout={() => {
          // Handle logout
          setCurrentUser(null);
        }}
      />

      {/* Main Content - adjust margin for sidebar on desktop */}
      <main className="flex-1 lg:ml-0">
        {showSettings ? (
          <SettingsPage
            user={currentUser}
            onBack={() => setShowSettings(false)}
          />
        ) : (
          <JobSearch />
        )}
      </main>

      {/* Post Job Form Modal */}
      <PostJobForm
        isOpen={showPostJob}
        onClose={() => setShowPostJob(false)}
        onSubmit={async (formData) => {
          // Handle job posting
          const response = await fetch("/api/jobs/create", {
            method: "POST",
            body: JSON.stringify(formData),
          });
          return Promise.resolve();
        }}
      />
    </div>
  );
}
```

---

## 🎨 Component Props

### CommandCenterSidebar

```javascript
<CommandCenterSidebar
  // User data
  user={{
    fullName: string,
    email: string,
    id: string
  }}
  
  // Current mode
  currentRole={'seeker' | 'employer'}
  
  // Resumes for display
  resumes={[
    {
      id: number,
      name: string,
      uploadedDate: string,
      size: number
    }
  ]}
  
  // Callbacks
  onRoleToggle={(newRole) => {}}
  onPostJob={() => {}}
  onSettingsClick={() => {}}
  onResumeUpload={(file, content) => {}}
  onResumeDelete={(resumeName) => {}}
  onLogout={() => {}}
/>
```

### SettingsPage

```javascript
<SettingsPage
  user={{
    fullName: string,
    email: string
  }}
  onBack={() => {}}  // Navigate back to main view
/>
```

---

## 💾 Data Flow: Resume Upload

### Frontend → Backend

```javascript
// User uploads resume via drag & drop
1. User drops PDF in sidebar
   ↓
2. CommandCenterSidebar triggers onResumeUpload()
   ↓
3. Frontend: Parse file, extract text
   ↓
4. POST /api/resumes/upload
   {
     userId: string,
     fileName: string,
     fileContent: string,  // Extracted text
     fileSize: number
   }
   ↓
5. Backend: Store in Supabase
   - Upload to supabase.storage.from('resumes')
   - Store metadata in 'resumes' table
   ↓
6. Return: { resumeId, url, uploadedAt }
   ↓
7. Frontend: Update state with new resume
```

### Backend Implementation (Node.js/Express)

```javascript
// routes/resumes.js
import { supabase } from "../config/db.js";

app.post("/api/resumes/upload", authenticate, async (req, res) => {
  const { fileName, fileContent, fileSize } = req.body;
  const userId = req.user.id;

  try {
    // 1. Upload file to Supabase Storage
    const filePath = `${userId}/${Date.now()}-${fileName}`;
    const { data, error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(filePath, new Blob([fileContent]));

    if (uploadError) throw uploadError;

    // 2. Store metadata in database
    const { data: resumeData, error: dbError } = await supabase
      .from("resumes")
      .insert([
        {
          user_id: userId,
          file_name: fileName,
          file_path: filePath,
          file_size: fileSize,
          extracted_text: fileContent,
          uploaded_at: new Date(),
        },
      ]);

    if (dbError) throw dbError;

    // 3. Get public URL
    const { data: publicUrl } = supabase.storage
      .from("resumes")
      .getPublicUrl(filePath);

    res.json({
      resumeId: resumeData[0].id,
      url: publicUrl.publicUrl,
      uploadedAt: new Date().toLocaleDateString(),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's resumes
app.get("/api/resumes", authenticate, async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", userId)
    .order("uploaded_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Delete resume
app.delete("/api/resumes/:resumeId", authenticate, async (req, res) => {
  const { resumeId } = req.params;
  const userId = req.user.id;

  // Get resume to find file path
  const { data: resume, error: getError } = await supabase
    .from("resumes")
    .select("file_path")
    .eq("id", resumeId)
    .eq("user_id", userId)
    .single();

  if (getError) return res.status(400).json({ error: getError.message });

  // Delete from storage
  const { error: deleteError } = await supabase.storage
    .from("resumes")
    .remove([resume.file_path]);

  if (deleteError) throw deleteError;

  // Delete from database
  const { error: dbError } = await supabase
    .from("resumes")
    .delete()
    .eq("id", resumeId);

  if (dbError) return res.status(400).json({ error: dbError.message });

  res.json({ success: true });
});
```

---

## 🔄 Role Toggle Flow

When user switches between "Job Seeker" and "Employer" mode:

```javascript
const handleRoleToggle = async (newRole) => {
  // Update UI immediately (optimistic update)
  setCurrentRole(newRole);

  try {
    // Call backend to persist
    const response = await fetch("/api/user/toggle-role", {
      method: "POST",
      body: JSON.stringify({ role: newRole }),
    });

    if (!response.ok) {
      // Revert on error
      setCurrentRole(currentRole === "seeker" ? "employer" : "seeker");
      toast.error("Failed to update role");
    } else {
      toast.success(`Switched to ${newRole} mode`);
    }
  } catch (error) {
    setCurrentRole(currentRole === "seeker" ? "employer" : "seeker");
    toast.error(error.message);
  }
};
```

---

## 📱 Responsive Behavior

- **Mobile** (< 1024px): Sidebar slides from left, overlay
- **Tablet** (1024px - 1280px): Compact sidebar visible
- **Desktop** (> 1280px): Full sidebar always visible

Toggle button stays visible on mobile for easy access.

---

## 🎯 Settings Tab Implementation

Each settings tab updates corresponding state:

```javascript
// In SettingsPage.jsx
const [settings, setSettings] = useState({
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  darkMode: false,
  // ... more settings
});

const handleSaveSettings = async () => {
  // POST /api/user/settings
  const response = await fetch("/api/user/settings", {
    method: "POST",
    body: JSON.stringify(settings),
  });
  // Handle response
};
```

---

## 🔐 Backend Endpoints Needed

```
POST /api/user/toggle-role
  Body: { role: 'seeker' | 'employer' }
  Returns: { success: boolean, role: string }

POST /api/user/settings
  Body: { settings object with all preferences }
  Returns: { success: boolean }

GET /api/user/settings
  Returns: { settings object }

POST /api/resumes/upload
  Body: { fileName, fileContent, fileSize }
  Returns: { resumeId, url, uploadedAt }

GET /api/resumes
  Returns: Array of user's resumes

DELETE /api/resumes/:resumeId
  Returns: { success: boolean }
```

---

## 📊 Database Schema (Supabase)

### Resumes Table
```sql
CREATE TABLE resumes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id TEXT NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  extracted_text TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ON resumes(user_id);
```

### User Settings Table
```sql
CREATE TABLE user_settings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id TEXT NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  push_notifications BOOLEAN DEFAULT true,
  profile_visibility TEXT DEFAULT 'public',
  dark_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);
```

---

## ✅ Integration Checklist

- [ ] Add CommandCenterSidebar to main layout
- [ ] Import SettingsPage component
- [ ] Test sidebar toggle on mobile
- [ ] Implement resume upload/download to Supabase
- [ ] Create backend endpoints for role toggle
- [ ] Create backend endpoints for settings
- [ ] Test role switching (UI updates accordingly)
- [ ] Test resume drag & drop upload
- [ ] Test settings page navigation
- [ ] Test dark mode support
- [ ] Test on mobile devices
- [ ] Add logout confirmation dialog

---

## 🚀 Advanced Features

### Sync Resume with Job Applications
```javascript
// When applying to job, use stored resume
const handleApplyWithResume = async (jobId) => {
  const selectedResume = resumes[0]; // Or user selects one
  
  const response = await fetch("/api/applications/create", {
    method: "POST",
    body: JSON.stringify({
      jobId,
      resumeId: selectedResume.id,
      resumeText: selectedResume.extractedText
    })
  });
};
```

### Notification Integration
```javascript
// When SMS is enabled, send WhatsApp/SMS updates
if (settings.smsNotifications) {
  // Send via Twilio or similar
  await sendSMS(user.phone, 'New job match: ' + jobTitle);
}
```

---

**Version**: 3.1 (Command Center)  
**Last Updated**: February 23, 2026  
**Status**: Production Ready ✅
