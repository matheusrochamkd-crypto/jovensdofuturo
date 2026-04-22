import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Brands from '../components/Brands'
import Purpose from '../components/Purpose'
import Venue from '../components/Venue'
import Audience from '../components/Audience'
import Outcomes from '../components/Outcomes'
import Speakers from '../components/Speakers'
import Schedule from '../components/Schedule'
import Protocol from '../components/Protocol'
import ApplicationForm from '../components/ApplicationForm'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-deep-slate text-white">
      <Navbar />
      <Hero />
      <Brands />
      <Purpose />
      <Venue />
      <Audience />
      <Outcomes />
      <Speakers />
      <Schedule />
      <Protocol />
      <ApplicationForm />
      <Footer />
    </div>
  )
}
