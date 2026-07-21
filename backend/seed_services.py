"""
Seed / upsert de servicios para CSD Good Services.

Uso:
    python seed_services.py

Requisitos:
- Correr desde la raíz del proyecto backend (donde está el paquete `app`),
  o ajustar el sys.path abajo si lo corrés desde otro lado.
- Usa la misma conexión que ya tiene configurada `app.database.session`.

Qué hace:
- Por cada servicio de la lista SERVICES, busca por `slug`.
  - Si existe: actualiza los campos (no toca is_active/is_featured/order
    si ya fueron editados a mano — ver comentario más abajo).
  - Si no existe: lo crea.
- Es idempotente: podés correrlo las veces que quieras.
"""

import sys
import os

# Si el script no está en la raíz del proyecto, descomentar y ajustar:
# sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database.session import SessionLocal

# Importamos TODOS los modelos de la app antes de tocar la base.
# SQLAlchemy resuelve relationship("NombreDeClase") como string en tiempo de
# mapeo, y necesita que cada clase referenciada ya esté registrada — sin
# importar todos los módulos de una, vas a ir viendo un KeyError distinto
# por cada modelo relacionado (Project, Category, User, etc.)
import app.models.service
import app.models.project
import app.models.category
import app.models.user
import app.models.blog
import app.models.quote
import app.models.appointment
import app.models.contact
import app.models.setting

from app.models.service import Service

SERVICES = [
    {
        "slug": "pintura",
        "color": "#2C6E9E",
        "order": 1,
        "title_en": "Painting",
        "title_es": "Pintura",
        "description_en": "Residential and commercial painting with flawless, lasting finishes.",
        "description_es": "Pintura residencial y comercial con acabados impecables y duraderos.",
        "long_description_en": (
            "We handle residential and commercial painting projects of every scale, "
            "from single rooms to full properties. Our team uses quality materials and "
            "modern techniques to deliver clean, even, long-lasting finishes, always "
            "meeting agreed timelines and paying close attention to every detail."
        ),
        "long_description_es": (
            "Realizamos proyectos de pintura residencial y comercial de todas las escalas, "
            "desde una habitación hasta propiedades completas. Nuestro equipo utiliza "
            "materiales de calidad y técnicas modernas para lograr acabados parejos y "
            "duraderos, cumpliendo siempre los tiempos acordados y cuidando cada detalle."
        ),
        "icon": "PaintRoller",
        "is_featured": True,
        "is_active": True,
    },
    {
        "slug": "remodelaciones",
        "color": "#D96E30",
        "order": 2,
        "title_en": "Remodeling & Renovations",
        "title_es": "Remodelaciones y Renovaciones",
        "description_en": "Complete renovations that transform homes and businesses.",
        "description_es": "Renovaciones completas que transforman hogares y negocios.",
        "long_description_en": (
            "From partial updates to full renovations, we help homeowners and businesses "
            "reimagine their spaces. Our team manages every phase of the project with "
            "clear communication, quality craftsmanship, and a focus on results that last."
        ),
        "long_description_es": (
            "Desde actualizaciones parciales hasta renovaciones completas, ayudamos a "
            "propietarios y negocios a reimaginar sus espacios. Nuestro equipo gestiona "
            "cada etapa del proyecto con comunicación constante, mano de obra de calidad "
            "y resultados duraderos."
        ),
        "icon": "Hammer",
        "is_featured": True,
        "is_active": True,
    },
    {
        "slug": "reparaciones",
        "color": "#4A7856",
        "order": 3,
        "title_en": "Repairs & Maintenance",
        "title_es": "Reparaciones y Mantenimiento",
        "description_en": "General repair and maintenance services you can rely on.",
        "description_es": "Servicios de reparación y mantenimiento general en los que puedes confiar.",
        "long_description_en": (
            "We provide general repair and maintenance services to keep your property "
            "in top condition. From small fixes to ongoing maintenance plans, our team "
            "responds promptly and works with the same attention to detail on every job."
        ),
        "long_description_es": (
            "Ofrecemos servicios de reparación y mantenimiento general para mantener tu "
            "propiedad en óptimas condiciones. Desde pequeños arreglos hasta planes de "
            "mantenimiento continuo, nuestro equipo responde con rapidez y cuida cada "
            "detalle en cada trabajo."
        ),
        "icon": "Wrench",
        "is_featured": False,
        "is_active": True,
    },
    {
        "slug": "limpieza",
        "color": "#3AA6A0",
        "order": 4,
        "title_en": "Cleaning Services",
        "title_es": "Servicios de Limpieza",
        "description_en": "General cleaning services for homes and businesses.",
        "description_es": "Servicios de limpieza general para hogares y negocios.",
        "long_description_en": (
            "We offer general cleaning services for homes, offices, and commercial "
            "spaces, helping our clients maintain clean, welcoming environments. As with "
            "all our services, we bring the same reliability and attention to detail to "
            "every job."
        ),
        "long_description_es": (
            "Ofrecemos servicios de limpieza general para hogares, oficinas y espacios "
            "comerciales, ayudando a nuestros clientes a mantener ambientes limpios y "
            "acogedores. Como en todos nuestros servicios, aplicamos la misma "
            "confiabilidad y atención al detalle en cada trabajo."
        ),
        "icon": "Sparkles",
        "is_featured": False,
        "is_active": True,
    },
    {
        "slug": "murales",
        "color": "#A6417D",
        "order": 5,
        "title_en": "Custom Murals",
        "title_es": "Murales Artísticos",
        "description_en": "Artistic, personalized murals that bring spaces to life.",
        "description_es": "Murales artísticos y personalizados que le dan vida a los espacios.",
        "long_description_en": (
            "We design and paint custom murals tailored to each client's vision, adding "
            "a unique artistic touch to homes, businesses, and commercial spaces. Every "
            "mural is created with care, from concept to final brushstroke."
        ),
        "long_description_es": (
            "Diseñamos y pintamos murales personalizados adaptados a la visión de cada "
            "cliente, agregando un toque artístico único a hogares, negocios y espacios "
            "comerciales. Cada mural se crea con dedicación, desde el concepto hasta el "
            "último trazo."
        ),
        "icon": "Palette",
        "is_featured": True,
        "is_active": True,
    },
    {
        "slug": "resina-epoxica",
        "color": "#8A6D3B",
        "order": 6,
        "title_en": "Epoxy Resin Finishes",
        "title_es": "Resina Epóxica",
        "description_en": "Decorative and functional epoxy resin finishes for floors, walls, and surfaces.",
        "description_es": "Acabados en resina epóxica decorativos y funcionales para pisos, paredes y superficies.",
        "long_description_en": (
            "We apply epoxy resin on floors, walls, tables, countertops, and other "
            "surfaces to create decorative and functional finishes. This modern "
            "technique combines durability with striking visual results, tailored to "
            "each client's style and needs."
        ),
        "long_description_es": (
            "Aplicamos resina epóxica en pisos, paredes, mesas, encimeras y otras "
            "superficies para crear acabados decorativos y funcionales. Esta técnica "
            "moderna combina durabilidad con resultados visuales impactantes, adaptados "
            "al estilo y necesidades de cada cliente."
        ),
        "icon": "Droplet",
        "is_featured": False,
        "is_active": True,
    },
]


def run():
    db = SessionLocal()
    created, updated = 0, 0
    try:
        for data in SERVICES:
            existing = db.query(Service).filter(Service.slug == data["slug"]).first()
            if existing:
                for field, value in data.items():
                    setattr(existing, field, value)
                updated += 1
                print(f"  ↻ actualizado: {data['slug']}")
            else:
                db.add(Service(**data))
                created += 1
                print(f"  + creado: {data['slug']}")

        db.commit()
        print(f"\nListo. Creados: {created} | Actualizados: {updated}")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run()