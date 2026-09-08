CATATAN PENGEMBANGAN
09-09-2026 00.30

BMTC Digital Platform --- Project Handoff & Update Log

Tanggal update: 2026-09-08 malam

Status Proyek

BMTC Digital Platform menjadi repository utama.

Repository aktif: - bmtc-digital-platform

Repository lama: - bold-after-dark-scanner (archive, tidak digunakan
untuk development aktif)

Arsitektur

BMTC DIGITAL PLATFORM

Finance Module

Keuangan club

Kas

Laporan finance

Audit finance

Event Module

BOLD AFTER DARK

Registration

Purchase

Payment

Raffle

Scanner

Reporting

Keputusan Penting

Finance Module dikunci.

Tidak dilakukan perubahan pada: - finance database - finance report -
finance dashboard - transaksi club

Event Module dibuat terpisah secara konsep.

Update Supabase Malam Ini

1. Events Table

Berhasil dibuat:

events

Tujuan: - membuat sistem event reusable - mendukung event lain di masa
depan

Data aktif:

event_code: BAD2026

event_name: BOLD AFTER DARK 2026

status: active

2. Products Table

Berhasil dibuat:

products

Tujuan: mengubah konsep single product menjadi product master.

Konsep:

products: - id - event_id - product_code - product_name - unit_name -
price - active status

Testing product: - TS001 --- T-Shirt BOLD - HD001 --- Hoodie BOLD

3. Purchases

Berhasil ditambahkan hubungan:

purchases.event_id

Tujuan: setiap transaksi memiliki identitas event.

Temuan Database Existing

Ditemukan bahwa tabel purchase_items sudah ada.

Struktur:

id

purchase_id

item_type

variant

size

sleeve_type

quantity

unit_price

subtotal

created_at

Kesimpulan:

Tidak membuat purchase_items baru.

Strategi:

Upgrade struktur existing.

Status Saat Ini

Selesai:

✓ Repository utama ditentukan ✓ Finance dipisahkan ✓ Events master
dibuat ✓ Products master dibuat ✓ Purchases terhubung event ✓ Purchase
items existing ditemukan

Tahap Berikutnya

Product Mapping

Tujuan:

Menghubungkan:

purchase_items.item_type

ke:

products.product_code

Kemudian menambahkan hubungan:

purchase_items.product_id

Setelah Mapping

Lanjut:

Product Management Admin

Multi product checkout

Scanner detail pembelian

Distribusi barang

Recovery handling scanner

Catatan Pengembangan

Prinsip:

Perubahan bertahap

Setiap tahap memiliki checkpoint

Jangan menyentuh finance

Jangan membuat duplikasi tabel

Audit struktur existing sebelum migrasi
