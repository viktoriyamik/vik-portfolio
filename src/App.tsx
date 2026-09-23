import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react'
import { askPortfolioAI } from './lib/ai'
import './App.css'

type ID = 'haesiivooja' | 'aura' | 'cleanpeer'
type Case = { id: ID; name: string; category: string; headline: string; summary: string; role: string; platform: string; status: string; challenge: string; process: string[]; decisions: {title:string;text:string}[]; outcome: string; links: {text:string;url:string}[] }
const figma = 'https://www.figma.com/design/U2iXpoIjaCTCBmiePL8GJi/Viktoriya-Mikhaylova---Product-Design-Portfolio'
const cases: Case[] = [
  {id:'haesiivooja',name:'HaeSiivooja',category:'SaaS marketplace · Web & mobile',headline:'A simpler way to find and book a local cleaner.',summary:'A two-sided marketplace connecting people who need cleaning services with local cleaners. Discovery, booking and appointment management come together in one service.',role:'Product design · UX/UI design',platform:'Web · Android',status:'Live product',challenge:'The experience has to support two connected needs: customers want to find and request a trusted service with confidence, while cleaners need to manage incoming work and appointments.',process:['Mapped the customer path from finding nearby cleaners to requesting and managing a booking.','Considered the cleaner experience alongside the customer experience so both sides of the marketplace connect.','Prioritized clear service information, straightforward scheduling and trust at the point of choice.'],decisions:[{title:'Two connected journeys',text:'Customer discovery and cleaner work management belong to the same service experience.'},{title:'Visible booking path',text:'Finding a provider, requesting a service and tracking an appointment are easy to understand.'},{title:'Trust in the details',text:'Service and provider information help customers make an informed choice.'}],outcome:'HaeSiivooja is available as a live service and Android app. No usage or conversion metrics are claimed in this case.',links:[{text:'Visit the service',url:'https://haesiivooja.fi'},{text:'View Google Play screens',url:'https://play.google.com/store/apps/details?id=com.cleanerfinder'}]},
  {id:'aura',name:'Aura',category:'Product design · Interface concept',headline:'Exploring a cohesive digital product experience.',summary:'A product and interface design case documented in Viktoriya’s Figma portfolio. The linked board contains the source screens for this concept.',role:'Product design · UX/UI design',platform:'Figma',status:'Design concept',challenge:'Create a connected digital experience with a clear hierarchy, coherent visual direction and understandable interactions.',process:['Organized the concept as a product journey rather than a set of isolated screens.','Worked through visual hierarchy and consistency across the interface.','Documented the design in the Figma board for direct review.'],decisions:[{title:'Clear hierarchy',text:'Important actions and content should be distinguishable at a glance.'},{title:'Consistent language',text:'Repeating patterns help the experience feel like one product.'},{title:'Reviewable source',text:'The Figma board provides the detailed visual evidence for this case.'}],outcome:'Aura is presented as a design concept. Launch status, user testing and quantitative outcomes are not asserted.',links:[{text:'Explore Aura in Figma',url:`${figma}?node-id=0-1&t=9kXJZFCfY4z6CPPO-1`}]},
  {id:'cleanpeer',name:'CleanPeer',category:'UX research · IA · Wireframing',headline:'Trustworthy answers for cleaners, right when they need them.',summary:'A learning and professional community concept that connects practical guidance, structured learning, AI support and knowledge from experienced people.',role:'Product strategy · UX research · UX/UI design',platform:'Mobile-first concept',status:'Research & prototype',challenge:'Sofia, an employed cleaner, encounters an unfamiliar problem at work. She needs practical guidance quickly and must decide whether it is safe to trust and apply.',process:['Developed a provisional learner persona and prioritized the unfamiliar-problem journey.','Mapped search, AI and expert/community routes, with checks for understanding and trust.','Created the sitemap, user flow and key screens around phone use during a workday.'],decisions:[{title:'Begin with the task',text:'Start with Sofia’s cleaning problem rather than a course catalogue.'},{title:'More than one route',text:'Search, AI and human support offer alternatives when a first answer is insufficient.'},{title:'Make trust visible',text:'Understanding and trust checks appear before she applies advice at work.'}],outcome:'The persona, journey and design choices are provisional. The concept needs validation with cleaners before its assumptions can be treated as findings.',links:[{text:'Explore CleanPeer in Figma',url:`https://www.figma.com/proto/U2iXpoIjaCTCBmiePL8GJi/Viktoriya-Mikhaylova---Product-Design-Portfolio?node-id=5-78&t=9kXJZFCfY4z6CPPO-1`}]},
]
function Visual({id}:{id:ID}){return <div className={`visual visual-${id}`} aria-hidden="true">{id==='haesiivooja'?<div className="mock mock-clean"><small>HaeSiivooja <span>✳</span></small><h3>A cleaner home,<br/><em>made simple.</em></h3><div className="search">Find cleaning near you <b>↗</b></div><div className="tiles"><i/><i/><i/></div></div>:id==='aura'?<div className="orb"><span>AURA<small>product design exploration</small></span></div>:<div className="mock mock-peer"><small>✳ cleanpeer</small><h3>What can we help<br/>you solve today?</h3><div className="search">Describe your cleaning question <b>↗</b></div><div className="tags"><span>Search</span><span>Ask AI</span><span>Ask an expert</span></div></div>}</div>}
type Source = { file: string; url: string }
function Assistant(){
 const [question,setQuestion]=useState('')
 const [answer,setAnswer]=useState('Ask about Viktoriya’s projects, UX research or product design process.')
 const [sources,setSources]=useState<Source[]>([])
 const [busy,setBusy]=useState(false)
 const suggestions=['Tell me about your projects','Tell me about your accessibility experience','Tell me about your IxDF studies','Show blog articles']
 const ask=async (raw:string)=>{
  const query=raw.trim();if(!query||busy)return
  setBusy(true);setAnswer('Finding an answer…');setSources([])
  try{const result=await askPortfolioAI(query);setAnswer(result.answer||'No answer was returned.');setSources(Array.isArray(result.sources)?result.sources:[])}
  catch{setAnswer('The portfolio AI is unavailable right now. Please try again later.')}
  finally{setBusy(false);setQuestion('')}
 }
 return <aside className="assistant" aria-labelledby="assistant-title">
  <div className="assistant-top"><p className="overline">AI ASSISTANT</p><span aria-hidden="true">✳</span></div>
  <h2 id="assistant-title">Ask about<br/><em>the work.</em></h2>
  <p className="assistant-intro">Explore Viktoriya’s projects and design background through the portfolio AI.</p>
  <div className="assistant-response" role="status" aria-live="polite">{answer}</div>
  {sources.length>0&&<div className="assistant-sources"><small>SOURCES</small>{sources.map(source=><a key={source.url} href={source.url.startsWith('http')?source.url:source.url.startsWith('/')?source.url:`/${source.url}`} target="_blank" rel="noreferrer">{source.file} ↗</a>)}</div>}
  <form onSubmit={event=>{event.preventDefault();void ask(question)}}><label htmlFor="ai-question">Ask a question</label><div className="assistant-input"><input id="ai-question" value={question} onChange={event=>setQuestion(event.target.value)} placeholder="Ask about a case study…"/><button disabled={busy} type="submit">{busy?'Thinking…':'Ask ↗'}</button></div></form>
  <div className="assistant-shortcuts"><small>TRY A QUESTION</small>{suggestions.map(item=><button disabled={busy} key={item} onClick={()=>void ask(item)}>{item} <ArrowUpRight size={14}/></button>)}</div>
 </aside>
}
const images:Record<ID,{src:string;alt:string;caption:string}[]>={
 haesiivooja:[
  {src:'/cases/haesiivooja-1.png',alt:'HaeSiivooja Android login screen',caption:'Account access'},
  {src:'/cases/haesiivooja-2.png',alt:'HaeSiivooja service selection screen',caption:'Selecting a service'},
  {src:'/cases/haesiivooja-3.png',alt:'HaeSiivooja cleaner account screen',caption:'Cleaner work management'},
 ],
 aura:[],
 cleanpeer:[
  {src:'/cases/cleanpeer-prototype.png',alt:'CleanPeer five-screen paper prototype with rationale',caption:'Five key screens and their design rationale'},
  {src:'/cases/cleanpeer-flow.png',alt:'CleanPeer cleaning-problem flow wireframe',caption:'Mapping the cleaning-problem journey'},
 ],
}
function App(){
 const [active,setActive]=useState<ID|null>(null),[menu,setMenu]=useState(false)
 useEffect(()=>{const read=()=>{const id=location.hash.slice(6) as ID;setActive(cases.some(c=>c.id===id)?id:null)};read();addEventListener('hashchange',read);return()=>removeEventListener('hashchange',read)},[])
 useEffect(()=>{if(active)scrollTo({top:0,behavior:'smooth'})},[active])
 const current=cases.find(c=>c.id===active)
 const jump=(id:string)=>{setMenu(false);location.hash=id;setActive(null);setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'}),0)}
 return <div className="site">
  <header className="header"><a href="#top" onClick={()=>setActive(null)} className="logo">VM<span>.</span></a><nav className={menu?'open':''}><button onClick={()=>jump('work')}>Projects</button><button onClick={()=>jump('whoami')}>Who I am</button><button onClick={()=>jump('contact')}>Contact</button></nav><button className="menu" aria-label="Toggle menu" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></header>
  {current?<main className="case" id="top">
   <button className="back" onClick={()=>jump('work')}><ArrowLeft size={18}/> All projects</button>
   <div className="case-intro"><p className="overline">CASE STUDY / {current.category}</p><h1>{current.name}<em>{current.headline}</em></h1><p>{current.summary}</p></div>
   <Visual id={current.id}/>
   <div className="facts"><div><small>MY ROLE</small><strong>{current.role}</strong></div><div><small>PLATFORM</small><strong>{current.platform}</strong></div><div><small>STATUS</small><strong>{current.status}</strong></div></div>
   <section className="case-section split"><span>01 / CHALLENGE</span><div><h2>The problem to solve</h2><p>{current.challenge}</p></div></section>
   <section className="case-section split"><span>02 / APPROACH</span><div><h2>From problem to experience</h2><ol>{current.process.map((step,i)=><li key={step}><b>0{i+1}</b>{step}</li>)}</ol></div></section>
   <section className="case-section"><span>03 / DESIGN DECISIONS</span><h2>Choices behind the work</h2><div className="decisions">{current.decisions.map(d=><article key={d.title}><span>✳</span><h3>{d.title}</h3><p>{d.text}</p></article>)}</div></section>
   <section className="case-section"><span>04 / SELECTED SCREENS</span><h2>Explore the experience</h2>{images[current.id].length?<div className={`case-gallery gallery-${current.id}`}>{images[current.id].map(image=><figure key={image.src}><img src={image.src} alt={image.alt} loading="lazy"/><figcaption>{image.caption}</figcaption></figure>)}</div>:<div className="design-reference"><Visual id="aura"/><p>A visual illustration of the Aura case. Explore the linked Figma board for Viktoriya’s original design screens.</p><a href={current.links[0].url} target="_blank" rel="noreferrer">View original Aura design <ArrowUpRight size={17}/></a></div>}</section>
   <section className="case-section split"><span>05 / STATUS</span><div><h2>Where the work stands</h2><p>{current.outcome}</p><div className="links">{current.links.map(l=><a href={l.url} key={l.url} target="_blank" rel="noreferrer">{l.text} <ArrowUpRight size={17}/></a>)}</div></div></section>
   <a className="next" href={`#case-${cases[(cases.indexOf(current)+1)%3].id}`}><small>UP NEXT</small>{cases[(cases.indexOf(current)+1)%3].name}<ArrowRight/></a>
  </main>:<main id="top">
   <section className="intro"><p className="overline">VIKTORIYA MIKHAYLOVA / PRODUCT DESIGNER & UX/UI DESIGNER</p><h1>Designing useful digital products<br/>with <em>clarity and care.</em></h1><p>I connect research, product thinking and interface design to turn complex needs into experiences people can understand and use.</p></section>
   <section className="portfolio-columns" id="work"><div className="featured"><p className="overline">FEATURED PROJECTS / 01—03</p><h2>Selected work</h2><div className="featured-list">{cases.map((c,i)=><a href={`#case-${c.id}`} className="featured-card" key={c.id}><Visual id={c.id}/><div><small>0{i+1} / {c.category}</small><h3>{c.name}</h3><p>{c.headline}</p><span>View case study <ArrowUpRight size={15}/></span></div></a>)}</div></div><Assistant/></section>
   <section className="whoami" id="whoami"><div><p className="overline">WHO I AM</p><h2>Product designer.<br/><em>UX/UI designer.</em></h2></div><div><p>I’m Viktoriya Mikhaylova. I own the product and UX/UI design work presented in these case studies. My practice spans problem framing, UX research, information architecture, flows, wireframes, prototyping and visual interface design.</p><p>My background in digital services and data helps me connect user needs with product decisions and the realities of implementation.</p><div className="skills">{['Product discovery','UX research','Service design','Personas & journeys','Information architecture','User flows','Wireframing','Interaction design','UI design','Prototyping','Usability testing','Accessibility','Design systems','Figma'].map(s=><span key={s}>{s}</span>)}</div></div></section>
   <section className="contact" id="contact"><p className="overline">CONTACT</p><h2>Let’s design<br/><em>what’s next.</em></h2><div className="contact-links"><a href="mailto:viktoriya.mikhaylova@hotmail.com">Email <span>viktoriya.mikhaylova@hotmail.com ↗</span></a><a href="https://github.com/viktoriyamik" target="_blank" rel="noreferrer">GitHub <span>github.com/viktoriyamik ↗</span></a><a href="https://www.linkedin.com/in/viktoriya-mikhaylova/" target="_blank" rel="noreferrer">LinkedIn <span>View profile ↗</span></a></div></section>
  </main>}
  <footer><span>© {new Date().getFullYear()} Viktoriya Mikhaylova</span><div><a href="mailto:viktoriya.mikhaylova@hotmail.com">Email ↗</a><a href="https://www.linkedin.com/in/viktoriya-mikhaylova/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div></footer>
 </div>
}
export default App
