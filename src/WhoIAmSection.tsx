import { ArrowUpRight, Compass, Layers, Eye, Sparkles } from 'lucide-react'
import './WhoIAmSection.css'

const expertise = [
  {
    number: '01', icon: <Compass size={21} strokeWidth={1.7} aria-hidden="true" />,
    title: 'Product thinking',
    text: 'I connect user needs, business context and delivery constraints. Before choosing a solution, I clarify the problem, the decisions people need to make and what success should look like.'
  },
  {
    number: '02', icon: <Eye size={21} strokeWidth={1.7} aria-hidden="true" />,
    title: 'Research & validation',
    text: 'I use interviews, journey mapping, task analysis, usability reviews and prototype testing to uncover friction. Findings become specific design choices rather than a report that sits unused.'
  },
  {
    number: '03', icon: <Layers size={21} strokeWidth={1.7} aria-hidden="true" />,
    title: 'UX, UI & systems',
    text: 'From information architecture and interaction flows to responsive interfaces, accessibility and consistent components, I design the details that make a service understandable and usable.'
  },
  {
    number: '04', icon: <Sparkles size={21} strokeWidth={1.7} aria-hidden="true" />,
    title: 'Human–AI interaction',
    text: 'I am interested in useful, accountable AI: visible system status, clear user control, honest uncertainty and meaningful routes to human expertise when automation reaches its limits.'
  }
]

const principles = [
  { number: '01', title: 'Understand the situation', detail: 'Map the people, their real task, the surrounding service and the constraints.' },
  { number: '02', title: 'Make the logic visible', detail: 'Define the information, choices and flows before polishing the interface.' },
  { number: '03', title: 'Prototype the decisions', detail: 'Build realistic interactions so ideas can be tested instead of merely described.' },
  { number: '04', title: 'Learn and improve', detail: 'Use feedback and evidence to refine the journey, then make the next decision clearer.' }
]

export default function WhoIAmSection() {
  return <section className="vm-about" id="whoami" aria-labelledby="vm-about-title">
    <div className="vm-about-inner">
      <header className="vm-about-header">
        <div className="vm-about-eyebrow"><span aria-hidden="true" className="vm-about-dot"/> ABOUT / VIKTORIYA MIKHAYLOVA</div>
        <div className="vm-about-hero">
          <div>
            <p className="vm-about-kicker">Who I am</p>
            <h2 id="vm-about-title">I design for the moments <em>that matter.</em></h2>
          </div>
          <div className="vm-about-intro">
            <p className="vm-about-lead">I’m Viktoriya, a Product & UX/UI Designer working at the intersection of human needs, digital services and emerging technology.</p>
            <p>I turn complex ideas into focused experiences—from discovering the problem and shaping the user journey to designing interfaces and interactive prototypes. I care about the reasoning behind each screen as much as the visual result.</p>
            <p>My background brings together <strong>Business Information Technology, graphic design and photography,</strong> with hands-on digital product work. It helps me see both the system behind an experience and the small moments that make it understandable.</p>
          </div>
        </div>
      </header>

      <div className="vm-about-statement">
        <span className="vm-about-label">MY DESIGN POINT OF VIEW</span>
        <p>Good product design is not about adding features. It is about helping someone make the <em>next confident decision.</em></p>
      </div>

      <div className="vm-about-subhead">
        <div><span className="vm-about-label">WHAT I BRING</span><h3>Strategy meets hands-on craft.</h3></div>
        <p>I work across the product-design process, connecting research, structure, interaction and interface quality.</p>
      </div>
      <div className="vm-about-capabilities">
        {expertise.map(item => <article key={item.number}>
          <div className="vm-about-cap-top"><span>{item.number}</span>{item.icon}</div>
          <h4>{item.title}</h4>
          <p>{item.text}</p>
        </article>)}
      </div>

      <div className="vm-about-method">
        <div className="vm-about-method-intro">
          <span className="vm-about-label">HOW I WORK</span>
          <h3>From ambiguity to an experience people can use.</h3>
          <p>I use a research-informed process, but I adapt the depth and tools to the challenge. The aim is always to make deliberate decisions, test assumptions and keep the user’s task in focus.</p>
        </div>
        <ol className="vm-about-steps">
          {principles.map(step => <li key={step.number}><span>{step.number}</span><div><h4>{step.title}</h4><p>{step.detail}</p></div></li>)}
        </ol>
      </div>

      <div className="vm-about-proof">
        <div>
          <span className="vm-about-label">THE WORK BEHIND THE WORDS</span>
          <h3>Different products. The same responsibility to make things clear.</h3>
        </div>
        <p><strong>HaeSiivooja</strong> brings customer booking and professional coordination into one service experience. <strong>CleanPeer</strong> explores trusted, practical learning for professional cleaners. <strong>AURA Atelier</strong> examines how an AI concierge can support confidence without replacing human judgement. My portfolio also includes website, service-design and interface projects, such as <strong>Laurea Digital Living Lab</strong>.</p>
      </div>

      <div className="vm-about-footer">
        <p>I’m continuing to develop my practice in digital product design and AI, with particular interest in accessible interfaces, design systems, UX research and responsible human–AI experiences.</p>
        <div className="vm-about-links"><a href="#work">Explore selected work <ArrowUpRight size={18} aria-hidden="true" /></a><a href="mailto:viktoriya.mikhaylova@hotmail.com">Get in touch <ArrowUpRight size={18} aria-hidden="true" /></a></div>
      </div>
    </div>
  </section>
}
