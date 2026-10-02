import React, { useEffect } from 'react';
import './legal-page.css';

const supportEmail = 'support.gainzope@gmail.com';

const pages = {
  '/privacy': {
    title: 'GAINZOPE Privacy Policy',
    description: 'Learn how GAINZOPE handles information for its rewards and recharge-discount services.',
    kicker: 'GAINZOPE / PRIVACY POLICY',
    heading: 'Privacy Policy',
    lead: 'This policy explains how GAINZOPE may handle information when you use our website, Android app, rewards features and eligible recharge-related services.',
    sections: [
      ['Information we may collect', 'Depending on the feature you use, GAINZOPE may collect information you provide or that is needed to operate the service. This can include account details, mobile-number or authentication information, contact email where you choose to provide it, device and app information, and usage or activity information.'],
      ['Rewards and activity information', 'We may keep records of points, tokens, referral activity, spin participation, surveys, tasks, offers, reward status and related verification information. This helps us credit eligible activity, show wallet status, investigate issues and protect the programme from misuse.'],
      ['Recharge and payment-related information', 'When an eligible recharge or payment-related feature is used, we may receive information needed to process, confirm, support or reconcile that transaction, such as the recharge request, status, amount, payment reference and provider response. Payment credentials are handled by the applicable payment provider; GAINZOPE does not state that it stores card or bank credentials unless a feature clearly says so.'],
      ['How we use information', 'We use information to provide and improve the service; authenticate accounts; operate rewards, surveys, offers, referrals and eligible redemptions; send requested or service-related notifications; respond to support requests; prevent fraud, abuse and duplicate accounts; and meet applicable legal or operational requirements.'],
      ['Service providers and third parties', 'Some features may involve service providers or activity providers, such as survey, offer, payment, recharge, authentication, notification or hosting providers. We share only the information reasonably needed for the relevant feature, subject to their applicable terms and privacy practices. The information shown in the app at the time of an activity or transaction may identify additional feature-specific handling.'],
      ['Security and retention', 'We use reasonable administrative, technical and organisational measures to protect information. No online service can guarantee absolute security. We retain information only for as long as reasonably needed for the purposes in this policy, to resolve disputes, prevent fraud, complete transactions or meet legal and operational obligations.'],
      ['Your choices and account deletion', 'You may choose not to provide optional information, manage device notifications through your device settings, and contact us about your information. To request deletion of an account, visit the Account Deletion page or email us. Some information may need to be retained where necessary for transaction records, fraud prevention, disputes or legal obligations.'],
      ['Children', 'GAINZOPE is intended only for people who are legally eligible to use the relevant service. Do not create an account or provide personal information if you are not eligible under applicable law or the app’s stated requirements.'],
      ['Policy updates and contact', 'We may update this policy as our features change. The current version will be posted here with its effective date. For privacy questions or requests, email ' + supportEmail + '.']
    ]
  },
  '/terms': {
    title: 'GAINZOPE Terms & Conditions',
    description: 'Read the terms that apply to GAINZOPE rewards, tokens and eligible recharge-related services.',
    kicker: 'GAINZOPE / TERMS & CONDITIONS',
    heading: 'Terms & Conditions',
    lead: 'These terms govern use of GAINZOPE’s website, Android app, rewards programme and eligible recharge-related services.',
    sections: [
      ['Acceptance and eligibility', 'By using GAINZOPE, you agree to these terms and the Privacy Policy. You must be eligible to use the service under applicable law and any requirements displayed in the app. GAINZOPE may limit features by location, account status or feature availability.'],
      ['Account responsibility and accurate information', 'You are responsible for information provided for your account, keeping access credentials secure and using only your own account. Provide accurate information and promptly correct material inaccuracies. Do not create or control accounts for another person except where a feature expressly permits it.'],
      ['Points, tokens and eligible value', 'Points are programme units awarded for eligible, verified activity. The current published rule is 100 Points = 1 GAINZOPE Token and 1 GAINZOPE Token = ₹1 of eligible value. Tokens are rewards-programme units, not money, deposits, investments, securities or cryptocurrency. They have value only in eligible options made available by GAINZOPE and are not guaranteed to be redeemable at all times.'],
      ['Activities, surveys, tasks and rewarded advertisements', 'Activities may include surveys, tasks, offers and rewarded advertisements where shown in the app. Follow the displayed instructions and any provider terms. An activity is eligible only after its stated requirements are met and the result is confirmed. A provider may disqualify, reject, delay or reverse an activity under its applicable rules.'],
      ['Referrals and spin fair play', 'Referral rewards, milestones and daily limits are governed by the Reward Terms. Spin participation is governed by the Spin & Fair-Play Rules. Free reward features are promotional rewards features; they are not gambling, betting or a paid chance-based service.'],
      ['Recharge services, payments and refunds', 'Eligible recharge services are subject to the information shown before a transaction is confirmed and to the applicable payment or recharge provider process. Payment processing may be handled by a provider. Refunds and cancellations, where applicable, are governed by the Refund & Cancellation Policy and the transaction status; a successful payment does not by itself guarantee that every transaction can be cancelled or refunded.'],
      ['Fraud, abuse and invalid rewards', 'Do not use duplicate or fake accounts, false information, bots, automation, emulators, manipulation, unauthorised scripts or other activity that interferes with the service or a provider. We may investigate suspected abuse, withhold, reverse or adjust invalid rewards, and suspend or terminate access where reasonably necessary to protect users and the programme.'],
      ['Third-party services and availability', 'Third-party providers operate their own services and policies. GAINZOPE is not responsible for their independent content, availability or decisions. Features, activities, rewards, providers and availability may change, pause or end. We do not guarantee uninterrupted service or the availability of a particular activity, reward, token use or recharge option.'],
      ['Changes, intellectual property and privacy', 'We may update features, rules or these terms. Material changes will be posted here or communicated through appropriate service channels. GAINZOPE names, branding, content and software are protected by applicable intellectual-property rights. Our handling of information is described in the Privacy Policy.'],
      ['Support and legal terms', 'For support, contact ' + supportEmail + '. To the extent permitted by applicable law, GAINZOPE is not liable for indirect, incidental or consequential loss arising from use of the service. Nothing in these terms limits rights that cannot legally be limited. These terms do not state a governing-law or jurisdiction clause because no verified business jurisdiction information is published on this site.']
    ]
  },
  '/reward-terms': {
    title: 'GAINZOPE Reward Terms',
    description: 'Read GAINZOPE reward, points, token and referral rules.',
    kicker: 'GAINZOPE / REWARD TERMS',
    heading: 'Reward terms & value rules',
    lead: 'These rules explain the current GAINZOPE rewards programme and how eligible points and tokens may be used.',
    alert: 'Current value rule: 100 Points = 1 GAINZOPE Token. 1 GAINZOPE Token = ₹1 of eligible value. Eligibility, limits and available uses are shown in the app when you redeem.',
    sections: [
      ['Earning points', 'Eligible earning opportunities may include daily spin, surveys, tasks, offers, rewarded advertisements and referrals when shown in the app. Points are credited only after the displayed requirements are met and the result is verified. An activity can remain pending, be reviewed, be rejected or be reversed when its requirements are not met.'],
      ['Using tokens', 'Tokens may be used only for eligible rewards or recharge-related value that is available in the app. Catalogue availability, redemption limits, transaction status and feature requirements can change. Points and tokens are not cash, investments or a promise of universal redemption.'],
      ['Referral rewards', 'When a referred user completes their first valid task or activity, the referrer receives 250 points and the referred user receives 150 points. Milestone bonuses are 2,000 points at 15 successful referrals, 3,500 points at 25 successful referrals and 10,000 points at 50 successful referrals. A maximum of 10 successful referrals can count each day.'],
      ['Reviews and changes', 'GAINZOPE may review, limit, withhold or reverse rewards connected to invalid, duplicate, deceptive or abusive activity. Activities, offers, gift cards, token uses and eligibility may change. The live information shown with an activity or redemption controls the current experience.'],
      ['Support', 'For questions about points, tokens, activities, referrals or redemption status, email ' + supportEmail + '.']
    ]
  },
  '/spin-rules': {
    title: 'GAINZOPE Spin & Fair-Play Rules',
    description: 'Read GAINZOPE daily spin participation and fair-play rules.',
    kicker: 'GAINZOPE / FAIR-PLAY RULES',
    heading: 'Spin & fair-play rules',
    lead: 'The GAINZOPE spin is a free promotional rewards feature. It is not gambling, casino play or betting.',
    alert: 'The app shows the active participation conditions and reward information before a user starts. GAINZOPE does not publish a universal public odds table because reward configuration can be feature-specific.',
    sections: [
      ['Eligibility and availability', 'Only eligible, verified accounts may participate when spin is displayed as available. Each eligible account may receive one daily spin, with the daily reset based on Indian Standard Time (IST). Availability can be limited by account status, feature rules or programme availability.'],
      ['Bonus spins and Mystery Box rewards', 'Valid tasks, activity milestones or other displayed programme conditions may unlock bonus spins. Where the spin experience includes a Mystery Box, the app will show the applicable reward information before participation.'],
      ['Reward selection and crediting', 'The app controls the active reward-selection experience and confirms the result. A reward is credited only after the app or relevant provider confirms it. GAINZOPE does not promise a particular reward, a particular outcome or immediate crediting for every participation.'],
      ['Fair play and review', 'Do not use duplicate accounts, automation, bots, scripts, manipulation or other invalid methods. GAINZOPE may review participation, withhold or reverse invalid rewards, and restrict access where needed to protect the programme.'],
      ['Support', 'For a spin or fair-play question, email ' + supportEmail + '.']
    ]
  },
  '/refund-cancellation': {
    title: 'GAINZOPE Refund & Cancellation Policy',
    description: 'Learn how GAINZOPE handles eligible recharge payment, cancellation and refund issues.',
    kicker: 'GAINZOPE / REFUND & CANCELLATION',
    heading: 'Refund & Cancellation Policy',
    lead: 'This policy distinguishes recharge and payment transactions from GAINZOPE rewards, points and tokens.',
    sections: [
      ['Recharge or payment transaction', 'Before a recharge is initiated, review the mobile number, operator, plan or service details, amount and any displayed token or discount application. After a transaction has been submitted to a payment or recharge provider, cancellation may no longer be possible.'],
      ['Successful payment and successful recharge', 'A payment marked successful and a recharge marked successful are generally treated as completed. Check the transaction status shown by the applicable service before contacting support.'],
      ['Successful payment but recharge unsuccessful', 'If payment is successful but the recharge is not confirmed as successful, the transaction may remain pending while the applicable payment or recharge provider processes its status. Refunds, where applicable, are processed according to the applicable transaction status and payment/recharge provider process.'],
      ['Failed or duplicate payments', 'If payment fails, do not assume money was collected; check the provider and transaction status first. If more than one payment appears to have been made for the same request, contact support with the relevant transaction details so the case can be reviewed. Duplicate payment does not automatically establish refund eligibility.'],
      ['Refund eligibility and destination', 'We review refund requests according to the transaction status, provider process and applicable requirements. Not every transaction can be refunded, including completed recharges where cancellation is unavailable. When a refund is approved and processed, it is handled through the applicable payment process and normally returns through the original transaction route where supported. We do not promise instant or fixed refund timelines.'],
      ['Rewards, points and tokens', 'Points and tokens are programme rewards, not cash balances. They are not refundable or exchangeable for cash merely because an activity, redemption option or transaction changes. Invalid or reversed activity, failed redemption processing, cancellation or fraud review may require an adjustment or reversal of related points, tokens or discounts.'],
      ['How to get help', 'Email ' + supportEmail + ' with the account identifier, mobile number used for the request, transaction or order reference if available, the issue and relevant screenshots. Do not send sensitive payment credentials by email.']
    ]
  },
  '/support': {
    title: 'GAINZOPE Support',
    description: 'Contact GAINZOPE support for account, rewards, recharge, payment, privacy and account-deletion help.',
    kicker: 'GAINZOPE / SUPPORT',
    heading: 'How can we help?',
    lead: 'Contact GAINZOPE support for help with your account, activities, rewards and eligible recharge-related services.',
    sections: [
      ['Contact support', 'Email ' + supportEmail + '. Include a clear description of the issue, the account email or mobile number used for the service where relevant, and a transaction or activity reference if available. Do not send OTPs, passwords, card details or other sensitive credentials.'],
      ['What we can help with', 'You can contact us about account access, points, tokens, surveys, tasks, offers, referrals, spin participation, recharge status, payment issues, refunds, privacy or data requests, and account deletion.'],
      ['A simple support flow', 'First, check the status shown in the app or transaction flow. Then email support with the relevant details and screenshots where useful. We will review the information available to us and may request additional non-sensitive details needed to investigate.'],
      ['Account deletion', 'For account deletion, see the Account Deletion page or email ' + supportEmail + ' with the subject “Account deletion request”.']
    ]
  },
  '/account-deletion': {
    title: 'GAINZOPE Account Deletion',
    description: 'Request deletion of your GAINZOPE account and learn what happens to eligible data and rewards.',
    kicker: 'GAINZOPE / ACCOUNT DELETION',
    heading: 'Request account deletion',
    lead: 'You can ask GAINZOPE to delete your account and associated personal information, subject to necessary verification and retention requirements.',
    sections: [
      ['How to request deletion', 'Email ' + supportEmail + ' with the subject “Account deletion request”. Use the email address or mobile number associated with your account and include enough information for us to identify the account. We may ask for reasonable verification before acting on the request.'],
      ['What may be deleted', 'After a verified request is processed, we may delete or de-identify account profile information and information that is no longer needed to provide the service. We will also close access to the account.'],
      ['Information we may retain', 'Some information may need to be retained where reasonably necessary for completed or pending transactions, fraud and security review, disputes, legal obligations, accounting or enforcing programme rules. Retained information is handled according to the Privacy Policy.'],
      ['Pending rewards and transactions', 'Request deletion after reviewing any pending activities, rewards, recharges or payment-related transactions. Deletion can affect access to pending rewards, tokens, activity history and support for unresolved transactions. We do not promise immediate deletion or preservation of unverified rewards.'],
      ['Need help?', 'For help with a deletion request or a related privacy question, email ' + supportEmail + '.']
    ]
  }
};

function mailLink(text = supportEmail) {
  return <a href={`mailto:${supportEmail}`}>{text}</a>;
}

export default function LegalPage({ path }) {
  const page = pages[path];

  useEffect(() => {
    if (!page) return undefined;
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const old = {
      description: description?.content,
      canonical: canonical?.href,
      ogTitle: ogTitle?.content,
      ogDescription: ogDescription?.content,
      ogUrl: ogUrl?.content
    };
    const url = `https://gainzope.in${path}`;
    document.title = page.title;
    if (description) description.content = page.description;
    if (canonical) canonical.href = url;
    if (ogTitle) ogTitle.content = page.title;
    if (ogDescription) ogDescription.content = page.description;
    if (ogUrl) ogUrl.content = url;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      document.title = previousTitle;
      if (description && old.description) description.content = old.description;
      if (canonical && old.canonical) canonical.href = old.canonical;
      if (ogTitle && old.ogTitle) ogTitle.content = old.ogTitle;
      if (ogDescription && old.ogDescription) ogDescription.content = old.ogDescription;
      if (ogUrl && old.ogUrl) ogUrl.content = old.ogUrl;
    };
  }, [page, path]);

  if (!page) return null;
  return (
    <main className="legalPage" id="main-content">
      <div className="legalShell legalMain">
        <p className="legalKicker">{page.kicker}</p>
        <h1>{page.heading}</h1>
        <p className="legalLead">{page.lead}</p>
        {page.alert && <aside className="legalAlert">{page.alert}</aside>}
        <div className="legalContent">
          {page.sections.map(([title, text]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{text.split(supportEmail).map((part, index, all) => <React.Fragment key={`${title}-${index}`}>{part}{index < all.length - 1 && mailLink()}</React.Fragment>)}</p>
            </section>
          ))}
        </div>
        <p className="legalEffective">Effective date: 3 October 2026</p>
      </div>
    </main>
  );
}

export { pages };
