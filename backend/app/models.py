from sqlalchemy import Column, Integer, String, Date, ForeignKey, Boolean
from .database import Base
import datetime

class ChuyenNganh(Base):
    __tablename__ = "chuyen_nganh"
    ma_cn = Column(String, primary_key=True)
    ten_cn = Column(String)
    mo_ta = Column(String)

class DauSach(Base):
    __tablename__ = "dau_sach"
    ma_dau_sach = Column(String, primary_key=True)
    ten_dau_sach = Column(String)
    nha_xb = Column(String)
    so_trang = Column(Integer)
    tac_gia = Column(String)
    ma_cn = Column(String, ForeignKey("chuyen_nganh.ma_cn"))

class BanSaoSach(Base):
    __tablename__ = "ban_sao_sach"
    ma_sach = Column(String, primary_key=True)
    ma_dau_sach = Column(String, ForeignKey("dau_sach.ma_dau_sach"))
    tinh_trang = Column(String, default="Sẵn sàng")

class DocGia(Base):
    __tablename__ = "doc_gia"
    ma_dg = Column(String, primary_key=True)
    ho_ten = Column(String)
    lop = Column(String)
    ngay_sinh = Column(Date)
    gioi_tinh = Column(String)

class PhieuMuon(Base):
    __tablename__ = "phieu_muon"
    id = Column(Integer, primary_key=True, autoincrement=True)
    ma_sach = Column(String, ForeignKey("ban_sao_sach.ma_sach"))
    ma_dg = Column(String, ForeignKey("doc_gia.ma_dg"))
    ma_thu_thu = Column(String)
    ngay_muon = Column(Date, default=datetime.date.today)
    da_tra = Column(Boolean, default=False)