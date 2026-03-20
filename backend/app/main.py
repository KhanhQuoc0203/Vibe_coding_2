from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, database
import datetime

app = FastAPI(title="Library Management System - KHDL19B")

# Cho phép React kết nối
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine)

# --- TỰ SINH DỮ LIỆU MẪU (SEED DATA) ---
@app.on_event("startup")
def startup_event():
    # Bước 1: Tạo bảng (nếu chưa có)
    models.Base.metadata.create_all(bind=database.engine)
    
    db = database.SessionLocal()
    try:
        # Bước 2: Kiểm tra và tạo Chuyên ngành
        if not db.query(models.ChuyenNganh).first():
            cn = models.ChuyenNganh(ma_cn="CNTT", ten_cn="Công nghệ thông tin", mo_ta="Sách chuyên ngành CNTT")
            db.add(cn)
            db.commit()

        # Bước 3: Kiểm tra và tạo Đầu sách + Bản sao
        if not db.query(models.DauSach).first():
            ds = models.DauSach(ma_dau_sach="PYTHON01", ten_dau_sach="Lập trình Python", tac_gia="Guido van Rossum", ma_cn="CNTT")
            db.add(ds)
            db.commit()
            
            # Tạo bản sao sách để mượn
            sach = models.BanSaoSach(ma_sach="PY-001", ma_dau_sach="PYTHON01", tinh_trang="Sẵn sàng")
            db.add(sach)
            db.commit()

        # Bước 4: Kiểm tra và tạo Độc giả (Thông tin của bạn)
        if not db.query(models.DocGia).filter(models.DocGia.ma_dg == "23711381").first():
            dg = models.DocGia(
                ma_dg="23711381", 
                ho_ten="Khuất Quốc Khánh", 
                lop="KHDL19B", 
                ngay_sinh=datetime.date(2004, 1, 1), 
                gioi_tinh="Nam"
            )
            db.add(dg)
            db.commit()
            
        print("✅ Đã khởi tạo dữ liệu mẫu thành công!")
    except Exception as e:
        print(f"❌ Lỗi khởi tạo: {e}")
    finally:
        db.close()

# --- API CHỨC NĂNG ---

@app.post("/muon-sach/")
def muon_sach(ma_dg: str, ma_sach: str, ma_tt: str = "Admin", db: Session = Depends(database.get_db)):
    # 1. Kiểm tra độc giả
    dg = db.query(models.DocGia).filter(models.DocGia.ma_dg == ma_dg).first()
    if not dg: raise HTTPException(404, "Mã độc giả không tồn tại!")
    
    # 2. Kiểm tra quy định: 1 người mượn 1 cuốn
    dang_muon = db.query(models.PhieuMuon).filter(models.PhieuMuon.ma_dg == ma_dg, models.PhieuMuon.da_tra == False).first()
    if dang_muon: raise HTTPException(400, "Bạn đang mượn 1 cuốn sách khác chưa trả!")

    # 3. Kiểm tra sách
    sach = db.query(models.BanSaoSach).filter(models.BanSaoSach.ma_sach == ma_sach, models.BanSaoSach.tinh_trang == "Sẵn sàng").first()
    if not sach: raise HTTPException(400, "Sách này hiện không có sẵn để mượn!")

    # 4. Thực hiện mượn
    new_phieu = models.PhieuMuon(ma_dg=ma_dg, ma_sach=ma_sach, ma_thu_thu=ma_tt)
    sach.tinh_trang = "Đang mượn"
    db.add(new_phieu)
    db.commit()
    return {"message": "Ghi nhận mượn sách thành công!"}

@app.get("/bao-cao/chua-tra")
def lay_bao_cao(db: Session = Depends(database.get_db)):
    # Query kết hợp 2 bảng để lấy tên độc giả
    results = db.query(models.PhieuMuon, models.DocGia).join(models.DocGia).filter(models.PhieuMuon.da_tra == False).all()
    return [{
        "id": p.id,
        "ma_dg": d.ma_dg,
        "ho_ten": d.ho_ten,
        "lop": d.lop,
        "ma_sach": p.ma_sach,
        "ngay_muon": p.ngay_muon
    } for p, d in results]