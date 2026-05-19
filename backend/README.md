# MyCinema Backend

Backend cua MyCinema la mot REST API viet bang FastAPI, dung PostgreSQL lam database chinh va Redis de giu ghe tam thoi trong qua trinh dat ve. Source code duoc chia theo mo hinh Router -> Service -> Model/Schema.

## Tong quan ky thuat

- Framework: FastAPI, Uvicorn.
- Database: PostgreSQL voi SQLAlchemy AsyncSession.
- Cache/lock: Redis, dung key tam thoi cho ghe dang duoc giu.
- Validate du lieu: Pydantic schema trong `app/schemas`.
- ORM model: SQLAlchemy model trong `app/models/models.py`.
- Entry point: `app/main.py`.
- API docs khi chay local: `http://localhost:8000/docs`.

Luong xu ly chinh:

```text
Client
  -> FastAPI router trong app/api/v1/endpoints
  -> Service trong app/services
  -> SQLAlchemy model / Redis manager
  -> PostgreSQL / Redis
  -> Pydantic response tra ve client
```

## Cau truc thu muc backend

```text
backend/
├── app/
│   ├── api/v1/endpoints/     # Khai bao route HTTP/WebSocket
│   ├── database/             # Tao async engine, session va dependency get_db
│   ├── models/               # ORM model anh xa bang PostgreSQL
│   ├── schemas/              # Pydantic schema cho request/response
│   ├── services/             # Logic nghiep vu
│   ├── redis/                # Redis manager giu/xoa/kiem tra ghe
│   ├── core/                 # Cau hinh ket noi phu tro
│   ├── uploads/              # Anh upload/local seed image
│   ├── utils/                # Tien ich bao mat/JWT
│   └── main.py               # Khoi tao FastAPI va include routers
├── requirements.txt
└── .env
```

## Cac bang du lieu chinh

Backend hien co cac model quan he sau:

- `taikhoan`: tai khoan nguoi dung, email, mat khau, so dien thoai, thong tin ca nhan.
- `phim`: thong tin phim, ngay khoi chieu/ket thuc, the loai, dao dien, dien vien, poster, trailer.
- `lich_chieu`: ngay chieu cua tung phim.
- `suat_chieu`: gio bat dau/ket thuc, gan voi lich chieu va phong chieu.
- `phong_chieu`: thong tin phong va so ghe.
- `ghe`: ghe trong phong, loai ghe va gia.
- `thanh_toan`: thong tin giao dich thanh toan.
- `ve`: ve da dat, gan user, suat chieu, ghe va thanh toan.
- `binh_luan`: binh luan/danh gia sao cua user cho phim.

## Phan tich tung chuc nang backend

### 1. Tai khoan va thong tin nguoi dung

Router: `app/api/v1/endpoints/Account.py`  
Service: `app/services/Account.py`

Endpoints hien co:

- `POST /account/register`: dang ky tai khoan.
- `POST /account/login`: dang nhap.
- `GET /account/profile/{user_id}`: lay thong tin profile.
- `PUT /account/users/{user_id}`: cap nhat profile.
- `POST /account/forgotpassword`: lay lai mat khau.
- `PUT /account/change-password/{user_id}`: doi mat khau.

Logic chinh:

- Dang ky kiem tra email da ton tai chua, kiem tra cac truong bat buoc `email`, `mat_khau`, `ten`, `sdt`, sau do tao ban ghi `TaiKhoan`.
- Dang nhap tim user theo email, so sanh mat khau va tra ve thong tin user neu hop le.
- Profile tim user theo `user_id`; neu khong co thi tra loi 404.
- Cap nhat profile dung `model_dump(exclude_unset=True)` de chi sua cac field client gui len.
- Quen mat khau hien tai tra ve mat khau dang luu trong database.
- Doi mat khau kiem tra user ton tai, mat khau cu dung va mat khau moi khac mat khau cu.

Luu y hien tai:

- Mat khau dang duoc luu va so sanh dang plain text, chua hash bang bcrypt.
- Chua thay router nao bat buoc JWT token cho cac API can dang nhap.
- `app/utils/security.py` co ham tao JWT, nhung chua duoc tich hop vao login flow hien tai.

### 2. Phim

Router: `app/api/v1/endpoints/film.py`  
Service: `app/services/film.py`

Endpoints hien co:

- `GET /films/showing`: lay danh sach phim dang chieu.
- `GET /films/upcoming`: lay danh sach phim sap chieu.
- `POST /films/`: them phim.
- `PUT /films/{phim_id}`: cap nhat phim.
- `DELETE /films/{id_film}`: xoa phim.

Logic chinh:

- Phim dang chieu duoc loc theo `ngay_ket_thuc >= date.today()` va `ngay_khoi_chieu <= fixed_date`.
- Phim sap chieu duoc loc theo `ngay_khoi_chieu > fixed_date`.
- `fixed_date` hien dang hard-code la `2025-04-20`, nen ket qua "dang chieu/sap chieu" phu thuoc moc nay thay vi ngay hien tai hoan toan.
- Them phim validate `ngay_khoi_chieu < ngay_ket_thuc`.
- Cap nhat phim tim theo id va set cac field duoc gui len.
- Xoa phim tim theo id roi delete trong database.

### 3. Chi tiet phim va lich/suat chieu cho booking

Router: `app/api/v1/endpoints/Booking.py`  
Service: `app/services/Booking.py`

Endpoint hien co:

- `GET /phim/{phim_id}`: lay chi tiet phim kem lich chieu va cac suat chieu.

Logic chinh:

- Tim phim theo `phim_id`.
- Lay tat ca `LichChieu` cua phim.
- Voi moi lich chieu, lay danh sach `SuatChieu`.
- Gom du lieu thanh response gom thong tin phim, danh sach ngay chieu va gio chieu.

### 4. Quan ly lich chieu

Router: `app/api/v1/endpoints/Schedule.py`  
Service: `app/services/Schedule.py`

Endpoints hien co:

- `GET /lichchieu/phim/{phim_id}`: lay lich chieu theo phim.
- `POST /lichchieu/`: tao lich chieu.
- `PUT /lichchieu/{schedule_id}`: cap nhat lich chieu.
- `DELETE /lichchieu/{schedule_id}`: xoa lich chieu.

Logic chinh:

- Lay lich chieu theo phim tra ve danh sach ngay chieu cua phim do.
- Tao lich chieu kiem tra phim ton tai, ngay chieu nam trong khoang ngay khoi chieu/ket thuc cua phim, va khong trung lich cung phim/cung ngay.
- Cap nhat lich chieu kiem tra lich ton tai va ngay moi khong nho hon ngay hien tai.
- Xoa lich chieu theo id.

### 5. Quan ly suat chieu

Router: `app/api/v1/endpoints/ShowTime.py`  
Service: `app/services/ShowTime.py`

Endpoints hien co:

- `POST /admin/suat-chieu/`: tao suat chieu.
- `GET /admin/lich-chieu/{lich_chieu_id}`: lay suat chieu theo lich chieu.
- `PUT /admin/suat-chieu/{suat_chieu_id}`: cap nhat suat chieu.
- `DELETE /admin/suat-chieu/{suat_chieu_id}`: xoa suat chieu.

Logic chinh:

- Lay suat chieu theo `lich_chieu_id` va sap xep theo `gio_bat_dau`.
- Tao suat chieu gan `lich_chieu_id`, `phong_id`, `gio_bat_dau`, `gio_ket_thuc`.
- Cap nhat suat chieu set lai cac field tu request.
- Xoa suat chieu theo id.

Luu y hien tai:

- Nhom API suat chieu nam duoi prefix `/admin` va yeu cau header `X-Admin-Key`.
- Service da kiem tra lich chieu/phong chieu ton tai, gio bat dau nho hon gio ket thuc, va khong trung gio trong cung phong/cung lich chieu.

### 6. Danh sach ghe va trang thai ghe

Router: `app/api/v1/endpoints/ChairList.py`  
Service: `app/services/ChairList.py`

Endpoint hien co:

- `GET /listghe/ghe/{suat_chieu_id}`: lay danh sach ghe cua suat chieu.

Logic chinh:

- Tim `phong_id` tu `suat_chieu_id`.
- Lay tat ca ghe thuoc phong do.
- Lay danh sach ghe da ban tu bang `ve` theo `suat_chieu_id`.
- Kiem tra Redis de biet ghe nao dang duoc giu tam thoi.
- Tra ve moi ghe voi `trang_thai`:
  - `da_ban`: da co ve trong database.
  - `dang_giu`: dang bi Redis lock.
  - `trong`: chua ban va khong bi giu.

### 7. Chon ghe, cap nhat ghe va xoa ghe tam thoi

Router: `app/api/v1/endpoints/ChooseChair.py`, `app/api/v1/endpoints/UpdateChair.py`  
Service: `app/services/ChooseChair.py`, `app/services/UpdateChair.py`  
Redis manager: `app/redis/redis.py`

Endpoints hien co:

- `POST /chon-ghe`: giu ghe tam thoi.
- `DELETE /xoa-ghe`: xoa ghe dang giu.
- `PUT /update-ghe`: thay doi danh sach ghe dang giu cua user.

Logic chinh:

- Kiem tra suat chieu ton tai.
- Voi tung ghe, kiem tra ghe co thuoc phong cua suat chieu khong.
- Kiem tra Redis xem ghe da bi user khac giu chua.
- Neu ghe con trong, tao Redis key `ghe:{ghe_id}:{suat_chieu_id}` voi value la `user_id`.
- TTL mac dinh la 300 giay, tuong duong 5 phut.
- Khi xoa ghe, service chi cho xoa neu user hien tai dung la user dang giu ghe.
- Khi update ghe, service xoa toan bo ghe cu cua user trong suat chieu do roi set lai danh sach ghe moi.

### 8. Thanh toan va tao ve

Router: `app/api/v1/endpoints/payment.py`  
Service: `app/services/payment.py`

Endpoint hien co:

- `POST /Payment/confirm`: xac nhan thanh toan va tao ve.

Logic chinh:

- Kiem tra suat chieu ton tai, dong thoi eager-load `lich_chieu`.
- Tim phim va phong chieu tu suat chieu.
- Voi tung ghe:
  - Kiem tra ghe co ton tai va thuoc phong cua suat chieu.
  - Kiem tra bang `ve` xem ghe da duoc ban voi trang thai `Da xac nhan` chua.
  - Kiem tra Redis xem ghe con duoc giu boi dung `user_id` khong.
- Tao ban ghi `ThanhToan` voi phuong thuc, trang thai, ngay thanh toan, so tien va ma giao dich.
- Tao cac ban ghi `Ve` cho tung ghe, gan `thanh_toan_id`.
- Commit database.
- Sau khi commit thanh cong, xoa cac key giu ghe trong Redis.
- Tra ve thong tin ve: danh sach id ve, ten phim, ngay/gio chieu, phong, ghe, tong gia, trang thai va ma giao dich.

Luu y hien tai:

- Luong thanh toan dang gia lap la thanh cong, chua tich hop cong thanh toan that.
- Neu loi xay ra sau khi da commit DB nhung truoc/xung quanh luc xoa Redis, ve van da duoc tao; can co buoc cleanup/retry neu muon chat hon.

### 9. Tim kiem phim

Router: `app/api/v1/endpoints/FilmSearch.py`  
Service: `app/services/FilmSearch.py`

Endpoint hien co:

- `POST /search-film`: tim phim theo tu khoa.

Logic chinh:

- Chuyen query ve lowercase.
- Dung PostgreSQL function `similarity` de tinh do gan dung theo `ten_phim` va `the_loai`.
- Lay diem cao nhat bang `greatest`, loc cac ket qua co similarity > 0.2, sap xep theo rank giam dan va gioi han 10 ket qua.

Luu y hien tai:

- Database can bat extension PostgreSQL `pg_trgm` de dung `similarity`.

### 10. Binh luan va danh gia phim

Router: `app/api/v1/endpoints/CommentFilm.py`  
Service: `app/services/CommentFilm.py`

Endpoints hien co:

- `POST /binhluan/`: tao binh luan.
- `GET /binhluan/{phim_id}`: lay binh luan va thong ke rating cua phim.
- `PUT /binhluan/{comment_id}`: cap nhat binh luan.
- `DELETE /binhluan/{comment_id}`: xoa binh luan.

Logic chinh:

- Tao binh luan kiem tra phim va tai khoan ton tai, sau do them `BinhLuan`.
- Lay binh luan eager-load user de hien thi ten tai khoan.
- Tinh thong ke rating gom tong so danh gia, diem trung binh va so luong tung muc sao.
- Cap nhat/xoa binh luan yeu cau `user_id` trong request/query phai trung voi `user_id` cua binh luan.

Luu y hien tai:

- Co them router `MovieCommetntary.py` va service `FilmCommentary.py` cung xu ly binh luan voi prefix `/binh-luan`; day la module gan trung chuc nang voi `/binhluan`.

### 11. Lich su xem phim, lich su thanh toan va chi tiet ve

Routers:

- `app/api/v1/endpoints/historyfilm.py`
- `app/api/v1/endpoints/historypayment.py`
- `app/api/v1/endpoints/DetailVe.py`

Services:

- `app/services/historyfilm.py`
- `app/services/historypayment.py`
- `app/services/DetailVe.py`

Endpoints hien co:

- `GET /lich-su-phim/{user_id}`: lich su phim da xem/da dat ve.
- `GET /historypayment/{user_id}`: lich su thanh toan.
- `GET /Ve-Detail-user/{user_id}`: chi tiet tat ca ve da mua cua user.

Logic chinh:

- Lich su phim lay cac ve `Da xac nhan`, eager-load phim, phong, ghe va thanh toan, sau do gom cac ghe theo `suat_chieu_id`.
- Lich su thanh toan join `ThanhToan` voi `Ve` theo user va tra ve phuong thuc, trang thai, ngay thanh toan, so tien, ma giao dich.
- Chi tiet ve tra ve tung ve rieng le kem ten phim, anh phim, ngay/gio chieu, phong, ghe, gia ve, so tien thanh toan va thoi gian tao.

### 12. Upload anh va WebSocket

Routers:

- `app/api/v1/endpoints/cloudinary.py`
- `app/api/v1/endpoints/websocket.py`

Logic hien co:

- `POST /admin/upload_image/`: nhan file upload, luu tam tren disk, upload len Cloudinary, xoa file tam va tra ve `image_url`.
- `WEBSOCKET /ws`: echo message, nhan text va gui lai `Message received: ...`.

Luu y hien tai:

- Router Cloudinary da duoc include trong `app/main.py`.
- Thong tin Cloudinary duoc doc tu `.env`.
- Endpoint upload anh yeu cau header `X-Admin-Key`.

## Luong nghiep vu dat ve

```text
1. Client goi GET /phim/{phim_id}
   -> lay chi tiet phim, lich chieu, suat chieu.

2. Client goi GET /listghe/ghe/{suat_chieu_id}
   -> backend tong hop trang thai ghe tu PostgreSQL va Redis.

3. User chon ghe, client goi POST /chon-ghe
   -> backend validate suat chieu/ghe
   -> tao Redis lock ghe:{ghe_id}:{suat_chieu_id} trong 5 phut.

4. Neu user doi ghe, client goi PUT /update-ghe
   -> backend xoa ghe cu cua user trong Redis
   -> giu danh sach ghe moi.

5. User thanh toan, client goi POST /Payment/confirm
   -> backend kiem tra ghe van duoc user nay giu
   -> tao ThanhToan
   -> tao Ve
   -> commit PostgreSQL
   -> xoa Redis lock.

6. User xem lai ve/lich su
   -> GET /Ve-Detail-user/{user_id}
   -> GET /lich-su-phim/{user_id}
   -> GET /historypayment/{user_id}
```

## Chay backend local

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

File `.env` can co toi thieu:

```env
DATABASE_URL=postgresql+asyncpg://<username>:<password>@localhost:5432/<database>
SECRET_KEY=<secret>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ADMIN_API_KEY=<admin-api-key>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
```

Redis hien dang mac dinh ket noi toi:

```text
redis://localhost:6379
```

## Cac diem can cai thien

- Hash mat khau bang bcrypt/passlib thay vi luu plain text.
- Login nen tra JWT access token/refresh token va cac API user/booking/payment nen kiem tra token.
- Sua ham `create_acces_token` trong `app/utils/security.py` neu muon dung JWT, vi payload `exp` hien chua duoc set dung key.
- Dua Redis URL vao `.env`, khong hard-code `redis://localhost:6379` trong source.
- Them rollback/exception handling ro hon trong thanh toan de dam bao tinh nguyen tu khi co loi.
- Loai bo hoac hop nhat module binh luan bi trung: `/binhluan` va `/binh-luan`.
- Them test cho account, seat locking, payment, comment va search.
