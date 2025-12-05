import { Calendar, List, Target, Clock, Bell, RefreshCw } from 'lucide-react';
import { colors } from '../colors';
import type { TimeManagementData } from '../types';

export const timeManagementData: TimeManagementData = {
  id: 'time-mgmt',
  title: 'Time Management App',
  subtitle: 'UX Research & Strategy',
  role: 'UX Researcher',
  timeline: '3 Months',
  team: 'Group + Individual',
  methods: 'Focus Groups, Survey, Diary Study',
  gradient: 'from-blue-500 to-indigo-600',
  pdfPath: '/Time Management App - UX Research Case Study.pdf',
  challenge: 'Design a time management app that aligns with user expectations. Understand what features users truly need versus what they think they need.',
  researchQuestion: 'Which tools and strategies do individuals who are good at managing their time use?',
  hypothesis: 'Users are more likely to use a time management app with features customizable to their preferences.',
  overview: 'This project explored how young professionals manage their time, identifying key pain points and opportunities for a productivity app that balances flexibility with smart defaults.',

  persona: {
    initials: 'AL',
    name: 'Alex Lee',
    subtitle: '32 M | Office Worker | Hybrid Work',
    goals: ['Reduce time wasted on distractions', 'Avoid procrastinating on non-urgent tasks', 'Complete all tasks set for the week'],
    painPoints: ['Task switching from coworker interruptions', 'Low motivation on non-urgent tasks', 'Using multiple time management tools'],
    extra1: { title: 'Tools & Strategies', items: ['Calendar blocking', 'Whiteboard for reminders', 'Prioritizing tasks by urgency'], color: colors.green },
    extra2: { title: 'Distractions', items: ['Texts, emails & social media', 'Socializing with colleagues', 'Mobile games'], color: colors.orange },
    color: colors.blue
  },

  approach: [
    { num: '1', title: 'Exploratory', sub: 'Focus Group', color: colors.purple },
    { num: '2', title: 'Validation', sub: 'Online Survey (17 participants)', color: colors.blue },
    { num: '3', title: 'In-Context', sub: 'Diary Study (10 days)', color: colors.green },
  ],

  focusGroupChallenges: ['Procrastination', 'Too many tasks', 'Forgot my plan', 'Social Media'],
  focusGroupSolutions: ['Screen time limit', 'To-Do List', 'Reminders', 'Set alarms'],

  surveyData: {
    q1: [
      { value: 15, label: "Personal", color: colors.blue },
      { value: 13, label: "Work", color: colors.teal },
      { value: 6, label: "Collab", color: colors.orange },
      { value: 5, label: "Academic", color: "#6B7280" },
    ],
    q7: [
      { value: 9, label: "Deadlines", color: colors.blue },
      { value: 9, label: "Breakdown", color: colors.teal },
      { value: 6, label: "None", color: colors.orange },
      { value: 1, label: "Blocking", color: "#6B7280" },
    ],
  },

  keyStats: [
    { label: 'Use weekly calendar "Several times a day"', value: '47%' },
    { label: 'Customize features "Rarely"', value: '47%' },
    { label: 'Believe advanced features increase effectiveness', value: '41%' },
  ],

  diaryDistractions: ['Social Media', 'Emails', 'Colleagues', 'Family'],
  diaryStrategies: ['To-Do List', 'Time Constraints', 'Reminders', 'Reprioritizing'],

  keyFindings: [
    { title: 'Frequency Drives Engagement', desc: 'Users who successfully manage time use tools multiple times daily.' },
    { title: 'Mood Impacts Productivity', desc: 'Low mood dramatically increases procrastination.' },
    { title: 'Interruptions Derail Focus', desc: 'Users struggle to refocus after digital interruptions.' },
    { title: 'The Customization Paradox', desc: 'Users want flexibility but rarely customize features.' },
    { title: 'Breaking Tasks is Key', desc: 'Setting deadlines and breaking tasks into smaller steps works best.' },
    { title: 'Weekly Calendar is Essential', desc: 'Majority accessed weekly calendar view several times daily.' },
  ],

  journeyMap: [
    { time: "Morning", mood: "Productive", title: "Planning", desc: "Motivated but overwhelmed by full calendar." },
    { time: "Mid-Morning", mood: "Distracted", title: "Deep Work", desc: "Digital notifications break concentration." },
    { time: "Afternoon", mood: "Low Energy", title: "The Slump", desc: "Social media temptation peaks." },
    { time: "Late Afternoon", mood: "Stressed", title: "The Race", desc: "Racing against deadlines." },
    { time: "Evening", mood: "Relief", title: "Reflection", desc: "Reviews day and plans ahead." }
  ],

  recommendations: [
    { icon: Calendar, color: colors.purple, title: 'Smart Calendar', desc: 'Weekly view default with drag-and-drop rescheduling and widget for at-a-glance planning.' },
    { icon: List, color: colors.blue, title: 'Intelligent Task Management', desc: 'Automatically prioritize and break down complex work into manageable steps.' },
    { icon: Target, color: colors.red, title: 'Focus Protection', desc: 'Do Not Disturb mode with visual indicator and notification silencing.' },
    { icon: Clock, color: colors.teal, title: 'Time Blocking', desc: 'Built-in Pomodoro timer with guided break prompts.' },
    { icon: Bell, color: colors.orange, title: 'Gentle Nudges', desc: 'Motivational prompts during low-energy periods to combat procrastination.' },
    { icon: RefreshCw, color: colors.green, title: 'Cross-Device Syncing', desc: '#1 biggest challenge identified - seamless sync across all devices.' },
  ],

  impact: [
    { title: 'Validated Hypothesis', desc: 'Yes, with a caveat: Users want customization but need smart defaults first.' },
    { title: 'Reduced Risk', desc: 'Validated demand before development investment.' },
    { title: 'Competitive Edge', desc: 'Differentiation through Focus Mode feature.' },
  ],

  designPrinciples: [
    'Reduce cognitive load: Smart defaults over blank slates.',
    'Protect focus time: Active interruption management.',
    'Adapt to mood: Recognize when users need extra support.'
  ],

  methodology: {
    worked: ['Recruiting "productive" users for pattern matching', 'Real-time journaling captured authentic moments'],
    challenges: 'Low survey response rate.',
    solution: 'Recruited previous respondents for diary study.',
    nextSteps: ['Extend diary study to 14 days', 'Add observational component (screen recording)', 'Usability Testing', 'Competitive Analysis']
  }
};
