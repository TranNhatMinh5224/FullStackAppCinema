# Admin API Notes

Tai lieu nay mo ta nhom API quan tri cua backend MyCinema va cac thay doi bao mat/validate da ap dung.

## Task da xu ly

### 1. Them middleware/auth dependency kiem tra admin

Backend da them dependency:

```txt
backend/app/core/admin_auth.py
```

Tat ca API quan tri phai gui header:

```http
X-Admin-Key: <ADMIN_API_KEY>
```

Gia tri `ADMIN_API_KEY` lay tu file `.env`:

```env
ADMIN_API_KEY=change-this-admin-key
```

Neu thieu header hoac sai key, backend tra ve:

```json
{
  "detail": "Không có quyền admin"
}
```

Neu server chua cau hinh `ADMIN_API_KEY`, backend tra ve loi 500:

```json
{
  "detail": "ADMIN_API_KEY chưa được cấu hình"
}
```

### 2. Chuan hoa route admin

Truoc day:

- Them/sua/xoa phim nam o `/films`.
- Them/sua/xoa lich chieu nam o `/lichchieu`.
- Suat chieu nam o `/admin`, nhung chua co bao mat that.

Sau khi chinh:

- Public film list van giu:
  - `GET /films/showing`
  - `GET /films/upcoming`
- Public schedule read van giu:
  - `GET /lichchieu/phim/{phim_id}`
- Admin film mutating API chuyen sang:
  - `POST /admin/films/`
  - `PUT /admin/films/{phim_id}`
  - `DELETE /admin/films/{id_film}`
- Admin schedule mutating API chuyen sang:
  - `POST /admin/lichchieu/`
  - `PUT /admin/lichchieu/{schedule_id}`
  - `DELETE /admin/lichchieu/{schedule_id}`
- Admin showtime API duoc bao ve bang `X-Admin-Key`:
  - `POST /admin/suat-chieu/`
  - `GET /admin/lich-chieu/{lich_chieu_id}`
  - `PUT /admin/suat-chieu/{suat_chieu_id}`
  - `DELETE /admin/suat-chieu/{suat_chieu_id}`

### 3. Dua Cloudinary credential ra environment

Truoc day Cloudinary credential bi hard-code trong:

```txt
backend/app/api/v1/endpoints/cloudinary.py
```

Sau khi chinh, cac bien duoc doc tu `.env`:

```env
CLOUDINARY_CLOUD_NAME=dkwvlimht
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Upload image da duoc include vao `app/main.py` va duoc bao ve bang admin key:

```txt
POST /admin/upload_image/
```

Input la `multipart/form-data`:

```txt
file: UploadFile
```

Output thanh cong:

```json
{
  "image_url": "https://res.cloudinary.com/..."
}
```

### 4. Bo sung validate suat chieu

Service:

```txt
backend/app/services/ShowTime.py
```

Da them validate khi tao/cap nhat suat chieu:

- `gio_bat_dau` phai nho hon `gio_ket_thuc`.
- `lich_chieu_id` phai ton tai.
- `phong_id` phai ton tai.
- Khong duoc trung khung gio trong cung phong va cung lich chieu.

Dieu kien trung gio:

```txt
existing.gio_bat_dau < new.gio_ket_thuc
existing.gio_ket_thuc > new.gio_bat_dau
```

## Admin API input/output

### Them phim

```http
POST /admin/films/
X-Admin-Key: <ADMIN_API_KEY>
```

Input:

```json
{
  "ten_phim": "Doraemon",
  "mo_ta": "Mo ta phim",
  "ngay_khoi_chieu": "2025-04-20",
  "ngay_ket_thuc": "2025-05-20",
  "the_loai": "Hoat hinh",
  "dao_dien": "Ten dao dien",
  "thoi_luong": 120,
  "dien_vien": "Dien vien A, B",
  "hinh_anh": "https://...",
  "trailer": "https://..."
}
```

Output:

```json
{
  "message": "Thêm phim thành công"
}
```

### Cap nhat phim

```http
PUT /admin/films/{phim_id}
X-Admin-Key: <ADMIN_API_KEY>
```

Input: cac field optional.

```json
{
  "ten_phim": "Ten phim moi",
  "thoi_luong": 130,
  "hinh_anh": "https://..."
}
```

Output:

```json
{
  "ten_phim": "Ten phim moi",
  "mo_ta": "Mo ta",
  "ngay_khoi_chieu": "2025-04-20",
  "ngay_ket_thuc": "2025-05-20",
  "the_loai": "Hoat hinh",
  "dao_dien": "Dao dien",
  "thoi_luong": 130,
  "dien_vien": "A, B",
  "hinh_anh": "https://...",
  "trailer": "https://..."
}
```

### Xoa phim

```http
DELETE /admin/films/{id_film}
X-Admin-Key: <ADMIN_API_KEY>
```

Output:

```json
{
  "message": "Xóa phim thành công"
}
```

### Tao lich chieu

```http
POST /admin/lichchieu/
X-Admin-Key: <ADMIN_API_KEY>
```

Input:

```json
{
  "phim_id": 1,
  "ngay_chieu": "2025-05-01"
}
```

Output:

```json
{
  "message": "Tạo lịch chiếu ngày 2025-05-01 thành công"
}
```

### Cap nhat lich chieu

```http
PUT /admin/lichchieu/{schedule_id}
X-Admin-Key: <ADMIN_API_KEY>
```

Input:

```json
{
  "ngay_chieu": "2025-05-02"
}
```

Output:

```json
{
  "message": "Cập nhật lịch chiếu thành công",
  "ngay_chieu_moi": "2025-05-02"
}
```

### Xoa lich chieu

```http
DELETE /admin/lichchieu/{schedule_id}
X-Admin-Key: <ADMIN_API_KEY>
```

Output:

```json
{
  "message": "Xóa lịch chiếu thành công",
  "ngay_chieu": "2025-05-02"
}
```

### Tao suat chieu

```http
POST /admin/suat-chieu/
X-Admin-Key: <ADMIN_API_KEY>
```

Input:

```json
{
  "lich_chieu_id": 1,
  "phong_id": 2,
  "gio_bat_dau": "18:00:00",
  "gio_ket_thuc": "20:00:00"
}
```

Output:

```json
{
  "message": "Suất chiếu được tạo thành công",
  "data": {
    "id": 1,
    "phong_id": 2,
    "gio_bat_dau": "18:00:00",
    "gio_ket_thuc": "20:00:00",
    "lich_chieu_id": 1
  }
}
```

### Lay suat chieu theo lich chieu

```http
GET /admin/lich-chieu/{lich_chieu_id}
X-Admin-Key: <ADMIN_API_KEY>
```

Output:

```json
[
  {
    "id": 1,
    "phong_id": 2,
    "gio_bat_dau": "18:00:00",
    "gio_ket_thuc": "20:00:00",
    "lich_chieu_id": 1
  }
]
```

### Cap nhat suat chieu

```http
PUT /admin/suat-chieu/{suat_chieu_id}
X-Admin-Key: <ADMIN_API_KEY>
```

Input:

```json
{
  "phong_id": 3,
  "gio_bat_dau": "19:00:00",
  "gio_ket_thuc": "21:00:00"
}
```

Output:

```json
{
  "message": "Cập nhật suất chiếu thành công",
  "data": {
    "id": 1,
    "phong_id": 3,
    "gio_bat_dau": "19:00:00",
    "gio_ket_thuc": "21:00:00",
    "lich_chieu_id": 1
  }
}
```

### Xoa suat chieu

```http
DELETE /admin/suat-chieu/{suat_chieu_id}
X-Admin-Key: <ADMIN_API_KEY>
```

Output:

```json
{
  "message": "Xóa suất chiếu thành công"
}
```

## Luu y cho frontend/admin client

- Tat ca API admin phai gui header `X-Admin-Key`.
- Cac URL them/sua/xoa phim da doi tu `/films/...` sang `/admin/films/...`.
- Cac URL them/sua/xoa lich chieu da doi tu `/lichchieu/...` sang `/admin/lichchieu/...`.
- Upload anh hien tai la `/admin/upload_image/`, khong con la route public.

## Frontend admin service

Da them helper service:

```txt
frontend/service/adminAPIservice.js
```

Service nay gom cac ham:

- `createFilm(adminKey, data)`
- `updateFilm(adminKey, filmId, data)`
- `deleteFilm(adminKey, filmId)`
- `createSchedule(adminKey, data)`
- `updateSchedule(adminKey, scheduleId, data)`
- `deleteSchedule(adminKey, scheduleId)`
- `createShowtime(adminKey, data)`
- `getShowtimesBySchedule(adminKey, scheduleId)`
- `updateShowtime(adminKey, showtimeId, data)`
- `deleteShowtime(adminKey, showtimeId)`
- `uploadImage(adminKey, file)`

Vi du:

```js
import { createFilm } from '../service/adminAPIservice';

const result = await createFilm(adminKey, {
  ten_phim: 'Doraemon',
  mo_ta: 'Mo ta phim',
  ngay_khoi_chieu: '2025-04-20',
  ngay_ket_thuc: '2025-05-20',
  the_loai: 'Hoat hinh',
  dao_dien: 'Ten dao dien',
  thoi_luong: 120,
  dien_vien: 'Dien vien A, B',
  hinh_anh: 'https://...',
  trailer: 'https://...',
});
```

## Env va secret

Da them file mau:

```txt
backend/.env.example
```

Da them `.env` vao:

```txt
backend/.gitignore
```

Luu y: `backend/.env` dang duoc Git track tu truoc. De ngung track file nay ma van giu file local, chay:

```bash
git rm --cached backend/.env
```

Sau do commit thay doi `.gitignore` va `.env.example`. Khong commit secret that trong `.env`.
