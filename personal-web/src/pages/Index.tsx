import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  CreditCard,
  Users,
  Lock,
  Sparkles,
  Activity,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-white/30">
      <Helmet>
        <title>
          UverusPay - Seamless Digital Banking for African Businesses
        </title>
        <meta
          name="description"
          content="UverusPay offers instant money transfers, virtual accounts, and bank-level security for growing African businesses. Open a free business account in under 5 minutes."
        />
        <meta
          name="keywords"
          content="digital banking africa, free business account nigeria, fast money transfer, virtual accounts, UverusPay, B2B payments, secure banking"
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://uveruspay.com/" />
        <meta
          property="og:title"
          content="UverusPay - Seamless Digital Banking for African Businesses"
        />
        <meta
          property="og:description"
          content="Experience banking without borders across Africa. Instant transfers, top-tier security, and zero hidden fees with UverusPay."
        />
        <meta
          property="og:image"
          content="https://uveruspay.com/og-image.jpg"
        />
        <meta property="og:site_name" content="UverusPay" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://uveruspay.com/" />
        <meta
          name="twitter:title"
          content="UverusPay - Seamless Digital Banking for African Businesses"
        />
        <meta
          name="twitter:description"
          content="Send, receive, and manage your business finances instantly. Setup takes less than 3 minutes."
        />
        <meta
          name="twitter:image"
          content="https://uveruspay.com/twitter-image.jpg"
        />

        <link rel="canonical" href="https://uveruspay.com/" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-24 pb-16 md:pt-32 md:pb-24 flex items-center justify-center overflow-hidden bg-gradient-hero">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] rounded-full bg-white/10 blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-[120px]"
          />

          {/* Floating Shape 1 */}
          <motion.div
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-[15%] left-[5%] md:left-[10%] w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg"
          >
            <Zap className="w-8 h-8 text-white/50" />
          </motion.div>

          {/* Floating Shape 2 */}
          <motion.div
            animate={{
              y: [0, 40, 0],
              rotate: [0, -15, 10, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-[25%] right-[5%] md:right-[15%] w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg"
          >
            <Shield className="w-10 h-10 text-white/40" />
          </motion.div>

          {/* Floating Shape 3 */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              x: [0, 15, 0],
              rotate: [-10, 5, -10],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-[15%] left-[10%] md:left-[25%] w-24 h-16 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg"
          >
            <CreditCard className="w-8 h-8 text-white/50" />
          </motion.div>

          {/* Floating Shape 4 */}
          <motion.div
            animate={{
              y: [0, 25, 0],
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute bottom-[20%] right-[10%] md:right-[25%] hidden lg:flex w-16 h-16 rounded-full bg-success/10 backdrop-blur-md border border-success/20 items-center justify-center shadow-lg"
          >
            <Sparkles className="w-8 h-8 text-success/60" />
          </motion.div>
        </div>

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-hero/90 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 cursor-pointer text-white"
              onClick={() => navigate("/")}
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">
                Uverus Pay
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 text-white"
            >
              <Button
                variant="ghost"
                className="hidden sm:inline-flex font-medium hover:bg-white/10 text-white"
                onClick={() => navigate("/auth/login")}
              >
                Sign In
              </Button>
              <Button
                variant="secondary"
                className="font-medium bg-white text-primary hover:bg-white/90 shadow-lg shadow-white/10 transition-all hover:scale-105 active:scale-95"
                onClick={() => navigate("/auth/register")}
              >
                Get Started
              </Button>
            </motion.div>
          </div>
        </header>

        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-10 max-w-7xl mt-12 text-white">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              className="flex-1 text-center lg:text-left pt-10 lg:pt-0"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 text-success" />
                <span className="text-white/90 text-sm font-medium">
                  The Future of Digital Banking
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8"
              >
                Personal <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-success">
                  Banking
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
              >
                Tenant-branded personal banking portal with bank-level security. 
                Experience banking without borders across Africa.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto h-14 px-8 text-base shadow-xl bg-white text-primary hover:bg-white/90 transition-all hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-white/20 group"
                  onClick={() => navigate("/auth/register")}
                >
                  Open Free Account
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-base border-white/30 text-white bg-white/10 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
                >
                  View Pricing
                </Button>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm text-white/60 font-medium"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-success" />
                  <span>Licensed by CBN</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-success" />
                  <span>NDIC Insured</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Interactive 3D/Floating Card Preview */}
            <motion.div
              className="flex-1 w-full max-w-[500px] lg:max-w-none relative perspective-1000"
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 p-1 rounded-3xl bg-gradient-to-br from-white/30 via-white/5 to-success/30 shadow-2xl backdrop-blur-2xl border border-white/20"
              >
                <div className="bg-primary/80 backdrop-blur-3xl rounded-[1.4rem] p-6 lg:p-8 shadow-inner border border-white/10">
                  <div className="flex justify-between items-start mb-8 text-white">
                    <div>
                      <p className="text-sm text-white/70 font-medium mb-1">
                        Total Balance
                      </p>
                      <h3 className="text-4xl font-bold tracking-tight">
                        ₦2,456,300
                        <span className="text-white/50 text-2xl">.00</span>
                      </h3>
                    </div>
                    <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8 text-white">
                    <div className="bg-success/20 p-4 rounded-2xl border border-success/30 transition-colors hover:bg-success/30 cursor-pointer backdrop-blur-sm">
                      <div className="w-8 h-8 rounded-full bg-success/30 flex items-center justify-center mb-3">
                        <ArrowRight className="w-4 h-4 text-white -rotate-45" />
                      </div>
                      <p className="font-semibold">Receive</p>
                    </div>
                    <div className="bg-white/15 p-4 rounded-2xl border border-white/20 transition-colors hover:bg-white/25 cursor-pointer backdrop-blur-sm">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-3">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                      <p className="font-semibold">Send</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-white">
                    <p className="text-sm font-semibold text-white/50 uppercase tracking-wider">
                      Recent Activity
                    </p>
                    {[
                      {
                        name: "Spotify Premium",
                        amount: "-₦4,500.00",
                        date: "Today, 2:45 PM",
                        icon: Smartphone,
                        color: "text-white",
                        bg: "bg-white/15",
                      },
                      {
                        name: "Salary Deposit",
                        amount: "+₦850,000.00",
                        date: "Yesterday",
                        icon: Zap,
                        color: "text-success",
                        bg: "bg-success/20",
                      },
                    ].map((tx, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2.5 rounded-xl border border-white/5 ${tx.bg}`}
                          >
                            <tx.icon className={`w-5 h-5 ${tx.color}`} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{tx.name}</p>
                            <p className="text-xs text-white/60">{tx.date}</p>
                          </div>
                        </div>
                        <p
                          className={`font-semibold text-sm ${tx.amount.startsWith("+") ? "text-success" : "text-white/90"}`}
                        >
                          {tx.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-card relative z-20 border-t border-border">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Everything you need to <span className="text-primary">scale</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Built for speed, uncompromising security, and radical simplicity.
              Say goodbye to banking frustrations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Bank-Grade Security",
                desc: "Enterprise-level 256-bit encryption protects every single transaction. Sleep easy.",
              },
              {
                icon: Zap,
                title: "Lightning Transfers",
                desc: "Why wait hours? Send and receive money instantly, across all supported networks.",
              },
              {
                icon: CreditCard,
                title: "Virtual Accounts",
                desc: "Generate unique account numbers on the fly for seamless customer collections.",
              },
              {
                icon: Users,
                title: "P2P Payments",
                desc: "Transfer to other Uverus Pay users with just a username. Zero fees, zero wait times.",
              },
              {
                icon: Globe,
                title: "Cross-Border Ready",
                desc: "Infrastructure built to connect seamless payments across the entire African continent.",
              },
              {
                icon: Lock,
                title: "Absolute Privacy",
                desc: "Your financial data is yours. We never share your data with unauthorized third parties.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group p-8 rounded-3xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-300 transform translate-x-4 -translate-y-4">
                  <feature.icon className="w-32 h-32 text-primary" />
                </div>

                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why UverusPay Section */}
      <section className="py-24 bg-background relative z-20 overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex-1 space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-primary text-sm font-medium">
                  Why UverusPay?
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Built for growing businesses that demand{" "}
                <span className="text-primary">more.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We're rethinking banking from the ground up to give you the
                tools you need to succeed in today's fast-paced digital economy.
                No hidden fees, no unnecessary paperwork.
              </p>

              <div className="space-y-4 pt-4">
                {[
                  "Free business account opening in under 5 minutes",
                  "Dedicated support team available 24/7",
                  "Automated bookkeeping and expense tracking",
                  "Multi-currency support for cross-border trade",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 w-6 h-6 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-base font-medium text-foreground">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex-1 w-full relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-success/20 rounded-[2.5rem] blur-3xl -z-10" />
              <div className="relative bg-card border border-border rounded-[2.5rem] p-8 sm:p-10 shadow-2xl">
                <div className="space-y-8">
                  <div className="flex justify-between items-center border-b border-border pb-8">
                    <div className="w-1/3">
                      <h4 className="font-semibold text-lg mb-1 leading-tight">
                        Traditional Banks
                      </h4>
                      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                        Slow & Pricey
                      </p>
                    </div>
                    <div className="w-1/3 text-center">
                      <div className="w-px h-12 bg-border mx-auto rounded-full"></div>
                    </div>
                    <div className="w-1/3 text-right">
                      <h4 className="font-semibold text-lg mb-1 leading-tight text-primary">
                        UverusPay
                      </h4>
                      <p className="text-success text-xs font-medium uppercase tracking-wider">
                        Fast & Free
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {[
                      {
                        label: "Account Setup",
                        old: "3-5 Business Days",
                        new: "3 Minutes",
                        type: "time",
                      },
                      {
                        label: "Transfer Fees",
                        old: "Up to 1.5%",
                        new: "Zero internally",
                        type: "money",
                      },
                      {
                        label: "Customer Support",
                        old: "9AM - 5PM",
                        new: "24/7 Priority",
                        type: "support",
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center py-2 relative"
                      >
                        {/* Decorative dotted line behind text */}
                        <div className="absolute left-0 right-0 top-1/2 h-[1px] border-b border-dashed border-border/60 -z-10"></div>

                        <span className="text-muted-foreground bg-card pr-4 line-through decoration-destructive/50 text-sm whitespace-nowrap">
                          {stat.old}
                        </span>
                        <span className="text-xs font-semibold bg-background px-3 py-1 rounded-full border border-border text-center uppercase tracking-wide">
                          {stat.label}
                        </span>
                        <span className="text-foreground bg-card pl-4 font-bold text-sm whitespace-nowrap">
                          {stat.new}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-border mt-8">
                    <Button
                      variant="ghost"
                      className="w-full text-primary hover:text-primary hover:bg-primary/5 group"
                    >
                      See full comparison
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-success via-warning to-success"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Ready to transform your finances?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Join thousands of forward-thinking businesses and individuals
                using Uverus Pay. Setup takes less than 3 minutes.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-10 text-lg font-semibold rounded-full bg-white text-primary hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-xl"
                onClick={() => navigate("/auth/register")}
              >
                Create Your Free Account
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary border-t border-white/10 pt-16 pb-8 text-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <span className="font-bold text-xl tracking-tight">
                Uverus Pay
              </span>
            </div>

            <div className="flex gap-8 text-sm font-medium text-white/70">
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Security
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex text-center">
            <p className="text-white/50 text-sm w-full">
              © {new Date().getFullYear()} Uverus Technologies Ltd. All rights
              reserved. Licensed by the Central Bank of Nigeria.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
