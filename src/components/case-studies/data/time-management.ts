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
  gradient: 'from-[#264653] to-[#2a9d8f]',
  pdfPath: '/Time Management App - UX Research Case Study.pdf',
  challenge: 'Design a time management app that aligns with user expectations. Understand what features users truly need versus what they think they need.',
  researchQuestion: 'Which tools and strategies do individuals who are good at managing their time use?',
  hypothesis: 'Users are more likely to use a time management app with features customizable to their preferences.',
  overview: 'Designing a time management app aligned with user expectations and actual usage patterns.',

  persona: {
    initials: 'AL',
    name: 'Alex Lee',
    subtitle: '32 M | Office Worker | Hybrid Work',
    goals: ['Reduce time wasted on distractions', 'Avoid procrastinating on non-urgent tasks', 'Complete all tasks set for the week'],
    painPoints: ['Task switching from coworker interruptions', 'Low motivation on non-urgent tasks', 'Using multiple time management tools'],
    extra1: { title: 'Tools & Strategies', items: ['Calendar blocking', 'Whiteboard for reminders', 'Prioritizing tasks by urgency'], color: colors.verdigris },
    extra2: { title: 'Distractions', items: ['Texts, emails & social media', 'Socializing with colleagues', 'Mobile games'], color: colors.sandy },
    color: colors.charcoal
  },

  approach: [
    { num: '1', title: 'Exploratory', sub: 'Focus Group', color: colors.verdigris },
    { num: '2', title: 'Validation', sub: 'Online Survey', color: colors.charcoal },
    { num: '3', title: 'In-Context', sub: 'Diary Study', color: colors.sandy },
  ],

  focusGroupChallenges: ['Procrastination', 'Too many tasks', 'Forgot my plan', 'Social Media'],
  focusGroupSolutions: ['Screen time limit', 'To-Do List', 'Reminders', 'Set alarms'],

  surveyData: {
    q1: [
      { value: 15, label: "Personal", color: colors.verdigris },
      { value: 13, label: "Work", color: colors.burnt },
      { value: 6, label: "Collab", color: colors.sandy },
      { value: 5, label: "Academic", color: colors.jasmine },
    ],
    q7: [
      { value: 9, label: "Deadlines", color: colors.verdigris },
      { value: 9, label: "Breakdown", color: colors.burnt },
      { value: 6, label: "None", color: colors.sandy },
      { value: 1, label: "Blocking", color: colors.jasmine },
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
    { title: 'Frequent Tool Usage', desc: 'Users use time management tools several times a day.' },
    { title: 'Weekly Calendar Preference', desc: 'Users prefer using the weekly calendar view several times a day.' },
    { title: 'Top Anti-Procrastination Strategies', desc: 'The strategies used the most to avoid procrastination are setting deadlines and breaking down tasks.' },
    { title: 'The Customization Paradox', desc: 'Users want flexibility but rarely customize.' },
    { title: 'Mood Impacts Productivity', desc: 'Low mood dramatically increases procrastination.' },
    { title: 'Interruptions Derail Focus', desc: 'Users struggle to refocus after interruptions.' },
  ],

  journeyMap: [
    { time: "Morning", mood: "Productive", title: "Planning", desc: "Motivated but overwhelmed by full calendar." },
    { time: "Mid-Morning", mood: "Distracted", title: "Deep Work", desc: "Digital notifications break concentration." },
    { time: "Afternoon", mood: "Low Energy", title: "The Slump", desc: "Social media temptation peaks." },
    { time: "Late Afternoon", mood: "Stressed", title: "The Race", desc: "Racing against deadlines." },
    { time: "Evening", mood: "Relief", title: "Reflection", desc: "Reviews day and plans ahead." }
  ],

  recommendations: [
    { icon: Calendar, color: colors.verdigris, title: 'Smart Calendar', desc: 'Weekly view default. Widget for at-a-glance planning. Drag-and-drop rescheduling.' },
    { icon: List, color: colors.charcoal, title: 'Intelligent Task Management', desc: 'Automatically prioritize and break down complex work into manageable steps.' },
    { icon: Target, color: colors.burnt, title: 'Focus Protection', desc: 'Do Not Disturb mode. Silence notifications. Visual indicator when in focus.' },
    { icon: Clock, color: colors.sandy, title: 'Time Blocking', desc: 'Built-in Pomodoro timer. Guided break prompts for sustained productivity.' },
    { icon: Bell, color: colors.jasmine, title: 'Gentle Nudges', desc: 'Motivational prompts during low-energy periods to keep you on track.' },
    { icon: RefreshCw, color: colors.charcoal, title: 'Cross-Device Syncing', desc: '#1 biggest challenge identified. Seamless sync across all your devices.' },
  ],

  impact: [
    { title: 'Reduced Risk', desc: 'Validated demand before development.' },
    { title: 'Competitive Edge', desc: 'Differentiation through Focus Mode.' },
    { title: 'Retention', desc: 'Addressing #1 pain point (syncing).' },
  ],

  designPrinciples: [
    'Reduce cognitive load: Smart defaults over blank slates.',
    'Protect focus time: Active interruption management.',
    'Adapt to mood: Recognize when users need extra support.'
  ],

  methodology: {
    worked: ['Mixed methods approach provided both breadth (survey) and depth (diary study)', 'Recruiting productive users gave insights into successful patterns', 'Real-time journaling captured authentic moments of distraction', 'Three-phase progression allowed each study to inform the next'],
    challenges: 'Low survey response rate (17 vs. goal of 25)',
    solution: 'Recruited previous survey respondents for diary study, ensuring highly engaged participants',
    nextSteps: ['Extend diary study to 14 days to capture full work weeks', 'Include participants who struggle with time management for comparison', 'Add observational component to see actual tool usage vs. self-reported']
  }
};
