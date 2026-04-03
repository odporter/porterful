'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Sparkles, GraduationCap, ChevronRight } from 'lucide-react';

const FEATURES = [
  {
    icon: BookOpen,
    title: '6 Core Subjects',
    desc: 'Math, Reading, Science, Social Studies, Art, and Music — all aligned with the ARCHTEXT™ system.',
  },
  {
    icon: Users,
    title: 'Separate Dashboards',
    desc: 'Honor (age 8) and Noble (age 9) get age-appropriate lessons and quizzes designed just for them.',
  },
  {
    icon: GraduationCap,
    title: 'Parent Dashboard',
    desc: 'Track progress, see quiz scores, and guide the learning path. Kelcee and Od are always in control.',
  },
  {
    icon: Sparkles,
    title: 'ARCHTEXT™ System',
    desc: 'A proprietary teaching methodology developed for homeschool environments. Learning that sticks.',
  },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[var(--pf-border)]">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, #a855f7 0%, transparent 50%)',
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <p className="text-sm uppercase tracking-widest text-purple-400 mb-4">Porterful Ecosystem</p>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            TEACH<span className="text-purple-400">YOUNG</span>
          </h1>
          <p className="text-xl text-[var(--pf-text-secondary)] max-w-2xl mx-auto mb-8">
            Homeschool curriculum for Honor and Noble. Built by their parents. Designed for how kids actually learn.
          </p>
          <a
            href="https://teachyoung.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-medium rounded-full transition-colors border border-purple-500/30">
            Go to TeachYoung.org
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-purple-400 mb-4">What It Is</p>
            <h2 className="text-3xl font-bold mb-4">Education is a right. Not a privilege.</h2>
            <div className="space-y-4 text-[var(--pf-text-secondary)]">
              <p>
                Kelcee and Od are teaching their kids at home. Not because school failed them — because they believe they can do it better. With more attention. More love. More relevance.
              </p>
              <p>
                TeachYoung is the platform they built for that. Lessons for Honor (8) and Noble (9), quizzes that actually test understanding, and a parent dashboard that shows exactly where each kid stands.
              </p>
              <p>
                The ARCHTEXT™ system is at the core — a methodology built for how kids think, not how tests want them to perform.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-4 rounded-2xl bg-[var(--pf-surface)] border border-[var(--pf-border)]">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{title}</h3>
                  <p className="text-sm text-[var(--pf-text-secondary)]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENTS */}
      <section className="border-t border-[var(--pf-border)]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-sm uppercase tracking-widest text-purple-400 mb-8 text-center">The Students</p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              { name: 'Honor', age: 8, grade: '3rd', color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30', accent: 'text-blue-400' },
              { name: 'Noble', age: 9, grade: '4th', color: 'from-orange-500/20 to-orange-600/20 border-orange-500/30', accent: 'text-orange-400' },
            ].map(({ name, age, grade, color, accent }) => (
              <div key={name} className={`p-8 rounded-3xl bg-gradient-to-br ${color} border text-center`}>
                <div className="w-20 h-20 rounded-full bg-white/10 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl font-bold">{name[0]}</span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{name}</h3>
                <p className={`text-sm ${accent}`}>Age {age} · {grade} Grade</p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-[var(--pf-text-secondary)]">
                    Age-appropriate lessons<br />aligned to ARCHTEXT™
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBJECTS */}
      <section className="border-t border-[var(--pf-border)]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-sm uppercase tracking-widest text-purple-400 mb-8 text-center">What They're Learning</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Math', desc: 'Numbers, patterns, problem solving', color: 'text-blue-400' },
              { name: 'Reading', desc: 'Comprehension, vocabulary, fluency', color: 'text-green-400' },
              { name: 'Science', desc: 'Exploration, experiments, curiosity', color: 'text-yellow-400' },
              { name: 'Social Studies', desc: 'History, geography, community', color: 'text-orange-400' },
              { name: 'Art', desc: 'Creativity, expression, technique', color: 'text-pink-400' },
              { name: 'Music', desc: 'Rhythm, theory, performance', color: 'text-purple-400' },
            ].map(({ name, desc, color }) => (
              <div key={name} className="p-5 rounded-2xl bg-[var(--pf-surface)] border border-[var(--pf-border)]">
                <h3 className={`font-bold mb-1 ${color}`}>{name}</h3>
                <p className="text-sm text-[var(--pf-text-secondary)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--pf-border)]">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Start learning.</h3>
          <p className="text-[var(--pf-text-secondary)] mb-8 max-w-lg mx-auto">
            TeachYoung is live and ready. Built for homeschool families who want more control over their kids' education.
          </p>
          <a
            href="https://teachyoung.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-full transition-colors">
            Visit TeachYoung.org
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

    </div>
  );
}
