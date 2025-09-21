import cloudinary
import app.uploads
from fastapi import APIRouter, UploadFile, File, HTTPException
import os

# Cấu hình Cloudinary
cloudinary.config(
    cloud_name="dkwvlimht",  # Thay bằng cloud_name của bạn
    api_key="235743718261541",        # Thay bằng API key của bạn
    api_secret="1hsrJZvtkiZCqKVxujlP4dsmZT8",  # Thay bằng API secret của bạn
)

router = APIRouter()

@router.post("/upload_image/")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Lưu tệp ảnh tạm thời
        temp_file_path = f"./temp_{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            buffer.write(file.file.read())

        # Upload ảnh lên Cloudinary và lấy URL
        result = cloudinary.uploader.upload(temp_file_path)
        image_url = result["secure_url"]

        # Xoá file tạm sau khi upload
        os.remove(temp_file_path)

        return {"image_url": image_url}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi tải ảnh lên: {str(e)}")