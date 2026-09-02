"""Default seed content for KKN-PLP Group 66. Uses placeholders, never fabricates identities."""

TEAM_ROLES = [
    "Group Coordinator",
    "Vice Coordinator",
    "Secretary",
    "Treasurer",
    "Education Division",
    "Religious Division",
    "Digitalization Division",
    "Social Division",
    "Environment Division",
    "Community Development Division",
    "Member",
    "Member",
    "Member",
    "Member",
    "Member",
]


def team_members():
    return [
        {
            "name": "[MEMBER NAME]",
            "nim": "[STUDENT ID]",
            "studyProgram": "[STUDY PROGRAM]",
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
        ("Education", "GraduationCap", "Learning support and classes for village children and youth."),
        ("Religious Activities", "Moon", "Mentoring, TPQ support, and community religious programs."),
        ("Digitalization", "Laptop", "Digital literacy and technology enablement for the community."),
        ("Social Activities", "HeartHandshake", "Community engagement, events, and social solidarity programs."),
        ("Environment", "Leaf", "Environmental conservation, greening, and cleanliness initiatives."),
        ("Community Development", "Sprout", "Empowering local potential and sustainable village development."),
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
        ("Arrival", "Team arrival and initial placement in the community."),
        ("Observation", "Understanding the community, needs, and local potential."),
        ("Planning", "Designing programs together with community stakeholders."),
        ("Implementation", "Carrying out the planned community service programs."),
        ("Collaboration", "Working hand in hand with residents and local officials."),
        ("Evaluation", "Reflecting on outcomes and measuring community impact."),
        ("Closing", "Farewell, handover, and sustainability of the programs."),
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
        "Opening of Community Learning Classes for Village Children",
        "Al-Hidayah TPQ Mentoring Program Receives Enthusiastic Participation",
        "Community Clean-Up Activity Welcomes the Rainy Season",
        "Digital Marketing Training for Local MSME Entrepreneurs",
        "Community Cultural and Religious Celebration Filled with Competitions and Performances",
        "Planting 100 Tree Seedlings in the Village Conservation Area",
    ]
    cats = ["Education", "Religious Activities", "Environment", "Digitalization", "Social Activities", "Environment"]
    return [
        {
            "title": t,
            "slug": _slug(t),
            "excerpt": "Activity story will be updated by the administrator.",
            "content": "Full article content will be added by the administrator.",
            "coverImage": "",
            "category": cats[i],
            "location": "[VILLAGE NAME]",
            "publishedAt": "",
            "author": "KKN-PLP Group 66",
            "isPublished": True,
            "order": i + 1,
        }
        for i, t in enumerate(titles)
    ]


def archives():
    items = [
        ("KKN Activity Schedule", "schedule", "Calendar"),
        ("Teaching Schedule", "schedule", "BookOpen"),
        ("Daily Reports", "document", "FileText"),
        ("KKN After Movie", "video", "Film"),
        ("Village Profile Video", "video", "Video"),
        ("Village Infographic", "image", "Image"),
    ]
    return [
        {
            "title": t,
            "description": "This document has not been added yet.",
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
        "Beginning of the Journey",
        "With Village Officials",
        "With Students",
        "Religious Activities",
        "Community Service",
        "With Local Entrepreneurs",
        "Farewell Night",
        "Memories with the Community",
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
            "village": "[VILLAGE NAME]",
            "district": "[SUBDISTRICT]",
            "regency": "[REGENCY]",
            "province": "[PROVINCE]",
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
        "siteName": "KKN-PLP Integrated Group 66",
        "university": "UIN K.H. Abdurrahman Wahid Pekalongan",
        "year": "2026",
        "tagline": "Be Present. Learn. Serve.",
        "description": "Official website of KKN-PLP Integrated Group 66 of UIN K.H. Abdurrahman Wahid Pekalongan, 2026.",
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
