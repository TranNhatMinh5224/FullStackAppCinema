#  Ứng Dụng Bán Vé Xem Phim Trực Tuyến

## I. Khảo Sát Nghiệp Vụ Hệ Thống

### 1. Đặt Vấn Đề

Trong thời đại công nghệ số phát triển mạnh mẽ, nhu cầu giải trí ngày càng tăng cao, trong đó xem phim tại rạp là một hình thức phổ biến. Tuy nhiên, việc mua vé truyền thống tại quầy thường gây bất tiện cho người dùng như:

- Phải xếp hàng chờ đợi
- Mất thời gian di chuyển
- Rủi ro hết vé hoặc không chọn được chỗ ngồi như mong muốn

Một **ứng dụng bán vé xem phim trực tuyến** sẽ giúp người dùng:

- Dễ dàng tra cứu lịch chiếu
- Đặt vé, chọn chỗ ngồi
- Thanh toán nhanh chóng ngay trên điện thoại hoặc máy tính

Ứng dụng không chỉ nâng cao trải nghiệm người dùng mà còn hỗ trợ rạp phim **quản lý suất chiếu, phòng chiếu và lượng vé bán ra** hiệu quả hơn.

---

### 2. Mục Tiêu

- Xây dựng một ứng dụng đặt vé xem phim hiện đại, thân thiện với người dùng
- Cho phép người dùng:
  - Xem danh sách phim đang chiếu và sắp chiếu
  - Xem thông tin chi tiết phim: nội dung, diễn viên, thời lượng, trailer,...
  - Tra cứu lịch chiếu theo ngày và suất chiếu
  - Đặt vé online: chọn phim, suất chiếu, chỗ ngồi, và thanh toán nhanh chóng

---

## II. Phân Tích & Thiết Kế Hệ Thống

### 1. Phạm Vi Chức Năng

- Giao diện thân thiện, dễ sử dụng
- Tìm kiếm phim theo tên
- Xem lịch chiếu theo ngày, theo phim
- Đặt vé trực tuyến: chọn phim, suất chiếu, ghế ngồi
- Sơ đồ chọn ghế trực quan
- Xem lịch sử đặt vé
- Quản lý thông tin người dùng

---

### 2. Biểu đồ phân rã chức năng

![Biểu đồ phân rã chức năng](Office/Phanda.png)

---

### 3. Biểu đồ UseCase

- **UseCase Tổng quát**  
  ![UseCase Tổng quát](Office/image-1.png)

- **UseCase Account**  
  ![UseCase Account](Office/image-2.png)

- **UseCase Quy trình đặt vé**  
  ![UseCase Quy trình đặt vé](Office/image-3.png)

- **UseCase Quản lý**  
  ![UseCase Quản lý](Office/image-4.png)

---

### 4. Activity Diagram

Mô tả luồng hoạt động _(workflow)_ của hệ thống App bán vé xem phim online.

![Activity Diagram](Office/image-5.png)

---

### 5. Sequence Diagram

Dùng để mô tả trình tự các tương tác giữa các đối tượng trong hệ thống theo thời gian trong hệ thống App bán vé xem phim online.

![Sequence Diagram](Office/image.png)

---

## III. Công nghệ sử dụng và công cụ phát triển

### 1. Công nghệ sử dụng

#### 📱 React Native

React Native là một framework phát triển ứng dụng di động đa nền tảng được phát triển bởi Facebook. Nó cho phép phát triển ứng dụng di động sử dụng JavaScript và cung cấp khả năng tái sử dụng mã nguồn cho cả hai nền tảng iOS và Android.

#### ⚙️ Python (FastAPI) và PostgreSQL

- **FastAPI**: Là một web framework hiện đại dành cho Python, dùng để xây dựng các API (đặc biệt là RESTful API) một cách nhanh chóng, hỗ trợ tự động tạo tài liệu Swagger UI.
- **PostgreSQL**: Là một hệ quản trị cơ sở dữ liệu quan hệ (RDBMS) mã nguồn mở mạnh mẽ, được sử dụng phổ biến trong các hệ thống backend chuyên nghiệp.

---

### 2. Công cụ phát triển

| Công Cụ               | Mục Đích Sử Dụng                                                    |
| --------------------- | ------------------------------------------------------------------- |
|  Visual Studio Code | IDE phát triển frontend và backend                                  |
|  Expo               | Build/test ứng dụng React Native dễ dàng trên thiết bị thực         |
|  Render             | Triển khai backend và PostgreSQL lên môi trường cloud, hỗ trợ CI/CD |
|  Redis              | Cache dữ liệu và tăng tốc độ truy vấn hệ thống                      |
|  Cloudinary         | Lưu trữ, tối ưu và quản lý ảnh (poster phim, ảnh ghế, ...)          |
|  GitHub             | Quản lý mã nguồn, teamwork, version control                         |

---

## IV.  Triển Khai

### 1.  Thiết Kế Giao Diện Người Dùng

- Giao diện được thiết kế bằng [Figma](https://figma.com/) để đảm bảo trải nghiệm người dùng (UX/UI) xuyên suốt và đồng bộ.
- Sơ đồ điều hướng và layout các màn hình được xác định rõ ràng trước khi phát triển.

---

### 2.  Triển Khai Backend

#### a. Cấu Trúc Cơ Sở Dữ Liệu

Sơ đồ tổng quan:  
![Database tổng quan](Office/image-8.png)

#### b. Các bảng chi tiết:

- **Tài Khoản**  
  ![Tài Khoản](Office/image-20.png)

- **Phim**  
  ![Phim](Office/image-10.png)

- **Phòng Chiếu**  
  ![Phòng Chiếu](Office/image-24.png)

- **Ghế**  
  ![Ghế](Office/image-21.png)

- **Lịch Chiếu**  
  ![Lịch Chiếu](Office/image-26.png)

- **Suất Chiếu**  
  ![Suất Chiếu](Office/image-25.png)

- **Vé**  
  ![Vé](Office/image-22.png)

- **Thanh Toán**  
  ![Thanh Toán](Office/image-23.png)

---

### 3.  Cấu Trúc Thư Mục Dự Án

- **Cấu trúc projetc**  
  ![alt text](Office/Struct.png)

  - frontend : chứa code frontend
  - backend : chưa code backend
  - Backupdata : chứa data ( backup data ,Restore để dùng)
  - Office : chứa tài liệu readme

- **Cấu trúc Frontend**  
  ![alt text](Office/structfrontend.png)
  frontend/

  - ├── .expo/ # Thư mục tự sinh của Expo (không chỉnh sửa)
  - ├── .vscode/ # Cấu hình dành riêng cho Visual Studio Code
  - ├── assets/ # Lưu trữ hình ảnh, font
  - ├── components/ # Các component dùng lại trong nhiều màn hình
  - ├── context/ # Quản lý trạng thái toàn cục bằng React Context API
  - ├── node_modules/ # Các thư viện được cài thông qua npm hoặc yarn
  - ├── screens/ # Các màn hình chính của ứng dụng (Home, Login, Register,...)
  - ├── service/ # Gọi API, xử lý backend
  - ├── .gitignore # Các file/thư mục bị Git bỏ qua
  - ├── App.js # Entry point chính của ứng dụng
  - ├── app.json # Cấu hình dự án cho Expo
  - ├── index.js # File gốc khởi chạy app (dùng trong môi trường dev/test)
  - ├── metro.config.js # Cấu hình Metro bundler (nạp asset, alias,...)
  - ├── package-lock.json # Khóa phiên bản các package
  - ├── package.json # Khai báo các dependency và script của project

- **Cấu trúc Backend**  
  ![alt text](Office/structbackend.png)
  backend/
  - ├── app/
  - │ ├── api/ # Định nghĩa các route endpoint (controller)
  - │ ├── core/ # Cấu hình Redis , JWT
  - │ ├── database/ # Cấu hình kết nối và session database
  - │ ├── models/ # Các class ORM mô tả bảng trong CSDL
  - │ ├── redis/ # Kết nối và xử lý Redis (cache,...)
  - │ ├── schemas/ # Các Pydantic model dùng validate request/response
  - │ ├── services/ # Xử lý logic nghiệp vụ của hệ thống
  - │ ├── uploads/ # Chứa các file upload (ảnh,...)
  - │ ├── utils/ # Các hàm tiện ích
  - │ ├── config.py # Biến cấu hình (đọc từ .env)
  - │ └── main.py # Điểm khởi động chính của FastAPI app
  - ├── venv/ # Môi trường ảo Python (không push lên git)
  - ├── .env # Biến môi trường
  - ├── .gitignore # Bỏ qua các file/thư mục khi commit
  - └── requirements.txt # Các thư viện cần thiết

### 4. Logic kết Nối Frontend , Backend và DB , Redis

1. React Native (Frontend – Ứng dụng di động)
   - Dùng để hiển thị giao diện và tương tác người dùng.
   - Gửi các HTTP request (GET, POST, PUT, DELETE) tới FastAPI sd axios( có thể sd fetch).
   - Nhận dữ liệu (JSON) từ FastAPI để hiển thị cho người dùng.
2. FastAPI (Backend – Xử lý logic nghiệp vụ)
   - Nhận request từ React Native, xử lý dữ liệu, xác thực, và tương tác với cơ sở dữ liệu PostgreSQL.
   - Sử dụng ORM như SQLAlchemy để kết nối và thao tác với database.
   - Trả về kết quả dưới dạng JSON.
3. PostgreSQL (Database – Lưu trữ dữ liệu)
   - Là nơi lưu trữ toàn bộ dữ liệu: người dùng, Phim ...
   - Backend (FastAPI) sẽ dùng các truy vấn SQL (thông qua ORM) để lấy, sửa, thêm hoặc xóa dữ liệu.
4. Redis(sd Local hoặc Redis Cloud)
   - Là bộ nhờ đệm lưu trữ tạm thời thông tin chọn ghế

### 4.1 Cụ Thể Các Kết nối

1. Kết Nối Backend Và DB (SD SQLAlchemy (ORM) kết nối với Backend )
   - Tạo File .env lưu đường dẫn liên kết tới vd : DB DATABASE_URL = "postgresql+asyncpg://postgres:05022004@localhost:5432/mycinema"
   - Tạo engine để kết nối đến PostgreSQL
   - Tạo Session để làm việc với database
   - Định nghĩa Base để tạo các Model để SQLAchemy ánh xạ từ model sang DB
   - Tạo DI cho mỗi phiên session
2. Kết nối Frontend và Backend
   - Giao tiếp qua các API
   - Sử Dụng Middleware cho phép frontend gửi request tới backend một cách hợp lệ.Giúp frontend truy cập API backend mà không bị trình duyệt chặn, đặc biệt khi chạy trên 2 domain hoặc 2 cổng khác nhau.
3. Kết nối redis .

- sd local thì : redis_url="redis://localhost:6379" : đây là url local để kết nối
- nếu sử dụng clound thì cần tạo Tk cloud : Tạo và connect . vd :(self, redis_url="redis://default:XNOrDwnmoV8ZwQ0zty9UINOn5cNGgNPx@redis-13952.c228.us-central1-1.gce.redns.redis-cloud.com:13952"):

### 5 . Xây Dựng Backend Các API cần cho hệ thống

- Chúng tôi đã xây dựng các API sử dụng Framework FastAPI nhằm kết nối ứng dụng với cơ sở dữ liệu PostgreSQL. Các API này đóng vai trò xử lý các yêu cầu từ phía người dùng, thực hiện truy vấn và trả về dữ liệu tương ứng từ cơ sở dữ liệu.
- Sau khi kiểm thử các API bằng công cụ Postman để đảm bảo hoạt động chính xác, chúng tôi tiến hành đẩy mã nguồn lên GitHub.
- Tiếp theo, sử dụng nền tảng Render để triển khai (deploy) dự án. Render được cấu hình để tự động kết nối với repository GitHub, từ đó xây dựng và triển khai ứng dụng trực tuyến.

API Account

![alt text](Office/APIAccount.png)

API Phim

![alt text](Office/APIPhim.png)

API Cho lịch chiếu , suất chiếu , chi tiết phim

![alt text](Office/SuatchieuLichChieu.png)

API Cho Danh Sách Ghế , chọn ghế

![alt text](Office/dsghe.png)

API Cho Đặt vé . Thanh Toán , Bình Luận ( có thể mở rộng thêm phía frontend) , và các API khác (có thể scale project nênus cần)

![alt text](Office/scale.png)

### 6 . Giao Diện frontend

- Triển khai front-end.
  - Tiếp theo, chúng tôi đã triển khai front-end của ứng dụng bằng cách sử dụng React Native. Chúng tôi đã xây dựng các màn hình và giao diện người dùng dựa trên thiết kế đã được xác định trước đó. Ứng dụng được kết nối với các API để lấy dữ liệu từ server và hiển thị cho người dùng.
  - Xây dựng tới màn hình nào sẽ viết luôn xử lý luồng kết nối tới sever.

1. **Giao Diện Trang chủ khi chưa đăng nhập**

   <img src="Office/f.jpg" alt="Trang chủ" width="200"/>

2. **Giao diện Phim Sắp Chiếu, Phim Đang Chiếu**

   <img src="Office/f.jpg" alt="Phim sắp chiếu" width="200"/>
   <img src="Office/f2.jpg" alt="Phim đang chiếu" width="200"/>

3. **Giao diện Chi Tiết Phim Sắp Chiếu, Phim Đang Chiếu**

   <img src="Office/f3.jpg" alt="Phim sắp chiếu" width="200"/>
   <img src="Office/f4.jpg" alt="Phim đang chiếu" width="200"/>

4. **Giao Diện Lịch Chiếu , Suất Chiếu**

   <img src="Office/f5.jpg" alt="Phim đang chiếu" width="200"/>

5. **Trường hợp chưa đăng nhập**

   <img src="Office/f6.jpg" alt="Phim sắp chiếu" width="200"/>
   
5.1. **TH Đã Đăng Nhập**

<p float="left">
  <img src="Office/f11.jpg" alt="Phim sắp chiếu" width="200"/>
  <img src="Office/f13.jpg" alt="Phim sắp chiếu" width="200"/>
  <img src="Office/f14.jpg" alt="Phim sắp chiếu" width="200"/>
</p>

6.  **Thanh Toán**

    <img src="Office/f12.jpg" alt="Phim sắp chiếu" width="200"/>
    
7.  **Thông Tin Vé**

<p float="left">
  <img src="Office/f20.jpg" alt="Phim sắp chiếu" width="200"/>
  <img src="Office/f15.jpg" alt="Phim sắp chiếu" width="200"/>
  <img src="Office/f16.jpg" alt="Phim sắp chiếu" width="200"/>
</p>

## V.  Test Case

## Module Test Case Cho Account

| STT | Module     | Mã Test Case | Mô Tả                                       | Bước Thực Hiện                                                                                | Dữ Liệu Đầu Vào                                                                         | Kết Quả Mong Đợi                                                | Kết Quả Thực Tế                                              | Trạng Thái |
| --- | ---------- | ------------ | ------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------ | ---------- |
| 1   | Người dùng | TC_USER_001  | Kiểm tra đăng ký tài khoản hợp lệ           | 1. Vào trang đăng ký<br>2. Nhập email, sdt và mật khẩu<br>3. Nhấn "Đăng ký"                   | Họ và tên: Nhật Minh<br>Email: minhhello@gmail.com<br>Sđt: 01234567<br>Mật khẩu: 123456 | Đăng ký thành công và chuyển sang trang đăng nhập               | Đăng ký thành công và chuyển sang trang đăng nhập            | Pass       |
| 2   | Người dùng | TC_USER_002  | Đăng ký với email sai định dạng             | 1. Vào trang đăng ký<br>2. Nhập email, sdt và mật khẩu<br>3. Nhấn "Đăng ký"                   | Họ và tên: Nguyễn Văn B<br>Email: test#gmail.com<br>Mật khẩu: 12345                     | Thông báo lỗi email không hợp lệ và không chuyển màn hình       | Hiển thị thông báo lỗi và giữ nguyên ở trang đăng ký         | Pass       |
| 3   | Người dùng | TC_USER_003  | Đăng ký tài khoản với email đã tồn tại      | 1. Vào trang đăng ký<br>2. Nhập email và mật khẩu<br>3. Nhấn "Đăng ký"                        | Họ và tên: Nguyễn Văn A<br>Email: test01@gmail.com<br>Mật khẩu: 123456                  | Thông báo lỗi "Email đã được sử dụng, vui lòng chọn email khác" | Hiển thị thông báo lỗi tài khoản đã tồn tại                  | Pass       |
| 4   | Người dùng | TC_USER_004  | Đăng ký thiếu thông tin                     | 1. Vào trang đăng ký<br>2. Nhập thiếu tên, email hoặc sdt                                     | Ví dụ: Không có SĐT hoặc tên hoặc email                                                 | Thông báo "Vui lòng nhập đầy đủ thông tin"                      | Hiển thị thông báo lỗi                                       | Pass       |
| 5   | Người dùng | TC_USER_005  | Đăng nhập hợp lệ                            | 1. Vào trang đăng nhập<br>2. Nhập email và mật khẩu<br>3. Nhấn "Đăng nhập"                    | Email: minhhello@gmail.com<br>Mật khẩu: 123456                                          | Đăng nhập thành công                                            | Thông báo đăng nhập thành công                               | Pass       |
| 6   | Người dùng | TC_USER_006  | Đăng nhập với mật khẩu sai                  | 1. Vào trang đăng nhập<br>2. Nhập email và sai mật khẩu<br>3. Nhấn "Đăng nhập"                | Email: user@example.com<br>Mật khẩu: sai123                                             | Hiển thị lỗi "Mật khẩu không đúng"                              | Hiển thị lỗi "Mật khẩu không đúng"                           | Pass       |
| 7   | Người dùng | TC_USER_007  | Đăng nhập với gmail chưa đăng ký            | 1. Vào trang đăng nhập<br>2. Nhập email và mật khẩu<br>3. Nhấn "Đăng nhập"                    | Email: Huychicken@gmail.com<br>Mật khẩu: 123456                                         | Thông báo gmail chưa được đăng ký, yêu cầu đăng ký tài khoản    | Thông báo gmail chưa được đăng ký, yêu cầu đăng ký tài khoản | Pass       |
| 8   | Người dùng | TC_USER_008  | Đăng xuất khỏi hệ thống                     | 1. Đăng nhập hệ thống<br>2. Nhấn nút "Đăng xuất"                                              | Email: Huychicken@gmail.com                                                             | Quay về trang chủ                                               | Quay về trang chủ                                            | Pass       |
| 9   | Người dùng | TC_USER_009  | Quên mật khẩu                               | 1. Nhấn nút "Quên mật khẩu"<br>2. Nhập gmail                                                  | Email: Huychicken@gmail.com                                                             | Hiển thị mật khẩu                                               | Hiển thị mật khẩu                                            | Pass       |
| 10  | Người dùng | TC_USER_010  | Quên mật khẩu với email sai định dạng       | 1. Nhấn nút "Quên mật khẩu"<br>2. Nhập gmail                                                  | Email: Huychicken#gmail.com                                                             | Hiển thị yêu cầu nhập lại gmail                                 | Hiển thị yêu cầu nhập lại gmail                              | Pass       |
| 11  | Người dùng | TC_USER_011  | Quên mật khẩu với email không tồn tại       | 1. Nhấn nút "Quên mật khẩu"<br>2. Nhập gmail                                                  | Email: Huychicken@gmail.com                                                             | Không tìm thấy tài khoản                                        | Không tìm thấy tài khoản                                     | Pass       |
| 12  | Người dùng | TC_USER_012  | Xem thông tin tài khoản                     | 1. Đăng nhập<br>2. Xem thông tin tài khoản                                                    |                                                                                         | Thông tin user                                                  | Thông tin user                                               | Pass       |
| 13  | Người dùng | TC_USER_013  | Thay đổi mật khẩu                           | 1. Nhấn nút thay đổi mật khẩu<br>2. Nhập mật khẩu cũ<br>3. Nhập mật khẩu mới                  | Mật khẩu cũ: 123456<br>Mật khẩu mới: 1234567                                            | Thay đổi mật khẩu thành công                                    | Thay đổi mật khẩu thành công                                 | Pass       |
| 14  | Người dùng | TC_USER_014  | Thay đổi mật khẩu với mật khẩu cũ sai       | 1. Nhấn nút thay đổi mật khẩu<br>2. Nhập mật khẩu cũ sai<br>3. Nhập mật khẩu mới              | Mật khẩu cũ: 12345<br>Mật khẩu mới: 1234567                                             | Yêu cầu nhập lại                                                | Yêu cầu nhập lại                                             | Pass       |
| 15  | Người dùng | TC_USER_015  | Thay đổi mật khẩu với mật khẩu mới giống cũ | 1. Nhấn nút thay đổi mật khẩu<br>2. Nhập lại mật khẩu cũ<br>3. Nhập lại mật khẩu mới giống cũ | Mật khẩu cũ: 123456<br>Mật khẩu mới: 123456                                             | Yêu cầu nhập mật khẩu mới mạnh hơn khác mật khẩu cũ             | Yêu cầu nhập mật khẩu mới mạnh hơn khác mật khẩu cũ          | Pass       |
| 16  | Người dùng | TC_USER_016  | Cập nhật thông tin người dùng | 1. . Đăng nhập<br>2. Thông tin tài khoản<br>3. Thay đổi thông tin | Giới tính: Nam<br>Giới tính mới: Nữ                                            | Cập nhật thành công            | Cập nhật thành công          | Pass       |  


## Module. Test Case Cho Chọn film , chọn Lịch Chiếu , Suất Chiếu

| STT | Module    | Mã Test Case | Mô Tả                                           | Bước Thực Hiện                                                                                   | Dữ Liệu Đầu Vào        | Kết Quả Mong Đợi                                                     | Kết Quả Thực Tế                                            | Trạng Thái |
| --- | --------- | ------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------- | ---------- |
| 1  | Chọn phim | TC_FILM_001  | Chọn phim muốn xem                              | 1. Nhấn vào mục "Phim đang chiếu"<br>2. Nhấn "Đặt vé"<br>3. Chọn lịch chiếu<br>4. Chọn giờ chiếu | Phim: Doraemon         | Hiển thị lịch chiếu và khung giờ chiếu                               | Hiển thị lịch chiếu và khung giờ chiếu                     | Pass       |
| 2  | Chọn phim | TC_FILM_002  | Chọn lịch chiếu & suất chiếu khi chưa đăng nhập | 1. Nhấn vào giờ chiếu của phim bất kỳ (khi chưa đăng nhập)                                       | Khung giờ chiếu bất kỳ | Hệ thống yêu cầu người dùng đăng nhập<br>Quay về màn hình trang chủ  | Hệ thống yêu cầu đăng nhập<br>Chuyển về màn hình trang chủ | Pass       |
| 3  | Đặt vé    | TC_FILM_003  | Hiển thị danh sách ghế                          | 1. Chọn suất chiếu bất kỳ đã đăng nhập                                                           | Suất chiếu đã chọn     | Hiển thị danh sách ghế: gồm ghế trống, ghế đã bán, ghế đang được đặt | Hiển thị danh sách ghế đầy đủ trạng thái                   | Pass       |
| 4  | Xem Phim đang chiếu    | TC_FILM_004  | Xem phim đang chiếu                          | 1. Nhấn vào “đang chiếu”                                                           | Không có     | Danh sách phim sắp chiếu | Danh sách phim sắp chiếu                  | Pass       |
| 5  | Xem phim sắp chiếu    | TC_FILM_005  | Xem danh sách phim sắp chiếu                          | 1. Nhấn vào “sắp chiếu”                                                           | Không có     | Danh sách phim đang chiếu | Danh sách phim đang chiếu                  | Pass   
| 6  | Xem chi tiết phim    | TC_FILM_006  | Xem chi tiết phim                          | 1. Nhấn vào phim muốn xem                                                          | Không có     | Chi tiết thông tin phim | Chi tiết thông tin phim                 | Pass     


3. Test Case cho đặt ghế và xem lịch

##  Module: Đặt ghế

| STT | Mã Test Case | Mô Tả                          | Bước Thực Hiện                                              | Dữ Liệu Đầu Vào    | Kết Quả Mong Đợi                         | Kết Quả Thực Tế                          | Trạng Thái |
| --- | ------------ | ------------------------------ | ----------------------------------------------------------- | ------------------ | ---------------------------------------- | ---------------------------------------- | ---------- |
| 3   | TC_FILM_003  | Hiển thị danh sách ghế         | 1. Chọn suất chiếu bất kỳ đã đăng nhập                      | Suất chiếu đã chọn | Hiển thị danh sách ghế đầy đủ trạng thái | Hiển thị danh sách ghế đầy đủ trạng thái | Pass       |
| 4   | TC_FILM_004  | Đặt ghế                        | 1. Chọn ghế<br>2. Nhấn xác nhận                             | Ghế A1, A2         | Giữ ghế thành công                       | Giữ ghế thành công                       | Pass       |
| 5   | TC_FILM_005  | Thanh toán                     | 1. Chọn ghế<br>2. Nhấn xác nhận<br>3. Nhấn thanh toán       | Ghế A1, A2         | Thanh toán thành công                    | Thanh toán thành công                    | Pass       |
| 6   | TC_FILM_006  | Đặt ghế nhưng không thanh toán | 1. Chọn ghế<br>2. Nhấn xác nhận<br>3. Không nhấn thanh toán | Ghế bất kỳ         | Hủy giữ ghế sau một thời gian            | Hủy giữ ghế                              | Pass       |

##  Module: Lịch sử vé

| STT | Mã Test Case | Mô Tả                         | Bước Thực Hiện                                  | Dữ Liệu Đầu Vào  | Kết Quả Mong Đợi                         | Kết Quả Thực Tế                          | Trạng Thái |
| --- | ------------ | ----------------------------- | ----------------------------------------------- | ---------------- | ---------------------------------------- | ---------------------------------------- | ---------- |
| 1   | TC_TICKET_001  | Lịch sử vé đã đặt             | 1. Đăng nhập<br>2. Nhấn vào mục "Lịch sử vé"    | Tài khoản hợp lệ | Hiển thị các vé đã đặt                   | Hiển thị các vé đã đặt                   | Pass       |
| 2   | TC_TICKET_002      | Lịch sử vé khi chưa đăng nhập | 1. Nhấn vào mục "Lịch sử vé" khi chưa đăng nhập | Không đăng nhập  | Yêu cầu đăng nhập                        | Yêu cầu đăng nhập                        | Pass       |
| 3   | TC_TICKET_003  | Chi tiết vé                   | 1. Nhấn vào vé đã mua trong danh sách lịch sử   | Vé đã mua        | Hiển thị thông tin vé chi tiết + mã vạch | Hiển thị thông tin vé chi tiết + mã vạch | Pass       |

##  VI. Cách Chạy Dự Án

### Bước 1: Clone Project từ GitHub

    git clone <link github >

### Bước 2: Restore File Backup Data

- Sử dụng file backup để khôi phục dữ liệu.
- tạo Db (setup name , mk Db )
- sử dụng chức năng restore DB
- Đảm bảo database đã được import đúng cách PostgreSQL

### Bước 3: Cấu Hình Địa Chỉ IP

- Mở CMD hoặc PowerShell, gõ: ipconfig
- Lấy địa chỉ IPv4 của máy. Ví dụ: 192.168.1.214

### Bước 4: Cập Nhật API URL Trong Frontend

- Mở file: frontend/src/service/APIpath.js
- Cập nhật dòng sau: const API_BASE_URL = 'http://192.168.1.214:8000';
  -Thay 192.168.1.214 bằng địa chỉ IPv4 bạn vừa lấy ở bước 3.

### Bước 5: Chạy Dự Án

- Chạy backend

  - cd backend
  - python -m venv venv
  - .\venv\Scripts\activate # Đối với Windows
  - pip install -r requirements.txt

  - uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

- Chạy Frontend
  - cd mobile
  - npm install
  - npm start
- Sd expo Go để quét hoặc android studio
