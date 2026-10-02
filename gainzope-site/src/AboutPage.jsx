import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './about.css';

function Arrow() {
  return (
    <svg className="arrowGlyph" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 14L14 6m0 0H7m7 0v7" />
    </svg>
  );
}

export default function AboutPage({ onBackToHome }) {
  const reduceMotion = useReducedMotion();
  const revealAnim = reduceMotion ? {} : { opacity: 1, y: 0 };

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "About GAINZOPE | India's Transparent Rewards & Recharge Savings App";

    const descMeta = document.querySelector('meta[name="description"]');
    const prevDesc = descMeta ? descMeta.getAttribute('content') : '';
    if (descMeta) {
      descMeta.setAttribute('content', "Discover why GAINZOPE was built in India: honest 100 points = ₹1 token conversion, up to 15% mobile recharge discounts (Bronze 5% off), and our 4-phase product roadmap.");
    }

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonicalLink ? canonicalLink.getAttribute('href') : '';
    if (canonicalLink) {
      canonicalLink.setAttribute('href', 'https://gainzope.in/about');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      document.title = prevTitle;
      if (descMeta && prevDesc) descMeta.setAttribute('content', prevDesc);
      if (canonicalLink && prevCanonical) canonicalLink.setAttribute('href', prevCanonical);
    };
  }, []);

  const roadmapPhases = [
    {
      phase: '01',
      status: 'Current Focus',
      badgeClass: 'current',
      title: 'Foundation & Android Beta Launch',
      timeframe: 'Launch Stage',
      desc: 'Building a rock-solid, fair rewards core with fast Indian mobile authentication and trusted reward partners.',
      items: [
        'Secure Indian mobile OTP sign-in',
        'Daily Free Spin with IST midnight reset',
        'High-yield CPX Research paid surveys',
        'Verified action task and offer walls',
        'Referral engine with milestone rewards (15, 25, 50 friends)',
        'Hindi and English bilingual interface'
      ]
    },
    {
      phase: '02',
      status: 'Coming Next',
      badgeClass: 'upcoming',
      title: 'Direct Recharge Checkout & Token Wallet',
      timeframe: 'Post-Beta Rollout',
      desc: 'Connecting points directly to mobile recharge savings across all major Indian telecom networks without friction.',
      items: [
        'Direct recharge discounts on Jio, Airtel, Vi & BSNL',
        '100 Points = 1 GAINZOPE Token (₹1 value) conversion',
        'Bronze Level starter discount (flat 5% off)',
        'Transparent wallet with live status tracking',
        'Brand gift cards: Amazon Pay, Flipkart & Google Play',
        'Fast-track token redemption clearance'
      ]
    },
    {
      phase: '03',
      status: 'In Development',
      badgeClass: 'upcoming',
      title: 'VIP Loyalty Tiers & Community Drops',
      timeframe: 'Growth Stage',
      desc: 'Rewarding consistent everyday earners with higher discount percentages and weekly surprise perks.',
      items: [
        'Silver (8%), Gold (12%) & Platinum (15%) tier unlocks',
        'Weekly Mystery Box drops with bonus tokens',
        'Activity streak multipliers (7-day, 30-day streaks)',
        'Milestone leaderboards with extra bonus pools',
        'Priority task and survey review queues'
      ]
    },
    {
      phase: '04',
      status: 'Future Horizon',
      badgeClass: 'upcoming',
      title: 'Utility Bill Savings & Vernacular Reach',
      timeframe: 'Expansion Stage',
      desc: 'Extending token savings beyond mobile prepaid recharge to cover essential household utility expenses.',
      items: [
        'DTH recharge discounts (Tata Play, Airtel DTH, Dish TV)',
        'Electricity and broadband bill payment savings',
        'Vernacular language rollout (Tamil, Telugu, Bangla, Marathi)',
        'GAINZOPE iOS app for iPhone users',
        'Direct merchant discount partnerships'
      ]
    }
  ];

  return (
    <div className="aboutPage">
      {/* Hero Header */}
      <section className="aboutHero">
        <div className="shell aboutHeroContent">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={revealAnim}
            transition={{ duration: 0.45 }}
          >
            <span className="aboutBadge">
              <span className="aboutBadgeDot" />
              THE GAINZOPE STORY &amp; ROADMAP
            </span>
            <h1>
              Why we built GAINZOPE.<br />
              <em>And how it actually saves you money.</em>
            </h1>
            <p className="aboutHeroLead">
              In India, mobile recharge is an unavoidable monthly bill. We built GAINZOPE to turn your spare daily moments into genuine recharge savings with complete honesty and zero gimmicks.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story & Problem Section */}
      <section className="storySection">
        <div className="shell storyGrid">
          <div className="storyCol">
            <span className="pillarNum">01 / THE PROBLEM WE ARE SOLVING</span>
            <h2>
              Mobile tariffs keep rising.<br />
              <em>Most reward apps keep lying.</em>
            </h2>
            <p className="storyText">
              Whether you are a college student, a freelancer, a delivery partner, or running a family household in India, your monthly mobile recharge on <strong>Jio, Airtel, or Vi</strong> is a recurring expense you cannot skip. Over recent years, prepaid plan tariffs have jumped repeatedly.
            </p>
            <p className="storyText">
              At the same time, if you search for "earning apps" or "reward apps" on the Play Store, almost everything you find is either:
            </p>
            <div className="contrastGrid">
              <div className="contrastCard bad">
                <span className="contrastTag">THE OLD BROKEN WAY</span>
                <h3>Fake Coins &amp; Impossible Limits</h3>
                <p>Apps promise ₹500, but give you 10,000 fake coins worth 10 paise, bury you under 30-second unskippable ads, and lock withdrawals forever.</p>
              </div>
              <div className="contrastCard good">
                <span className="contrastTag">THE GAINZOPE WAY</span>
                <h3>Real Points, Direct Discounts</h3>
                <p>100 points = 1 token = ₹1. No cashout traps. Use eligible tokens directly to reduce your real Indian mobile recharge bills or redeem gift cards.</p>
              </div>
            </div>
          </div>

          <div className="storyCol">
            <span className="pillarNum">02 / OUR SIMPLE PROMISE</span>
            <h2>
              A rewards app built on<br />
              <em>transparent arithmetic.</em>
            </h2>
            <p className="storyText">
              GAINZOPE was born from a very grounded idea: <strong>Your spare time has real market value.</strong> Market research firms and brand partners happily pay for genuine consumer opinions and verified task trials.
            </p>
            <div className="storyTextHighlight">
              "Instead of pocketing that revenue or inventing confusing casino coins, GAINZOPE passes the value directly back to you as bill-slashing mobile discounts."
            </div>
            <p className="storyText">
              Here is how the discount engine works for every user from Day 1:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', gap: '10px', fontSize: '0.94rem', color: '#d2d6cb', lineHeight: 1.5 }}>
                <span style={{ color: '#c8ff00', fontWeight: 'bold' }}>1.</span>
                <span><strong>Fixed Conversion:</strong> 100 verified points = 1 GAINZOPE Token = ₹1 eligible value. Always transparent.</span>
              </li>
              <li style={{ display: 'flex', gap: '10px', fontSize: '0.94rem', color: '#d2d6cb', lineHeight: 1.5 }}>
                <span style={{ color: '#c8ff00', fontWeight: 'bold' }}>2.</span>
                <span><strong>Bronze Starter Tier:</strong> Every new user starts at Bronze Level, unlocking an instant 5% discount on mobile recharges.</span>
              </li>
              <li style={{ display: 'flex', gap: '10px', fontSize: '0.94rem', color: '#d2d6cb', lineHeight: 1.5 }}>
                <span style={{ color: '#c8ff00', fontWeight: 'bold' }}>3.</span>
                <span><strong>Real-World Math:</strong> On a popular ₹299 28-day plan, your 5% Bronze discount knocks off ₹15, and 20 tokens knock off another ₹20. You pay only ₹264!</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Values / Fair Play */}
      <section className="pillarsSection">
        <div className="shell">
          <div className="sectionHeaderCenter">
            <p className="kicker">03 / HOW WE PROTECT YOU</p>
            <h2>Three rules we will <em>never break.</em></h2>
            <p className="sub">Trust takes years to build and seconds to lose. Here is how we guarantee fair play.</p>
          </div>

          <div className="pillarsGrid">
            <article className="pillarCard">
              <span className="pillarNum">RULE 01</span>
              <h3>Zero Hidden Fees</h3>
              <p>GAINZOPE is 100% free to join and use. We will never ask for a membership fee, a deposit, or a hidden deduction when you redeem tokens.</p>
            </article>

            <article className="pillarCard">
              <span className="pillarNum">RULE 02</span>
              <h3>Crystal Clear Wallet Status</h3>
              <p>Every activity clearly shows whether your points are In Progress, Under Review, or Credited. No phantom balances or disappearing points.</p>
            </article>

            <article className="pillarCard">
              <span className="pillarNum">RULE 03</span>
              <h3>No Gambling or Casino Mechanics</h3>
              <p>Our daily spin and mystery drops are strictly free bonus perks. GAINZOPE is not a betting app; you earn purely through genuine participation.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Product Roadmap */}
      <section className="roadmapSection">
        <div className="shell">
          <div className="sectionHeaderCenter">
            <p className="kicker">04 / THE PRODUCT ROADMAP</p>
            <h2>Where we are. <em>And where we are going.</em></h2>
            <p className="sub">We believe in transparent engineering. Here is our public development timeline for India.</p>
          </div>

          <div className="roadmapTimeline">
            {roadmapPhases.map((phase) => (
              <article key={phase.phase} className={`roadmapPhase ${phase.badgeClass === 'current' ? 'active' : ''}`}>
                <div className="phaseStatusCol">
                  <span className={`phaseBadge ${phase.badgeClass}`}>{phase.status}</span>
                  <div className="phaseNumber">PHASE {phase.phase}</div>
                  <span className="phaseTimelineDate">{phase.timeframe}</span>
                </div>
                <div className="phaseBody">
                  <h3>{phase.title}</h3>
                  <p>{phase.desc}</p>
                  <ul className="phaseDeliverables">
                    {phase.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom Action Box */}
          <div className="aboutCtaBox">
            <h3>Be part of GAINZOPE from Day 1.</h3>
            <p>
              We are finalizing the Android app build for Google Play. Leave your email to receive an instant launch alert and early access to high-yield surveys.
            </p>
            <div className="aboutCtaBtns">
              <a href="/#subscribe" className="primaryButton">
                Get Day-1 Launch Alert <Arrow />
              </a>
              {onBackToHome && (
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="textButton"
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#f5f6f2', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}
                >
                  ← Back to Home
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
