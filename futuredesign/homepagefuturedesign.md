UCA Future Homepage Designs & Archives

This document serves as an archive for sections that have been temporarily removed but will be useful as the United Club Association scales. You can copy and paste these blocks back into index.html and index.css when needed.

1. Featured Events Section

When the clubs begin hosting multiple events, you can drop this section back onto the homepage to highlight recent activities.

HTML Block

<!-- Featured Events Section -->
<section class="events section-container" id="events">
   <div class="section-header text-center gsap-fade-up">
      <h2>Featured <span class="text-gradient">Events</span></h2>
      <p>Discover the latest activities and competitions from our clubs.</p>
   </div>
   
   <div class="event-showcase">
      <div class="event-grid">
         <article class="event-card event-card--fftour gsap-stagger-item">
            <div class="event-image">
               <img src="/images/fftour25.jpeg" alt="Poster for FF Tour Event" loading="lazy" />
            </div>
            <div class="event-content">
               <div class="event-date"><span>FEB 15 2025</span></div>
               <h3>ULIC Free Fire Tour '25</h3>
               <p>A thrilling esports tournament bringing top players together.</p>
               <a href="/events/fftour25.html" class="read-more">Read More <i data-feather="arrow-right"></i></a>
            </div>
         </article>

         <article class="event-card event-card--snapfest gsap-stagger-item">
            <div class="event-image">
               <img src="/images/snapfest-bg.jpeg" alt="Poster for SnapFest Event" loading="lazy" />
            </div>
            <div class="event-content">
               <div class="event-date"><span>FEB 23 2025</span></div>
               <h3>SnapFest '25</h3>
               <p>The ultimate photography contest hosted by Photography Club.</p>
               <a href="/events/snapfest.html" class="read-more">Read More <i data-feather="arrow-right"></i></a>
            </div>
         </article>

         <article class="event-card event-card--uca-unveiled gsap-stagger-item">
            <div class="event-image">
               <img src="/images/banner-3.jpg" alt="Poster for UCA Unveiled Event" loading="lazy" />
            </div>
            <div class="event-content">
               <div class="event-date"><span>MAY 08 2025</span></div>
               <h3>UCA Unveiled</h3>
               <p>Join us in the Introduction as we reveal the official clubs.</p>
               <a href="/events/uca-unveiled.html" class="read-more">Read More <i data-feather="arrow-right"></i></a>
            </div>
         </article>
      </div>
   </div>
</section>


CSS Block

/* Featured Events Styles Archive */
.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.event-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  transition: transform var(--transition-smooth);
  display: flex;
  flex-direction: column;
}

.event-card:hover {
  transform: translateY(-5px);
  border-color: rgba(139, 92, 246, 0.4);
}

.event-image {
  height: 200px;
  overflow: hidden;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.event-card:hover .event-image img {
  transform: scale(1.05);
}

.event-content {
  padding: 2rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.event-date {
  font-size: 0.85rem;
  color: var(--color-secondary-glow);
  margin-bottom: 1rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.event-content h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
}

.event-content p {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  flex-grow: 1;
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-primary);
  font-weight: 600;
  margin-top: auto;
  transition: color 0.3s ease;
}

.read-more:hover {
  color: var(--color-primary-glow);
}

.read-more i {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.read-more:hover i {
  transform: translateX(4px);
}


2. Quantitative Stats (High Numbers)

When the association grows to have a large number of clubs and events, use this raw numeric variation instead of the current narrative-driven one.

HTML Block

<div class="stats-grid">
   <div class="stat-card gsap-stagger-item">
      <h3 class="stat-number" data-target="15" data-suffix="">0</h3>
      <p class="stat-label">Active Clubs</p>
   </div>
   <div class="stat-card gsap-stagger-item">
      <h3 class="stat-number" data-target="500" data-suffix="+">0</h3>
      <p class="stat-label">Student Members</p>
   </div>
   <div class="stat-card gsap-stagger-item">
      <h3 class="stat-number" data-target="120" data-suffix="+">0</h3>
      <p class="stat-label">Events Hosted</p>
   </div>
</div>
