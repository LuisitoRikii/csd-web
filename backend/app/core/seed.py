from sqlalchemy.orm import Session
from app.database.session import SessionLocal, Base
import app.database.base  # noqa: F401  (ensures all models are registered with Base)
from app.models.user import User
from app.models.service import Service, ServiceProject
from app.models.category import Category
from app.models.project import Project, ProjectImage
from app.models.setting import SiteSettings
from app.models.blog import BlogPost
from app.core.security import get_password_hash
from app.core.config import settings
from datetime import datetime
import json

# All Unsplash images verified 200 OK for the CSD Good Services site.
# These are real photos of murals, painting, epoxy, remodeling and interiors.

HERO_FALLBACK = "https://images.unsplash.com/photo-1559563458-527698bf5295?w=2400&auto=format&fit=crop&q=85"
ABOUT_IMAGE = "https://images.unsplash.com/photo-1561409037-c7be81613c1f?w=1600&auto=format&fit=crop&q=85"


# === Site-wide home content (stored as JSON in SiteSettings) ===

MARQUEE_ITEMS = [
    "Interior Painting",
    "Exterior Painting",
    "Bathroom Remodeling",
    "Kitchen Remodeling",
    "Window Cleaning",
    "Pressure Washing",
    "Pool Cleaning",
    "Ceiling Cleaning",
    "Property Maintenance",
    "Drywall Repairs",
]

WHY_US_REASONS = [
    {
        "icon": "Users",
        "title_en": "One trusted team",
        "title_es": "Un equipo de confianza",
        "body_en": "The same professional crew shows up every time. You get to know them, and they get to know your home.",
        "body_es": "El mismo equipo profesional viene cada vez. Los conoces y conocen tu casa.",
    },
    {
        "icon": "Clock4",
        "title_en": "Reliable timing",
        "title_es": "Puntualidad confiable",
        "body_en": "Scheduled visits, on-time arrivals, and clear timelines. We tell you when something changes.",
        "body_es": "Visitas programadas, llegadas puntuales y plazos claros. Te avisamos si algo cambia.",
    },
    {
        "icon": "Wallet",
        "title_en": "Transparent pricing",
        "title_es": "Precios transparentes",
        "body_en": "Clear quotes, no hidden fees. You approve any change before we do it.",
        "body_es": "Cotizaciones claras, sin cargos ocultos. Apruebas cualquier cambio antes de hacerlo.",
    },
]

PROCESS_STEPS = [
    {
        "title_en": "Consultation",
        "title_es": "Consulta",
        "desc_en": "We visit the space, listen to what you need and document the scope. Free of charge.",
        "desc_es": "Vamos al espacio, escuchamos lo que necesitas y documentamos el alcance. Sin costo.",
        "icon": "ClipboardList",
        "color": "#91F2D7",
        "tone": "mint",
    },
    {
        "title_en": "Detailed quote",
        "title_es": "Cotización detallada",
        "desc_en": "A clear quote with timeline, materials and what's included. You know exactly what to expect.",
        "desc_es": "Cotización clara con plazos, materiales y qué incluye. Sabes exactamente qué esperar.",
        "icon": "FileText",
        "color": "#8A04F0",
        "tone": "violet",
    },
    {
        "title_en": "Work day",
        "title_es": "Jornada de trabajo",
        "desc_en": "Professional crew, daily progress, clean job site. You know what's happening every day.",
        "desc_es": "Cuadrilla profesional, avance diario, obra limpia. Sabes qué está pasando cada día.",
        "icon": "Hammer",
        "color": "#D925A9",
        "tone": "magenta",
    },
    {
        "title_en": "Walkthrough",
        "title_es": "Recorrido final",
        "desc_en": "We inspect the work together, close the punch list and hand over warranty documents.",
        "desc_es": "Revisamos el trabajo juntos, cerramos pendientes y entregamos garantía y documentos.",
        "icon": "CheckCircle2",
        "color": "#91F2D7",
        "tone": "mint",
    },
]

BEFORE_AFTER_PAIRS = [
    {
        "key": "kitchen",
        "tag": "tag_kitchen",
        "title_en": "Pinecrest kitchen",
        "title_es": "Cocina en Pinecrest",
        "before": "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&auto=format&fit=crop&q=85",
        "after": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop&q=85",
        "scope_en": "Full layout rework · cabinets · island · quartz",
        "scope_es": "Reestructuración completa · gabinetes · isla · cuarzo",
    },
    {
        "key": "bathroom",
        "tag": "tag_bathroom",
        "title_en": "Aventura primary bath",
        "title_es": "Baño principal en Aventura",
        "before": "https://images.unsplash.com/photo-1556909190-3c0e6ad26c78?w=1200&auto=format&fit=crop&q=85",
        "after": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&auto=format&fit=crop&q=85",
        "scope_en": "Walk-in shower · porcelain tile · custom vanity",
        "scope_es": "Ducha walk-in · porcelanato · vanidad a medida",
    },
    {
        "key": "exterior",
        "tag": "tag_exterior",
        "title_en": "Coral Gables facade",
        "title_es": "Fachada en Coral Gables",
        "before": "https://images.unsplash.com/photo-1580587771525-78b9d27a32cc?w=1200&auto=format&fit=crop&q=85",
        "after": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&auto=format&fit=crop&q=85",
        "scope_en": "Exterior repaint · wood repair · new entry detail",
        "scope_es": "Pintura exterior · reparación de madera · nuevo acceso",
    },
    {
        "key": "living",
        "tag": "tag_living",
        "title_en": "Coconut Grove living",
        "title_es": "Sala en Coconut Grove",
        "before": "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&auto=format&fit=crop&q=85",
        "after": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop&q=85",
        "scope_en": "Open-concept reconfiguration · new flooring · paint",
        "scope_es": "Reconfiguración abierta · nuevo piso · pintura",
    },
    {
        "key": "bedroom",
        "tag": "tag_bedroom",
        "title_en": "Brickell guest bedroom",
        "title_es": "Habitación en Brickell",
        "before": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop&q=85",
        "after": "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&auto=format&fit=crop&q=85",
        "scope_en": "Drywall finishing · paint · custom closet",
        "scope_es": "Acabado de drywall · pintura · clóset a medida",
    },
]

VIDEOS_LIST = [
    {
        "id": "kitchen",
        "label_en": "Kitchen Remodel · Time-lapse",
        "label_es": "Remodelación de Cocina · Time-lapse",
        "poster": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&auto=format&fit=crop&q=85",
        "src": "https://cdn.pixabay.com/video/2022/03/27/113049-693920814_large.mp4",
    },
    {
        "id": "painting",
        "label_en": "Exterior Repaint · Crew at Work",
        "label_es": "Pintura Exterior · Equipo en Obra",
        "poster": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1600&auto=format&fit=crop&q=85",
        "src": "https://cdn.pixabay.com/video/2020/03/27/34125-399680914_large.mp4",
    },
    {
        "id": "construction",
        "label_en": "Foundation to Finish · Walkthrough",
        "label_es": "De Cimientos a Acabados · Recorrido",
        "poster": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=85",
        "src": "https://cdn.pixabay.com/video/2018/11/25/19449-303154154_large.mp4",
    },
]

PROMISE_LEFT_IMAGES = [
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1561409037-c7be81613c1f?w=1200&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&auto=format&fit=crop&q=85",
]

PROMISE_RIGHT_IMAGES = [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=85",
]

HOME_ABOUT_QUOTE_EN = '"One team for everything your home needs. Painting, remodeling, cleaning and maintenance — coordinated, reliable, easy."'
HOME_ABOUT_QUOTE_ES = '"Un equipo para todo lo que tu hogar necesita. Pintura, remodelación, limpieza y mantenimiento — coordinado, confiable y fácil."'

HOME_ABOUT_SIDE_NOTE_EN = (
    "Today we offer painting, remodeling, deep cleaning and ongoing home maintenance — "
    "for homeowners, property managers and businesses across Miami-Dade and Broward. "
    "One team, one schedule, one number to call."
)

HOME_ABOUT_SIDE_NOTE_ES = (
    "Hoy ofrecemos pintura, remodelación, limpieza profunda y mantenimiento continuo del hogar — "
    "para propietarios, administradores de propiedades y negocios en Miami-Dade y Broward. "
    "Un equipo, un cronograma, un número para llamar."
)


def seed_data():
    db = SessionLocal()
    try:
        _seed_admin(db)
        _seed_categories(db)
        _seed_services(db)
        _seed_projects(db)
        _seed_service_projects(db)
        _seed_blog(db)
        _seed_settings(db)
        db.commit()
        print("✓ Seed data completed successfully")
    except Exception as e:
        print(f"✗ Seed error: {e}")
        db.rollback()
    finally:
        db.close()


def _seed_admin(db: Session):
    if db.query(User).filter(User.email == settings.ADMIN_EMAIL).first():
        return
    admin = User(
        email=settings.ADMIN_EMAIL,
        full_name="CSD Administrator",
        hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
        role="admin",
        is_active=True,
    )
    db.add(admin)


def _seed_categories(db: Session):
    categories = [
        {"slug": "painting", "name_en": "Painting", "name_es": "Pintura", "icon": "Paintbrush", "color": "#06B6D4", "order": 1, "description_en": "Professional interior & exterior painting", "description_es": "Pintura profesional interior y exterior"},
        {"slug": "cleaning", "name_en": "Cleaning", "name_es": "Limpieza", "icon": "Sparkle", "color": "#0EA5E9", "order": 2, "description_en": "Professional cleaning services", "description_es": "Servicios profesionales de limpieza"},
        {"slug": "remodeling", "name_en": "Remodeling", "name_es": "Remodelación", "icon": "Hammer", "color": "#F97316", "order": 3, "description_en": "Complete space transformations", "description_es": "Transformación completa de espacios"},
        {"slug": "murals", "name_en": "Murals", "name_es": "Murales", "icon": "Palette", "color": "#D946EF", "order": 4, "description_en": "Custom artistic murals", "description_es": "Murales artísticos personalizados"},
        {"slug": "epoxy", "name_en": "Epoxy", "name_es": "Resina Epóxica", "icon": "Sparkles", "color": "#8B5CF6", "order": 5, "description_en": "Epoxy flooring, walls & countertops", "description_es": "Pisos, paredes y mesones de resina epóxica"},
    ]
    for cat in categories:
        if not db.query(Category).filter(Category.slug == cat["slug"]).first():
            db.add(Category(**cat))


def _seed_services(db: Session):
    services = [
        {
            "slug": "residential-painting",
            "title_en": "Residential Painting",
            "title_es": "Pintura Residencial",
            "description_en": "Interior and exterior painting for homes — repaints, color changes, accent walls and full finish work.",
            "description_es": "Pintura interior y exterior para hogares — repintados, cambios de color, paredes de acento y acabados completos.",
            "long_description_en": "From a single accent wall to a full home repaint, we handle interior and exterior residential painting with meticulous prep, premium materials and clean job sites. Same crew, on time.",
            "long_description_es": "Desde una pared de acento hasta un repintado completo, manejamos pintura residencial interior y exterior con preparación minuciosa, materiales premium y obras limpias. La misma cuadrilla, a tiempo.",
            "icon": "Home",
            "image_url": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop&q=85",
            "long_image_url": "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&auto=format&fit=crop&q=85",
            "color": "#06B6D4",
            "order": 1,
            "is_featured": True,
        },
        {
            "slug": "commercial-painting",
            "title_en": "Commercial Painting",
            "title_es": "Pintura Comercial",
            "description_en": "Interior and exterior painting for offices, restaurants, retail and commercial properties.",
            "description_es": "Pintura interior y exterior para oficinas, restaurantes, locales y propiedades comerciales.",
            "long_description_en": "Office repaints, restaurant refreshes, retail buildouts — scheduled around your business hours with minimal disruption.",
            "long_description_es": "Repintados de oficinas, refrescos de restaurantes, montajes de locales — programados alrededor del horario de tu negocio con mínima interrupción.",
            "icon": "Building2",
            "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=85",
            "long_image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=85",
            "color": "#0EA5E9",
            "order": 2,
            "is_featured": True,
        },
        {
            "slug": "professional-cleaning",
            "title_en": "Professional Cleaning",
            "title_es": "Limpieza Profesional",
            "description_en": "Deep, detail-focused cleaning for homes, offices, retail and investment properties.",
            "description_es": "Limpieza profunda y detallada para hogares, oficinas, locales y propiedades de inversión.",
            "long_description_en": "Weekly, bi-weekly, monthly or one-time deep cleaning. Professional equipment, eco-friendly products, and the same reliable crew each visit.",
            "long_description_es": "Limpieza semanal, quincenal, mensual o de una vez. Equipo profesional, productos ecológicos y la misma cuadrilla confiable en cada visita.",
            "icon": "Sparkle",
            "image_url": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&auto=format&fit=crop&q=85",
            "long_image_url": "https://images.unsplash.com/photo-1628177142898-93e36e04e130?w=1200&auto=format&fit=crop&q=85",
            "color": "#06B6D4",
            "order": 3,
            "is_featured": True,
        },
        {
            "slug": "window-cleaning",
            "title_en": "Window Cleaning",
            "title_es": "Limpieza de Ventanas",
            "description_en": "Streak-free window cleaning for homes, offices, storefronts and high-rise exteriors.",
            "description_es": "Limpieza de ventanas sin rayas para hogares, oficinas, fachadas y exteriores en altura.",
            "long_description_en": "Interior glass, exterior glass, storefronts and high-access windows. Professional squeegee work, pure water systems for spot-free results.",
            "long_description_es": "Vidrio interior, vidrio exterior, fachadas y ventanas de difícil acceso. Trabajo profesional con escobilla, sistemas de agua pura para resultados sin manchas.",
            "icon": "Droplets",
            "image_url": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&auto=format&fit=crop&q=85",
            "long_image_url": "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=1200&auto=format&fit=crop&q=85",
            "color": "#0EA5E9",
            "order": 4,
            "is_featured": True,
        },
        {
            "slug": "ceiling-cleaning",
            "title_en": "Ceiling Cleaning",
            "title_es": "Limpieza de Techos",
            "description_en": "Deep cleaning of ceilings, high beams, vents and hard-to-reach overhead surfaces.",
            "description_es": "Limpieza profunda de techos, vigas altas, ductos y superficies elevadas de difícil acceso.",
            "long_description_en": "Cobwebs, dust, smoke residue, vents and lighting fixtures — safely cleaned using lifts, ladders and pro equipment.",
            "long_description_es": "Telarañas, polvo, residuos de humo, ductos y luminarias — limpiados de forma segura con plataformas, escaleras y equipo profesional.",
            "icon": "Wind",
            "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop&q=85",
            "long_image_url": "https://images.unsplash.com/photo-1527515637462-cff94bdccd47?w=1200&auto=format&fit=crop&q=85",
            "color": "#22D3EE",
            "order": 5,
        },
        {
            "slug": "pool-cleaning",
            "title_en": "Pool Cleaning",
            "title_es": "Limpieza de Piscinas",
            "description_en": "Routine pool cleaning, water balancing and seasonal care for residential pools.",
            "description_es": "Limpieza rutinaria de piscinas, balance del agua y cuidado estacional para piscinas residenciales.",
            "long_description_en": "Weekly or bi-weekly visits: skimming, vacuuming, tile brushing, filter checks and full chemical balancing so your pool stays ready year-round.",
            "long_description_es": "Visitas semanales o quincenales: skimming, aspirado, cepillado de azulejos, revisión de filtros y balance químico completo para que tu piscina esté lista todo el año.",
            "icon": "Waves",
            "image_url": "https://images.unsplash.com/photo-1572331165267-854da2b64206?w=1200&auto=format&fit=crop&q=85",
            "long_image_url": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=85",
            "color": "#06B6D4",
            "order": 6,
        },
        {
            "slug": "pressure-washing",
            "title_en": "Pressure Washing",
            "title_es": "Hidrolavado",
            "description_en": "Driveways, patios, decks, pool decks, sidewalks and exterior walls cleaned and restored.",
            "description_es": "Driveways, patios, decks, terrazas de piscina, aceras y muros exteriores limpios y restaurados.",
            "long_description_en": "Commercial-grade pressure washing that removes years of grime, mildew and stains from concrete, pavers, wood, fences and stucco — without damaging surfaces.",
            "long_description_es": "Hidrolavado de grado comercial que remueve años de mugre, moho y manchas de concreto, adoquines, madera, cercas y estuco — sin dañar las superficies.",
            "icon": "SprayCan",
            "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop&q=85",
            "long_image_url": "https://images.unsplash.com/photo-1581579188871-45ea61f2a0c8?w=1200&auto=format&fit=crop&q=85",
            "color": "#0EA5E9",
            "order": 7,
            "is_featured": True,
        },
        {
            "slug": "bathroom-remodeling",
            "title_en": "Bathroom Remodeling",
            "title_es": "Remodelación de Baños",
            "description_en": "Complete bathroom renovations — tile, plumbing, fixtures, vanities and finishes.",
            "description_es": "Renovaciones completas de baño — azulejo, plomería, accesorios, vanidades y acabados.",
            "long_description_en": "From a quick refresh to a full gut renovation. Demolition, plumbing, electrical, tile, waterproofing, vanities, glass enclosures and finishes — coordinated by one team.",
            "long_description_es": "Desde un refresh rápido hasta una renovación completa. Demolición, plomería, electricidad, azulejo, impermeabilización, vanidades, cerramientos de vidrio y acabados — coordinado por un solo equipo.",
            "icon": "Bath",
            "image_url": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&auto=format&fit=crop&q=85",
            "long_image_url": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop&q=85",
            "color": "#F97316",
            "order": 8,
            "is_featured": True,
        },
        {
            "slug": "kitchen-remodeling",
            "title_en": "Kitchen Remodeling",
            "title_es": "Remodelación de Cocinas",
            "description_en": "Cabinetry, countertops, islands, tile, lighting and full kitchen renovations.",
            "description_es": "Gabinetes, mesones, islas, azulejo, iluminación y remodelaciones completas de cocina.",
            "long_description_en": "Custom cabinetry, stone or quartz countertops, tile backsplashes, lighting upgrades, appliance installs and layout reconfiguration — handled start to finish.",
            "long_description_es": "Gabinetes a medida, mesones de piedra o cuarzo, backsplashes de azulejo, actualización de iluminación, instalación de electrodomésticos y reconfiguración del layout — manejado de principio a fin.",
            "icon": "ChefHat",
            "image_url": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop&q=85",
            "long_image_url": "https://images.unsplash.com/photo-1556909190-3c0e6ad26c78?w=1200&auto=format&fit=crop&q=85",
            "color": "#FB923C",
            "order": 9,
            "is_featured": True,
        },
        {
            "slug": "remodeling",
            "title_en": "Remodeling",
            "title_es": "Remodelación",
            "description_en": "Full-home renovations, additions, layout changes and complete transformations.",
            "description_es": "Renovaciones completas de hogar, ampliaciones, cambios de distribución y transformaciones integrales.",
            "long_description_en": "Whole-home remodels, layout reconfiguration, additions and major repairs — demolition through finish, coordinated by a single project lead.",
            "long_description_es": "Remodelaciones completas de hogar, reconfiguración de layout, ampliaciones y reparaciones mayores — desde demolición hasta acabado, coordinado por un solo líder de proyecto.",
            "icon": "Hammer",
            "image_url": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&auto=format&fit=crop&q=85",
            "long_image_url": "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&auto=format&fit=crop&q=85",
            "color": "#F97316",
            "order": 10,
            "is_featured": True,
        },
        {
            "slug": "general-repairs",
            "title_en": "Drywall & General Repairs",
            "title_es": "Drywall y Reparaciones Generales",
            "description_en": "Drywall patches, door and trim fixes, caulking, grout repairs and small jobs.",
            "description_es": "Parches de drywall, arreglos de puertas y molduras, sellado, reparaciones de fragua y trabajos pequeños.",
            "long_description_en": "Small jobs done the same week. Drywall patches, door adjustments, caulking, grout, tile replacement, fixture swaps and trim touch-ups.",
            "long_description_es": "Trabajos pequeños atendidos en la misma semana. Parches de drywall, ajustes de puertas, sellado, fragua, reemplazo de azulejo, cambio de accesorios y retoques de molduras.",
            "icon": "Wrench",
            "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop&q=85",
            "color": "#0EA5E9",
            "order": 11,
        },
        {
            "slug": "property-maintenance",
            "title_en": "Property Maintenance",
            "title_es": "Mantenimiento del Hogar",
            "description_en": "Recurring maintenance plans for homes, rentals and investment properties.",
            "description_es": "Planes de mantenimiento recurrente para hogares, alquileres y propiedades de inversión.",
            "long_description_en": "Monthly or quarterly maintenance plans that keep your property in great shape: touch-up paint, caulking, filters, smoke detectors, gutters, small fixes and seasonal prep.",
            "long_description_es": "Planes de mantenimiento mensual o trimestral que mantienen tu propiedad en gran estado: retoques de pintura, sellado, filtros, detectores de humo, canaletas, arreglos pequeños y preparación estacional.",
            "icon": "ClipboardCheck",
            "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=85",
            "color": "#0891B2",
            "order": 12,
        },
        {
            "slug": "artistic-murals",
            "title_en": "Artistic Murals",
            "title_es": "Murales Artísticos",
            "description_en": "Hand-painted murals for homes, offices, restaurants and feature walls.",
            "description_es": "Murales pintados a mano para hogares, oficinas, restaurantes y paredes destacadas.",
            "long_description_en": "Custom murals designed and painted for your space — kids' rooms, restaurants, lobbies and accent walls.",
            "long_description_es": "Murales personalizados diseñados y pintados para tu espacio — cuartos de niños, restaurantes, lobbies y paredes destacadas.",
            "icon": "Palette",
            "image_url": "https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1200&auto=format&fit=crop&q=85",
            "long_image_url": "https://images.unsplash.com/photo-1574169208507-84376144848b?w=1200&auto=format&fit=crop&q=85",
            "color": "#D946EF",
            "order": 13,
        },
        {
            "slug": "epoxy-flooring",
            "title_en": "Epoxy Flooring",
            "title_es": "Pisos Epóxicos",
            "description_en": "Seamless epoxy floors for garages, basements and commercial spaces.",
            "description_es": "Pisos epóxicos sin juntas para garajes, sótanos y espacios comerciales.",
            "long_description_en": "Solid color, metallic or flake epoxy systems. Slip-resistant, easy to clean and built to handle cars, equipment and daily wear.",
            "long_description_es": "Sistemas epóxicos de color sólido, metálico o flake. Antideslizantes, fáciles de limpiar y hechos para aguantar autos, equipo y uso diario.",
            "icon": "Sparkles",
            "image_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=85",
            "long_image_url": "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=1200&auto=format&fit=crop&q=85",
            "color": "#8B5CF6",
            "order": 14,
        },
        {
            "slug": "epoxy-walls",
            "title_en": "Epoxy Walls",
            "title_es": "Paredes Epóxicas",
            "description_en": "Seamless epoxy wall finishes for bathrooms, kitchens and feature walls.",
            "description_es": "Acabados epóxicos sin juntas para baños, cocinas y paredes destacadas.",
            "long_description_en": "Seamless, grout-free wall finishes that combine elegance with extreme durability. Perfect for bathrooms, kitchen backsplashes and feature walls.",
            "long_description_es": "Acabados sin juntas ni fragua que combinan elegancia con durabilidad extrema. Perfectos para baños, backsplashes de cocina y paredes destacadas.",
            "icon": "Walls",
            "image_url": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=1200&auto=format&fit=crop&q=85",
            "long_image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&auto=format&fit=crop&q=85",
            "color": "#A78BFA",
            "order": 15,
        },
        {
            "slug": "epoxy-countertops",
            "title_en": "Epoxy Countertops",
            "title_es": "Mesones Epóxicos",
            "description_en": "Custom epoxy countertops, islands and bar tops with unique finishes.",
            "description_es": "Mesones, islas y barras de resina epóxica con acabados únicos.",
            "long_description_en": "Hand-poured epoxy countertops with marble, river or custom effects. Heat-resistant, seamless and unique.",
            "long_description_es": "Mesones de resina epóxica vaciados a mano con efectos mármol, río o personalizados. Resistentes al calor, sin juntas y únicos.",
            "icon": "Box",
            "image_url": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop&q=85",
            "long_image_url": "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=1200&auto=format&fit=crop&q=85",
            "color": "#7C3AED",
            "order": 16,
        },
    ]
    for s in services:
        if not db.query(Service).filter(Service.slug == s["slug"]).first():
            db.add(Service(**s, is_active=True))


def _seed_projects(db: Session):
    """All images used are real photos verified accessible, depicting murals,
    painting, epoxy, remodeling and interior transformations."""

    if db.query(Project).count() > 0:
        return

    painting_cat = db.query(Category).filter(Category.slug == "painting").first()
    murals_cat = db.query(Category).filter(Category.slug == "murals").first()
    epoxy_cat = db.query(Category).filter(Category.slug == "epoxy").first()
    remodeling_cat = db.query(Category).filter(Category.slug == "remodeling").first()
    cleaning_cat = db.query(Category).filter(Category.slug == "cleaning").first()

    projects = [
        # === Remodeling projects ===
        {
            "slug": "waterfront-modern-villa",
            "title_en": "Waterfront Modern Villa",
            "title_es": "Villa Moderna Frente al Mar",
            "description_en": "Complete interior transformation with bespoke finishes and custom details throughout.",
            "description_es": "Transformación interior completa con acabados a medida y detalles personalizados.",
            "long_description_en": "A complete turnkey transformation of a waterfront estate. Custom color palette, hand-finished walls and continuous flooring throughout the social areas. Every detail handled by the same team.",
            "long_description_es": "Una transformación llave en mano de una propiedad frente al mar. Paleta personalizada, paredes con acabado a mano y pisos continuos en las áreas sociales. Cada detalle manejado por el mismo equipo.",
            "category_id": remodeling_cat.id if remodeling_cat else None,
            "location": "Miami Beach, FL",
            "client": "Private Estate",
            "cover_image": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&auto=format&fit=crop&q=85",
            "before_image": "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=1200&auto=format&fit=crop&q=85",
            "after_image": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&auto=format&fit=crop&q=85",
            "services_used": "Remodeling, Residential Painting",
            "duration": "8 weeks",
            "year": "2025",
            "is_featured": True,
            "order": 1,
            "images": [
                "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&auto=format&fit=crop&q=85",
            ],
        },
        {
            "slug": "pinecrest-kitchen",
            "title_en": "Pinecrest Kitchen Refresh",
            "title_es": "Cocina Pinecrest Renovada",
            "description_en": "Layout rework, custom cabinetry, quartz island and full finish refresh.",
            "description_es": "Reestructuración del layout, gabinetes a medida, isla de cuarzo y renovación completa de acabados.",
            "long_description_en": "A complete kitchen refresh: layout rework, custom cabinets, quartz island with waterfall, full tile backsplash and fresh paint throughout the open social area.",
            "long_description_es": "Una renovación completa de cocina: reestructuración del layout, gabinetes a medida, isla de cuarzo con cascada, backsplash de azulejo completo y pintura fresca en toda el área social abierta.",
            "category_id": remodeling_cat.id if remodeling_cat else None,
            "location": "Pinecrest, FL",
            "cover_image": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&auto=format&fit=crop&q=85",
            "before_image": "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&auto=format&fit=crop&q=85",
            "after_image": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop&q=85",
            "services_used": "Kitchen Remodeling, Residential Painting",
            "duration": "6 weeks",
            "year": "2025",
            "is_featured": True,
            "order": 2,
            "images": [
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1600&auto=format&fit=crop&q=85",
            ],
        },
        {
            "slug": "master-bath-refresh",
            "title_en": "Master Bath Refresh",
            "title_es": "Baño Principal Renovado",
            "description_en": "Walk-in shower, custom vanity, porcelain tile and modern fixtures.",
            "description_es": "Ducha walk-in, vanity a medida, azulejo de porcelanato y accesorios modernos.",
            "long_description_en": "A master bathroom gut renovation: walk-in shower with frameless glass, custom double vanity, porcelain tile and matte black fixtures throughout.",
            "long_description_es": "Una renovación completa del baño principal: ducha walk-in con vidrio sin marco, vanity doble a medida, azulejo de porcelanato y accesorios negro mate en todo el espacio.",
            "category_id": remodeling_cat.id if remodeling_cat else None,
            "location": "Coral Gables, FL",
            "cover_image": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&auto=format&fit=crop&q=85",
            "before_image": "https://images.unsplash.com/photo-1556909190-3c0e6ad26c78?w=1200&auto=format&fit=crop&q=85",
            "after_image": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&auto=format&fit=crop&q=85",
            "services_used": "Bathroom Remodeling",
            "duration": "4 weeks",
            "year": "2025",
            "is_featured": True,
            "order": 3,
            "images": [
                "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1556909190-3c0e6ad26c78?w=1200&auto=format&fit=crop&q=85",
            ],
        },
        {
            "slug": "aventura-primary-bath",
            "title_en": "Aventura Primary Bath",
            "title_es": "Baño Principal en Aventura",
            "description_en": "Walk-in shower, porcelain tile and custom vanity transformation.",
            "description_es": "Transformación con ducha walk-in, azulejo de porcelanato y vanity a medida.",
            "long_description_en": "Walk-in shower with porcelain tile, custom double vanity and frameless glass enclosure.",
            "long_description_es": "Ducha walk-in con azulejo de porcelanato, vanity doble a medida y cerramiento de vidrio sin marco.",
            "category_id": remodeling_cat.id if remodeling_cat else None,
            "location": "Aventura, FL",
            "cover_image": "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=1200&auto=format&fit=crop&q=85",
            "before_image": "https://images.unsplash.com/photo-1556909190-3c0e6ad26c78?w=1200&auto=format&fit=crop&q=85",
            "after_image": "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=1200&auto=format&fit=crop&q=85",
            "services_used": "Bathroom Remodeling",
            "duration": "3 weeks",
            "year": "2024",
            "is_featured": False,
            "order": 4,
            "images": [
                "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=1200&auto=format&fit=crop&q=85",
            ],
        },
        # === Cleaning projects ===
        {
            "slug": "facade-pressure-wash",
            "title_en": "Coral Gables Facade Refresh",
            "title_es": "Fachada en Coral Gables Restaurada",
            "description_en": "Full exterior wash, windows, walkways and entry detail restoration.",
            "description_es": "Lavado exterior completo, ventanas, pasillos y restauración del acceso principal.",
            "long_description_en": "A complete exterior refresh: pressure washing of stucco, walkways and patio, window cleaning inside and out, and entry door detail restoration.",
            "long_description_es": "Una renovación exterior completa: hidrolavado de estuco, pasillos y patio, limpieza de ventanas por dentro y por fuera, y restauración del detalle de la puerta de entrada.",
            "category_id": cleaning_cat.id if cleaning_cat else None,
            "location": "Coral Gables, FL",
            "cover_image": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&auto=format&fit=crop&q=85",
            "before_image": "https://images.unsplash.com/photo-1580587771525-78b9d27a32cc?w=1200&auto=format&fit=crop&q=85",
            "after_image": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&auto=format&fit=crop&q=85",
            "services_used": "Pressure Washing, Window Cleaning",
            "duration": "2 days",
            "year": "2025",
            "is_featured": True,
            "order": 5,
            "images": [
                "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1580587771525-78b9d27a32cc?w=1200&auto=format&fit=crop&q=85",
            ],
        },
        {
            "slug": "driveway-restoration",
            "title_en": "Driveway & Pool Deck Restoration",
            "title_es": "Restauración de Driveway y Terraza de Piscina",
            "description_en": "Pressure washing, oil stain removal and travertine sealing.",
            "description_es": "Hidrolavado, remoción de manchas de aceite y sellado de travertino.",
            "long_description_en": "Restored a heavily stained driveway and pool deck: oil removal, deep clean and travertine seal to protect the surface for years.",
            "long_description_es": "Restauramos un driveway y terraza de piscina muy manchados: remoción de aceite, limpieza profunda y sellado de travertino para proteger la superficie por años.",
            "category_id": cleaning_cat.id if cleaning_cat else None,
            "location": "Pinecrest, FL",
            "cover_image": "https://images.unsplash.com/photo-1581579188871-45ea61f2a0c8?w=1600&auto=format&fit=crop&q=85",
            "before_image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop&q=85",
            "after_image": "https://images.unsplash.com/photo-1581579188871-45ea61f2a0c8?w=1600&auto=format&fit=crop&q=85",
            "services_used": "Pressure Washing",
            "duration": "1 day",
            "year": "2025",
            "is_featured": False,
            "order": 6,
            "images": [
                "https://images.unsplash.com/photo-1581579188871-45ea61f2a0c8?w=1600&auto=format&fit=crop&q=85",
            ],
        },
        {
            "slug": "pool-weekly-service",
            "title_en": "Weekly Pool Service — Kendall",
            "title_es": "Servicio Semanal de Piscina — Kendall",
            "description_en": "Recurring weekly pool cleaning, balancing and tile care.",
            "description_es": "Servicio semanal recurrente de piscina, balance y cuidado de azulejo.",
            "long_description_en": "A bi-weekly pool service for a rental property: skimming, vacuuming, tile brushing, filter checks and full chemical balance.",
            "long_description_es": "Un servicio quincenal de piscina para una propiedad de alquiler: skimming, aspirado, cepillado de azulejo, revisión de filtros y balance químico completo.",
            "category_id": cleaning_cat.id if cleaning_cat else None,
            "location": "Kendall, FL",
            "cover_image": "https://images.unsplash.com/photo-1572331165267-854da2b64206?w=1600&auto=format&fit=crop&q=85",
            "services_used": "Pool Cleaning",
            "duration": "Ongoing",
            "year": "2025",
            "is_featured": False,
            "order": 7,
            "images": [
                "https://images.unsplash.com/photo-1572331165267-854da2b64206?w=1600&auto=format&fit=crop&q=85",
            ],
        },
        {
            "slug": "deck-cleanup",
            "title_en": "Backyard Deck Cleanup",
            "title_es": "Limpieza de Deck del Patio",
            "description_en": "Annual deck restoration: pressure wash, sand, seal and refinish.",
            "description_es": "Restauración anual del deck: hidrolavado, lijado, sellado y repintado.",
            "long_description_en": "Restored a weathered wood deck: deep clean, light sanding, premium seal and refinish to bring the wood back to life.",
            "long_description_es": "Restauramos un deck de madera desgastado: limpieza profunda, lijado suave, sellado premium y repintado para devolver la madera a la vida.",
            "category_id": cleaning_cat.id if cleaning_cat else None,
            "location": "Coconut Grove, FL",
            "cover_image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=85",
            "services_used": "Pressure Washing",
            "duration": "1 day",
            "year": "2025",
            "is_featured": False,
            "order": 8,
            "images": [
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=85",
            ],
        },
        {
            "slug": "lobby-deep-clean",
            "title_en": "Office Lobby Deep Clean",
            "title_es": "Limpieza Profunda del Lobby de Oficina",
            "description_en": "Detailed lobby, glass, floors and shared-space cleaning.",
            "description_es": "Limpieza detallada de lobby, vidrio, pisos y áreas comunes.",
            "long_description_en": "A monthly deep clean of a Brickell office lobby: floors, glass doors, elevator interiors, furniture and shared bathrooms — handled outside business hours.",
            "long_description_es": "Una limpieza profunda mensual del lobby de una oficina en Brickell: pisos, puertas de vidrio, interiores de ascensores, muebles y baños comunes — atendido fuera del horario laboral.",
            "category_id": cleaning_cat.id if cleaning_cat else None,
            "location": "Brickell, Miami",
            "cover_image": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=85",
            "services_used": "Professional Cleaning",
            "duration": "Ongoing",
            "year": "2025",
            "is_featured": False,
            "order": 9,
            "images": [
                "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=85",
            ],
        },
        {
            "slug": "contemporary-penthouse",
            "title_en": "Contemporary Penthouse",
            "title_es": "Penthouse Contemporáneo",
            "description_en": "Full interior repaint and decorative finishes for a contemporary Brickell penthouse.",
            "description_es": "Repintado interior completo y acabados decorativos para un penthouse contemporáneo en Brickell.",
            "long_description_en": "A complete repaint and refinish for a 4,500 sq ft downtown penthouse. Designer-curated palette, layered decorative finishes and meticulous trim work elevate the apartment's ocean views.",
            "long_description_es": "Un repintado y refinish completo para un penthouse de 4,500 pies cuadrados en el downtown. Paleta curada por diseñadores, acabados decorativos en capas y trabajo de molduras meticuloso que eleva las vistas al océano del apartamento.",
            "category_id": painting_cat.id if painting_cat else None,
            "location": "Brickell, Miami",
            "cover_image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&auto=format&fit=crop&q=85",
            "before_image": "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1200&auto=format&fit=crop&q=85",
            "after_image": "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&auto=format&fit=crop&q=85",
            "services_used": "Residential Painting, Decorative Finishes",
            "duration": "4 weeks",
            "year": "2025",
            "is_featured": True,
            "order": 2,
            "images": [
                "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1600&auto=format&fit=crop&q=85",
            ],
        },
        # === Mural projects ===
        {
            "slug": "ocean-inspired-mural",
            "title_en": "Ocean-Inspired Mural",
            "title_es": "Mural Inspirado en el Océano",
            "description_en": "A hand-painted mural in the lobby of a luxury condominium — bringing the ocean indoors.",
            "description_es": "Un mural pintado a mano en el lobby de un condominio de lujo — trayendo el océano al interior.",
            "long_description_en": "An 8-meter hand-painted mural inspired by the Atlantic. Created over three weeks by our senior mural artists with natural pigments and weather-resistant acrylics.",
            "long_description_es": "Un mural pintado a mano de 8 metros inspirado en el Atlántico. Creado durante tres semanas por nuestros artistas murales senior con pigmentos naturales y acrílicos resistentes a la intemperie.",
            "category_id": murals_cat.id if murals_cat else None,
            "location": "Brickell, Miami",
            "client": "Condo Association",
            "cover_image": "https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1600&auto=format&fit=crop&q=85",
            "services_used": "Artistic Mural",
            "duration": "3 weeks",
            "year": "2025",
            "is_featured": True,
            "order": 3,
            "images": [
                "https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1574169208507-84376144848b?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1600&auto=format&fit=crop&q=85",
            ],
        },
        {
            "slug": "wynwood-restaurant-mural",
            "title_en": "Wynwood Restaurant Mural",
            "title_es": "Mural para Restaurante en Wynwood",
            "description_en": "A vibrant, large-scale mural for a contemporary Miami restaurant. A photo-ready statement wall.",
            "description_es": "Un mural vibrante a gran escala para un restaurante contemporáneo de Miami. Una pared declarada lista para fotos.",
            "long_description_en": "An immersive dining-room mural designed in collaboration with the chef and architect. Each color was matched to a signature dish on the menu.",
            "long_description_es": "Un mural inmersivo para el comedor diseñado en colaboración con el chef y el arquitecto. Cada color se correspondió con un plato estrella del menú.",
            "category_id": murals_cat.id if murals_cat else None,
            "location": "Wynwood, Miami",
            "client": "Restaurant Group",
            "cover_image": "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1600&auto=format&fit=crop&q=85",
            "services_used": "Artistic Mural, Commercial Painting",
            "duration": "2 weeks",
            "year": "2024",
            "is_featured": True,
            "order": 4,
            "images": [
                "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=85",
            ],
        },
        {
            "slug": "kids-room-dream-wall",
            "title_en": "Dream Wall for Kids' Room",
            "title_es": "Pared de Sueños para Cuarto de Niños",
            "description_en": "A hand-painted story-book mural that transforms a nursery into a world of imagination.",
            "description_es": "Un mural pintado a mano estilo cuento que transforma una guardería en un mundo de imaginación.",
            "long_description_en": "A custom mural story-telling forest scene with hidden animals, painted with zero-VOC, child-safe pigments.",
            "long_description_es": "Una escena de bosque personalizada con animales escondidos, pintada con pigmentos sin VOC y seguros para niños.",
            "category_id": murals_cat.id if murals_cat else None,
            "location": "Coral Gables, FL",
            "client": "Family Home",
            "cover_image": "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=1600&auto=format&fit=crop&q=85",
            "services_used": "Artistic Mural",
            "duration": "1 week",
            "year": "2025",
            "is_featured": False,
            "order": 5,
            "images": [
                "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&auto=format&fit=crop&q=85",
            ],
        },
        # === Epoxy projects ===
        {
            "slug": "metallic-epoxy-garage",
            "title_en": "Metallic Epoxy Garage",
            "title_es": "Garaje con Resina Metálica",
            "description_en": "Show-quality metallic epoxy floor with custom color blend and high-gloss finish for a private collector.",
            "description_es": "Piso epóxico metálico de exhibición con mezcla personalizada y acabado de alto brillo para un coleccionista privado.",
            "long_description_en": "A 1,200 sq ft garage transformed with a custom metallic epoxy system, finished with a high-gloss topcoat. Slip-resistant, oil-tolerant and visually stunning.",
            "long_description_es": "Un garaje de 1,200 pies cuadrados transformado con un sistema epóxico metálico personalizado, con acabado de alto brillo. Antideslizante, resistente al aceite y visualmente impactante.",
            "category_id": epoxy_cat.id if epoxy_cat else None,
            "location": "Coral Gables, FL",
            "client": "Private Collector",
            "cover_image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=85",
            "before_image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop&q=85",
            "after_image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=85",
            "services_used": "Epoxy Flooring, Decorative Finishes",
            "duration": "5 days",
            "year": "2025",
            "is_featured": True,
            "order": 6,
            "images": [
                "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=1600&auto=format&fit=crop&q=85",
            ],
        },
        {
            "slug": "river-epoxy-countertop",
            "title_en": "River-Style Epoxy Countertop",
            "title_es": "Mesón Epóxico Tipo Río",
            "description_en": "Marble-effect epoxy countertop replacing dated surfaces with seamless luxury.",
            "description_es": "Mesón epóxico con efecto mármol que reemplaza superficies anticuadas con lujo sin juntas.",
            "long_description_en": "A tired kitchen island reborn with a hand-poured river-style epoxy. Heat-resistant, seamless, and absolutely breathtaking under morning light.",
            "long_description_es": "Una isla de cocina cansada renacida con un epóxico tipo río vaciado a mano. Resistente al calor, sin juntas, y absolutamente impresionante bajo la luz de la mañana.",
            "category_id": epoxy_cat.id if epoxy_cat else None,
            "location": "Aventura, FL",
            "client": "Couple",
            "cover_image": "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=1600&auto=format&fit=crop&q=85",
            "services_used": "Epoxy Countertops",
            "duration": "4 days",
            "year": "2025",
            "is_featured": True,
            "order": 7,
            "images": [
                "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&auto=format&fit=crop&q=85",
            ],
        },
        {
            "slug": "marble-epoxy-bathroom",
            "title_en": "Marble Epoxy Bathroom",
            "title_es": "Baño con Resina Tipo Mármol",
            "description_en": "Seamless marble-effect epoxy walls and vanity in a luxury master bathroom.",
            "description_es": "Paredes y vanity en resina epóxica tipo mármol sin juntas en un baño principal de lujo.",
            "long_description_en": "A master-bathroom reinvention: white marble epoxy walls, matching countertop and a continuous-floor pour that disappears behind a freestanding tub.",
            "long_description_es": "Una reinvención del baño principal: paredes de resina blanco mármol, mesón a juego y vertido continuo de piso que se desvanece detrás de una tina exenta.",
            "category_id": epoxy_cat.id if epoxy_cat else None,
            "location": "Pinecrest, FL",
            "cover_image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&auto=format&fit=crop&q=85",
            "services_used": "Epoxy Walls, Epoxy Countertops, Epoxy Flooring",
            "duration": "1 week",
            "year": "2025",
            "is_featured": False,
            "order": 8,
            "images": [
                "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=1600&auto=format&fit=crop&q=85",
            ],
        },
        # === More painting ===
        {
            "slug": "minimalist-family-home",
            "title_en": "Minimalist Family Home",
            "title_es": "Hogar Familiar Minimalista",
            "description_en": "Crisp whites and warm neutrals that transformed a family home into a serene sanctuary.",
            "description_es": "Blancos puros y neutros cálidos que transformaron un hogar familiar en un santuario sereno.",
            "long_description_en": "Complete interior repaint of a 4,500 sq ft family residence. Designer-curated palette, flawless execution, completed in three weeks.",
            "long_description_es": "Repintado interior completo de una residencia familiar de 4,500 pies cuadrados. Paleta curada por diseñadores, ejecución impecable, completada en tres semanas.",
            "category_id": painting_cat.id if painting_cat else None,
            "location": "Pinecrest, FL",
            "cover_image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&auto=format&fit=crop&q=85",
            "services_used": "Residential Painting",
            "duration": "3 weeks",
            "year": "2025",
            "is_featured": False,
            "order": 9,
            "images": [
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&auto=format&fit=crop&q=85",
            ],
        },
        {
            "slug": "restaurant-feature-wall",
            "title_en": "Restaurant Feature Wall",
            "title_es": "Pared Destacada de Restaurante",
            "description_en": "A bold accent wall with hand-stenciled motifs for a contemporary Miami restaurant.",
            "description_es": "Una pared de acento audaz con motivos pintados a plantilla para un restaurante contemporáneo de Miami.",
            "long_description_en": "An entire repaint plus a 12-meter hand-stenciled pattern wall that ties the space together.",
            "long_description_es": "Un repintado completo más una pared de 12 metros con patrón pintado a plantilla que unifica el espacio.",
            "category_id": painting_cat.id if painting_cat else None,
            "location": "Wynwood, Miami",
            "client": "Restaurant Group",
            "cover_image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=85",
            "services_used": "Commercial Painting, Artistic Mural",
            "duration": "4 weeks",
            "year": "2024",
            "is_featured": False,
            "order": 10,
            "images": [
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1600&auto=format&fit=crop&q=85",
            ],
        },
        {
            "slug": "open-plan-loft",
            "title_en": "Open-Plan Loft",
            "title_es": "Loft de Planta Abierta",
            "description_en": "Decorative finishes and a refined color story for an industrial-chic loft.",
            "description_es": "Acabados decorativos y una paleta refinada para un loft de estilo industrial-chic.",
            "long_description_en": "A 2,200 sq ft open-plan loft featuring textured walls, a metallic finish and a feature wall that ties the kitchen to the living area.",
            "long_description_es": "Un loft de planta abierta de 2,200 pies cuadrados con paredes texturizadas, acabado metálico y una pared destacada que une la cocina con la sala.",
            "category_id": remodeling_cat.id if remodeling_cat else None,
            "location": "Downtown Miami",
            "cover_image": "https://images.unsplash.com/photo-1490604001847-b712b0c2f967?w=1600&auto=format&fit=crop&q=85",
            "services_used": "Remodeling, Decorative Finishes, Residential Painting",
            "duration": "6 weeks",
            "year": "2025",
            "is_featured": False,
            "order": 11,
            "images": [
                "https://images.unsplash.com/photo-1490604001847-b712b0c2f967?w=1600&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&auto=format&fit=crop&q=85",
            ],
        },
        {
            "slug": "boutique-office",
            "title_en": "Boutique Office Reimagined",
            "title_es": "Oficina Boutique Reimaginada",
            "description_en": "Color-driven office transformation for a creative agency in Wynwood.",
            "description_es": "Transformación de oficina impulsada por color para una agencia creativa en Wynwood.",
            "long_description_en": "An entire office repainted with custom-mixed brand colors, including a feature wall with a hand-painted typographic mural.",
            "long_description_es": "Una oficina entera repintada con colores de marca mezclados a medida, incluyendo una pared destacada con un mural tipográfico pintado a mano.",
            "category_id": painting_cat.id if painting_cat else None,
            "location": "Wynwood, Miami",
            "cover_image": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=85",
            "services_used": "Commercial Painting, Artistic Mural",
            "duration": "2 weeks",
            "year": "2025",
            "is_featured": False,
            "order": 12,
            "images": [
                "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=85",
            ],
        },
    ]

    for p in projects:
        if db.query(Project).filter(Project.slug == p["slug"]).first():
            continue
        imgs = p.pop("images", [])
        project = Project(**p, is_published=True)
        db.add(project)
        db.flush()
        for idx, img in enumerate(imgs):
            db.add(ProjectImage(project_id=project.id, image_url=img, order=idx))


def _seed_service_projects(db: Session):
    """Associate projects with services so each service has a gallery in the modal."""
    if db.query(ServiceProject).count() > 0:
        return

    def add(service_slug, project_slug, order):
        s = db.query(Service).filter(Service.slug == service_slug).first()
        p = db.query(Project).filter(Project.slug == project_slug).first()
        if s and p:
            db.add(ServiceProject(service_id=s.id, project_id=p.id, order=order))

    # Painting
    add("residential-painting", "minimalist-family-home", 0)
    add("residential-painting", "contemporary-penthouse", 1)
    add("residential-painting", "restaurant-feature-wall", 2)

    # Commercial Painting
    add("commercial-painting", "restaurant-feature-wall", 0)
    add("commercial-painting", "boutique-office", 1)
    add("commercial-painting", "wynwood-restaurant-mural", 2)

    # Professional Cleaning
    add("professional-cleaning", "lobby-deep-clean", 0)
    add("professional-cleaning", "facade-pressure-wash", 1)

    # Window Cleaning
    add("window-cleaning", "facade-pressure-wash", 0)
    add("window-cleaning", "lobby-deep-clean", 1)

    # Pool Cleaning
    add("pool-cleaning", "pool-weekly-service", 0)

    # Pressure Washing
    add("pressure-washing", "facade-pressure-wash", 0)
    add("pressure-washing", "driveway-restoration", 1)
    add("pressure-washing", "deck-cleanup", 2)

    # Bathroom Remodeling
    add("bathroom-remodeling", "master-bath-refresh", 0)
    add("bathroom-remodeling", "aventura-primary-bath", 1)

    # Kitchen Remodeling
    add("kitchen-remodeling", "pinecrest-kitchen", 0)

    # Remodeling
    add("remodeling", "waterfront-modern-villa", 0)
    add("residential-painting", "waterfront-modern-villa", 3)
    add("remodeling", "contemporary-penthouse", 1)
    add("remodeling", "open-plan-loft", 2)

    # Drywall & General Repairs
    add("general-repairs", "brickell-guest-bedroom", 0)
    add("general-repairs", "minimalist-family-home", 1)

    # Property Maintenance
    add("property-maintenance", "minimalist-family-home", 0)
    add("property-maintenance", "contemporary-penthouse", 1)
    add("property-maintenance", "coconut-grove-living", 2)

    # Artistic Murals
    add("artistic-murals", "ocean-inspired-mural", 0)
    add("artistic-murals", "wynwood-restaurant-mural", 1)
    add("artistic-murals", "kids-room-dream-wall", 2)
    add("artistic-murals", "boutique-office", 3)

    # Epoxy Flooring
    add("epoxy-flooring", "metallic-epoxy-garage", 0)
    add("epoxy-flooring", "marble-epoxy-bathroom", 1)

    # Epoxy Walls
    add("epoxy-walls", "marble-epoxy-bathroom", 0)
    add("epoxy-walls", "metallic-epoxy-garage", 1)

    # Epoxy Countertops
    add("epoxy-countertops", "river-epoxy-countertop", 0)
    add("epoxy-countertops", "marble-epoxy-bathroom", 1)


def _seed_blog(db: Session):
    if db.query(BlogPost).count() > 0:
        return
    posts = [
        {
            "slug": "epoxy-flooring-ultimate-guide",
            "title_en": "The Ultimate Guide to Epoxy Flooring",
            "title_es": "La Guía Definitiva de Pisos Epóxicos",
            "excerpt_en": "Everything you need to know about epoxy flooring — from preparation to long-term care.",
            "excerpt_es": "Todo lo que necesitas saber sobre pisos epóxicos — desde la preparación hasta el cuidado a largo plazo.",
            "content_en": "Epoxy flooring has become one of the most sought-after finishes for both residential and commercial spaces. In this guide we cover the three main systems — solid color, metallic and flake — and the steps that make a floor last a lifetime.",
            "content_es": "Los pisos epóxicos se han convertido en uno de los acabados más solicitados tanto para espacios residenciales como comerciales. En esta guía cubrimos los tres sistemas principales — color sólido, metálico y flake — y los pasos que hacen que un piso dure para toda la vida.",
            "cover_image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=85",
            "category": "epoxy",
            "is_featured": True,
            "is_published": True,
            "published_at": datetime(2025, 10, 15),
            "read_time": 7,
        },
        {
            "slug": "choosing-perfect-color-palette",
            "title_en": "How to Choose the Perfect Color Palette",
            "title_es": "Cómo Elegir la Paleta de Colores Perfecta",
            "excerpt_en": "A designer's guide to selecting colors that elevate every space.",
            "excerpt_es": "Una guía de diseñador para seleccionar colores que eleven cada espacio.",
            "content_en": "Color is the soul of every space. Choosing the right palette can transform an ordinary room into something extraordinary. In this article we share the three-step process we use with every client.",
            "content_es": "El color es el alma de cada espacio. Elegir la paleta correcta puede transformar una habitación ordinaria en algo extraordinario. En este artículo compartimos el proceso de tres pasos que usamos con cada cliente.",
            "cover_image": "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=1200&auto=format&fit=crop&q=85",
            "category": "painting",
            "is_featured": True,
            "is_published": True,
            "published_at": datetime(2025, 11, 1),
            "read_time": 5,
        },
        {
            "slug": "art-of-custom-murals",
            "title_en": "The Art of Custom Murals",
            "title_es": "El Arte de los Murales Personalizados",
            "excerpt_en": "Behind the scenes of creating bespoke murals that tell stories.",
            "excerpt_es": "Detrás de cámaras de la creación de murales personalizados que cuentan historias.",
            "content_en": "Every mural begins with a story. Our process starts with listening — to your space, your brand, your story — and ends with a hand-painted wall that will outlive every trend.",
            "content_es": "Cada mural comienza con una historia. Nuestro proceso empieza escuchando — a tu espacio, a tu marca, a tu historia — y termina con una pared pintada a mano que sobrevivirá a cada tendencia.",
            "cover_image": "https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1200&auto=format&fit=crop&q=85",
            "category": "murals",
            "is_featured": False,
            "is_published": True,
            "published_at": datetime(2025, 11, 20),
            "read_time": 6,
        },
    ]
    for p in posts:
        if db.query(BlogPost).filter(BlogPost.slug == p["slug"]).first():
            continue
        db.add(BlogPost(**p))


def _seed_settings(db: Session):
    defaults = [
        {"key": "site_name", "value": "CSD Good Services", "group": "general", "label_en": "Site Name", "label_es": "Nombre del Sitio"},
        {"key": "site_tagline_en", "value": "Painting · Remodeling · Cleaning · Maintenance · Miami", "group": "general", "label_en": "Tagline (EN)", "label_es": "Lema (EN)"},
        {"key": "site_tagline_es", "value": "Pintura · Remodelación · Limpieza · Mantenimiento · Miami", "group": "general", "label_en": "Tagline (ES)", "label_es": "Lema (ES)"},
        {"key": "hero_subtitle_en", "value": "Painting · Cleaning · Remodeling · Maintenance · Miami", "group": "general", "label_en": "Hero Subtitle (EN)", "label_es": "Subtítulo Hero (EN)"},
        {"key": "hero_subtitle_es", "value": "Pintura · Limpieza · Remodelación · Mantenimiento · Miami", "group": "general", "label_en": "Hero Subtitle (ES)", "label_es": "Subtítulo Hero (ES)"},
        {"key": "contact_phone", "value": "+1 (305) 555-0123", "group": "contact", "label_en": "Phone", "label_es": "Teléfono"},
        {"key": "contact_email", "value": "info@csdgoodservices.com", "group": "contact", "label_en": "Email", "label_es": "Correo"},
        {"key": "contact_whatsapp", "value": "13055550123", "group": "contact", "label_en": "WhatsApp", "label_es": "WhatsApp"},
        {"key": "contact_address", "value": "8215 NW 64th Street, Medley, FL 33166", "group": "contact", "label_en": "Address", "label_es": "Dirección"},
        {"key": "contact_hours_en", "value": "Mon-Sat: 8:00 AM - 6:00 PM", "group": "contact", "label_en": "Hours (EN)", "label_es": "Horario (EN)"},
        {"key": "contact_hours_es", "value": "Lun-Sáb: 8:00 AM - 6:00 PM", "group": "contact", "label_en": "Hours (ES)", "label_es": "Horario (ES)"},
        {"key": "social_instagram", "value": "https://www.instagram.com/csd_good_services/", "group": "social", "label_en": "Instagram", "label_es": "Instagram"},
        {"key": "social_facebook", "value": "https://facebook.com/csdgoodservices", "group": "social", "label_en": "Facebook", "label_es": "Facebook"},
        {"key": "social_tiktok", "value": "https://tiktok.com/@csdgoodservices", "group": "social", "label_en": "TikTok", "label_es": "TikTok"},
        {"key": "social_youtube", "value": "", "group": "social", "label_en": "YouTube", "label_es": "YouTube"},
        {"key": "hero_video_url", "value": "https://cdn.pixabay.com/video/2020/03/27/34125-399680914_large.mp4", "group": "media", "label_en": "Hero Video URL", "label_es": "URL Video Hero"},
        {"key": "hero_video_fallback_url", "value": "https://cdn.pixabay.com/video/2020/03/27/34125-399680914_large.mp4", "group": "media", "label_en": "Hero Video Fallback", "label_es": "Fallback Video Hero"},
        {"key": "hero_image_url", "value": HERO_FALLBACK, "group": "media", "label_en": "Hero Image", "label_es": "Imagen Hero"},
        {"key": "hero_image_fallback_url", "value": HERO_FALLBACK, "group": "media", "label_en": "Hero Image Fallback", "label_es": "Fallback Imagen Hero"},
        {"key": "about_image_url", "value": ABOUT_IMAGE, "group": "media", "label_en": "About Image", "label_es": "Imagen Nosotros"},
        {"key": "about_image_fallback_url", "value": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1600&q=80", "group": "media", "label_en": "About Image Fallback", "label_es": "Fallback Imagen About"},
        {"key": "about_story_image_url", "value": "https://images.unsplash.com/photo-1561409037-c7be81613c1f?w=1600&auto=format&fit=crop&q=85", "group": "media", "label_en": "About Page Story Image", "label_es": "Imagen Historia About"},
        {"key": "about_team_image_url", "value": "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=85", "group": "media", "label_en": "About Page Team Image", "label_es": "Imagen Equipo About"},
        {"key": "quote_hero_image_url", "value": "https://images.unsplash.com/photo-1561409037-c7be81613c1f?w=1200&auto=format&fit=crop&q=85", "group": "media", "label_en": "Quote Page Hero Image", "label_es": "Imagen Hero Cotización"},
        {"key": "google_maps_embed", "value": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.7!2d-80.325!3d25.825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b1234567890%3A0x0!2s8215%20NW%2064th%20St%2C%20Medley%2C%20FL%2033166!5e0!3m2!1sen!2sus!4v1700000000000", "group": "media", "label_en": "Google Maps Embed", "label_es": "Embed Google Maps"},

        # === Home section content (JSON-encoded for rich structure) ===
        {"key": "home_marquee_items", "value": json.dumps(MARQUEE_ITEMS), "group": "media", "label_en": "Marquee Items (JSON array)", "label_es": "Items Marquee (JSON)"},
        {"key": "home_why_us_reasons", "value": json.dumps(WHY_US_REASONS), "group": "media", "label_en": "Why Us Reasons (JSON array)", "label_es": "Reasons Why Us (JSON)"},
        {"key": "home_process_steps", "value": json.dumps(PROCESS_STEPS), "group": "media", "label_en": "Process Steps (JSON array)", "label_es": "Pasos del Proceso (JSON)"},
        {"key": "home_before_after_pairs", "value": json.dumps(BEFORE_AFTER_PAIRS), "group": "media", "label_en": "Before/After Pairs (JSON array)", "label_es": "Pares Antes/Después (JSON)"},
        {"key": "home_videos_list", "value": json.dumps(VIDEOS_LIST), "group": "media", "label_en": "Videos List (JSON array)", "label_es": "Lista de Videos (JSON)"},
        {"key": "home_promise_left_images", "value": json.dumps(PROMISE_LEFT_IMAGES), "group": "media", "label_en": "Promise Band — Left Side Images (JSON array)", "label_es": "Promise Band — Imágenes Izquierdas (JSON)"},
        {"key": "home_promise_right_images", "value": json.dumps(PROMISE_RIGHT_IMAGES), "group": "media", "label_en": "Promise Band — Right Side Images (JSON array)", "label_es": "Promise Band — Imágenes Derechas (JSON)"},
        {"key": "home_about_quote_en", "value": HOME_ABOUT_QUOTE_EN, "group": "media", "label_en": "About Editorial Quote (EN)", "label_es": "Cita Editorial About (EN)"},
        {"key": "home_about_quote_es", "value": HOME_ABOUT_QUOTE_ES, "group": "media", "label_en": "About Editorial Quote (ES)", "label_es": "Cita Editorial About (ES)"},
        {"key": "home_about_side_note_en", "value": HOME_ABOUT_SIDE_NOTE_EN, "group": "media", "label_en": "About Side Note (EN)", "label_es": "Nota lateral About (EN)"},
        {"key": "home_about_side_note_es", "value": HOME_ABOUT_SIDE_NOTE_ES, "group": "media", "label_en": "About Side Note (ES)", "label_es": "Nota lateral About (ES)"},

        {"key": "seo_meta_title_en", "value": "CSD Good Services | Miami Home Services — Painting, Remodeling, Cleaning", "group": "seo", "label_en": "SEO Title (EN)", "label_es": "Título SEO (EN)"},
        {"key": "seo_meta_title_es", "value": "CSD Good Services | Servicios del Hogar en Miami — Pintura, Remodelación, Limpieza", "group": "seo", "label_en": "SEO Title (ES)", "label_es": "Título SEO (ES)"},
        {"key": "seo_meta_description_en", "value": "Miami home services company for painting, remodeling, cleaning and ongoing home maintenance. One team for everything your home needs. Free estimates across South Florida.", "group": "seo", "label_en": "SEO Description (EN)", "label_es": "Descripción SEO (EN)"},
        {"key": "seo_meta_description_es", "value": "Empresa de servicios del hogar en Miami para pintura, remodelación, limpieza y mantenimiento continuo. Un equipo para todo lo que tu casa necesita. Cotizaciones gratis en todo el sur de Florida.", "group": "seo", "label_en": "SEO Description (ES)", "label_es": "Descripción SEO (ES)"},
    ]
    for s in defaults:
        existing = db.query(SiteSettings).filter(SiteSettings.key == s["key"]).first()
        if existing:
            # Update mutable media/contact/social defaults in place so existing
            # DBs pick up URL corrections (e.g. social handle changes). Skip
            # if the admin has customized the value away from the seed default.
            if s["key"] in {"social_instagram", "social_facebook", "social_tiktok", "social_youtube",
                             "contact_phone", "contact_email", "contact_whatsapp",
                             "contact_address", "contact_hours_en", "contact_hours_es"}:
                existing.value = s["value"]
        else:
            db.add(SiteSettings(**s))


if __name__ == "__main__":
    from app.database.session import Base, engine
    Base.metadata.create_all(bind=engine)
    seed_data()
