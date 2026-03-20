from pydantic import BaseModel
from datetime import date
from typing import Optional

class DocGiaBase(BaseModel):
    ma_dg: str
    ho_ten: str
    lop: str
    ngay_sinh: date
    gioi_tinh: str

    class Config:
        from_attributes = True