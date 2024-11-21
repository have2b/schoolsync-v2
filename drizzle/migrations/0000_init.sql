CREATE TYPE "public"."HOCVI" AS ENUM('CU NHAN', 'THAC SI', 'TIEN SI', 'PHO GIAO SU', 'GIAO SU');--> statement-breakpoint
CREATE TYPE "public"."GIOITINH" AS ENUM('NAM', 'NU', 'KHAC');--> statement-breakpoint
CREATE TYPE "public"."VAITRO" AS ENUM('SINH VIEN', 'GIANG VIEN', 'QUAN TRI');--> statement-breakpoint
CREATE TYPE "public"."HOCKY" AS ENUM('HOC KY I', 'HOC KY II');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TAIKHOAN" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"TenTK" varchar(255) NOT NULL,
	"Email" varchar(100) NOT NULL,
	"MatKhau" text NOT NULL,
	"HoTen" varchar(100) NOT NULL,
	"NgaySinh" date NOT NULL,
	"GioiTinh" "GIOITINH" DEFAULT 'NAM',
	"DiaChi" varchar(255) NOT NULL,
	"DienThoai" varchar(11) NOT NULL,
	"Vaitro" "VAITRO" DEFAULT 'SINH VIEN',
	"Avatar" varchar(255),
	"LanDauDangNhap" boolean DEFAULT true,
	"DaXoa" boolean DEFAULT false,
	"NgayXoa" date,
	"NgayTao" date DEFAULT now(),
	"NgayCapNhat" date DEFAULT now(),
	CONSTRAINT "TAIKHOAN_TenTK_unique" UNIQUE("TenTK"),
	CONSTRAINT "TAIKHOAN_Email_unique" UNIQUE("Email"),
	CONSTRAINT "TAIKHOAN_DienThoai_unique" UNIQUE("DienThoai")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "LOPHC" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"MaLHC" varchar(10) NOT NULL,
	"TenLHC" varchar(100) NOT NULL,
	"SoLuong" smallint NOT NULL,
	"DaXoa" boolean DEFAULT false,
	"NgayXoa" date,
	"MaGV" uuid,
	"MaKhoa" uuid,
	"NgayTao" date DEFAULT now(),
	"NgayCapNhat" date DEFAULT now(),
	CONSTRAINT "LOPHC_MaLHC_unique" UNIQUE("MaLHC"),
	CONSTRAINT "LOPHC_TenLHC_unique" UNIQUE("TenLHC")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "HOCPHAN" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"MaHP" varchar(10) NOT NULL,
	"TenHP" varchar(100) NOT NULL,
	"SoTC" smallint DEFAULT 0 NOT NULL,
	"SoTiet" smallint DEFAULT 0 NOT NULL,
	"DaXoa" boolean DEFAULT false,
	"NgayXoa" date,
	"NgayTao" date DEFAULT now(),
	"NgayCapNhat" date DEFAULT now(),
	CONSTRAINT "HOCPHAN_MaHP_unique" UNIQUE("MaHP"),
	CONSTRAINT "HOCPHAN_TenHP_unique" UNIQUE("TenHP")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "KHOA" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"MaKhoa" varchar(10) NOT NULL,
	"TenKhoa" varchar(100) NOT NULL,
	"MoTa" text,
	"DaXoa" boolean DEFAULT false,
	"NgayXoa" date,
	"NgayTao" date DEFAULT now(),
	"NgayCapNhat" date DEFAULT now(),
	CONSTRAINT "KHOA_MaKhoa_unique" UNIQUE("MaKhoa"),
	CONSTRAINT "KHOA_TenKhoa_unique" UNIQUE("TenKhoa")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "DIEM" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"MaSV" uuid,
	"MaLHP" uuid,
	"DiemCC" real DEFAULT 0,
	"DiemKT1" real DEFAULT 0,
	"DiemKT2" real DEFAULT 0,
	"DiemTL" real DEFAULT 0,
	"DiemThi" real DEFAULT 0,
	"DaXoa" boolean DEFAULT false,
	"NgayXoa" date,
	"NgayTao" date DEFAULT now(),
	"NgayCapNhat" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "LOPHP" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"MaLHP" varchar(10) NOT NULL,
	"TenLHP" varchar(100) NOT NULL,
	"SoLuong" smallint NOT NULL,
	"HocKy" "HOCKY" DEFAULT 'HOC KY I' NOT NULL,
	"NamHoc" varchar(10) NOT NULL,
	"NgayBD" date NOT NULL,
	"NgayKT" date NOT NULL,
	"DaXoa" boolean DEFAULT false,
	"NgayXoa" date,
	"MaHP" uuid,
	"MaGV" uuid,
	"NgayTao" date DEFAULT now(),
	"NgayCapNhat" date DEFAULT now(),
	CONSTRAINT "LOPHP_MaLHP_unique" UNIQUE("MaLHP"),
	CONSTRAINT "LOPHP_TenLHP_unique" UNIQUE("TenLHP")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SINHVIEN" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"MaSV" varchar(10) NOT NULL,
	"MaTK" uuid,
	"MaLHC" uuid,
	"NgayTao" date DEFAULT now(),
	"NgayCapNhat" date DEFAULT now(),
	CONSTRAINT "SINHVIEN_MaSV_unique" UNIQUE("MaSV")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "GIANGVIEN" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"MaGV" varchar(10) NOT NULL,
	"HocVi" "HOCVI" DEFAULT 'CU NHAN',
	"ChuyenNganh" varchar(100) NOT NULL,
	"MaTK" uuid,
	"MaKhoa" uuid,
	"NgayTao" date DEFAULT now(),
	"NgayCapNhat" date DEFAULT now(),
	CONSTRAINT "GIANGVIEN_MaGV_unique" UNIQUE("MaGV")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "LOPHC" ADD CONSTRAINT "LOPHC_MaGV_GIANGVIEN_id_fk" FOREIGN KEY ("MaGV") REFERENCES "public"."GIANGVIEN"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "LOPHC" ADD CONSTRAINT "LOPHC_MaKhoa_KHOA_id_fk" FOREIGN KEY ("MaKhoa") REFERENCES "public"."KHOA"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DIEM" ADD CONSTRAINT "DIEM_MaSV_SINHVIEN_id_fk" FOREIGN KEY ("MaSV") REFERENCES "public"."SINHVIEN"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DIEM" ADD CONSTRAINT "DIEM_MaLHP_LOPHP_id_fk" FOREIGN KEY ("MaLHP") REFERENCES "public"."LOPHP"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "LOPHP" ADD CONSTRAINT "LOPHP_MaHP_HOCPHAN_id_fk" FOREIGN KEY ("MaHP") REFERENCES "public"."HOCPHAN"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "LOPHP" ADD CONSTRAINT "LOPHP_MaGV_GIANGVIEN_id_fk" FOREIGN KEY ("MaGV") REFERENCES "public"."GIANGVIEN"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SINHVIEN" ADD CONSTRAINT "SINHVIEN_MaTK_TAIKHOAN_id_fk" FOREIGN KEY ("MaTK") REFERENCES "public"."TAIKHOAN"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SINHVIEN" ADD CONSTRAINT "SINHVIEN_MaLHC_LOPHC_id_fk" FOREIGN KEY ("MaLHC") REFERENCES "public"."LOPHC"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "GIANGVIEN" ADD CONSTRAINT "GIANGVIEN_MaTK_TAIKHOAN_id_fk" FOREIGN KEY ("MaTK") REFERENCES "public"."TAIKHOAN"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "GIANGVIEN" ADD CONSTRAINT "GIANGVIEN_MaKhoa_KHOA_id_fk" FOREIGN KEY ("MaKhoa") REFERENCES "public"."KHOA"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
