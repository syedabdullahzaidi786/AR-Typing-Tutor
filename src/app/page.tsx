import Link from "next/link";
import { auth } from "@/lib/auth";
import { Keyboard, Trophy, Award, Globe, ArrowRight, Zap, Shield, BarChart3 } from "lucide-react";
import VerifyCertificateForm from "@/components/certificate/VerifyCertificateForm";

export default async function HomePage() {
  const session = await auth();

  const features = [
    {
      icon: Globe,
      title: "4 Languages",
      desc: "English, Urdu, Arabic & Sindhi with full RTL support",
      color: "from-violet-600 to-indigo-600",
    },
    {
      icon: Zap,
      title: "Real-Time Engine",
      desc: "Live WPM, accuracy tracking with character-level feedback",
      color: "from-blue-600 to-cyan-600",
    },
    {
      icon: Trophy,
      title: "Timed Tests",
      desc: "1, 3, 5 minute tests with pass/fail evaluation",
      color: "from-yellow-600 to-orange-600",
    },
    {
      icon: Award,
      title: "Certificates",
      desc: "Download PNG certificates upon passing tests",
      color: "from-green-600 to-emerald-600",
    },
    {
      icon: BarChart3,
      title: "Leaderboard",
      desc: "Daily, weekly rankings by language and WPM",
      color: "from-pink-600 to-rose-600",
    },
    {
      icon: Shield,
      title: "Verified",
      desc: "QR code verification for all certificates",
      color: "from-teal-600 to-green-600",
    },
  ];

  const languages = [
    { name: "English", sample: "The quick brown fox...", dir: "ltr" },
    { name: "اردو", sample: "پاکستان ایک خوبصورت ملک ہے", dir: "rtl" },
    { name: "العربية", sample: "اللغة العربية لغة جميلة", dir: "rtl" },
    { name: "سنڌي", sample: "سنڌ هڪ خوبصورت صوبو آهي", dir: "rtl" },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-8">
          <Keyboard className="w-4 h-4" />
          Multi-Language Typing Platform
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Master Typing in{" "}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Any Language
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Practice and get certified in English, Urdu, Arabic, and Sindhi. Real-time
          feedback, timed tests, and professional certificates.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/practice"
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
          >
            Start Practicing
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/test"
            className="flex items-center gap-2 px-8 py-4 bg-gray-800 border border-gray-700 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
          >
            Take a Test
          </Link>
          {!session && (
            <Link
              href="/register"
              className="flex items-center gap-2 px-8 py-4 border border-violet-500 text-violet-400 rounded-xl font-semibold hover:bg-violet-500/10 transition-colors"
            >
              Create Account
            </Link>
          )}
        </div>
      </section>

      {/* Language showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 hover:border-violet-500/40 transition-colors"
            >
              <p className="text-violet-400 font-semibold mb-2">{lang.name}</p>
              <p
                className="text-gray-400 text-sm"
                dir={lang.dir}
                style={{ textAlign: lang.dir === "rtl" ? "right" : "left" }}
              >
                {lang.sample}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Verify Certificate Form */}
      <VerifyCertificateForm />

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Everything You Need
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      {!session && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/20 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Certified?
            </h2>
            <p className="text-gray-400 mb-8">
              Create a free account and start your typing journey today.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
