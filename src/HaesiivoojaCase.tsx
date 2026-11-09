import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import './HaesiivoojaCase.css'

const play = 'https://play.google.com/store/apps/details?id=com.cleanerfinder'

const screens = [
  {
    file: 'haesiivooja-login.png',
    title: 'A familiar way to begin',
    text: 'Recognisable sign-in options reduce the effort of entering the service. The next design priority is making the value of registering clear before asking for personal details.',
    alt: 'HaeSiivooja Android sign-in screen'
  },
  {
    file: 'haesiivooja-services.png',
    title: 'Turn a need into a defined service',
    text: 'Cleaning categories and optional extras help customers explain the work. This structure also gives professionals a clearer basis for understanding incoming requests.',
    alt: 'HaeSiivooja Android cleaning service selection screen'
  },
  {
    file: 'haesiivooja-cleaner.png',
    title: 'Give professionals their own workflow',
    text: 'The cleaner dashboard brings bookings, services and availability into a work-oriented view. A marketplace cannot work well when only the customer experience is considered.',
    alt: 'HaeSiivooja Android cleaner workspace'
  }
]

const swatches = [
  { name: 'Deep ocean', hex: '#103F49', purpose: 'Readable headings and confident structure' },
  { name: 'Ocean teal', hex: '#096C7B', purpose: 'Primary actions, navigation and trust' },
  { name: 'Mascot cyan', hex: '#12CBE7', purpose: 'Recognition and lively accents' },
  { name: 'Sunshine yellow', hex: '#FFCE55', purpose: 'Warmth and selective emphasis' }
]

export default function HaesiivoojaCase({ back }: { back: () => void }) {
  return <main className="hc" id="top">
    <button className="back hc-back" onClick={back}><ArrowLeft size={18} /> All projects</button>

    <div className="hc-intro">
      <p className="overline">HAESIIVOOJA / FIRST-OF-ITS-KIND FINNISH CLEANING MARKETPLACE</p>
      <h1>From “I need a cleaner”<br /><em>to a clear next step.</em></h1>
      <p>Designed as Finland’s first-of-its-kind, cleaning-specific SaaS marketplace for choosing an independent cleaner directly—not booking an agency’s own staff or waiting for competing quotes.</p>
      <a href="https://haesiivooja.fi" target="_blank" rel="noreferrer">Explore the live service <ArrowUpRight size={16} /></a>
    </div>

    <figure className="hc-hero">
      <div className="hc-hero-copy">
        <img className="hc-hero-mascot" src="/cases/haesiivooja-mascot.png" width="118" height="118" alt="HaeSiivooja blue water-drop brand mascot" />
        <span>ONE DIRECT-BOOKING MARKETPLACE.<br />TWO CONNECTED JOURNEYS.</span>
        <p>Find a cleaner.<br />Find customers.<br />Understand the next step.</p>
        <small>Finnish cleaning-specific marketplace · Android open testing</small>
      </div>
      <div className="hc-phones">{screens.map(screen => <img key={screen.file} src={'/cases/' + screen.file} alt={screen.alt} />)}</div>
      <figcaption>Customer access → service selection → cleaner work management. Actual Android application screens.</figcaption>
    </figure>

    <dl className="hc-facts">
      <div><dt>MY ROLE</dt><dd>Sole product &amp; UX/UI designer</dd></div>
      <div><dt>PRODUCT MODEL</dt><dd>First-of-its-kind Finnish direct-cleaner marketplace</dd></div>
      <div><dt>PUBLIC AVAILABILITY</dt><dd>Website live · Android open testing</dd></div>
      <div><dt>ADDITIONAL PLATFORM</dt><dd>iOS developed · not publicly released</dd></div>
    </dl>

    <nav className="hc-nav" aria-label="Case study sections">
      {[
        ['context', 'The opportunity'], ['decisions', 'Design decisions'],
        ['brand', 'Visual identity'], ['screens', 'The interface'],
        ['prototype', 'Try the journey'], ['outcome', 'What I delivered']
      ].map(([section, label]) => <button key={section} onClick={() => document.getElementById('hc-' + section)?.scrollIntoView({ behavior: 'smooth' })}>{label}</button>)}
    </nav>

    <section className="hc-section hc-split" id="hc-context">
      <p className="overline">01 / DEFINE THE OPPORTUNITY</p>
      <div>
        <h2>Not another cleaning agency.<br />A marketplace built for both sides.</h2>
        <p>HaeSiivooja was designed around a first-of-its-kind proposition in Finland: a cleaning-only, two-sided SaaS marketplace in which customers choose an independent cleaning professional and initiate a booking request directly in the app. HaeSiivooja does not employ its own cleaning workforce or require customers to collect competing offers before approaching a cleaner.</p>
        <p>The core design challenge was the asymmetry between the two audiences: customers start with a personal need and uncertainty about price, scope and trust; cleaners need an actionable request, a manageable schedule and a way to reach potential customers. Direct selection should reduce steps without suggesting that a booking is automatically confirmed.</p>
        <div className="hc-note">
          <strong>The product-design decision</strong>
          <p>Design one connected marketplace with two clearly different interfaces. Each role sees the information needed for its next decision, while the booking request remains the shared point of reference.</p>
        </div>
        
        <div className="hc-note">
          <strong>What makes the model different in Finland</strong>
          <p>Freska offers cleaning as a managed service using its own recruited cleaners. Puhtaudella.fi is a request-for-quotes platform where providers respond with offers. HaeSiivooja is designed for customers to discover and choose an independent cleaner in the app, then send that cleaner a booking request directly. The distinction is the service model and customer control—not a claim that every booking is instantly confirmed.</p>
        </div>
        
      </div>
    </section>

    <section className="hc-section" id="hc-decisions">
      <p className="overline">02 / MAKE COMPLEX DECISIONS FEEL SIMPLE</p>
      <h2>Three choices that shaped the experience.</h2>
      <p className="hc-lead">Each decision responds to a specific user uncertainty and has an implication for both marketplace roles.</p>
      <div className="hc-cards">
        <article>
          <small>01 / SCOPE BEFORE COMMITMENT</small>
          <h3>Make the work understandable.</h3>
          <p>Separate the cleaning type from optional extras and keep service descriptions concrete. Customers can express a need more accurately, while cleaners receive a clearer description of the expected work.</p>
          <b>Why: fewer assumptions at the moment a booking is requested.</b>
        </article>
        <article>
          <small>02 / SHARED BOOKING LOGIC</small>
          <h3>Connect two different workflows.</h3>
          <p>Customers need to know what they have requested; professionals need to decide whether they can take the work. Requested and confirmed states should remain distinguishable across both views.</p>
          <b>Why: one person's action changes what the other needs to see.</b>
        </article>
        <article>
          <small>03 / TRANSPARENT VALUE</small>
          <h3>Separate platform and service fees.</h3>
          <p>Make free registration, the booking service fee, professional subscription and independently priced cleaning work understandable as different things, rather than hiding them behind a generic price.</p>
          <b>Why: pricing clarity helps customers and cleaners make informed decisions.</b>
        </article>
      </div>
      <div className="hc-journey">
        <div><small>CUSTOMER</small><ol><li>Define the cleaning need</li><li>Explore a provider and time</li><li>Review scope and fees</li><li>Follow booking status</li></ol></div>
        <div><small>CLEANER</small><ol><li>Set services and work area</li><li>Manage availability</li><li>Review a request</li><li>Coordinate the job</li></ol></div>
        <p>One booking connects two journeys without forcing both people into the same interface.</p>
      </div>
    </section>

    <section className="hc-section hc-brand" id="hc-brand">
      <p className="overline">03 / VISUAL IDENTITY EVOLUTION</p>
      <h2>Friendly enough to remember.<br />Clear enough to trust.</h2>
      <div className="hc-brand-grid">
        <div className="hc-brand-art">
          <img src="/cases/haesiivooja-mascot.png" width="270" height="270" alt="Friendly HaeSiivooja water-drop mascot with cyan body and yellow gloves" loading="lazy" />
          <span>HaeSiivooja's recognisable, welcoming character</span>
        </div>
        <div>
          <p>Cleaning is a personal service, so the identity needed to feel approachable without making booking details feel informal or uncertain. The expressive water-drop mascot creates recognition and warmth; the interface itself stays structured and readable.</p>
          <p>I connected the mascot's cyan and yellow to the website through limited accents, while using deep ocean and teal for text, navigation and primary actions. This gives the brand a consistent personality without using bright decorative colours where users need to read prices, forms or booking statuses.</p>
          <p>Earlier explorations are part of the process. The current identity reflects a deliberate progression toward a coherent product, not a retrospective claim that every screen began with this palette.</p>
        </div>
      </div>
      <div className="hc-palette">{swatches.map(swatch => <div className="hc-swatch" key={swatch.hex}>
        <div className="hc-swatch-color" style={{ backgroundColor: swatch.hex }} />
        <strong>{swatch.name}</strong><code>{swatch.hex}</code><small>{swatch.purpose}</small>
      </div>)}</div>
      <div className="hc-note"><strong>Why the contrast matters</strong><p>Cyan and yellow carry the personality. Darker teal carries the decisions. This distinction helps the visual identity support comprehension instead of competing with essential information.</p></div>
    </section>

    <section className="hc-section" id="hc-screens">
      <p className="overline">04 / THE DEVELOPED INTERFACE</p>
      <h2>Different responsibilities. One coherent service.</h2>
      <p className="hc-lead">Selected Android application screens show how the design supports entry, service definition and professional work management. Open a screen to inspect it.</p>
      <div className="hc-screen-grid">{screens.map(screen => <figure key={screen.file}>
        <a href={'/cases/' + screen.file} target="_blank" rel="noreferrer"><img src={'/cases/' + screen.file} alt={screen.alt} loading="lazy" /></a>
        <figcaption><h3>{screen.title}</h3><p>{screen.text}</p></figcaption>
      </figure>)}</div>
      <p className="hc-caption">Android is available through <a href={play} target="_blank" rel="noreferrer">Google Play open testing ↗</a>. An iOS version has been developed but is not publicly released; these images show the Android application.</p>
    </section>

    <section className="hc-section hc-prototype" id="hc-prototype">
      <div>
        <p className="overline">05 / INTERACTIVE EXPERIENCE</p>
        <h2>Try the connected<br />booking journey.</h2>
        <p>Choose a cleaning type, add an extra, select a cleaner and review the request. Then switch to the cleaner's view to see how the same request moves toward confirmation.</p>
        <div className="hc-note"><strong>What the walkthrough demonstrates</strong><p>The prototype focuses on interaction logic and the relationship between the two roles. Its earlier-stage visual styling is intentionally retained as process evidence.</p></div>
        <a href="/haesiivooja-prototype.html" target="_blank" rel="noreferrer">Open the interactive walkthrough <ArrowUpRight size={16} /></a>
      </div>
      <iframe src="/haesiivooja-prototype.html" title="Interactive HaeSiivooja customer and cleaner booking walkthrough" loading="lazy" sandbox="allow-scripts" />
    </section>

    <section className="hc-section hc-split hc-outcome" id="hc-outcome">
      <p className="overline">06 / THE DESIGN DELIVERED</p>
      <div>
        <h2>A first-of-its-kind model,<br />designed as one experience.</h2>
        <p>HaeSiivooja brings a direct customer-to-independent-cleaner booking model into a single cleaning-focused product. Customers can find an individual professional and initiate a request without going through a cleaning agency or a quote-competition process. The cleaner manages their own services and availability; the two perspectives are connected through the booking workflow.</p>
        <ul>
          <li><strong>A distinctive Finnish service model:</strong> a first-of-its-kind, cleaning-specific direct-booking marketplace for independent providers rather than an agency-owned workforce or a quote-request intermediary.</li>
          <li><strong>Two role-specific experiences:</strong> discovery and booking for customers; service presentation, availability and work management for cleaners.</li>
          <li><strong>Clearer commercial logic:</strong> separate explanations of registration, the platform booking fee, professional subscriptions and the provider's cleaning price.</li>
          <li><strong>A connected visual system:</strong> the mascot's warmth carried into a usable, restrained teal-and-cyan interface.</li>
          <li><strong>Implemented product work:</strong> a live website, Android app in Google Play open testing and an iOS app developed but not yet publicly released.</li>
        </ul>
        <p className="hc-takeaway">The design principle that guided the work: make it easy for both people to understand the service, recognise their responsibility and know what happens next.</p>
        <div className="links"><a href="https://haesiivooja.fi" target="_blank" rel="noreferrer">Explore HaeSiivooja <ArrowUpRight size={16} /></a><a href={play} target="_blank" rel="noreferrer">View Android app <ArrowUpRight size={16} /></a></div>
      </div>
    </section>
  </main>
}
