import { ArrowUpRight, Compass, Layers, Eye, Sparkles } from 'lucide-react'
import './WhoIAmSection.css'

const expertise = [
  {
    number: '01', icon: <Compass size={21} strokeWidth={1.7} aria-hidden="true" />,
    title: 'Product strategy & discovery',
    text: 'I connect user needs, product opportunities and technical constraints. I frame the problem, clarify the value proposition, prioritize what matters and turn uncertainty into testable product decisions.'
  },
  {
    number: '02', icon: <Sparkles size={21} strokeWidth={1.7} aria-hidden="true" />,
    title: 'Human–AI experiences',
    text: 'I design AI interactions around genuine user value: useful assistance, explainable recommendations, transparent uncertainty, meaningful control and a thoughtful handoff to people when expertise matters.'
  },
  {
    number: '03', icon: <Eye size={21} strokeWidth={1.7} aria-hidden="true" />,
    title: 'Research, testing & learning',
    text: 'I explore user motivations and behaviours through interviews, task flows, journeys and usability testing. I turn what I learn into clearer interaction models, stronger decisions and focused iterations.'
  },
  {
    number: '04', icon: <Layers size={21} strokeWidth={1.7} aria-hidden="true" />,
    title: 'Interface systems & visual craft',
    text: 'I translate information architecture and service journeys into accessible interfaces, design systems and prototypes. Typography, composition and visual storytelling give those experiences clarity, while technical understanding keeps them feasible.'
  }
]

const principles = [
  { number: '01', title: 'Frame the product opportunity', detail: 'Understand the person, their task, the business context and where technology can add meaningful value.' },
  { number: '02', title: 'Define the experience logic', detail: 'Map decisions, edge cases, information flows and the boundaries between AI assistance and human agency.' },
  { number: '03', title: 'Prototype realistic interactions', detail: 'Turn assumptions into testable journeys, working interfaces and tangible design alternatives.' },
  { number: '04', title: 'Validate and iterate', detail: 'Use evidence, feedback and accessibility principles to refine the next important product decision.' }
]

export default function WhoIAmSection() {
  return <section className="vm-about" id="whoami" aria-labelledby="vm-about-title">
    <div className="vm-about-inner">
      <header className="vm-about-header">
        <div className="vm-about-eyebrow"><span aria-hidden="true" className="vm-about-dot"/> ABOUT / VIKTORIYA MIKHAYLOVA</div>
        <div className="vm-about-hero">
          <div>
            <p className="vm-about-kicker">Who I am</p>
            <h2 id="vm-about-title">I design <em>human-centred AI products.</em></h2>
          </div>
          <div className="vm-about-intro">
            <p className="vm-about-lead">I’m Viktoriya, an <strong>AI-driven Product Designer</strong> who turns complex needs and emerging technologies into useful, considered digital products.</p>
            <p>I work across the product lifecycle—from opportunity framing and research to experience strategy, interaction design, accessible interfaces and working prototypes. My focus is the whole product experience, not an isolated screen.</p>
            <p>My background combines <strong>Business Information Technology with graphic design and photography</strong>. It gives me both systems thinking and an eye for visual hierarchy, composition and storytelling—skills I apply to products that need to feel as clear as they are capable.</p>
          </div>
        </div>
      </header>

      <div className="vm-about-statement">
        <span className="vm-about-label">MY DESIGN POINT OF VIEW</span>
        <p>AI should make a product <em>more useful, understandable and empowering</em>—not simply more automated.</p>
      </div>

      <div className="vm-about-subhead">
        <div><span className="vm-about-label">WHAT I BRING</span><h3>Strategy, research and hands-on product craft.</h3></div>
        <p>I connect product thinking, human–AI interaction, evidence-based design and implementation-aware execution.</p>
      </div>
      <div className="vm-about-capabilities">
        {expertise.map(item => <article key={item.number}>
          <div className="vm-about-cap-top"><span>{item.number}</span>{item.icon}</div>
          <h4>{item.title}</h4>
          <p>{item.text}</p>
        </article>)}
      </div>


      <section className="vm-about-visual" aria-labelledby="vm-about-visual-title">
        <div className="vm-about-visual-intro">
          <span className="vm-about-label">THE FOUNDATION BEHIND MY UI CRAFT</span>
          <h3 id="vm-about-visual-title">Visual communication is part of the product—not a finishing touch.</h3>
          <p>Graphic design taught me to build hierarchy, rhythm and consistency. Photography sharpened how I think about framing, focus and storytelling. I use both to guide attention and make complex digital experiences easier to understand, without losing sight of usability or accessibility.</p>
        </div>
        <div className="vm-about-visual-grid">
          <article><span>01 / GRAPHIC DESIGN</span><h4>Make information clear.</h4><p>Typography, layout and visual identity help people recognize what matters and navigate with confidence.</p></article>
          <article><span>02 / PHOTOGRAPHY</span><h4>Give every detail a purpose.</h4><p>Composition, light and narrative inform my approach to imagery, art direction and visual focus.</p></article>
          <article><span>03 / PRODUCT APPLICATION</span><h4>Connect craft to usability.</h4><p>I apply that visual foundation to responsive interfaces, accessible components and coherent product systems.</p></article>
        </div>
      </section>


      <section className="vm-about-toolkit" aria-labelledby="vm-about-toolkit-title">
        <div className="vm-about-toolkit-heading">
          <span className="vm-about-label">TOOLS &amp; PLATFORMS</span>
          <h3 id="vm-about-toolkit-title">From design thinking to tangible experiences.</h3>
          <p>I choose tools according to the product, its users and what needs to be tested or delivered.</p>
        </div>
        <div className="vm-about-toolkit-list">
          <div><h4>Product design &amp; prototyping</h4><p>Figma, interaction flows, design systems and functional prototypes.</p></div>
          <div><h4>Graphic design &amp; photography</h4><p>Adobe Creative Cloud for visual assets, image editing, illustration and layout.</p></div>
          <div><h4>Web implementation &amp; CMS</h4><p>React, HTML, CSS and JavaScript for interactive web experiences; WordPress and Wix for content-managed websites.</p></div>
        </div>
      </section>

      <div className="vm-about-method">
        <div className="vm-about-method-intro">
          <span className="vm-about-label">HOW I WORK</span>
          <h3>From product ambiguity to meaningful interaction.</h3>
          <p>I start with the decision a person needs to make, not the screen that needs to be drawn. My process adapts to the context, keeping user value, feasibility and trust visible from concept to validation.</p>
        </div>
        <ol className="vm-about-steps">
          {principles.map(step => <li key={step.number}><span>{step.number}</span><div><h4>{step.title}</h4><p>{step.detail}</p></div></li>)}
        </ol>
      </div>

      <div className="vm-about-proof">
        <div>
          <span className="vm-about-label">SELECTED PRODUCT THINKING</span>
          <h3>Real problems, connected journeys and responsible AI concepts.</h3>
        </div>
        <p><strong>AURA Atelier</strong> explores emotionally intelligent styling and a considered transition from AI concierge to human advisor. <strong>CleanPeer</strong> connects a cleaner’s immediate problem with credible guidance, expert support and learning. <strong>HaeSiivooja</strong> brings customer booking and cleaner coordination into a single service experience. <strong>Laurea Digital Living Lab</strong> adds evidence of website information architecture, responsive design and development.</p>
      </div>

      <div className="vm-about-footer">
        <p>I’m especially interested in AI-native product experiences, human–AI interaction, design systems, accessibility and research that helps teams make confident product decisions.</p>
        <div className="vm-about-links"><a href="#work">Explore selected work <ArrowUpRight size={18} aria-hidden="true" /></a><a href="mailto:viktoriya.mikhaylova@hotmail.com">Get in touch <ArrowUpRight size={18} aria-hidden="true" /></a></div>
      </div>
    </div>
  </section>
}
