import { ArrowLeft, ArrowUpRight, ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import './PortfolioDeepDives.css'

const root = '/cases/'
const cleanPeerFigma = 'https://www.figma.com/design/gohnjvc6zywSi4MdoG6E79/Viktoriya-Mikhaylova?node-id=0-1'
const cleanPeerDemo = '/viktoriya/cleanpeer-prototype/'
const auraFigma = 'https://www.figma.com/design/U2iXpoIjaCTCBmiePL8GJi/Viktoriya-Mikhaylova---Product-Design-Portfolio?node-id=0-1'

function Artifact({ file, alt, caption, className = '' }: { file: string; alt: string; caption: string; className?: string }) {
  return <figure className={`pd-artifact ${className}`}>
    <a href={`${root}${file}`} target="_blank" rel="noreferrer" aria-label={`Open full size: ${alt}`}>
      <img src={`${root}${file}`} alt={alt} loading="lazy" />
    </a>
    <figcaption>{caption} <span>View full image ↗</span></figcaption>
  </figure>
}

function Chapter({ number, eyebrow, title, children, id }: { number: string; eyebrow: string; title: string; children: ReactNode; id: string }) {
  return <section className="pd-chapter" id={id}>
    <div className="pd-chapter-meta"><span>{number} / {eyebrow}</span></div>
    <div className="pd-chapter-content"><h2>{title}</h2>{children}</div>
  </section>
}

function CaseTop({ back, label, title, emphasized, lead, facts, image, imageAlt, color, links }: {
  back: () => void; label: string; title: string; emphasized: string; lead: string;
  facts: { label: string; value: string }[]; image: string; imageAlt: string;
  color: string; links: { name: string; href: string }[];
}) {
  return <>
    <button type="button" className="back pd-back" onClick={back}><ArrowLeft size={18}/> All projects</button>
    <header className="pd-intro">
      <p className="pd-overline">{label}</p>
      <h1>{title}<br/><em>{emphasized}</em></h1>
      <p className="pd-lead">{lead}</p>
      <div className="pd-links">{links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.name}<ArrowUpRight size={16}/></a>)}</div>
    </header>
    <figure className={`pd-cover pd-cover--${color}`}>
      <img src={`${root}${image}`} alt={imageAlt} fetchPriority="high" />
      <figcaption>Original interface designs by Viktoriya Mikhaylova · Click screenshots below to explore the work</figcaption>
    </figure>
    <dl className="pd-facts">{facts.map(f => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}</dl>
  </>
}

export function CleanPeerCase({ back }: { back: () => void }) {
  return <main className="pd-case pd-case--cleanpeer" id="top">
    <CaseTop back={back} color="cleanpeer" label="CLEANPEER / PROFESSIONAL LEARNING & AI-ASSISTED SUPPORT" title="A better answer starts" emphasized="with the problem." lead="A professional learning experience for cleaners, designed to replace fragmented advice with practical guidance, visible sources and a path to expert support. I shaped the concept, research framing, information architecture and interactive prototype as the sole designer." image="portfolio-cleanpeer-cover.webp" imageAlt="CleanPeer real mid-fidelity screens showing the cleaner's problem, search results, expert-backed guidance and completion" facts={[
      {label:'MY ROLE',value:'Sole product, UX & UI designer'},
      {label:'SCOPE',value:'Concept strategy → research framing → IA → prototypes'},
      {label:'PRIMARY USER',value:'Sofia, a developing professional cleaner'},
      {label:'OUTPUT',value:'Interactive mobile-first prototype'}
    ]} links={[{name:'Explore interactive prototype',href:cleanPeerDemo},{name:'Open design rationale in Figma',href:cleanPeerFigma}]}/>
    <nav className="pd-local-nav" aria-label="CleanPeer case sections"><a href="#cp-problem">Challenge</a><a href="#cp-strategy">Strategy</a><a href="#cp-flow">User journey</a><a href="#cp-artifacts">Screens</a><a href="#cp-validation">Validation</a></nav>

    <Chapter id="cp-problem" number="01" eyebrow="PRODUCT OPPORTUNITY" title="Cleaning advice exists everywhere. Confidence does not.">
      <p>When a cleaner meets an unfamiliar surface, chemical or stain at work, a generic search result may not be enough. Advice is scattered across videos, forums and product pages; expertise and safety context are often difficult to judge. The important design problem is not simply finding content—it is helping someone make a sound next decision in the middle of real work.</p>
      <div className="pd-insight"><span>DESIGN FRAMING</span><strong>How might we help cleaners find an answer they can trust, understand the safe next step and know when to ask a professional?</strong></div>
      <p>I positioned CleanPeer as a connected experience for immediate problem-solving, professional learning and peer expertise. Its first useful moment had to be concrete: one cleaning problem, one relevant answer, a way to check the evidence and a clear route forward.</p>
    </Chapter>

    <Chapter id="cp-strategy" number="02" eyebrow="PRIORITIZATION & USER MODELS" title="Start with the highest-frequency need, not the biggest feature list.">
      <p>I considered different pathways—courses, community exchange, mentorship and on-the-job troubleshooting. A prioritization matrix compared 15 candidate journeys by expected frequency and relevance. The unfamiliar-problem journey became the critical path because it offered an immediate test of CleanPeer's value: could Sofia act with more confidence?</p>
      <div className="pd-grid pd-grid--two">
        <Artifact file="portfolio-cleanpeer-priority.webp" alt="Journey prioritization matrix comparing CleanPeer feature opportunities" caption="Journey prioritization: select a high-value, repeated workplace need."/>
        <Artifact file="portfolio-cleanpeer-persona.webp" alt="Primary persona Sofia and the rationale for her prioritization" caption="Priority persona Sofia: a focused design hypothesis, not a claim of representative field research."/>
      </div>
      <h3>Two mental models made the product strategy more specific</h3>
      <div className="pd-principles"><article><span>01 / MENTORSHIP</span><h4>People trust people.</h4><p>Give guidance an identifiable professional source, rather than relying on anonymous answers.</p></article><article><span>02 / STRUCTURED LEARNING</span><h4>People need a path.</h4><p>Turn a one-off solution into related topics and skills without interrupting the urgent task.</p></article><article><span>03 / AI AS SUPPORT</span><h4>Fast does not mean authoritative.</h4><p>Use AI to help users describe and find relevant content while making verification and human escalation visible.</p></article></div>
    </Chapter>

    <Chapter id="cp-flow" number="03" eyebrow="INFORMATION ARCHITECTURE & CRITICAL PATH" title="One primary task, several trustworthy ways forward.">
      <p>The main journey follows Sofia from a coffee-stain problem to a confirmed learning outcome. She can describe the situation using text, a photo or voice; review mixed search results; open a practical guide with a credited expert; and decide whether she understands what to do. Community and expert routes remain available if the first answer is insufficient.</p>
      <Artifact file="portfolio-cleanpeer-flow.webp" alt="CleanPeer happy path flow diagram with decisions and professional support routes" caption="Primary user flow: articulate the problem → discover results → assess guidance → expert/source → outcome."/>
      <Artifact file="portfolio-cleanpeer-sitemap.webp" alt="CleanPeer sitemap organizing Solve, Learn, Community, Experts and support" caption="Sitemap: Solve a Problem leads; learning, community and expert support form connected alternatives."/>
      <div className="pd-insight"><span>CRITICAL DESIGN CHOICE</span><strong>The interface should never make finding help harder than the cleaning task itself.</strong></div>
    </Chapter>

    <Chapter id="cp-artifacts" number="04" eyebrow="SCREEN EVOLUTION" title="From five key screens to an interactive journey.">
      <p>I began with quick paper sketches to work out hierarchy and state changes before investing in UI polish. The digital wireframes connected the same decision points. Both original five-screen sequences are preserved below—without presentation or assignment-cover labels—so the progression from structure to interaction remains visible.</p>
      <div className="pd-grid pd-grid--stack">
        <Artifact file="portfolio-cleanpeer-sketches.webp" alt="CleanPeer original five-screen paper sketches" caption="01 / Five key screen sketches: home, explain problem, results, guidance, expert and outcome."/>
        <Artifact file="portfolio-cleanpeer-five-digital.webp" alt="CleanPeer five digital wireframes connected through important decisions" caption="02 / Digital five-screen flow: hierarchy, navigation and verification touchpoints."/>
      </div>
      <p>The later prototype gives each moment a job. On the problem screen, suggested topic tags are editable and text, photo and voice are visible alternatives. Search results distinguish guides, videos, experts and community content. A guide foregrounds steps, safety and source expertise. An achievement closes the loop only after the user confirms the problem was solved.</p>
      <Artifact file="portfolio-cleanpeer-midfi.webp" alt="Actual CleanPeer mid-fidelity screens showing Home, Solve, Results, Guidance, Expert and achievement" caption="Mid-fidelity interface: six connected moments in the problem-solving journey."/>
      <div className="pd-cta"><div><h3>Explore the working prototype</h3><p>The demo shows the intended interactions; photo and voice inputs are simulations, not working recognition services.</p></div><a href={cleanPeerDemo} target="_blank" rel="noreferrer">Launch prototype <ArrowUpRight size={18}/></a></div>
    </Chapter>

    <Chapter id="cp-validation" number="05" eyebrow="EVALUATION & ITERATION" title="Feedback revealed the difference between seeing an action and trusting it.">
      <p>The documented peer review and prototype walkthrough exposed an important mismatch: people may try adding a photo before typing, because showing the stain is easier than explaining it. The first version offered that control without meaningful feedback. I revised the interaction to make attachment state visible and removable, while keeping the design transparent about which actions are simulated.</p>
      <Artifact file="portfolio-cleanpeer-iteration.webp" alt="CleanPeer comparison of early sketches with primary flow and annotated iteration decisions" caption="Iteration evidence: early flow and screens informed later interaction decisions."/>
      <div className="pd-principles"><article><span>VISIBILITY OF STATUS</span><h4>Confirm the action.</h4><p>Show added content, changed tags and visible progress instead of leaving users guessing.</p></article><article><span>MATCH TO MENTAL MODEL</span><h4>Use their language.</h4><p>Keep familiar problem terms and recognizable labels across input, results and guides.</p></article><article><span>RECOGNITION & TRUST</span><h4>Show who is behind advice.</h4><p>Place verified source information alongside guidance so credibility is not hidden in a separate screen.</p></article></div>
      <p className="pd-evidence">Evidence boundary: the supplied review describes peer feedback, heuristic evaluation and illustrative task observations. It does not establish a representative user study or measured improvement in a live product.</p>
    </Chapter>

    <Chapter id="cp-reflection" number="06" eyebrow="REFLECTION" title="Design the next confident decision.">
      <p>My central learning was to treat trust as an interaction requirement—not a marketing message. A useful result has to tell the cleaner what to do, why it is credible and when a human expert is the safer route. The resulting prototype is more coherent because screens follow decisions rather than a catalogue of features.</p>
      <p>Next, I would test the critical path with practicing cleaners, measure unaided completion and comprehension, and examine how clearly people distinguish professional guidance from AI-assisted discovery.</p>
      <div className="pd-footer-link"><a href={cleanPeerFigma} target="_blank" rel="noreferrer">Review research and prototype rationale in Figma <ArrowRight size={18}/></a></div>
    </Chapter>
  </main>
}

export function AuraCase({ back }: { back: () => void }) {
  return <main className="pd-case pd-case--aura" id="top">
    <CaseTop back={back} color="aura" label="AURA ATELIER / HUMAN-CENTERED AI & LUXURY EXPERIENCE" title="From too many choices" emphasized="to quiet confidence." lead="A mobile-first AI concierge for emotionally intelligent luxury discovery. I independently developed the product strategy, research plan, primary persona, user flows and high-fidelity conversational interface—keeping human expertise at the center of the experience." image="portfolio-aura-cover.webp" imageAlt="Original AURA Atelier mobile screens: personalized greeting, emotional styling request and visible AI progress" facts={[
      {label:'MY ROLE',value:'Sole product, UX & UI designer'},
      {label:'DISCIPLINE',value:'Human–AI interaction, strategy & UX research'},
      {label:'DELIVERABLE',value:'Mobile-first prototype & end-to-end flow'},
      {label:'PRODUCT STATUS',value:'Concept and designed prototype'}
    ]} links={[{name:'View AURA Figma source',href:auraFigma}]}/>
    <nav className="pd-local-nav" aria-label="Aura case sections"><a href="#aura-challenge">Problem</a><a href="#aura-persona">Research framing</a><a href="#aura-journey">Experience flow</a><a href="#aura-ui">Interface</a><a href="#aura-trust">Human–AI trust</a></nav>

    <Chapter id="aura-challenge" number="01" eyebrow="STRATEGIC CHALLENGE" title="Luxury customers don't just buy products. They seek assurance.">
      <p>High-end discovery can still feel overwhelming. An abundance of product options doesn't resolve the emotional pressure of dressing for an important moment. AURA Atelier begins with the client's occasion, preferences and desired feeling instead of a product grid. Its goal is to reduce uncertainty while preserving the care and discretion associated with a personal advisor.</p>
      <div className="pd-insight"><span>THE PRODUCT POSITION</span><strong>AI helps articulate preferences and narrow options; a human advisor takes over when context, taste or confidence requires real expertise.</strong></div>
      <p>I intentionally rejected a fully automated shopping chatbot. The interface is a relationship layer: a calm conversation that makes recommendations understandable and a boutique visit easier to prepare for.</p>
    </Chapter>

    <Chapter id="aura-persona" number="02" eyebrow="RESEARCH FRAMING & PERSONA" title="Design for the emotional job, not just the functional task.">
      <p>The priority persona, Léa Moreau, represents a luxury client navigating an important social moment. Her job-to-be-done is not “show me dresses”—it is to feel confident and authentic without the anxiety of getting luxury wrong. That reframing informed the tone, the order of questions and the handoff to a real advisor.</p>
      <div className="pd-grid pd-grid--two"><Artifact file="portfolio-aura-persona.webp" alt="AURA Atelier Léa Moreau priority persona and jobs-to-be-done" caption="Priority persona and JTBD: a design model to investigate rather than a verified population segment."/><Artifact file="portfolio-aura-research.webp" alt="Proposed AURA research methods including interviews observation and benchmarking" caption="Research plan: proposed interviews, observation, stakeholder conversations and competitor review."/></div>
      <p>I defined research questions across emotional expectations, uncertainty, personalization and trust. The file documents the proposed research methods and a usability plan; it should not be presented as completed fieldwork or measured research results.</p>
    </Chapter>

    <Chapter id="aura-journey" number="03" eyebrow="SERVICE BLUEPRINT & MVP" title="Every step should make the next one feel easier.">
      <p>The planned journey moves through seven meaningful stages: discover AURA, explore a personal atelier, describe the moment, compare a curated shortlist, refine with feedback, connect to a human advisor and continue the boutique experience. Emotional intent and confidence connect the digital and physical touchpoints.</p>
      <Artifact file="portfolio-aura-journey.webp" alt="AURA emotional journey map tracing confidence through service stages" caption="Emotional journey map: touchpoints and confidence shifts, modeled for the primary persona."/>
      <Artifact file="portfolio-aura-flow.webp" alt="AURA user flow from emotional prompt through recommendations to advisor handoff" caption="User flow: describe an occasion → curated guidance → refinement → advisor → continued experience."/>
      <p>MVP prioritization was not a feature race. Conversational guidance, contextual understanding, recommendation rationale, preference memory and a human-advisor transition were essential to test the concept. Additional commerce automation and advanced wardrobe analysis remained outside the initial focus.</p>
      <Artifact file="portfolio-aura-mvp.webp" alt="AURA MoSCoW prioritization board showing must should could and won't features" caption="MoSCoW scope: experience quality and human continuity ahead of optional automation."/>
    </Chapter>

    <Chapter id="aura-ui" number="04" eyebrow="THE DESIGNED EXPERIENCE" title="A quiet interface that stays out of the way.">
      <p>The prototype uses warm neutrals, editorial typography and restrained cards to give the conversation space. Rather than confronting users with a catalog, it makes one question or decision visible at a time. Saved inspirations create continuity, while recognizable advisor information signals that assistance is always available.</p>
      <div className="pd-grid pd-grid--two">
        <Artifact file="portfolio-aura-intro.webp" alt="AURA onboarding and first conversation screens" caption="01 / Opening: contextual greeting, free-text prompt, saved inspirations and advisor presence."/>
        <Artifact file="portfolio-aura-interactions.webp" alt="AURA conversational preference input and micro-interactions" caption="02 / Interaction: conversational refinement rather than complicated filters."/>
        <Artifact file="portfolio-aura-status.webp" alt="AURA progress and service update screens" caption="03 / Status: visible progress and appointment information reduce uncertainty."/>
        <Artifact file="portfolio-aura-curated.webp" alt="AURA curated luxury outfits and styling suggestions" caption="04 / Recommendations: comparative, visually curated looks with room to choose."/>
        <Artifact file="portfolio-aura-friction.webp" alt="AURA difficult request and AI uncertainty handling" caption="05 / Friction: the system recognizes uncertain social context instead of pretending to know."/>
        <Artifact file="portfolio-aura-handoff.webp" alt="AURA advisor Camille handoff through conversational interface" caption="06 / Human handoff: pass preference context to Camille without asking clients to repeat themselves."/>
      </div>
      <Artifact file="portfolio-aura-ending.webp" alt="AURA appointment confirmation and saved conversation outcome" caption="07 / Resolution: a concrete appointment confirmation and continuity after the conversation."/>
    </Chapter>

    <Chapter id="aura-trust" number="05" eyebrow="HUMAN–AI INTERACTION" title="Trust is strongest when the system knows its limits.">
      <div className="pd-principles"><article><span>01 / USER CONTROL</span><h4>Suggest, don't pressure.</h4><p>Explain fit and present alternatives. The client stays in control of the decision.</p></article><article><span>02 / HONEST UNCERTAINTY</span><h4>Don't improvise authority.</h4><p>If an occasion depends on subtle norms or human judgement, disclose uncertainty and invite advisor review.</p></article><article><span>03 / CONTINUITY</span><h4>Pass context, not just contact.</h4><p>The transition to Camille carries the shortlist, preferences and occasion so the conversation feels continuous.</p></article></div>
      <div className="pd-insight"><span>DESIGN PRINCIPLE</span><strong>AI provides speed and personalized discovery. The human relationship provides judgement, empathy and confidence.</strong></div>
    </Chapter>

    <Chapter id="aura-evaluation" number="06" eyebrow="TEST PLAN & NEXT STEPS" title="Validate confidence before optimizing conversion.">
      <p>I outlined moderated prototype testing with 5–7 prospective participants, focused on emotional discovery, comprehensible recommendations, friction handling and advisor handoff. Candidate measures include unaided task completion, hesitation points, recommendation comprehension and the user's confidence after the conversation.</p>
      <Artifact file="portfolio-aura-testplan.webp" alt="AURA planned usability testing framework and tasks" caption="Proposed study design and tasks. These are plans, not completed research results."/>
      <p className="pd-evidence">The AURA presentation defines success thresholds as goals, not achieved statistics. The project is a designed prototype, and no production adoption or conversion improvement is claimed.</p>
      <p>My key product insight is that an AI experience does not feel premium simply because it is personalized. It feels premium when it is legible, well-paced, honest about uncertainty and ready to involve an expert.</p>
      <div className="pd-footer-link"><a href={auraFigma} target="_blank" rel="noreferrer">Explore the AURA design and rationale in Figma <ArrowRight size={18}/></a></div>
    </Chapter>
  </main>
}
