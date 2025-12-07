import { User, ShoppingCart, Calendar, MapPin } from 'lucide-react';
import { colors } from '../colors';
import type { AGODigitalData } from '../types';

export const agoDigitalData: AGODigitalData = {
  id: 'ago-digital',
  title: 'AGO Digital Experience',
  subtitle: 'Purchase Journey Optimization',
  role: 'Lead UX Researcher',
  timeline: '4 Months',
  team: 'Solo Researcher',
  methods: 'Heuristic Evaluation, User Interviews, Ethnographic Research',
  gradient: 'from-[#e76f51] to-[#f4a261]',
  pdfPath: '/AGO Digital Experience - UX Research Case Study.pdf',
  challenge: 'The Art Gallery of Ontario wanted to understand their digital user experience but didn\'t have clarity on where issues might exist. My task was to conduct a comprehensive evaluation to uncover usability problems and identify opportunities for improvement.',
  researchQuestion: 'How can we reduce friction in the AGO\'s digital ticket purchase journey while maintaining the cultural experience?',
  hypothesis: 'Streamlining the purchase flow and improving information architecture will increase conversion rates.',
  overview: 'This project examined the digital journey of visitors purchasing tickets for the Art Gallery of Ontario, identifying pain points and opportunities for improvement through mixed-methods research.',

  persona: {
    initials: 'JE',
    name: 'Jessica',
    subtitle: '40 F | Marketing Manager | Toronto, ON',
    details: 'Parent of 2 children (Ages: 5 & 10)',
    goals: ['Know what exhibits suit her children\'s ages', 'Plan logistics (arrival, parking, amenities)', 'Seamlessly purchase tickets'],
    painPoints: ['Searching multiple pages for basic info', 'Mandatory account creation', 'Hidden policies & fees'],
    extra1: { title: 'Motivations', items: ['Create meaningful experiences for children', 'Maximize time with efficient planning', 'Support arts and local community'], color: colors.verdigris },
    extra2: { title: 'Behaviour', items: ['Researches on mobile during commute', 'Checks reviews before committing', 'Abandons cart if checkout > 3 min'], color: colors.sandy },
    color: colors.burnt
  },

  approach: [
    { num: '1', title: 'Competitive Analysis', sub: 'Heuristic Evaluation', color: colors.verdigris },
    { num: '2', title: 'User Interviews', sub: '6 In-depth Sessions', color: colors.charcoal },
    { num: '3', title: 'Ethnographic Research', sub: 'On-site Observation', color: colors.sandy },
  ],

  competitors: ['Art Gallery of Ontario', 'The Metropolitan Museum of Art', 'The British Museum'],

  siteIssues: [
    { title: 'Missing Digital Experiences', desc: 'AGO lacked virtual tours and digital collection access that competitors offered', color: colors.burnt },
    { title: 'Unintuitive Website Design', desc: 'Confusing navigation, poor information architecture, interface friction', color: colors.sandy },
    { title: 'Weak Purchase Conversion', desc: 'Inefficient purchase flows causing user drop-off - became primary focus', color: colors.jasmine },
  ],

  hypothesesTested: [
    'Cart editing from any page increases conversion',
    'Forced account creation increases abandonment',
    'Users prefer calendar button over list button',
    'Users prefer date picker matching real-life models',
    'Users prefer monthly view for ticket booking',
    'Seeing events on calendar increases conversion'
  ],

  observationAreas: ['Entrance & Wayfinding', 'Ticket Information', 'Purchase Process', 'User Emotions'],

  keyFindings: [
    {
      title: "Account Creation Barriers",
      items: ['Complex account creation process', 'Security and privacy concerns', 'Difficult password management', 'Forced account creation at checkout'],
      quote: '"Why do I need to create an account just to buy a ticket?"',
      color: colors.burnt
    },
    {
      title: "Cart Management Issues",
      items: ['Cart sessions expiring too quickly', 'Inability to edit cart efficiently', 'Long, complex checkout process', 'Poor cart customization'],
      color: colors.sandy
    },
    {
      title: "Ticket Booking Complexity",
      items: ['Over-simplified calendar lacking info', 'Unintuitive time slot booking', 'Missing system status indicators', 'Fees not displayed upfront'],
      color: colors.jasmine
    },
    {
      title: "Information Architecture",
      items: ['Disorganized site structure', 'Critical information hidden', 'Lack of clear wayfinding', 'Users depend on staff for basic info'],
      color: colors.verdigris
    },
  ],

  journeyMap: [
    { time: "Pre-Planning", mood: "Confused", title: "Research Phase", desc: "Information split across multiple pages. Parking details buried." },
    { time: "Online Purchase", mood: "Frustrated", title: "Checkout Struggle", desc: "+5 step checkout vs expected 2-3. Forced account creation." },
    { time: "Arriving On-Site", mood: "Overwhelmed", title: "Finding Way", desc: "No clear signage. Users ask staff for directions. Info desk congestion." },
    { time: "In-Person Purchase", mood: "Relieved", title: "Quick Transaction", desc: "Fast transaction. Payment processed quickly. Receives tickets." },
    { time: "Exploring Gallery", mood: "Lost", title: "Navigation", desc: "Museum wayfinding unclear. No digital gallery guide. Uses printed map." }
  ],

  cognitiveDissonance: 'Ethnographic research revealed that the physical ticket purchase was easy (2-3 minutes, clear process) while the digital experience was frustrating (+5 steps, account required). This mismatch creates negative brand perception before visitors even arrive.',

  recommendations: [
    { icon: User, color: colors.charcoal, title: 'Account Creation', items: ['Implement guest checkout option', 'Reduce required personal information', 'Provide clear value proposition for accounts', 'Improve password management UX'] },
    { icon: ShoppingCart, color: colors.verdigris, title: 'Cart Management', items: ['Extend cart session timeout', 'Enable in-cart editing without restarting', 'Streamline checkout to reduce steps', 'Add cart saving functionality'] },
    { icon: Calendar, color: colors.jasmine, title: 'Ticket Booking', items: ['Redesign calendar to show events clearly', 'Add system status indicators', 'Display all fees upfront', 'Align digital with physical mental models'] },
    { icon: MapPin, color: colors.sandy, title: 'Information Architecture', items: ['Reorganize site for intuitive trip planning', 'Develop clear content strategy', 'Improve search and filtering', 'Add digital wayfinding resources'] },
  ],

  quickWins: [
    { title: 'Guest Checkout', desc: 'Immediate reduction in cart abandonment' },
    { title: 'Extended Cart Timeout', desc: 'Let users return to complete purchase' },
    { title: 'Upfront Fee Display', desc: 'Build trust, reduce checkout surprises' },
  ],

  validatedHypotheses: [
    'Forced account creation during checkout increases cart abandonment',
    'Users prefer calendar views that show available events clearly',
    'Cart editing capabilities directly impact conversion rates',
    'Cognitive dissonance between physical and digital experiences negatively impacts satisfaction'
  ],

  businessValue: [
    { title: 'Revenue Impact', items: ['Clear roadmap to reduce cart abandonment', 'Opportunity to convert visitors into members', 'Decrease dependency on in-person sales'], color: colors.verdigris },
    { title: 'Competitive Positioning', items: ['Insights vs leading cultural institutions', 'Strategic recommendations to match standards', 'Unique opportunities identified'], color: colors.charcoal },
    { title: 'User Experience & Brand', items: ['Data-driven understanding of frustrations', 'Prioritized improvements for satisfaction', 'Framework for consistent experiences'], color: colors.jasmine },
    { title: 'Operational Efficiency', items: ['Reduced burden on front desk staff', 'Better traffic flow in physical space', 'Foundation for future product decisions'], color: colors.sandy },
  ],

  methodology: {
    worked: ['Mixed-method approach provided comprehensive insights', 'Ethnographic research revealed unexpected findings', 'Affinity mapping enabled efficient synthesis'],
    challenges: ['Participant no-shows: Recruited 2 extra participants', 'Technical issues: Tested all tech before interviews', 'Site access: Prepared official research letter'],
    nextSteps: ['Prioritize quick wins: Guest checkout, extended timeout', 'Usability testing on redesigned flows', 'Monitor conversion rates post-implementation']
  }
};
