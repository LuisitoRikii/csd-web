import { motion } from 'framer-motion'
import { MapPin, Navigation } from 'lucide-react'

export const MapSection = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-cream">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center mb-12"
        >
          <div className="lg:col-span-2">
            <h2 className="font-serif text-display-md tracking-tight">
              Studio <span className="italic font-light">Medley</span>
            </h2>
            <p className="mt-4 text-charcoal/80 max-w-lg">
              We are based minutes from Miami International Airport. Visits to our studio are by appointment only — schedule yours today.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 text-magenta" />
              <span className="text-charcoal">8215 NW 64th Street, Medley, FL 33166</span>
            </div>
            <a
              href="https://maps.google.com/?q=8215+NW+64th+Street+Medley+FL+33166"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-ink text-paper text-sm font-medium hover:bg-graphite transition-colors"
            >
              <Navigation size={14} />
              Get Directions
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative aspect-[16/7] rounded-3xl overflow-hidden border border-line"
        >
          <iframe
            title="CSD Good Services Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.7!2d-80.325!3d25.825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b1234567890%3A0x0!2s8215%20NW%2064th%20St%2C%20Medley%2C%20FL%2033166!5e0!3m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  )
}
