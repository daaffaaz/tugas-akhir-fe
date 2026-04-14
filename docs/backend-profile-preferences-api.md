# Backend Spec: User Preferences & Avatar Upload

## Context

The frontend profile page (`/profile`) has a rich form with 18 fields.
Currently `GET/PATCH /api/users/profile/` only covers `full_name` and
`avatar_url` (stored on the `User` model).

The remaining **16 preference fields** are temporarily written to
`localStorage` under the key `pl_preferences` (see
`src/app/profile/profile-form.tsx`). Once you add the endpoints below,
swap the two `loadPreferences` / `savePreferences` localStorage calls with
`getPreferences()` / `updatePreferences()` API calls and the rest of the
form wiring stays exactly the same.

---

## 1. New endpoint: `GET /PATCH /api/users/preferences/`

| | |
|---|---|
| **Auth** | `Authorization: Bearer <access_token>` required on both methods |
| **GET** | Returns the full preferences object for the authenticated user. If no row exists yet, return an object with all fields set to `null` (or their defaults below). |
| **PATCH** | Partial update. Any subset of fields may be sent. Returns the full updated preferences object. |

### Expected JSON shape (GET response / PATCH request/response)

```json
{
  "job_title": "Junior DevOps Engineer",
  "age_range": "18-24",
  "education_level": "S1",
  "operating_system": "windows",
  "git_skill": "basic",
  "cli_level": 2,
  "logic_level": 2,
  "weekly_hours": "8-14",
  "study_slot": "malam",
  "material_format": "interactive",
  "theory_practice": "balanced",
  "evaluation_type": "coding_challenge",
  "target_role": "devops",
  "main_goal": "upskilling",
  "ram_gb": "<8",
  "internet_quality": "stable",
  "budget_idr": "<500k"
}
```

---

## 2. Model: `UserPreferences`

Suggested: a separate model with a `OneToOneField` to `User`.
Alternatively, add these as nullable columns on `User`.

| Frontend key | DB field | Django field | Allowed values |
|---|---|---|---|
| `job` | `job_title` | `CharField(max_length=100, blank=True)` | free text |
| `ageRange` | `age_range` | `CharField(max_length=10, blank=True)` | `"18-24"` `"25-34"` `"35+"` |
| `education` | `education_level` | `CharField(max_length=10, blank=True)` | `"SMA"` `"D3"` `"S1"` `"S2"` |
| `os` | `operating_system` | `CharField(max_length=10, blank=True)` | `"windows"` `"macos"` `"linux"` |
| `gitSkill` | `git_skill` | `CharField(max_length=20, blank=True)` | `"none"` `"basic"` `"intermediate"` |
| `cliLevel` | `cli_level` | `SmallIntegerField(null=True)` | `0` `1` `2` `3` |
| `logicLevel` | `logic_level` | `SmallIntegerField(null=True)` | `0` `1` `2` `3` |
| `weeklyHours` | `weekly_hours` | `CharField(max_length=10, blank=True)` | `"<4"` `"4-8"` `"8-14"` `"15+"` |
| `studySlot` | `study_slot` | `CharField(max_length=10, blank=True)` | `"pagi"` `"malam"` `"kerja"` `"weekend"` |
| `materialFormat` | `material_format` | `CharField(max_length=15, blank=True)` | `"video"` `"text"` `"interactive"` `"project"` |
| `theoryPractice` | `theory_practice` | `CharField(max_length=10, blank=True)` | `"theory"` `"balanced"` `"practice"` |
| `evaluation` | `evaluation_type` | `CharField(max_length=20, blank=True)` | `"quiz"` `"coding_challenge"` `"project"` |
| `targetRole` | `target_role` | `CharField(max_length=30, blank=True)` | `"backend"` `"devops"` `"data_ml"` |
| `mainGoal` | `main_goal` | `CharField(max_length=20, blank=True)` | `"career_change"` `"upskilling"` `"hobby"` |
| `ram` | `ram_gb` | `CharField(max_length=10, blank=True)` | `"<8"` `"8-16"` `"16+"` |
| `internet` | `internet_quality` | `CharField(max_length=15, blank=True)` | `"unstable"` `"stable"` `"very_stable"` |
| `budget` | `budget_idr` | `CharField(max_length=10, blank=True)` | `"<500k"` `"500k-2m"` `">2m"` |

### Validation notes
- All fields are optional (PATCH may send any subset).
- For `CharField` fields with fixed choices, use `choices=` on the model
  field and validate in the serializer.
- `cli_level` and `logic_level` must be in `[0, 1, 2, 3]`; reject other
  integers with a 400.

---

## 3. Suggested URL routing

```python
# apps/users/urls.py
path("preferences/", PreferencesView.as_view(), name="user-preferences"),
```

Full URL: `GET/PATCH /api/users/preferences/`

### View sketch

```python
class PreferencesView(generics.RetrieveUpdateAPIView):
    serializer_class = UserPreferencesSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "patch"]

    def get_object(self):
        obj, _ = UserPreferences.objects.get_or_create(user=self.request.user)
        return obj

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)
```

---

## 4. Avatar upload endpoint (separate gap)

The `PATCH /api/users/profile/` accepts `avatar_url` as a plain string.
The edit-avatar button in the UI is cosmetic until this endpoint exists.

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/users/avatar/` |
| **Auth** | Bearer JWT required |
| **Request** | `multipart/form-data` with field `file` (image) |
| **Response** | `{ "avatar_url": "<public url to stored file>" }` |
| **Frontend flow** | Upload → receive `avatar_url` → immediately call `PATCH /api/users/profile/` with that URL → update `avatarUrl` state in `ProfileForm` |

---

## 5. Coursera platform (catalog gap)

The `import_courses` management command only seeds **Udemy** and **ICEI**
platforms. The Coursera tab in `/course-catalog` will return 0 results
until Coursera courses are seeded.

To fix: add a Coursera import source to the command (or seed directly) so
that `Platform.objects.get_or_create(name="Coursera", ...)` exists in the
database. The frontend already sends `platform_name=Coursera` correctly.

---

## 6. Free-course price assumption

The frontend filter "Gratis" sends `max_price=0` to the API. This assumes
free courses are stored with `price=0` (not `NULL`). Please confirm and
normalise during import — if any free course arrives with `price=NULL`,
coerce it to `0` so the filter works correctly.
