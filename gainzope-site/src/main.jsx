import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import './styles.css';
import './footer.css';
import './download.css';
import './choose.css';
import './rewards.css';
import './nav.css';
import './product-details.css';
import './performance.css';
import './subscribe.css';
import './mobile.css';

const navLinks = [
  ['Home', '#top'],
  ['How it works', '#how'],
  ['Ways to earn', '#earn'],
  ['Rewards', '#rewards'],
  ['FAQ', '#faq']
];

const earningWays = [
  ['01', 'Daily spin', 'Claim your free spin for the day. The app shows the active rules before you play.', 'Spin'],
  ['02', 'Available surveys', 'Answer CPX Research surveys that match you. A reward is shown before you begin.', 'Survey'],
  ['03', 'Verified tasks', 'Complete the listed steps. Eligible completions move to your points balance after verification.', 'Task'],
  ['04', 'Offers worth trying', 'Choose an offer, read its requirements, and track its status in the app.', 'Offer'],
  ['05', 'Refer a friend', 'Your friend completes their first valid task, then both accounts receive their referral points.', 'Invite']
];

const faqs = [
  ['What is GAINZOPE?', 'GAINZOPE is an upcoming India rewards app. Complete available activities, collect points, convert them to tokens, and use eligible value on mobile recharge or gift cards.'],
  ['When are points added?', 'Points are added after an activity meets its listed requirement and is verified. Your wallet will show whether an activity is in progress, under review or credited.'],
  ['How do points convert to tokens?', 'The value rule is simple: 100 points = 1 token. One token gives ₹1 of eligible value, subject to the reward option shown in the app.'],
  ['Why did I not qualify for a survey?', 'Survey availability and eligibility can vary. Answer honestly and review the survey screen before starting; some screeners do not award points.'],
  ['How does the daily spin work?', 'Every eligible account gets one free spin per day based on IST. Valid tasks and milestones may unlock bonus spins. The live spin rules will be shown before launch.'],
  ['When does a referral reward arrive?', 'When your referred friend completes their first valid task, you receive 250 points and your friend receives 150 points. The app will show the referral status.'],
  ['Can I recharge any number?', 'GAINZOPE is currently for India. Sign in with an Indian mobile number and use eligible tokens only for Indian mobile recharges.'],
  ['Can I withdraw rewards as cash?', 'GAINZOPE is designed for eligible recharge discounts and gift-card rewards. Cash withdrawal is not available unless the app later shows it as an option.'],
  ['How will I receive updates?', 'Leave your email in the footer and we will use it for GAINZOPE launch news and important product updates. Hindi and English are supported in the app.'],
  ['When will the Android app launch?', 'The GAINZOPE Android app is coming soon. Follow the official GAINZOPE channels for launch updates.']
];

function Arrow({ down = false }) {
  return (
    <svg className="arrowGlyph" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {down ? <path d="M10 4v12m0 0l-5-5m5 5l5-5" /> : <path d="M6 14L14 6m0 0H7m7 0v7" />}
    </svg>
  );
}

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="GAINZOPE home">
      <span className="logoMark">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#10110e" />
          <path d="M15 9h-5a3 3 0 0 0-3 3v0a3 3 0 0 0 3 3h5v-3h-3" stroke="#c8ff00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>GAINZOPE</span>
    </a>
  );
}

function Reveal({ children, className = '', delay = 0 }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { opacity: 1, y: 0 };
  return (
    <motion.div
      className={`reveal ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={reveal}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function MotionTitle({ title, accent, className = '' }) {
  const reduceMotion = useReducedMotion();
  const titleWords = title.split(' ');
  const accentWords = accent ? accent.split(' ') : [];
  return (
    <h2 className={`motionTitle ${className}`} aria-label={`${title} ${accent || ''}`}>
      <span className="titleLine">
        {titleWords.map((word, index) => (
          <React.Fragment key={`t-${word}-${index}`}>
            <motion.span
              aria-hidden="true"
              initial={reduceMotion ? false : { opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="motionWord"
            >
              {word}
            </motion.span>
            {index < titleWords.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </span>
      {accent && (
        <>
          <br />
          <span className="accentLine">
            {accentWords.map((word, index) => (
              <React.Fragment key={`a-${word}-${index}`}>
                <motion.span
                  aria-hidden="true"
                  initial={reduceMotion ? false : { opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.45, delay: 0.12 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="motionWord accentWord"
                >
                  {word}
                </motion.span>
                {index < accentWords.length - 1 ? ' ' : ''}
              </React.Fragment>
            ))}
          </span>
        </>
      )}
    </h2>
  );
}

function AppIcon({ type }) {
  if (type === 'Spin') return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4L18.4 5.6" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
  if (type === 'Survey') return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
  if (type === 'Offer') return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
    </svg>
  );
  if (type === 'Task') return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const handleScroll = () => setScrolled(window.scrollY > 18); handleScroll(); window.addEventListener('scroll', handleScroll, { passive: true }); return () => window.removeEventListener('scroll', handleScroll); }, []);
  return (
    <header className={`navWrap ${scrolled ? 'isScrolled' : ''}`}>
      <div className="nav shell">
        <Logo />
        <nav className="desktopNav" aria-label="Primary navigation">
          {navLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <div className="navActions">
          <a className="navAlertBtn" href="#subscribe"><span className="pulseDot" /> Get Launch Alert</a>
          <a className="navCta" href="#download">App coming soon <Arrow /></a>
        </div>
        <button
          className={`menuButton ${open ? 'open' : ''}`}
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span />
          <span />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobileMenu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Mobile navigation"
          >
            <div className="mobileMenuInner">
              <a className="mobileAlertLink" href="#subscribe" onClick={() => setOpen(false)}>
                <div className="mobileAlertLeft">
                  <div className="mobileAlertBadge">
                    <span className="mobileAlertDot" />
                    <span>LAUNCH NOTIFICATIONS</span>
                  </div>
                  <strong>Get Day-1 Android Link</strong>
                  <small>Receive instant alert on Google Play release</small>
                </div>
                <span className="mobileAlertArrow"><Arrow /></span>
              </a>

              <div className="mobileNavList">
                {navLinks.map(([label, href], index) => (
                  <motion.a
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 + index * 0.035 }}
                    className="mobileNavItem"
                  >
                    <span className="mobileNavNum">0{index + 1}</span>
                    <span className="mobileNavText">{label}</span>
                    <Arrow />
                  </motion.a>
                ))}
              </div>

              <div className="mobileMenuBottom">
                <a className="mobileAppLink" href="#download" onClick={() => setOpen(false)}>
                  <div className="mobileAppIcon">G</div>
                  <div className="mobileAppInfo">
                    <div className="mobileAppTitle">GAINZOPE for Android</div>
                    <span className="mobileAppStatus">COMING SOON · INDIA ONLY</span>
                  </div>
                  <Arrow />
                </a>

                <div className="mobileMenuFooter">
                  <span>🇮🇳 HINDI + ENGLISH</span>
                  <a href="mailto:support.gainzope@gmail.com">support.gainzope@gmail.com ↗</a>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function DemoPhone() {
  return <motion.div className="heroPhone" initial={{ opacity: 0, rotate: 9, y: 28 }} animate={{ opacity: 1, rotate: 4, y: 0 }} transition={{ duration: .8, ease: [0.22, 0.7, 0.2, 1] }}><div className="phoneNotch" /><div className="phoneScreen"><div className="phoneTop"><span>GAINZOPE</span><b>•••</b></div><div className="phoneHello"><small>GOOD TO SEE YOU</small><strong>Your activity<br />has value.</strong></div><div className="balanceCard"><div><small>SAMPLE BALANCE</small><strong>2,480 <i>PTS</i></strong></div><span className="balanceSpark">✦</span><div className="balanceProgress"><span /></div><p><b>120 pts</b> from your next milestone</p></div><div className="phoneLabel"><span>APP PREVIEW</span><b>Ways to earn</b></div><div className="phoneActivities"><span><i>◎</i> Quick survey <b>+120</b></span><span><i>◇</i> Explore an offer <b>+80</b></span></div><div className="phoneNav"><span>Home</span><span>Earn</span><span>Wallet</span></div></div></motion.div>;
}

function Hero() {
  return <section id="top" className="hero shell"><Reveal className="heroCopy"><p className="kicker"><span className="liveDot" /> THE GAINZOPE REWARDS APP</p><h1>Earn points.<br /><em>Save on recharge.</em></h1><p className="heroText">Take part in available surveys, tasks, offers, spins and referrals. Convert every 100 points into 1 token, then use eligible tokens to lower your next mobile recharge.</p><div className="heroActions"><a className="primaryButton" href="#how">See how it works <Arrow /></a><a className="textButton" href="#earn">Explore ways to earn <Arrow down /></a></div><p className="heroFinePrint">Coming soon for India. Activities, reward values and availability can change.</p></Reveal><div className="heroVisual"><div className="orbit orbitOne" /><div className="orbit orbitTwo" /><motion.div className="heroNote noteOne" animate={{ y: [0, -8, 0] }} transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}><span>01</span><b>COMPLETE</b><small>Choose an available activity</small></motion.div><motion.div className="heroNote noteTwo" animate={{ y: [0, 8, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: .3 }}><span>02</span><b>REDEEM</b><small>Use tokens on eligible rewards</small></motion.div><DemoPhone /><p className="demoCaption">APP PREVIEW <span>SAMPLE BALANCE</span></p></div></section>;
}

function TrustStrip() {
  return <section className="trustStrip"><div className="shell"><span>ONE SIMPLE REWARDS LOOP</span><b>Explore</b><i>·</i><b>Earn</b><i>·</i><b>Track</b><i>·</i><b>Use</b><span>DETAILS SHOWN IN APP</span></div></section>;
}

function Journey() {
  const steps = [['01', 'Choose what is available', 'Open a survey, task, offer, spin or referral option that is active for your account.'], ['02', 'Finish the requirement', 'Read the steps first, then complete the activity as shown in the app.'], ['03', 'Check your status', 'Your wallet shows when an activity is in progress, under review or credited.'], ['04', 'Turn points into value', 'Convert 100 points into 1 token and use eligible tokens when a reward is ready.']];
  return <section id="how" className="journey section shell"><Reveal className="sectionIntro"><p className="kicker">01 / HOW GAINZOPE WORKS</p><MotionTitle title="Complete. Collect." accent="Save when you recharge." /><p>Everything follows one clear path: choose an activity, complete it, watch its status, and use verified points when you are ready.</p></Reveal><div className="journeyRail">{steps.map(([number, title, description], index) => <Reveal key={title} delay={index * .08}><motion.article className="journeyStep" whileHover={{ x: 7 }} transition={{ type: 'spring', stiffness: 350, damping: 24 }}><span className="stepNumber">{number}</span><div className="stepMarker"><i /></div><div><h3>{title}</h3><p>{description}</p></div><Arrow /></motion.article></Reveal>)}</div></section>;
}

function EarnWays() {
  return <section id="earn" className="earnSection"><div className="shell"><Reveal className="sectionIntro splitIntro"><div><p className="kicker">02 / WAYS TO EARN</p><MotionTitle title="Pick an activity." accent="Make it count." /></div><p>What you see can change by day and account. The app only shows activities that are currently open, along with the steps and reward details you need before starting.</p></Reveal><div className="earnGrid">{earningWays.map(([number, title, text, type], index) => <Reveal key={title} delay={index * .06}><motion.article className="earnCard" whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 280, damping: 20 }}><div className="earnCardTop"><span>{number}</span><span className="earnIcon"><AppIcon type={type} /></span></div><h3>{title}</h3><p>{text}</p><div className="earnCardBottom"><small>CHECK IN APP</small><Arrow /></div></motion.article></Reveal>)}</div></div></section>;
}

function ReferralRewards() {
  const milestones = [['15', '2,000 points'], ['25', '3,500 points'], ['50', '10,000 points']];
  return <section className="referralSection"><div className="shell referralGrid"><Reveal><p className="kicker">03 / REFER & EARN</p><h2>Invite a friend.<br /><em>Unlock points together.</em></h2><p>Share your referral code. When your friend completes their first valid task, GAINZOPE credits a reward to both accounts.</p><div className="referralSplit"><div><small>YOUR REWARD</small><strong>250 <i>PTS</i></strong></div><div><small>FRIEND'S REWARD</small><strong>150 <i>PTS</i></strong></div></div><p className="referralFine">A referral counts only after that first task is verified. Up to 10 successful referrals can count in one day.</p></Reveal><Reveal delay={.12} className="milestoneBoard"><div className="milestoneHead"><span>REFERRAL MILESTONES</span><b>EXTRA POINTS</b></div>{milestones.map(([count, points], index) => <motion.div key={count} className="milestoneRow" whileHover={{ x: 7 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}><span>0{index + 1}</span><strong><b>{count}</b> successful referrals</strong><em>+ {points}</em></motion.div>)}<div className="milestoneFoot"><span>DAILY LIMIT</span><b>10 REFERRALS</b></div></Reveal></div></section>;
}

function SpinAndRecharge() {
  return (
    <section className="spinRecharge shell">
      <Reveal className="spinCard">
        <p className="kicker">04 / SPIN REWARDS</p>
        <h2>A free spin.<br /><em>Once a day.</em></h2>
        <p>Every eligible GAINZOPE account gets one free daily spin, reset on Indian Standard Time.</p>
        <div className="spinDial">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}>
            <svg viewBox="0 0 64 64" width="56" height="56" fill="none" aria-hidden="true">
              <circle cx="32" cy="32" r="29" fill="#0d0e0b" stroke="#c9ff00" strokeWidth="3" />
              <circle cx="32" cy="32" r="7" fill="#c9ff00" />
              <line x1="32" y1="3" x2="32" y2="61" stroke="#c9ff00" strokeWidth="2" />
              <line x1="3" y1="32" x2="61" y2="32" stroke="#c9ff00" strokeWidth="2" />
              <line x1="11.5" y1="11.5" x2="52.5" y2="52.5" stroke="#c9ff00" strokeWidth="2" />
              <line x1="11.5" y1="52.5" x2="52.5" y2="11.5" stroke="#c9ff00" strokeWidth="2" />
              <circle cx="32" cy="11" r="2.5" fill="#ffffff" />
              <circle cx="32" cy="53" r="2.5" fill="#ffffff" />
              <circle cx="11" cy="32" r="2.5" fill="#ffffff" />
              <circle cx="53" cy="32" r="2.5" fill="#ffffff" />
            </svg>
          </motion.div>
          <i>FREE SPIN<br />DAILY</i>
        </div>
        <ul>
          <li>Complete valid tasks to unlock bonus spins</li>
          <li>Reach milestones to earn extra spins</li>
          <li>Find Mystery Box rewards in the spin experience</li>
        </ul>
        <a href="/reward-rules.html">Read spin rules <Arrow /></a>
      </Reveal>
      <Reveal delay={.12} className="rechargeCard">
        <p className="kicker">05 / RECHARGE WITH TOKENS</p>
        <h2>Make your next<br /><em>recharge cost less.</em></h2>
        <p>Sign in with an Indian mobile number, earn points, convert them in your wallet, and apply eligible tokens to an Indian mobile recharge.</p>
        <div className="rechargeExample">
          <div><small>RECHARGE AMOUNT</small><b>{'\u20B9'}299</b></div>
          <span>−</span>
          <div><small>20 TOKENS</small><b>{'\u20B9'}20 OFF</b></div>
          <span>=</span>
          <div className="finalRecharge"><small>YOU PAY</small><b>{'\u20B9'}279</b></div>
        </div>
        <p className="rechargeFine">Example only. The app shows the available discount and final amount before you pay.</p>
      </Reveal>
    </section>
  );
}

function ValueExchange() {
  return (
    <section className="valueSection">
      <div className="shell valueGrid">
        <Reveal>
          <p className="kicker">06 / POINTS & TOKENS</p>
          <h2>A clear value rule.<br /><em>No guesswork.</em></h2>
          <p>Every 100 verified points converts to 1 GAINZOPE token. One token gives ₹1 of eligible value when you choose a reward.</p>
          <p className="valueFine">Before you redeem, the app shows the reward, token value, any limit and the final amount.</p>
        </Reveal>
        <Reveal delay={.1} className="valueMachine">
          <div className="valueInput">
            <small>WAYS TO COLLECT</small>
            <span>Spin · Surveys · Tasks · Offers · Referrals</span>
          </div>
          <div className="valueFlow">
            <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M10 4v12m-4-4l4 4 4-4" /></svg>
            </motion.span>
          </div>
          <motion.div className="valuePoints" whileHover={{ scale: 1.03 }}>
            <small>VERIFIED POINTS</small>
            <strong>100 <i>PTS</i></strong>
            <span>converts to 1 token</span>
          </motion.div>
          <div className="valueFlow">
            <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: .25 }}>
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M10 4v12m-4-4l4 4 4-4" /></svg>
            </motion.span>
          </div>
          <motion.div className="valueToken" whileHover={{ scale: 1.03 }}>
            <span style={{ display: 'grid', placeItems: 'center' }}>
              <svg viewBox="0 0 36 36" width="34" height="34" fill="none" aria-hidden="true">
                <circle cx="18" cy="18" r="16" fill="#c8ff00" stroke="#10110e" strokeWidth="2" />
                <circle cx="18" cy="18" r="12" stroke="#10110e" strokeWidth="1.5" strokeDasharray="3 2" />
                <path d="M21 12h-4a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-2h-4" stroke="#10110e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <small>GAINZOPE TOKEN</small>
              <strong>1 TOKEN</strong>
              <b>= ₹1 ON ELIGIBLE REWARDS</b>
            </div>
          </motion.div>
          <div className="valueDestinations">
            <span>Recharge discounts</span>
            <span>Gift cards</span>
            <span>More rewards over time</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function RewardDestinations() {
  const rewards = [
    [
      'Recharge discounts',
      'Use eligible tokens to reduce the amount you pay on an Indian mobile recharge.',
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="5" y="2" width="14" height="20" rx="3" />
        <path d="M12 18h.01" />
        <path d="M13 7l-3 5h4l-2 5" stroke="#c8ff00" strokeWidth="2.2" />
      </svg>
    ],
    [
      'Gift cards',
      'Choose from gift cards that are currently available in the GAINZOPE reward catalogue.',
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="3" />
        <path d="M2 10h20" stroke="#c8ff00" />
        <circle cx="7" cy="15" r="1.5" fill="currentColor" />
        <path d="M16 15h3" />
      </svg>
    ],
    [
      'More rewards later',
      'New ways to use tokens can be added as the app grows.',
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2l2.4 7.4H22l-6 4.5 2.3 7.1-6.3-4.6-6.3 4.6 2.3-7.1-6-4.5h7.6L12 2z" fill="rgba(200, 255, 0, 0.18)" stroke="#c8ff00" />
      </svg>
    ]
  ];
  return (
    <section className="rewardDestinations shell">
      <Reveal className="sectionIntro splitIntro">
        <div>
          <p className="kicker">07 / USE YOUR TOKENS</p>
          <h2>Use them on<br /><em>something useful.</em></h2>
        </div>
        <p>Every reward shows its token value and conditions before you confirm. You decide whether to use it now or keep saving your tokens.</p>
      </Reveal>
      <div className="destinationGrid">
        {rewards.map(([title, text, icon], index) => (
          <Reveal key={title} delay={index * .08}>
            <motion.article whileHover={{ y: -7 }} transition={{ type: 'spring', stiffness: 260, damping: 19 }}>
              <span className="destinationIcon">{icon}</span>
              <small>REWARD OPTION 0{index + 1}</small>
              <h3>{title}</h3>
              <p>{text}</p>
              <Arrow />
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function RewardPreview() {
  return <section id="rewards" className="rewardsSection"><div className="shell rewardsGrid"><Reveal className="rewardCopy"><p className="kicker">08 / YOUR GAINZOPE WALLET</p><h2>Know what is<br /><em>ready to use.</em></h2><p>Your wallet keeps points, tokens and activity status in one place, so you know what is pending, what is credited and what can be redeemed.</p><ul><li><span>01</span> Track activities in progress or under review</li><li><span>02</span> See verified points and available tokens</li><li><span>03</span> Check eligible recharge and gift-card rewards</li></ul></Reveal><Reveal delay={.12} className="walletPreview"><motion.div className="walletShell" whileHover={{ rotateX: 2, rotateY: -3 }} transition={{ type: 'spring', stiffness: 150, damping: 17 }}><div className="walletHeader"><span>GAINZOPE WALLET</span><b>PREVIEW</b></div><div className="walletBalance"><small>SAMPLE POINTS</small><strong>2,480 <i>PTS</i></strong><span>Example balance for preview</span></div><div className="walletMeter"><div><span>VERIFIED POINTS</span><b>2,480</b></div><div className="meter"><span /></div><small>Every 100 verified points converts to 1 token.</small></div><div className="walletRows"><div><span><i className="greenDot" /> Survey credited</span><b>+120 PTS</b></div><div><span><i className="greenDot" /> Task under review</span><b>PENDING</b></div></div><div className="rewardStatus"><div><small>READY TO USE</small><b>Check rewards in the app</b></div><Arrow /></div></motion.div></Reveal></div></section>;
}

function Clarity() {
  return <section className="clarity shell"><Reveal><p className="kicker">09 / CLEAR BEFORE YOU CONTINUE</p><h2>You should see the requirement, the reward status, and the final value before you go ahead.</h2></Reveal><div className="clarityGrid"><Reveal delay={.05}><article><span>BEFORE YOU START</span><p>Read the steps, reward and conditions shown with the activity.</p></article></Reveal><Reveal delay={.12}><article><span>AFTER YOU FINISH</span><p>Check whether the activity is in progress, under review or credited.</p></article></Reveal><Reveal delay={.19}><article><span>WHEN YOU REDEEM</span><p>Review the token value, reward limit and final amount before you confirm.</p></article></Reveal></div><Reveal delay={.24}><p className="clarityNote">Activities, rewards and availability can change. The latest details shown in the app always apply.</p></Reveal></section>;
}

function WhyChoose() {
  const reasons = [
    ['01', 'One fixed conversion', '100 verified points make 1 token. One token gives ₹1 of eligible value.'],
    ['02', 'Rewards for everyday use', 'Apply eligible tokens to Indian mobile recharge or choose an available gift card.'],
    ['03', 'Status you can follow', 'See whether an activity is in progress, under review, credited or ready to use.'],
    ['04', 'One place to check', 'Your wallet brings together your points, tokens, activity history and reward options.']
  ];
  return (
    <section className="chooseSection">
      <div className="shell chooseGrid">
        <Reveal className="chooseCopy">
          <p className="kicker">10 / WHY GAINZOPE?</p>
          <h2>Simple to follow.<br /><em>Useful when it matters.</em></h2>
          <p>GAINZOPE is built around real activity, clear status and rewards you can put toward everyday mobile spending.</p>
          <div className="chooseReasons">
            {reasons.map(([number, title, text], index) => (
              <motion.article key={title} whileHover={{ x: 7 }} transition={{ type: 'spring', stiffness: 320, damping: 24 }}>
                <span>{number}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
                <Arrow />
              </motion.article>
            ))}
          </div>
        </Reveal>
        <Reveal delay={.14} className="chooseVisual">
          <div className="chooseHalo haloOne" />
          <div className="chooseHalo haloTwo" />
          <motion.div className="chooseCore" animate={{ rotate: [0, 3, 0], y: [0, -8, 0] }} transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}>
            <svg viewBox="0 0 64 64" width="68" height="68" fill="none" aria-hidden="true">
              <path d="M32 6L54 18v16c0 14-22 24-22 24S10 48 10 34V18L32 6z" fill="#10110e" />
              <path d="M32 12l16 9v12c0 10-16 17-16 17s-16-7-16-17V21l16-9z" fill="#c8ff00" />
              <path d="M25 32l5 5 10-10" stroke="#10110e" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <small>POINTS THAT<br />GO FURTHER</small>
          </motion.div>
          <motion.div className="chooseTag tagOne" animate={{ y: [0, -7, 0] }} transition={{ duration: 4.3, repeat: Infinity, ease: 'easeInOut' }}>
            <i /> 100 PTS = 1 TOKEN
          </motion.div>
          <motion.div className="chooseTag tagTwo" animate={{ y: [0, 7, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: .3 }}>
            1 TOKEN = ₹1 <i />
          </motion.div>
          <p>MADE FOR<br />EVERYDAY REWARDS</p>
        </Reveal>
      </div>
    </section>
  );
}

function SubscribeSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    setMessage('');
    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000').replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'launch_alert' })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to register right now. Please try again.');

      setStatus('success');
      setMessage(data.alreadyRegistered
        ? "You are already registered. We will send you an email the moment GAINZOPE goes live."
        : 'Thank you! You are on the official launch list. You will receive an instant email with the Google Play link as soon as GAINZOPE launches.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="subscribe" className="subscribeSection">
      <div className="subscribeAura" aria-hidden="true">
        <div className="auraCircle auraOne" />
        <div className="auraCircle auraTwo" />
        <div className="auraGridOverlay" />
      </div>

      <div className="shell subscribeGrid">
        <Reveal className="subscribeContent">
          <p className="kicker">12 / LAUNCH NOTIFICATIONS</p>
          <div className="subscribeBadgeRow">
            <span className="subscribeLivePill">
              <span className="subscribePulseRing">
                <span className="subscribePulseDot" />
              </span>
              OFFICIAL LAUNCH DISPATCH
            </span>
            <span className="subscribeBuildTag">ANDROID · INDIA ROLLOUT</span>
          </div>

          <h2 className="subscribeTitle">
            Get the day-1 link.
            <em>The moment we go live on Google Play.</em>
          </h2>
          <p className="subscribeDesc">
            Sign up with your email to receive an instant release alert the hour GAINZOPE launches, plus early notification whenever new high-yield surveys, partner tasks, or spin milestones are unlocked.
          </p>

          <div className="subscribePillars">
            <div className="subscribePillarItem">
              <div className="pillarIconWrap">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                  <path d="M3.6 2.4c-.4.4-.6 1-.6 1.8v15.6c0 .8.2 1.4.6 1.8L12.5 12 3.6 2.4z" fill="#00D2FF" />
                  <path d="M15.5 9.1L4.8 3.1C4.3 2.8 3.9 2.8 3.6 3L12.5 12l3-2.9z" fill="#00F076" />
                  <path d="M15.5 14.9L12.5 12l-8.9 9c.3.2.7.2 1.2-.1l10.7-6z" fill="#FF3A44" />
                  <path d="M20.1 11.2l-4.6-2.6-3 3.4 3 3.4 4.6-2.6c.9-.5.9-1.2 0-1.6z" fill="#FFC800" />
                </svg>
              </div>
              <div>
                <div className="pillarHead">
                  <h3>Google Play Day-1 Alert</h3>
                  <span className="pillarTag">PRIORITY INBOX</span>
                </div>
                <p>Instant official download link sent straight to your email. Zero waiting, zero delay.</p>
              </div>
            </div>

            <div className="subscribePillarItem">
              <div className="pillarIconWrap">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#c8ff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <div className="pillarHead">
                  <h3>Early Reward Drops & News</h3>
                  <span className="pillarTag">HIGH-YIELD SURVEYS</span>
                </div>
                <p>Be the first to know when limited CPX Research survey quotas and bonus spins become active.</p>
              </div>
            </div>

            <div className="subscribePillarItem">
              <div className="pillarIconWrap">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#c8ff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <div className="pillarHead">
                  <h3>Strict Privacy Guarantee</h3>
                  <span className="pillarTag">ZERO SPAM</span>
                </div>
                <p>Only essential product updates and launch notices. No third-party sharing, opt-out anytime.</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="subscribeBoxWrapper">
          <div className="subscribeBoxGlow" aria-hidden="true" />
          <div className="subscribeBox">
            <div className="subscribeBoxTop">
              <div className="terminalStatus">
                <span className="terminalDot" />
                <span>LAUNCH REGISTRATION HUB</span>
              </div>
              <span className="terminalCode">STATUS: ACTIVE</span>
            </div>

            <div className="subscribeBoxHero">
              <h3>Secure your launch alert</h3>
              <p>Enter your email below. We’ll notify you the exact moment the app is ready to download.</p>
            </div>

            {status === 'success' ? (
              <motion.div
                className="launchSuccessCard"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="launchSuccessHeader">
                  <span className="launchSuccessMark">
                    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#10110e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="4 11 8 15 16 6" />
                    </svg>
                  </span>
                  <div>
                    <h4>Registration Confirmed</h4>
                    <small>Official launch list updated</small>
                  </div>
                </div>
                <p className="launchSuccessText">{message}</p>
                <div className="launchSuccessMeta">
                  <span>● Status: Active on Launch Radar</span>
                </div>
                <div>
                  <button
                    type="button"
                    className="launchSuccessReset"
                    onClick={() => setStatus('idle')}
                  >
                    Register another email <Arrow />
                  </button>
                </div>
              </motion.div>
            ) : (
              <form className="launchForm" onSubmit={handleSubmit}>
                <div className="launchField">
                  <label htmlFor="launch-email">
                    <span>EMAIL ADDRESS</span>
                    <span className="labelHint">INDIA LAUNCH NOTIFICATIONS</span>
                  </label>
                  <div className="inputContainer">
                    <span className="inputIcon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <input
                      id="launch-email"
                      type="email"
                      className="launchInput"
                      placeholder="name@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === 'loading'}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="launchSubmit"
                  disabled={status === 'loading'}
                >
                  <span>{status === 'loading' ? 'Securing your spot…' : 'Notify me at launch'}</span>
                  <Arrow />
                </button>

                <div className="launchTrustBanner">
                  <span className="trustShield">
                    <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#c8ff00" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="4 10 8 14 16 6" />
                    </svg>
                  </span>
                  <span>Direct Google Play link · No marketing spam · 100% Free</span>
                </div>
              </form>
            )}

            {status === 'error' && (
              <motion.p
                className="launchError"
                role="alert"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {message}
              </motion.p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TrustAndSupport() {
  return <section className="trustSection"><div className="shell"><Reveal className="trustHead"><div><p className="kicker">11 / RULES & SUPPORT</p><h2>Read the rules.<br /><em>Then earn with confidence.</em></h2></div><p>Keep the important information close: how points work, how spin rewards work and where to get help.</p></Reveal><div className="trustGrid"><Reveal delay={.05}><a href="/privacy.html"><span>01</span><div><h3>Privacy & data</h3><p>See the current website privacy notice and ask privacy questions.</p></div><Arrow /></a></Reveal><Reveal delay={.12}><a href="/terms.html"><span>02</span><div><h3>Reward terms</h3><p>Read points, tokens, referrals, gift cards and recharge reward information.</p></div><Arrow /></a></Reveal><Reveal delay={.19}><a href="/reward-rules.html"><span>03</span><div><h3>Spin rules</h3><p>Check spin participation and reward-selection information before you play.</p></div><Arrow /></a></Reveal><Reveal delay={.26}><a href="mailto:support.gainzope@gmail.com?subject=GAINZOPE%20reward%20support"><span>04</span><div><h3>Reward support</h3><p>Get help with pending points, surveys, tasks, referrals or recharge status.</p></div><Arrow /></a></Reveal></div><Reveal delay={.3}><p className="trustNote">Status updates and reward notifications will come through the app. Hindi and English are supported. Need a hand? Email <a href="mailto:support.gainzope@gmail.com">support.gainzope@gmail.com</a>.</p></Reveal></div></section>;
}

function Download() {
  return (
    <section id="download" className="downloadSection">
      <div className="shell downloadGrid">
        <Reveal>
          <p className="kicker">13 / THE GAINZOPE APP</p>
          <h2>GAINZOPE for<br /><em>Android is coming soon.</em></h2>
          <p>Launch with your Indian mobile number, choose Hindi or English, and keep track of activities, points, tokens and eligible rewards in one place.</p>
          <span className="comingButton">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true" className="playSymbol">
              <path d="M3.6 2.4c-.4.4-.6 1-.6 1.8v15.6c0 .8.2 1.4.6 1.8L12.5 12 3.6 2.4z" fill="#00D2FF" />
              <path d="M15.5 9.1L4.8 3.1C4.3 2.8 3.9 2.8 3.6 3L12.5 12l3-2.9z" fill="#00F076" />
              <path d="M15.5 14.9L12.5 12l-8.9 9c.3.2.7.2 1.2-.1l10.7-6z" fill="#FF3A44" />
              <path d="M20.1 11.2l-4.6-2.6-3 3.4 3 3.4 4.6-2.6c.9-.5.9-1.2 0-1.6z" fill="#FFC800" />
            </svg>
            <span>
              <small>GAINZOPE FOR ANDROID</small>
              <b>COMING SOON</b>
            </span>
            <Arrow />
          </span>
        </Reveal>
        <Reveal delay={.1} className="downloadVisual">
          <div className="downloadRings">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }} />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} />
          </div>
          <motion.div className="downloadCoin" animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
            <svg viewBox="0 0 88 88" width="84" height="84" fill="none" aria-hidden="true">
              <circle cx="44" cy="44" r="40" fill="#10110e" stroke="#c8ff00" strokeWidth="4" />
              <circle cx="44" cy="44" r="32" stroke="rgba(200, 255, 0, 0.45)" strokeDasharray="5 3" strokeWidth="2" />
              <path d="M49 28h-9a9 9 0 0 0-9 9v14a9 9 0 0 0 9 9h9a9 9 0 0 0 9-9v-5h-10" stroke="#c8ff00" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          <span>INDIA ONLY · HINDI + ENGLISH<br />LAUNCH UPDATES COMING SOON</span>
        </Reveal>
      </div>
    </section>
  );
}

function SocialIcon({ type }) {
  if (type === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.8" />
      </svg>
    );
  }
  if (type === 'youtube') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  if (type === 'telegram') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function Footer() {
  const socialLinks = [
    ['instagram', 'Instagram', 'https://www.instagram.com/gainzope/'],
    ['youtube', 'YouTube', 'https://www.youtube.com/@gainzope'],
    ['telegram', 'Telegram', 'https://t.me/gainzope'],
    ['x', 'X', 'https://x.com/gainzope']
  ];
  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const joinUpdates = async (event) => {
    event.preventDefault();
    setEmailMessage('');
    try {
      const response = await fetch(`${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000').replace(/\/$/, '')}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'website_footer' })
      });
      if (!response.ok) throw new Error('Please try again in a moment.');
      setEmail('');
      setEmailMessage('✓ You are on the update list! Launch details will arrive in your inbox.');
    } catch (error) { setEmailMessage(error.message); }
  };
  return (
    <footer className="siteFooter">
      <div className="shell footerLead">
        <div>
          <p className="kicker">THE GAINZOPE REWARDS APP</p>
          <h2>Small wins.<br /><em>Save when you recharge.</em></h2>
        </div>
        <div className="footerLeadSide">
          <p>Spin, answer, complete, refer and turn your points into rewards you can actually use.</p>
          <a className="footerAction" href="#how">See how it works <Arrow /></a>
        </div>
      </div>
      <div className="shell footerGrid">
        <div className="footerBrand">
          <Logo />
          <p>Earn points. Save on what matters.</p>
          <small>Spin rewards, surveys, tasks, offers, referrals, gift cards and eligible recharge discounts in one upcoming app.</small>
          <a className="footerContactLink" href="mailto:support.gainzope@gmail.com">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            support.gainzope@gmail.com
          </a>
        </div>
        <div className="footerLinks">
          <h3>EXPLORE</h3>
          <a href="#how">How it works</a>
          <a href="#earn">Ways to earn</a>
          <a href="#rewards">Your wallet</a>
          <a href="#subscribe">Launch alerts</a>
          <a href="#download">App updates</a>
        </div>
        <div className="footerLinks">
          <h3>HELP & RULES</h3>
          <a href="#faq">Frequently asked</a>
          <a href="/terms.html">Reward terms</a>
          <a href="/reward-rules.html">Spin rules</a>
          <a href="/privacy.html">Privacy & data</a>
          <a href="mailto:support.gainzope@gmail.com?subject=GAINZOPE%20support">Get support</a>
        </div>
        <div className="footerSocial">
          <h3>STAY IN THE LOOP</h3>
          <p>Leave your email for GAINZOPE launch news, new rewards and important updates.</p>
          <form className="footerEmailForm" onSubmit={joinUpdates}>
            <label className="srOnly" htmlFor="footer-email">Email address</label>
            <input id="footer-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email address" required />
            <button type="submit">Join updates <Arrow /></button>
          </form>
          {emailMessage && <small className="footerPushMessage" role="status">{emailMessage}</small>}
          <div className="footerSocialTitle">CONNECT WITH GAINZOPE</div>
          <div className="footerSocialLinks">
            {socialLinks.map(([type, label, href]) => (
              <a
                key={type}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GAINZOPE on ${label}`}
                className={`social-${type}`}
                title={label}
              >
                <SocialIcon type={type} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="shell footerBottom">
        <span>© {new Date().getFullYear()} GAINZOPE. All rights reserved.</span>
        <div className="footerSecurityBadge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>SSL Secured · Made for India</span>
        </div>
        <span>gainzope.in <b>·</b> Android app coming soon</span>
      </div>
    </footer>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="faqSection">
      <div className="shell faqGrid">
        <Reveal>
          <p className="kicker">14 / QUESTIONS, ANSWERED</p>
          <h2>Clear answers<br /><em>before you start.</em></h2>
          <p>More support and activity-specific help will be available inside the GAINZOPE app after launch.</p>
        </Reveal>
        <div className="faqList">
          {faqs.map(([question, answer], index) => (
            <article key={question} className="faqItem">
              <button type="button" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>
                <span>{question}</span>
                <span className={`faqPlusIcon ${open === index ? 'isOpen' : ''}`} aria-hidden="true">
                  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#c8ff00" strokeWidth="2.4" strokeLinecap="round">
                    <line x1="10" y1="4" x2="10" y2="16" style={{ transformOrigin: 'center', transition: 'transform 0.25s ease', transform: open === index ? 'rotate(90deg) scale(0)' : 'rotate(0)' }} />
                    <line x1="4" y1="10" x2="16" y2="10" />
                  </svg>
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === index && (
                  <motion.div className="faqAnswer" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .24 }}>
                    <p>{answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function trackVisitor() {
  try {
    let sessionId = sessionStorage.getItem('gainzope_sid');
    if (!sessionId) {
      sessionId = 'gz_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      sessionStorage.setItem('gainzope_sid', sessionId);
    }
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const device = isMobile ? 'mobile' : 'desktop';
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000').replace(/\/$/, '');

    fetch(`${baseUrl}/api/analytics/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        device,
        path: window.location.pathname || '/',
        referrer: document.referrer || 'direct'
      }),
      keepalive: true
    }).catch(() => {});
  } catch {}
}

function App() {
  useEffect(() => {
    trackVisitor();
  }, []);

  return <><Nav /><main><Hero /><TrustStrip /><Journey /><EarnWays /><ReferralRewards /><SpinAndRecharge /><ValueExchange /><RewardDestinations /><RewardPreview /><Clarity /><WhyChoose /><TrustAndSupport /><SubscribeSection /><Download /><FAQ /></main><Footer /></>;
}
createRoot(document.getElementById('root')).render(<App />);
