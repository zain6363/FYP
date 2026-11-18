# Learnova - Course Pages Bundle (Updated)

Yeh folder Learnova platform ke sirf aur sirf Course Pages aur unke related components aur services par mushtamil hai.

---

## 📁 Folder Structure & File Descriptions

### 1. `student/` (Student & Public Portal Course Pages)
- **`CourseCatalogPage.tsx`** *(Latest Standalone Version)*: 
  - Mukammal alag public courses page jismein global glassmorphic navbar (active Courses indicator ke sath), hero header, search input, status filters (*All Courses*, *Available to Join*, *My Enrolled*), holographic course cards, aur interactive syllabus modal shamil hain.
  - Navbar mein "Courses" par click karne se ab yeh page khulta hai.
- **`CourseDetailsPage.tsx`**: 
  - Detailed syllabus page jismein topics list, lessons count, course description, aur direct enrollment workflow mojud hai.
- **`CourseLearningMapPage.tsx`**: 
  - Interactive DAG knowledge graph jo course ke topological sequence, prerequisites, aur unlocked units visually display karta hai.
- **`LessonWorkspacePage.tsx`**: 
  - Enrolled course ke individual lessons, reading material, aur resources access karne ka workspace.

---

### 2. `teacher/` (Faculty & Teacher Studio Course Pages)
- **`CoursesPage.tsx`**: Teacher studio ka courses directory jahan courses create, manage, aur status update kiye jate hain.
- **`CourseOverviewPage.tsx`**: Specific course ka faculty analytics overview, enrolled students count, aur topic readiness statistics.
- **`CurriculumEditorPage.tsx`**: Course curriculum authoring tool jahan topics, units, aur lessons add aur sequence kiye jate hain.
- **`PrerequisiteManagerPage.tsx`**: Course ke prerequisite rules aur cycle detection DAG validator ka interface.
- **`ResourceManagerPage.tsx`**: Course lessons ke sath link hone wale PDF documents, external links, aur lecture resources ka manager.

---

### 3. `admin/` (Administrative Governance Course Page)
- **`CourseOversightPage.tsx`**: University administration ke liye audit aur oversight interface jahan platform-wide courses verify aur approve kiye jate hain.

---

### 4. `api/` (Course Data & Curriculum APIs)
- **`coursesApi.ts`**: Course fetch, enrollment, aur course detail data models aur REST endpoints.
- **`curriculumApi.ts`**: Curriculum hierarchy, lessons completion, aur topic mappings ke API clients.
