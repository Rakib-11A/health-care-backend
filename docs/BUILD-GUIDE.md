# PH-HealthCare Backend — Task 1 Build Guide

This guide walks you through implementing all 14 APIs and the database schema from **Task-1.md** in the correct order, using your project’s existing patterns.

---

## Table of Contents

1. [Conventions in This Project](#1-conventions-in-this-project)
2. [Phase 0: Prisma — Admin & SuperAdmin Models](#2-phase-0-prisma--admin--superadmin-models)
3. [Module 1: User — Create Admin & Create Super Admin](#3-module-1-user--create-admin--create-super-admin)
4. [Module 2: Doctor — CRUD (refine existing)](#4-module-2-doctor--crud-refine-existing)
5. [Module 3: Admin — Full CRUD](#5-module-3-admin--full-crud)
6. [Module 4: Super Admin — Full CRUD](#6-module-4-super-admin--full-crud)
7. [Module 5: Database — New Models](#7-module-5-database--new-models)
8. [Route Registration](#8-route-registration)
9. [Testing Checklist](#9-testing-checklist)

---

## 1. Conventions in This Project

Use these so your code matches the rest of the app:

| Item | Use |
|------|-----|
| Async handler | `asynchandler` from `../../utils/asyncHandler` |
| Response | `sendResponse(res, { httpStatusCode: status.CREATED, success, message, data })` |
| Status codes | `status` from `http-status` (e.g. `status.CREATED`, `status.OK`) |
| Auth | `checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN)` from `../../middlewares/checkAuth.middleware` |
| Validation | `validateRequest(someZodSchema)` — schema should parse **`req.body`** (no top-level `body` key if middleware passes `req.body`) |
| Errors | `AppError(status.NOT_FOUND, 'Message')` from `../../errorHelpers/AppError` |
| Exports | camelCase: `userService`, `userController`, `userRoutes` |

---

## 2. Phase 0: Prisma — Admin & SuperAdmin Models

Your app already uses `prisma.admin` in the user service. Ensure the schema defines **Admin** and **SuperAdmin** and that **User** has the relations.

### 2.1 Create `prisma/schema/admin.prisma`

```prisma
model Admin {
  id           String    @id @default(uuid())
  userId       String    @unique
  name         String
  email        String    @unique
  profilePhoto String?
  contactNumber String?
  isDeleted    Boolean   @default(false)
  deletedAt    DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@index([email])
  @@index([isDeleted])
  @@map("admins")
}
```

### 2.2 Create `prisma/schema/superAdmin.prisma`

```prisma
model SuperAdmin {
  id            String    @id @default(uuid())
  userId        String    @unique
  name          String
  email         String    @unique
  profilePhoto  String?
  contactNumber String?
  isDeleted     Boolean   @default(false)
  deletedAt     DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@index([email])
  @@index([isDeleted])
  @@map("super_admins")
}
```

### 2.3 Update `prisma/schema/auth.prisma` (User model)

Add optional relations:

```prisma
model User {
  // ... existing fields ...
  patient    Patient?
  doctor     Doctor?
  admin      Admin?      // add
  superAdmin SuperAdmin? // add
  // ...
}
```

### 2.4 Fix Doctor soft-delete field (optional but recommended)

In `prisma/schema/doctor.prisma`, use `deletedAt` (lowercase) so it matches Prisma conventions:

- Change `DeletedAt` → `deletedAt`.

### 2.5 Apply schema

```bash
npx prisma generate
npx prisma migrate dev --name add_admin_superadmin
```

---

## 3. Module 1: User — Create Admin & Create Super Admin

### Task 1.1: Create Admin API

**Endpoint:** `POST /api/users/create-admin`  
**Access:** Only `SUPER_ADMIN`.

#### 3.1.1 Interface — `src/app/modules/user/user.interface.ts`

You already have `ICreateAdmin`. Ensure it matches:

```ts
export interface ICreateAdmin {
  password: string;
  admin: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber: string;
  };
}
```

#### 3.1.2 Validation — `src/app/modules/user/user.validation.ts`

Schema must validate **`req.body`** (no wrapper), to work with your `validateRequest`:

```ts
export const createAdminValidationSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  admin: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email format"),
    profilePhoto: z.string().url("Invalid URL format").optional(),
    contactNumber: z.string().min(1, "Contact number is required"),
  }),
});
```

Add to exports (e.g. `UserValidation` or keep exporting `createAdminValidationSchema`).

#### 3.1.3 Service — `src/app/modules/user/user.service.ts`

- Keep your existing `createAdmin` logic (check email, signUpEmail with `UserRole.ADMIN`, transaction to create admin, cleanup user on failure).
- Use `AppError(status.CONFLICT, 'User with this email already exists')` and `AppError(status.INTERNAL_SERVER_ERROR, 'Failed to create admin')` instead of `throw new Error(...)` if you use AppError elsewhere.
- Export `createAdmin` in the service object, e.g.:

```ts
export const userService = {
  createDoctor,
  createAdmin,
};
```

#### 3.1.4 Controller — `src/app/modules/user/user.controller.ts`

```ts
const createAdmin = asynchandler(async (req: Request, res: Response) => {
  const result = await userService.createAdmin(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

export const userController = {
  createDoctor,
  createAdmin,
};
```

#### 3.1.5 Route — `src/app/modules/user/user.route.ts`

```ts
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { UserRole } from "../../../generated/prisma/enums";

router.post(
  "/create-admin",
  checkAuth(UserRole.SUPER_ADMIN),
  validateRequest(createAdminValidationSchema),
  userController.createAdmin
);
```

---

### Task 1.2: Create Super Admin API

**Endpoint:** `POST /api/users/create-super-admin`  
**Access:** Only `SUPER_ADMIN`.

Repeat the same pattern as Create Admin, with these replacements:

| Create Admin | Create Super Admin |
|--------------|--------------------|
| `ICreateAdmin` | `ICreateSuperAdmin` (same shape, different name) |
| `createAdminValidationSchema` | `createSuperAdminValidationSchema` |
| `createAdmin` (service/controller) | `createSuperAdmin` |
| `UserRole.ADMIN` | `UserRole.SUPER_ADMIN` |
| `tx.admin.create` / `tx.admin.findUnique` | `tx.superAdmin.create` / `tx.superAdmin.findUnique` |
| Route path | `/create-super-admin` |

Add interface, validation schema, service function, controller function, and route; export all and register the new route.

---

## 4. Module 2: Doctor — CRUD (refine existing)

You already have doctor CRUD. Align it with the task: filter by `isDeleted`, set `deletedAt` on soft delete, flatten specialties where needed, and protect routes with `checkAuth`.

### 4.1 Get All Doctors — `doctor.service.ts`

- In `getAllDoctors`, add `where: { isDeleted: false }`, `orderBy: { createdAt: 'desc' }`.
- Use `select` (or keep `include`) and return specialties as a flattened array: `specialties: doctor.specialities.map((s) => s.speciality)` (or your relation name, e.g. `speciality` from `DoctorSpaciality`).

### 4.2 Get Doctor by ID — `doctor.service.ts`

- In `getDoctorById`, find by `id` only (Prisma `findUnique` only takes unique fields).
- After fetch, if `!doctor || doctor.isDeleted` throw `AppError(status.NOT_FOUND, 'Doctor not found')`.
- Return doctor with flattened specialties.

### 4.3 Update Doctor — `doctor.service.ts` & validation

- In `doctor.interface.ts`, add/use an `IUpdateDoctor` that includes optional fields and `specialties?: string[]`.
- In `updateDoctor`: if `specialties` is provided, delete existing `DoctorSpaciality` for this doctor and create new ones (same pattern as task doc).
- Validation: optional fields with `.optional()`, `specialties: z.array(z.string().uuid()).optional()` (or your Zod v4 equivalent).

### 4.4 Soft Delete Doctor — `doctor.service.ts`

- In `softDeleteDoctor`: if not found or already `isDeleted`, throw.
- Update with `data: { isDeleted: true, deletedAt: new Date() }` (use `deletedAt` to match schema; fix schema to `deletedAt` if it’s currently `DeletedAt`).

### 4.5 Doctor routes — auth

- Add `checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR)` to GET list and GET by id.
- Add same to PATCH.
- Use `checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN)` only for DELETE.

---

## 5. Module 3: Admin — Full CRUD

Create the admin module and 4 APIs: getAllAdmins, getAdminById, updateAdmin, softDeleteAdmin.

### 5.1 Create files

```text
src/app/modules/admin/
  admin.controller.ts
  admin.service.ts
  admin.route.ts
  admin.interface.ts
  admin.validation.ts
```

### 5.2 `admin.interface.ts`

```ts
export interface IUpdateAdmin {
  name?: string;
  profilePhoto?: string;
  contactNumber?: string;
}
```

### 5.3 `admin.validation.ts`

```ts
import z from "zod";

export const updateAdminValidationSchema = z.object({
  name: z.string().min(1).optional(),
  profilePhoto: z.string().url().optional(),
  contactNumber: z.string().optional(),
}).partial();
```

### 5.4 `admin.service.ts`

- **getAllAdmins:** `prisma.admin.findMany({ where: { isDeleted: false }, orderBy: { createdAt: 'desc' }, include: { user: { select: { id, name, email, role, status } } } })`.
- **getAdminById(id):** `findUnique({ where: { id, isDeleted: false } })` — note: Prisma may not allow two fields in `where` for `findUnique`; if so, find by `id` and then if `!admin || admin.isDeleted` throw not found.
- **updateAdmin(id, payload):** Check exists and not deleted, then `prisma.admin.update({ where: { id }, data: payload })`.
- **softDeleteAdmin(id):** Check exists and not already deleted, then `update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } })`.

Use `AppError(status.NOT_FOUND, 'Admin not found')` and similar where appropriate.

### 5.5 `admin.controller.ts`

- Each handler: `asynchandler`, call service, `sendResponse` with `httpStatusCode: status.OK` (201 only for create).
- Params: `req.params.id` for getById, update, delete.

### 5.6 `admin.route.ts`

- `GET /` → getAllAdmins — `checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN)`
- `GET /:id` → getAdminById — same
- `PATCH /:id` → validateRequest(updateAdminValidationSchema), updateAdmin — same
- `DELETE /:id` → softDeleteAdmin — same

Export router as `adminRoutes` (or your naming convention).

---

## 6. Module 4: Super Admin — Full CRUD

Same as Admin module with these replacements:

- Folder: `src/app/modules/superAdmin/`.
- File names: `superAdmin.controller.ts`, `superAdmin.service.ts`, etc.
- Model: `prisma.superAdmin`, table name `super_admins`.
- Interfaces/validation: `IUpdateSuperAdmin`, `updateSuperAdminValidationSchema`.
- Base path for routes: `/super-admins` (with hyphen).

Implement: getAllSuperAdmins, getSuperAdminById, updateSuperAdmin, softDeleteSuperAdmin; same auth as Admin (only ADMIN and SUPER_ADMIN).

---

## 7. Module 5: Database — New Models

Add these models for appointments, schedules, reviews, health data, and medical reports. Adjust to your existing schema (e.g. single `schema.prisma` vs multiple files, and whether you use `@db.Uuid` and `gen_random_uuid()`).

### 7.1 Enums — `prisma/schema/enums.prisma`

Ensure these exist (add if missing):

```prisma
enum AppointmentStatus {
  SCHEDULED
  INPROGRESS
  COMPLETED
  CANCELED
}

enum PaymentStatus {
  PAID
  UNPAID
}

enum BloodGroup {
  A_POSITIVE
  A_NEGATIVE
  B_POSITIVE
  B_NEGATIVE
  AB_POSITIVE
  AB_NEGATIVE
  O_POSITIVE
  O_NEGATIVE
}

enum MaritalStatus {
  MARRIED
  UNMARRIED
  DIVORCED
  WIDOWED
}
```

(You already have `Gender`.)

### 7.2 Schedule — `prisma/schema/schedule.prisma`

```prisma
model Schedule {
  id        String   @id @default(uuid())
  startDate DateTime
  endDate   DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  doctorSchedules DoctorSchedules[]

  @@map("schedules")
}
```

### 7.3 DoctorSchedules (junction) — add to `prisma/schema/doctor.prisma`

- In **Doctor** model add: `doctorSchedules DoctorSchedules[]`.
- Add new model (adjust to your ID style):

```prisma
model DoctorSchedules {
  id         String   @id @default(uuid())
  doctorId   String
  scheduleId String
  isBooked   Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  doctor    Doctor   @relation(fields: [doctorId], references: [id])
  schedule  Schedule @relation(fields: [scheduleId], references: [id])
  appointment Appointment?

  @@unique([doctorId, scheduleId])
  @@map("doctor_schedules")
}
```

In `schedule.prisma`, add:

```prisma
model Schedule {
  // ...
  doctorSchedules DoctorSchedules[]
}
```

(You’ll need to reference Schedule from the same schema or use a multi-file setup; adjust imports/includes as per your Prisma setup.)

### 7.4 Appointment — `prisma/schema/appointment.prisma`

Requires **Patient**, **Doctor**, **DoctorSchedules**. Use your project’s generator/datasource pattern.

```prisma
model Appointment {
  id               String            @id @default(uuid())
  patientId        String
  doctorId         String
  doctorScheduleId String            @unique
  videoCallingId  String
  status          AppointmentStatus @default(SCHEDULED)
  paymentStatus   PaymentStatus     @default(UNPAID)
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  patient        Patient         @relation(fields: [patientId], references: [id])
  doctor         Doctor          @relation(fields: [doctorId], references: [id])
  doctorSchedule DoctorSchedules @relation(fields: [doctorScheduleId], references: [id])
  review         Review?
  medicalReport  MedicalReport?

  @@map("appointments")
}
```

Add on **Doctor**: `appointments Appointment[]`, **Patient**: `appointments Appointment[]`, **DoctorSchedules**: `appointment Appointment?`.

### 7.5 Review — `prisma/schema/review.prisma`

```prisma
model Review {
  id            String   @id @default(uuid())
  patientId     String
  doctorId      String
  appointmentId String   @unique
  rating        Float
  comment       String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  patient     Patient     @relation(fields: [patientId], references: [id])
  doctor      Doctor      @relation(fields: [doctorId], references: [id])
  appointment Appointment @relation(fields: [appointmentId], references: [id])

  @@map("reviews")
}
```

Add **Doctor**: `reviews Review[]`, **Patient**: `reviews Review[]`, **Appointment**: `review Review?`.

### 7.6 PatientHealthData — `prisma/schema/patientHealthData.prisma`

```prisma
model PatientHealthData {
  id                   String        @id @default(uuid())
  patientId             String        @unique
  gender                Gender
  dateOfBirth           DateTime
  bloodGroup            BloodGroup
  hasAllergies          Boolean       @default(false)
  hasDiabetes           Boolean       @default(false)
  height                String
  weight                String
  smokingStatus         Boolean       @default(false)
  dietaryPreferences    String?
  pregnancyStatus       Boolean       @default(false)
  mentalHealthHistory   String?
  immunizationStatus    String?
  hasPastSurgeries      Boolean       @default(false)
  recentAnxiety         Boolean       @default(false)
  recentDepression      Boolean       @default(false)
  maritalStatus         MaritalStatus @default(UNMARRIED)
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt

  patient Patient @relation(fields: [patientId], references: [id])
  @@map("patient_health_data")
}
```

Add on **Patient**: `patientHealthData PatientHealthData?`.

### 7.7 MedicalReport — `prisma/schema/medicalReport.prisma`

```prisma
model MedicalReport {
  id            String   @id @default(uuid())
  patientId     String
  doctorId      String
  appointmentId String   @unique
  diagnosis     String
  treatment     String
  followUpDate  DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  patient     Patient     @relation(fields: [patientId], references: [id])
  doctor      Doctor      @relation(fields: [doctorId], references: [id])
  appointment Appointment @relation(fields: [appointmentId], references: [id])
  @@map("medical_reports")
}
```

Add on **Doctor**: `medicalReports MedicalReport[]`, **Patient**: `medicalReports MedicalReport[]`, **Appointment**: `medicalReport MedicalReport?`.

### 7.8 Apply migrations

After all schema changes:

```bash
npx prisma generate
npx prisma migrate dev --name add_healthcare_models
```

---

## 8. Route Registration

In `src/app/routes/index.ts`:

```ts
import { adminRoutes } from "../modules/admin/admin.route";
import { superAdminRoutes } from "../modules/superAdmin/superAdmin.route";

router.use("/admins", adminRoutes);
router.use("/super-admins", superAdminRoutes);
```

(Adjust import/export names to match your files, e.g. `adminRoutes` vs `AdminRoutes`.)

---

## 9. Testing Checklist

For each API, verify:

- Success: valid body/params and correct role/token.
- Validation: missing/invalid fields return 400.
- Auth: no token or wrong token → 401.
- Authorization: wrong role → 403.
- Not found: invalid or deleted id → 404.
- Create Admin/Super Admin: duplicate email → 409 (or your chosen status).

Use Postman/Thunder Client with:

- `POST /api/users/create-admin` and `create-super-admin` (SUPER_ADMIN token).
- `GET/PATCH/DELETE /api/doctors`, `GET/PATCH/DELETE /api/admins`, `GET/PATCH/DELETE /api/super-admins`.

Document results in `TEST_CASES.md` and any notes in `IMPLEMENTATION_NOTES.md` as required by the task.

---

## Quick reference: 14 APIs

| # | Method | Path | Access | Purpose |
|---|--------|------|--------|---------|
| 1 | POST | /api/users/create-admin | SUPER_ADMIN | Create admin |
| 2 | POST | /api/users/create-super-admin | SUPER_ADMIN | Create super admin |
| 3 | GET | /api/doctors | ADMIN, SUPER_ADMIN, DOCTOR | List doctors |
| 4 | GET | /api/doctors/:id | ADMIN, SUPER_ADMIN, DOCTOR | Get doctor by id |
| 5 | PATCH | /api/doctors/:id | ADMIN, SUPER_ADMIN, DOCTOR | Update doctor |
| 6 | DELETE | /api/doctors/:id | ADMIN, SUPER_ADMIN | Soft delete doctor |
| 7 | GET | /api/admins | ADMIN, SUPER_ADMIN | List admins |
| 8 | GET | /api/admins/:id | ADMIN, SUPER_ADMIN | Get admin by id |
| 9 | PATCH | /api/admins/:id | ADMIN, SUPER_ADMIN | Update admin |
| 10 | DELETE | /api/admins/:id | ADMIN, SUPER_ADMIN | Soft delete admin |
| 11 | GET | /api/super-admins | ADMIN, SUPER_ADMIN | List super admins |
| 12 | GET | /api/super-admins/:id | ADMIN, SUPER_ADMIN | Get super admin by id |
| 13 | PATCH | /api/super-admins/:id | ADMIN, SUPER_ADMIN | Update super admin |
| 14 | DELETE | /api/super-admins/:id | ADMIN, SUPER_ADMIN | Soft delete super admin |

Following this guide in order (Phase 0 → User → Doctor → Admin → Super Admin → DB models → routes → tests) will let you implement Task 1 in a consistent way and pass the submission checklist.
