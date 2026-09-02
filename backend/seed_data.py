"""Konten seed default untuk KKN-PLP Terpadu Kelompok 66. Gunakan placeholder, jangan mengarang identitas."""

TEAM_ROLES = [
    "Koordinator Kelompok",
    "Wakil Koordinator",
    "Sekretaris",
    "Bendahara",
    "Divisi Pendidikan",
    "Divisi Keagamaan",
    "Divisi Digitalisasi",
    "Divisi Sosial",
    "Divisi Lingkungan",
    "Divisi Pemberdayaan Masyarakat",
    "Anggota",
    "Anggota",
    "Anggota",
    "Anggota",
    "Anggota",
]


def team_members():
    return [
        {
            "name": "[NAMA ANGGOTA]",
            "nim": "[NIM]",
            "studyProgram": "[PROGRAM STUDI]",
            "role": TEAM_ROLES[i],
            "photo": "",
            "bio": "",
            "instagram": "",
            "whatsapp": "",
            "order": i + 1,
            "isActive": True,
        }
        for i in range(15)
    ]


def programs():
    data = [
        ("Pendidikan", "GraduationCap", "Mendukung kegiatan pembelajaran dan meningkatkan semangat belajar anak-anak serta masyarakat."),
        ("Kegiatan Keagamaan", "Moon", "Mendukung kegiatan keagamaan dan pembinaan masyarakat melalui berbagai aktivitas positif."),
        ("Digitalisasi", "Laptop", "Mendorong pemanfaatan teknologi digital untuk mendukung kebutuhan masyarakat."),
        ("Kegiatan Sosial", "HeartHandshake", "Membangun kepedulian dan kebersamaan melalui kegiatan sosial bersama masyarakat."),
        ("Lingkungan", "Leaf", "Mendorong kepedulian terhadap kebersihan, kelestarian, dan lingkungan sekitar."),
        ("Pemberdayaan Masyarakat", "Sprout", "Mendukung potensi masyarakat melalui kegiatan pemberdayaan dan pengembangan kapasitas."),
    ]
    return [
        {
            "title": t,
            "description": d,
            "icon": icon,
            "number": i + 1,
            "activities": [],
            "isActive": True,
            "order": i + 1,
        }
        for i, (t, icon, d) in enumerate(data)
    ]


def timeline():
    stages = [
        ("Datang", "Awal kedatangan dan pengenalan lingkungan masyarakat."),
        ("Observasi", "Mengenali kondisi, kebutuhan, potensi, dan karakteristik masyarakat."),
        ("Perencanaan", "Menyusun rencana kegiatan berdasarkan hasil observasi."),
        ("Pelaksanaan", "Melaksanakan berbagai program bersama masyarakat."),
        ("Kolaborasi", "Membangun kerja sama dan kebersamaan dengan berbagai pihak."),
        ("Evaluasi", "Melakukan evaluasi terhadap kegiatan dan hasil yang telah dicapai."),
        ("Penutupan", "Menutup rangkaian kegiatan dengan penuh rasa syukur dan kenangan."),
    ]
    return [
        {
            "number": f"{i + 1:02d}",
            "title": t,
            "description": d,
            "date": "",
            "image": "",
            "order": i + 1,
            "isActive": True,
        }
        for i, (t, d) in enumerate(stages)
    ]


def _slug(t):
    import re

    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")


def news():
    titles = [
        "Pembukaan Kelas Belajar Bersama Anak-Anak Desa",
        "Pendampingan TPQ Al-Hidayah Mendapat Antusiasme Masyarakat",
        "Kegiatan Kerja Bakti Bersama Menyambut Musim Hujan",
        "Pelatihan Digital Marketing bagi Pelaku UMKM",
        "Kegiatan Perayaan Budaya dan Keagamaan Bersama Masyarakat",
        "Penanaman 100 Bibit Pohon di Kawasan Konservasi Desa",
    ]
    cats = ["Pendidikan", "Kegiatan Keagamaan", "Lingkungan", "Digitalisasi", "Kegiatan Sosial", "Lingkungan"]
    return [
        {
            "title": t,
            "slug": _slug(t),
            "excerpt": "Cerita kegiatan akan diperbarui oleh administrator.",
            "content": "Isi artikel lengkap akan ditambahkan oleh administrator.",
            "coverImage": "",
            "category": cats[i],
            "location": "[NAMA DESA]",
            "publishedAt": "",
            "author": "KKN-PLP Terpadu Kelompok 66",
            "isPublished": True,
            "order": i + 1,
        }
        for i, t in enumerate(titles)
    ]


def archives():
    items = [
        ("Jadwal Kegiatan KKN", "schedule", "Calendar"),
        ("Jadwal Mengajar", "schedule", "BookOpen"),
        ("Laporan Harian", "document", "FileText"),
        ("Video After Movie", "video", "Film"),
        ("Video Profil Desa", "video", "Video"),
        ("Infografis Desa", "image", "Image"),
    ]
    return [
        {
            "title": t,
            "description": "Dokumen belum tersedia.",
            "type": typ,
            "url": "",
            "embedUrl": "",
            "icon": icon,
            "order": i + 1,
            "isActive": True,
        }
        for i, (t, typ, icon) in enumerate(items)
    ]


def memories():
    cats = [
        "Awal Perjalanan",
        "Bersama Perangkat Desa",
        "Bersama Siswa",
        "Kegiatan Keagamaan",
        "Pengabdian kepada Masyarakat",
        "Bersama Pelaku UMKM",
        "Malam Perpisahan",
        "Kenangan Bersama Masyarakat",
    ]
    return [
        {
            "title": c,
            "description": "",
            "category": c,
            "imageUrl": "",
            "storageKey": "",
            "order": i + 1,
            "isActive": True,
        }
        for i, c in enumerate(cats)
    ]


def location():
    return [
        {
            "village": "[NAMA DESA]",
            "district": "[KECAMATAN]",
            "regency": "[KABUPATEN]",
            "province": "[PROVINSI]",
            "address": "",
            "latitude": "",
            "longitude": "",
            "googleMapsUrl": "",
            "embedUrl": "",
            "order": 1,
            "isActive": True,
        }
    ]


def videos():
    return []


def gallery():
    return []


def settings():
    return {
        "siteName": "KKN-PLP Terpadu Kelompok 66",
        "university": "UIN K.H. Abdurrahman Wahid Pekalongan",
        "year": "2026",
        "tagline": "Hadirlah. Belajarlah. Mengabdilah.",
        "description": "Belajar bersama masyarakat, berkarya, dan mengabdi untuk memberikan kontribusi nyata.",
        "instagram": "",
        "tiktok": "",
        "youtube": "",
        "whatsapp": "",
        "email": "kknplpdesabanjarejo@gmail.com",
        "logo": "",
        "favicon": "",
    }


SEED_MAP = {
    "team_members": team_members,
    "programs": programs,
    "timeline": timeline,
    "news": news,
    "archives": archives,
    "memories": memories,
    "locations": location,
    "videos": videos,
    "gallery": gallery,
}
