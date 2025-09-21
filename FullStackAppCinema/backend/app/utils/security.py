import jwt #lib để tạo tokken 
from datetime import datetime , timezone, timedelta # timedelta la xd khoang thoi gian het han
from  app.config import ACCESS_TOKEN_EXPIRE_MINUTES ,ALGORITHM,SECRET_KEY ,REFRESH_TOKEN_EXPIRE_DAYS

def create_acces_token(data : dict , expire_time : timedelta =None):
    to_encode = data.copy() # copy data de tranh loi len ban goc
    expire = datetime.now(timezone.utc) + (expire_time or timedelta(ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({expire: expire})
    # sd encode : jwt.encode(payload , key , algorithm , header , json_encode)
    return jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
def creat_refresh_token(data : dict , expire_time : timedelta= None ):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expire_time  or timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)



# def hash_password(password): 
#     salt = bcrypt.gensalt()
#     hashed_password = bcrypt.hashpw(password.encode("utf-8") , salt)
#     return hashed_password.decode("utf-8")
# def check_password(password ,hashed_password):
#     return bcrypt.checkpw(password.encode("utf-8") , hashed_password.encode("utf-8")) # chuyển đổ chuỗi thành bytes




#Áp dụng thuật toán bcrypt:

# Bcrypt sử dụng một biến thể của thuật toán Blowfish, cụ thể là EksBlowfish (viết tắt của “Expensive Key Schedule Blowfish”).
# Thuật toán này thực hiện quá trình xử lý mật khẩu và salt qua hàng trăm hoặc hàng nghìn vòng lặp (số vòng được xác định bởi cost factor).
# Trong mỗi vòng, mật khẩu và salt được “trộn” qua các bước tính toán phức tạp, tạo nên một kết quả mã hóa mà việc đảo ngược (tìm lại mật khẩu gốc) là không khả thi.
# def create_access_token(...): Đây là một hàm trong Python.

# data: dict:

# Kiểu dữ liệu (dict): data là một từ điển (dictionary), chứa thông tin cần mã hóa vào JWT.

# Ví dụ dữ liệu: {"sub": "admin", "role": "user"}

# expires_delta: timedelta = None:

# Kiểu dữ liệu (timedelta): Xác định khoảng thời gian token có hiệu lực.

# Giá trị mặc định (None): Nếu không truyền thời gian hết hạn, nó sẽ dùng ACCESS_TOKEN_EXPIRE_MINUTES.