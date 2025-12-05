**AlgoTrade Project Responsibilities Distribution**

Shubham: The Agent Architect
Role: AI Inference & Autonomous Execution
Shubham’s mission was to transform a static language model into an active financial agent. He was responsible for the "Brain" (Decision Making) and the "Hands" (Execution).
Solving Hallucination with Grounding: Shubham engineered the core geminiService.ts. Instead of letting the AI guess, he implemented a Search Grounding pipeline. The system first fetches live price and news snapshots via Google Tools, then injects that factual context into a strict JSON-enforced prompt. This ensures every signal is based on reality.
The Auto-Pilot Loop: Intelligence is useless without action. Shubham developed the runAutoScan engine within the TradingContext. This asynchronous loop runs every 3 seconds, scanning the watchlist and triggering executeTrade instantly when the AI detects a signal. This closed the loop between Inference and Action.
"I didn't just want a chatbot that gives advice. I wanted an Agent that could wake up, analyze the market, and physically execute the trade while I slept." — Shubham

Prashant: The Quantitative Analyst
Role: Data Fusion, Sentiment & Backtesting
While Shubham built the agent, Prashant acted as the "Validator," ensuring the AI wasn't gambling. His focus was on Data Synthesis—providing the mathematical ground truth required for safe trading.
Structured Data Parsing: An AI prediction needs context. Prashant engineered the FundamentalsCard to parse unstructured financial text into rigid metrics like PE Ratios, Sector benchmarks, and Market Cap.
Sentiment & Risk Engines: He built the NewsPanel to score headlines (Positive/Negative) and, crucially, the PerformanceMetrics module. Before a single rupee is risked, Prashant’s logic runs a statistical simulation to calculate "Win Rate" and "Max Drawdown," giving the user a probability score based on historical volatility.
"A 'Buy' signal is dangerous without context. My job was to engineer the safeguards—ensuring we backtest the probability and analyze the sentiment before pulling the trigger." — Prashant

Siddharth: The Platform Engineer
Role: State Management, Ledger & Simulation
Siddharth built the "Backbone" that keeps the entire system running. He engineered the client-side exchange environment that mimics a real brokerage backend.
The Ledger State Machine: Siddharth architected the complex TradingContext, effectively building a double-entry ledger in the browser. He handled the logic for Portfolio balancing, Average-Down calculations, and realized P&L updates.
Market Simulation: To test the agent without risking real capital, Siddharth wrote the generateMockChartData algorithms. These mathematical functions simulate realistic market "noise" and volatility ticks, creating a dynamic environment for the AI to navigate. He also implemented the localStorage persistence layer, ensuring the user's Net Worth is cryptographically preserved across sessions.
"The AI needs a playground. I built a crash-resistant exchange environment in the browser that tracks every cent, ensuring our 'Paper Trading' is mathematically identical to the real thing." — Siddharth

Gaurav: The Frontend Architect
Role: High-Frequency Visualization & UI/UX
Financial data is dense and intimidating. Gaurav’s role was to be the "Face" of the terminal, translating complex backend logic into a seamless, institutional-grade interface.
Custom Charting Engine: Gaurav built the StockChart.tsx component from scratch using Recharts. He moved beyond simple line graphs to render dynamic Candlestick patterns with RSI overlays that update in real-time without performance lag.
The Mission Control Dashboard: He designed the TradingDashboard and PredictionCard to visually balance Prashant’s fundamental data with Shubham’s active signals. Using a "Glassmorphism" aesthetic and Tailwind CSS, Gaurav ensured that switching between Analysis and Trading views is instantaneous, creating a cognitive environment where traders can make split-second decisions.
"We aren't building a website; we're building a Terminal. My goal was cognitive efficiency—giving the trader maximum data density with zero visual clutter." — Gaurav
