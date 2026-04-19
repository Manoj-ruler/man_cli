"use client";

import React, { useState } from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
  Terminal, 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  Calendar, 
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Shield,
  Check
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  TERMASSIST_INSTALL_COMMAND,
  TERMASSIST_NPM_PACKAGE,
} from "@/lib/termassist-npm";

interface PostContent {
  title: string;
  category: string;
  date: string;
  readTime: string;
  content: React.ReactNode;
}

const POSTS: Record<string, PostContent> = {
  "quick-install-guide": {
    title: "Install TermAssist Step by Step (The Super Simple Guide)",
    category: "Setup",
    date: "Apr 19, 2026",
    readTime: "8 min",
    content: (
      <>
        <h2>What you are doing (in one sentence)</h2>
        <p>
          You will install a small program called <strong>TermAssist</strong> from{" "}
          <a href="https://www.npmjs.com/package/@manoj-ruler/termassist" target="_blank" rel="noopener noreferrer">npm</a>.
          After that, you can type normal English in your terminal and TermAssist will suggest the right command. You do{" "}
          <strong>not</strong> need the website to try it — the website is only for extras (history and custom snippets).
        </p>

        <div className="blog-callout blog-callout-info">
          <Terminal className="w-5 h-5 mt-1 shrink-0" />
          <div>
            <strong>The install command you will use:</strong>{" "}
            <code>{TERMASSIST_INSTALL_COMMAND}</code> — copy it exactly, including the <code>@</code> and the slash.
          </div>
        </div>

        <h2>Step 1 — Install Node.js (the free “engine”)</h2>
        <p>
          TermAssist runs on <strong>Node.js</strong>. If you already have Node, skip to Step 2.
        </p>
        <ol>
          <li>Open <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">https://nodejs.org</a>.</li>
          <li>Download the <strong>LTS</strong> version (those letters mean “long-term support” — the stable one).</li>
          <li>Run the installer. Click “Next” until it finishes. Restart your terminal app after it is done.</li>
        </ol>

        <h2>Step 2 — Open a terminal</h2>
        <ul>
          <li><strong>Windows:</strong> Press the Windows key, type <code>PowerShell</code>, open “Windows PowerShell”.</li>
          <li><strong>Mac:</strong> Open “Terminal” from Applications → Utilities (or press <code>Cmd + Space</code>, type Terminal).</li>
          <li><strong>Linux:</strong> Open your usual terminal (often <code>Ctrl + Alt + T</code>).</li>
        </ul>

        <h2>Step 3 — Install TermAssist from npm (one line)</h2>
        <p>Paste this line, then press Enter:</p>
        <pre>
          <code>{TERMASSIST_INSTALL_COMMAND}</code>
        </pre>
        <p>
          <code>-g</code> means “install for the whole computer,” so you can run <code>termassist</code> from any folder.
        </p>
        <p>
          If you see errors about permission, search for “npm global install permission” for your operating system, or run your terminal as an administrator only if your IT rules allow it.
        </p>

        <h2>Step 4 — Make sure it really installed</h2>
        <p>Paste this and press Enter:</p>
        <pre>
          <code>npm list -g {TERMASSIST_NPM_PACKAGE}</code>
        </pre>
        <p>
          You should see a line with <code>{TERMASSIST_NPM_PACKAGE}</code> and a version number. That means success.
        </p>

        <h2>Step 5 — Run your first question</h2>
        <p>Paste one of these and press Enter:</p>
        <pre>
          <code>termassist &quot;how to list files&quot;</code>
        </pre>
        <p>TermAssist will show a suggested command and ask if you want to run it. You can edit the line before you press Enter.</p>

        <h2>Step 6 — (Optional) Use the short name <code>??</code></h2>
        <p>
          After you are comfortable, you can add a shortcut so you type <code>??</code> instead of <code>termassist</code>. That is a small setup step in your shell profile — the full walkthrough is in{" "}
          <Link href="/blog/mastering-cli" className="text-pink hover:underline">the complete beginner&apos;s guide</Link>.
        </p>

        <h2>Step 7 — (Optional) Use the website and dashboard</h2>
        <p>This part is only if you want history in the browser or custom commands saved online.</p>
        <ol>
          <li>Go to <Link href="/auth/signup" className="text-pink hover:underline">Sign up</Link> on this site and create an account.</li>
          <li>Open <Link href="/dashboard/settings" className="text-pink hover:underline">Dashboard → Settings</Link>.</li>
          <li>Click <strong>Generate Token</strong>. Copy the token (it often starts with <code>ta_</code>).</li>
          <li>
            Create a file named <code>config.json</code> inside a folder named <code>.termassist</code> in your home folder.
            Put your token and this site&apos;s URL inside — the Settings page shows a ready-to-copy example.
          </li>
          <li>Set <code>&quot;sync_enabled&quot;: true</code> only if you want to send query history to your dashboard.</li>
        </ol>

        <h2>Step 8 — (Optional) Download your custom snippets</h2>
        <p>After you save snippets on the dashboard, run:</p>
        <pre>
          <code>termassist sync</code>
        </pre>
        <p>That downloads them to your computer so TermAssist can match them like built-in commands.</p>

        <h2>If something goes wrong</h2>
        <ul>
          <li><strong>“command not found”:</strong> Node might not be on your PATH, or the global npm folder is not on PATH. Reinstall Node LTS and open a new terminal window.</li>
          <li><strong>Wrong package:</strong> The name on npm is <code>{TERMASSIST_NPM_PACKAGE}</code> — not plain <code>termassist</code> alone.</li>
          <li><strong>Sync errors:</strong> Check <code>api_token</code>, <code>api_url</code>, and that <code>sync_enabled</code> is true in <code>~/.termassist/config.json</code> (Windows: <code>%USERPROFILE%\.termassist\config.json</code>).</li>
        </ul>

        <div className="blog-callout blog-callout-info">
          <Sparkles className="w-5 h-5 mt-1 shrink-0" />
          <div>
            <strong>Next read:</strong>{" "}
            <Link href="/blog/mastering-cli" className="text-pink hover:underline">The complete beginner&apos;s guide</Link>{" "}
            for aliases, interactive mode, and more examples — or{" "}
            <Link href="/blog/packages-deep-dive" className="text-pink hover:underline">how TermAssist works</Link>{" "}
            if you are curious about BM25 and privacy.
          </div>
        </div>
      </>
    ),
  },
  "mastering-cli": {
    title: "The Complete Beginner's Guide to TermAssist: From Zero to Hero",
    category: "Guide",
    date: "Apr 17, 2026",
    readTime: "15 min",
    content: (
      <>
        <h2>What is TermAssist?</h2>
        <p>
          TermAssist is a tool that helps you use your computer's terminal (also called command prompt or console) by typing normal English sentences instead of complicated commands.
        </p>
        <p>
          Imagine you want to find all Python files you changed today. Normally, you'd need to remember this command:
        </p>
        <pre>
          <code>find . -name '*.py' -mtime -1</code>
        </pre>
        <p>
          With TermAssist, you just type:
        </p>
        <pre>
          <code>?? find all python files modified today</code>
        </pre>
        <p>
          TermAssist understands what you mean and shows you the exact command. You can then run it immediately!
        </p>

        <div className="blog-callout blog-callout-info">
           <Terminal className="w-5 h-5 mt-1 shrink-0" />
           <div>
              <strong>Important:</strong> TermAssist works 100% on your computer. It does not send your questions to the internet. This means it's fast and private.
           </div>
        </div>

        <h2>Part 1: Creating Your Account (The Website)</h2>
        <p>
          Before using TermAssist in your terminal, you need to create an account on our website. This account lets you save your favorite commands and see your usage history.
        </p>

        <h3>Step 1: Go to the Signup Page</h3>
        <p>
          Open your web browser and go to the TermAssist website. Click the "Sign Up" button, or go directly to the signup page.
        </p>

        <h3>Step 2: Create Your Account</h3>
        <p>
          You have two options:
        </p>
        <ul>
          <li><strong>Option A - Use Google</strong>: Click "Continue with Google" and select your Google account. This is the fastest way.</li>
          <li><strong>Option B - Use Email</strong>: Enter your email address and create a password. Make sure your password is strong (use letters, numbers, and symbols).</li>
        </ul>

        <h3>Step 3: Verify Your Email (If Using Email Signup)</h3>
        <p>
          If you signed up with email, check your inbox for a verification email from TermAssist. Click the verification link to activate your account.
        </p>

        <h2>Part 2: Getting Your API Token</h2>
        <p>
          An API token is like a special key that connects your terminal to your website account. You need this key so TermAssist knows who you are.
        </p>

        <h3>Step 1: Go to Dashboard Settings</h3>
        <p>
          After logging in, click on "Dashboard" in the top menu. Then click on "Settings" in the left sidebar (or go to Dashboard → Settings).
        </p>

        <h3>Step 2: Generate Your Token</h3>
        <p>
          In the Settings page, find the section called "CLI API Token". Click the button that says "Generate Token".
        </p>
        <p>
          You will see a token that looks like this: <code>ta_abc123def456...</code> (it will be much longer).
        </p>

        <h3>Step 3: Copy Your Token</h3>
        <p>
          Click the copy icon (it looks like two overlapping squares) next to your token. This copies it to your clipboard. Save this token somewhere safe - you'll need it in the next step!
        </p>

        <div className="blog-callout blog-callout-warning">
           <Shield className="w-5 h-5 mt-1 shrink-0 text-pink" />
           <div>
              <strong>Keep Your Token Secret:</strong> Don't share your API token with anyone. It's like a password for your account.
           </div>
        </div>

        <h2>Part 3: Installing TermAssist on Your Computer</h2>

        <h3>Step 1: Check Your Prerequisites</h3>
        <p>
          Before installing, make sure you have these two things installed:
        </p>
        <ul>
          <li><strong>Node.js</strong>: This is required to run TermAssist. Download it from <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">nodejs.org</a>. Install the "LTS" (Long Term Support) version.</li>
          <li><strong>Terminal Access</strong>: You need access to your computer's terminal application.</li>
        </ul>

        <h3>Step 2: Install TermAssist from npm</h3>
        <p>
          Open your terminal and paste this <strong>exact</strong> command (the name includes <code>@manoj-ruler/</code>), then press Enter:
        </p>
        <pre>
          <code>{TERMASSIST_INSTALL_COMMAND}</code>
        </pre>
        <p>
          The <code>-g</code> means &quot;global,&quot; which lets you use the <code>termassist</code> command from any folder on your computer.
        </p>

        <h3>Step 3: Verify installation</h3>
        <p>
          The CLI does not need a separate <code>--version</code> flag for you to know it worked. Run:
        </p>
        <pre>
          <code>npm list -g {TERMASSIST_NPM_PACKAGE}</code>
        </pre>
        <p>
          You should see your package name and a version number. Or run <code>termassist &quot;list files&quot;</code> — if TermAssist answers with a command, you are ready.
        </p>

        <h2>Part 4: Setting Up the Configuration File</h2>
        <p>
          TermAssist needs a configuration file to know your API token and settings. This file is stored in a hidden folder on your computer.
        </p>

        <h3>For Windows Users:</h3>
        <p>
          <strong>Step 1:</strong> Press <code>Windows + R</code> to open the Run dialog.
        </p>
        <p>
          <strong>Step 2:</strong> Type this and press Enter:
        </p>
        <pre>
          <code>%USERPROFILE%</code>
        </pre>
        <p>
          <strong>Step 3:</strong> Create a new folder called <code>.termassist</code> (don't forget the dot at the beginning!).
        </p>
        <p>
          <strong>Step 4:</strong> Inside that folder, create a file called <code>config.json</code>.
        </p>
        <p>
          <strong>Step 5:</strong> Open <code>config.json</code> with Notepad or any text editor and paste this:
        </p>
        <pre>
          <code>{`{
  "api_token": "PASTE_YOUR_TOKEN_HERE",
  "api_url": "https://termassist.vercel.app",
  "sync_enabled": true
}`}</code>
        </pre>
        <p>
          <strong>Step 6:</strong> Replace <code>PASTE_YOUR_TOKEN_HERE</code> with the token you copied earlier. Save the file.
        </p>

        <h3>For Mac/Linux Users:</h3>
        <p>
          <strong>Step 1:</strong> Open your terminal.
        </p>
        <p>
          <strong>Step 2:</strong> Create the config folder by typing:
        </p>
        <pre>
          <code>mkdir -p ~/.termassist</code>
        </pre>
        <p>
          <strong>Step 3:</strong> Create and edit the config file:
        </p>
        <pre>
          <code>nano ~/.termassist/config.json</code>
        </pre>
        <p>
          <strong>Step 4:</strong> Paste this into the editor:
        </p>
        <pre>
          <code>{`{
  "api_token": "PASTE_YOUR_TOKEN_HERE",
  "api_url": "https://termassist.vercel.app",
  "sync_enabled": true
}`}</code>
        </pre>
        <p>
          <strong>Step 5:</strong> Replace <code>PASTE_YOUR_TOKEN_HERE</code> with your actual token.
        </p>
        <p>
          <strong>Step 6:</strong> Press <code>Ctrl + X</code>, then <code>Y</code>, then <code>Enter</code> to save and exit.
        </p>

        <h2>Part 5: Using TermAssist - The Basics</h2>

        <h3>Your First Query</h3>
        <p>
          Now for the fun part! Open your terminal and type:
        </p>
        <pre>
          <code>?? how to list all files</code>
        </pre>
        <p>
          TermAssist will show you the command: <code>ls -la</code>
        </p>
        <p>
          You'll see a prompt asking: "🚀 Ready to execute (Edit if needed):"
        </p>
        <ul>
          <li>If the command looks good, just press <code>Enter</code> to run it.</li>
          <li>If you want to change something, edit the command first, then press <code>Enter</code>.</li>
          <li>If you don't want to run anything, press <code>Ctrl + C</code> to cancel.</li>
        </ul>

        <h3>More Example Queries</h3>
        <p>Try these to see how TermAssist works:</p>
        <ul>
          <li><code>?? undo last git commit</code> → Shows: <code>git reset --soft HEAD~1</code></li>
          <li><code>?? find large files bigger than 100mb</code> → Shows: <code>find / -type f -size +100M 2&gt;/dev/null</code></li>
          <li><code>?? check ip address</code> → Shows: <code>ip addr show</code></li>
          <li><code>?? compress a folder into zip</code> → Shows: <code>zip -r archive.zip directory/</code></li>
        </ul>

        <h2>Part 6: Setting Up the ?? Shortcut (Alias)</h2>
        <p>
          Right now, you have TermAssist installed, but typing the full command every time is annoying. Let's set up a shortcut so you can just type <code>??</code> instead!
        </p>

        <h3>Option A: Set Up the ?? Shortcut (Recommended)</h3>
        <p>
          This lets you type <code>?? your question</code> from any folder on your computer.
        </p>

        <h4>For Windows Users (PowerShell):</h4>
        <p>
          <strong>Step 1:</strong> Open PowerShell and type this command, then press Enter:
        </p>
        <pre>
          <code>notepad $PROFILE</code>
        </pre>
        <p>
          This opens a file in Notepad. If you get an error saying the file doesn&apos;t exist, that&apos;s okay — Notepad will ask if you want to create it. Click &quot;Yes&quot;.
        </p>

        <p>
          <strong>Step 2:</strong> Add this line to the file (use this when you installed with <code>{TERMASSIST_INSTALL_COMMAND}</code>):
        </p>
        <pre>
          <code>{`function ?? { termassist @args }`}</code>
        </pre>

        <p>
          <strong>Step 3:</strong> Save the file (Ctrl + S) and close Notepad.
        </p>

        <p>
          <strong>Step 4:</strong> Close PowerShell completely and open it again.
        </p>

        <p>
          <strong>Step 5:</strong> Test it by typing:
        </p>
        <pre>
          <code>?? how to list files</code>
        </pre>
        <p>
          If you see a command appear, congratulations! The shortcut is working!
        </p>

        <h4>For Mac/Linux Users (Terminal):</h4>
        <p>
          <strong>Step 1:</strong> First, find out which shell you're using. Type:
        </p>
        <pre>
          <code>echo $SHELL</code>
        </pre>
        <p>
          If you see <code>/bin/zsh</code>, you're using Zsh (default on newer Macs). If you see <code>/bin/bash</code>, you're using Bash.
        </p>

        <p>
          <strong>Step 2:</strong> Open the right config file:
        </p>
        <ul>
          <li><strong>For Zsh</strong>: Type <code>nano ~/.zshrc</code></li>
          <li><strong>For Bash</strong>: Type <code>nano ~/.bashrc</code></li>
        </ul>

        <p>
          <strong>Step 3:</strong> Add this line to the end of the file:
        </p>
        <pre>
          <code>alias ??='termassist'</code>
        </pre>

        <p>
          <strong>Step 4:</strong> Save and exit:
        </p>
        <ul>
          <li>Press <code>Ctrl + X</code></li>
          <li>Press <code>Y</code> (for "Yes, save changes")</li>
          <li>Press <code>Enter</code></li>
        </ul>

        <p>
          <strong>Step 5:</strong> Load the new settings:
        </p>
        <ul>
          <li><strong>For Zsh</strong>: Type <code>source ~/.zshrc</code></li>
          <li><strong>For Bash</strong>: Type <code>source ~/.bashrc</code></li>
        </ul>

        <p>
          <strong>Step 6:</strong> Test it by typing:
        </p>
        <pre>
          <code>?? how to list files</code>
        </pre>
        <p>
          If you see a command appear, it's working!
        </p>

        <h3>Option B: Use TermAssist Without the ?? Shortcut</h3>
        <p>
          If you don't want to set up the shortcut, or if you're having trouble with it, you can still use TermAssist! Here's how:
        </p>

        <h4>Method 1: Use the full command (if installed globally)</h4>
        <p>
          If you installed TermAssist with <code>{TERMASSIST_INSTALL_COMMAND}</code>, you can use:
        </p>
        <pre>
          <code>termassist "your question here"</code>
        </pre>
        <p>
          For example:
        </p>
        <pre>
          <code>termassist "find all python files"</code>
        </pre>

        <h4>Method 2: Use Node.js Directly</h4>
        <p>
          If you have the TermAssist folder on your computer, you can run it with Node.js:
        </p>
        <pre>
          <code>node /path/to/termassist/cli/index.js "your question here"</code>
        </pre>

        <p>
          <strong>On Windows:</strong>
        </p>
        <pre>
          <code>node "C:/Users/YourName/path-to-termassist/cli/index.js" "find python files"</code>
        </pre>

        <p>
          <strong>On Mac/Linux:</strong>
        </p>
        <pre>
          <code>node /home/username/path-to-termassist/cli/index.js "find python files"</code>
        </pre>

        <div className="blog-callout blog-callout-info">
           <Terminal className="w-5 h-5 mt-1 shrink-0" />
           <div>
              <strong>Tip:</strong> Replace <code>/path/to/termassist</code> with the actual path where you have TermAssist installed. If you're not sure where it is, search for "termassist" in your file explorer or Finder.
           </div>
        </div>

        <h4>Method 3: Create a Custom Shortcut (Any Name You Want)</h4>
        <p>
          Don't like <code>??</code>? You can use any word you want! For example, let's say you want to use <code>ta</code> (short for TermAssist):
        </p>

        <p>
          <strong>On Windows (PowerShell)</strong>: Add this to your profile:
        </p>
        <pre>
          <code>{`function ta { termassist @args }`}</code>
        </pre>

        <p>
          <strong>On Mac/Linux</strong>: Add this to your <code>.zshrc</code> or <code>.bashrc</code>:
        </p>
        <pre>
          <code>alias ta='termassist'</code>
        </pre>

        <p>
          Then you can use:
        </p>
        <pre>
          <code>ta find python files</code>
        </pre>

        <h3>Troubleshooting the Alias</h3>
        <p>
          <strong>Problem: "The term '??' is not recognized" (Windows)</strong>
        </p>
        <p>
          <strong>Solution:</strong> Make sure you:
        </p>
        <ol>
          <li>Saved your PowerShell profile file</li>
          <li>Closed and reopened PowerShell completely</li>
          <li>Used the correct syntax in your profile</li>
        </ol>

        <p>
          <strong>Problem: "alias: ?? not found" (Mac/Linux)</strong>
        </p>
        <p>
          <strong>Solution:</strong> Make sure you:
        </p>
        <ol>
          <li>Added the alias to the correct file (.zshrc or .bashrc)</li>
          <li>Ran the <code>source</code> command after adding it</li>
          <li>Used quotes around the alias if your shell requires them</li>
        </ol>

        <div className="blog-callout blog-callout-warning">
           <Shield className="w-5 h-5 mt-1 shrink-0 text-pink" />
           <div>
              <strong>Important:</strong> If you can&apos;t get the alias to work, don&apos;t worry! Just use <code>termassist &quot;your question&quot;</code> instead. It works exactly the same way; you only type a few more characters.
           </div>
        </div>

        <h2>Part 7: Interactive Mode</h2>
        <p>
          If you're not sure what command you need, you can use interactive mode!
        </p>
        <p>
          Just type <code>??</code> and press Enter (without any words after it).
        </p>
        <p>
          You'll see a search box where you can type keywords. As you type, TermAssist shows matching commands. Use your arrow keys to navigate and press Enter to select a command.
        </p>

        <h2>Part 8: Syncing Your Custom Snippets</h2>
        <p>
          If you created custom snippets in the dashboard (we'll explain this later), you can download them to your computer.
        </p>
        <p>
          In your terminal, type (you can use <code>??</code> instead of <code>termassist</code> if you set up the shortcut):
        </p>
        <pre>
          <code>termassist sync</code>
        </pre>
        <p>
          TermAssist will download all your custom snippets from the dashboard. You&apos;ll see a message like &quot;Successfully synced 5 snippets.&quot;
        </p>

        <h2>Part 9: What Commands Can TermAssist Understand?</h2>
        <p>
          TermAssist comes with 250+ pre-built commands covering:
        </p>
        <ul>
          <li><strong>Git</strong>: Commits, branches, merges, stashes, and more</li>
          <li><strong>Docker</strong>: Containers, images, compose</li>
          <li><strong>File Operations</strong>: Find, search, copy, move, delete</li>
          <li><strong>Networking</strong>: SSH, ping, DNS, ports</li>
          <li><strong>System</strong>: Processes, memory, disk usage, services</li>
          <li><strong>Package Managers</strong>: npm, pip, apt</li>
          <li><strong>Archives</strong>: zip, tar, compression</li>
          <li><strong>Permissions</strong>: chmod, chown, sudo</li>
          <li><strong>And much more!</strong></li>
        </ul>

        <h2>Tips for Best Results</h2>
        <ul>
          <li><strong>Be specific</strong>: "find python files" works better than just "find files"</li>
          <li><strong>Use action words</strong>: Start with verbs like "find", "create", "delete", "install"</li>
          <li><strong>Don't worry about perfect grammar</strong>: TermAssist understands "how do i list files" and "list files" equally well</li>
          <li><strong>Check the confidence score</strong>: If it's below 30%, try rephrasing your question</li>
        </ul>

        <div className="blog-callout blog-callout-info">
           <Sparkles className="w-5 h-5 mt-1 shrink-0" />
           <div>
              <strong>Congratulations!</strong> You now know how to use TermAssist. Keep reading the other blog posts to learn about the dashboard and advanced features!
           </div>
        </div>
      </>
    ),
  },
  "packages-deep-dive": {
    title: "How Does TermAssist Work? The Technology Explained Simply",
    category: "Technology",
    date: "Apr 16, 2026",
    readTime: "10 min",
    content: (
      <>
        <h2>What Makes TermAssist Special?</h2>
        <p>
          Most AI tools send your questions to big computers in the cloud (the internet). TermAssist is different - it does everything on your own computer. This makes it faster and more private.
        </p>
        <p>
          In this article, we&apos;ll explain exactly how TermAssist understands your English sentences and turns them into terminal commands. Don&apos;t worry — we&apos;ll explain everything in simple terms!
        </p>

        <h2>Where do I get TermAssist?</h2>
        <p>
          Install the CLI from npm with <code>{TERMASSIST_INSTALL_COMMAND}</code>. The published name is{" "}
          <code>{TERMASSIST_NPM_PACKAGE}</code> — always use that full name when you install or upgrade. The command you type in the terminal is still <code>termassist</code>.
        </p>

        <h2>The Magic Behind the Scenes: BM25 Algorithm</h2>
        <p>
          TermAssist uses something called "BM25" to match your questions with commands. BM25 is a proven method that search engines use to find relevant results.
        </p>

        <h3>How BM25 Works (Simple Explanation)</h3>
        <p>
          Imagine you have a library of commands. Each command has a description. When you ask a question, TermAssist does this:
        </p>

        <p>
          <strong>Step 1: It breaks your question into words</strong>
        </p>
        <p>
          If you type "find all python files modified today", TermAssist splits it into: find, python, files, modified, today
        </p>
        <p>
          It removes common words like "all", "the", "is" because they don't help with matching.
        </p>

        <p>
          <strong>Step 2: It searches through all commands</strong>
        </p>
        <p>
          TermAssist has 250+ commands stored in a file. For each command, it checks how many of your words appear in the command's description.
        </p>

        <p>
          <strong>Step 3: It scores each command</strong>
        </p>
        <p>
          Commands that match more of your words get higher scores. But it's smarter than just counting matches:
        </p>
        <ul>
          <li>If a word appears in many commands (like "file"), it's worth less points</li>
          <li>If a word appears in few commands (like "python"), it's worth more points</li>
          <li>This helps TermAssist find the most specific and relevant match</li>
        </ul>

        <p>
          <strong>Step 4: It picks the best match</strong>
        </p>
        <p>
          The command with the highest score wins! TermAssist shows you that command.
        </p>

        <div className="blog-callout blog-callout-info">
           <Terminal className="w-5 h-5 mt-1 shrink-0" />
           <div>
              <strong>Real Example:</strong> When you type "find python files", the word "python" is rare in the command database, so it gets a high score. The word "files" is common, so it gets a lower score. This helps TermAssist find the exact command you need.
           </div>
        </div>

        <h2>Why Is TermAssist So Fast?</h2>
        <p>
          TermAssist responds in less than 50 milliseconds (that's 0.05 seconds!). Here's why:
        </p>

        <h3>Reason 1: No Internet Required</h3>
        <p>
          Other AI tools need to:
        </p>
        <ol>
          <li>Send your question to a server (takes time)</li>
          <li>Wait for the server to process it (takes more time)</li>
          <li>Receive the answer back (takes even more time)</li>
        </ol>
        <p>
          This usually takes 2-5 seconds. TermAssist skips all of this because everything happens on your computer.
        </p>

        <h3>Reason 2: Simple Math, Not Heavy AI</h3>
        <p>
          Some AI tools use massive "language models" that are gigabytes in size. These require powerful computers and take time to load.
        </p>
        <p>
          TermAssist uses simple math (the BM25 algorithm) that runs in milliseconds. No heavy loading, no waiting.
        </p>

        <h3>Reason 3: Optimized Code</h3>
        <p>
          The search code is written in JavaScript and runs directly in Node.js. It's designed to be fast and efficient.
        </p>

        <h2>How Confident is the Match?</h2>
        <p>
          After finding the best command, TermAssist calculates a "confidence score" from 0% to 100%.
        </p>
        <ul>
          <li><strong>80-100%</strong>: Very confident match. The command is almost certainly what you want.</li>
          <li><strong>50-79%</strong>: Good match. The command is probably right, but you might want to review it.</li>
          <li><strong>30-49%</strong>: Weak match. TermAssist found something, but you should double-check.</li>
          <li><strong>Below 30%</strong>: No confident match. Try rephrasing your question.</li>
        </ul>

        <p>
          If the confidence is below 30%, TermAssist will say "No confident match found. Try rephrasing."
        </p>

        <h2>What If Multiple Commands Match?</h2>
        <p>
          Sometimes your question could match several commands. In normal mode, TermAssist shows you the best match. But in interactive mode (when you just type <code>??</code>), you'll see the top 7 results and can choose the one you want.
        </p>

        <h2>Where Are the Commands Stored?</h2>
        <p>
          All the built-in commands are stored in a file called <code>commands.json</code> inside the TermAssist installation folder. Each command looks like this:
        </p>
        <pre>
          <code>{`{
  "intent": "find all python files modified today",
  "command": "find . -name '*.py' -mtime -1",
  "category": "find",
  "description": "Find Python files modified in the last 24 hours"
}`}</code>
        </pre>

        <p>
          Let me explain each part:
        </p>
        <ul>
          <li><strong>intent</strong>: What you might type to get this command</li>
          <li><strong>command</strong>: The actual terminal command that will run</li>
          <li><strong>category</strong>: What type of command this is (git, docker, find, etc.)</li>
          <li><strong>description</strong>: A clear explanation of what the command does</li>
        </ul>

        <h2>Custom Snippets</h2>
        <p>
          You can add your own commands! When you create a custom snippet in the dashboard and sync it, TermAssist saves it in a file called <code>custom_snippets.json</code>. These custom commands work exactly the same way as the built-in ones.
        </p>

        <h2>Privacy and Security</h2>
        <p>
          Here's what makes TermAssist private:
        </p>

        <h3>Your Questions Stay Local</h3>
        <p>
          When you type a query, TermAssist searches your local command database. Your question never leaves your computer during the search.
        </p>

        <h3>Optional Telemetry</h3>
        <p>
          If you enable sync (by setting <code>sync_enabled: true</code> in your config), TermAssist sends some information to the dashboard after running a command:
        </p>
        <ul>
          <li>What you typed (the query)</li>
          <li>What command was matched</li>
          <li>How long it took to find the match</li>
          <li>Whether the command ran successfully</li>
        </ul>
        <p>
          This is ONLY for showing you analytics in the dashboard. If you don't want this, set <code>sync_enabled: false</code> and TermAssist will stay 100% offline.
        </p>

        <h2>The Terminal Demo on the Homepage</h2>
        <p>
          You know that cool animated terminal on the TermAssist homepage? That's not a real terminal - it's a demonstration component called <code>TerminalDemo</code>. It shows how TermAssist works by typing out a query and then revealing the matched command. It loops continuously to show different examples.
        </p>

        <h2>Summary</h2>
        <p>
          TermAssist works by:
        </p>
        <ol>
          <li>Taking your English question</li>
          <li>Breaking it into important words</li>
          <li>Searching through 250+ commands using the BM25 algorithm</li>
          <li>Finding the best match based on word frequency and relevance</li>
          <li>Showing you the command with a confidence score</li>
          <li>Letting you edit and run it</li>
        </ol>

        <p>
          All of this happens in less than 50 milliseconds, entirely on your computer, with no internet connection needed for the search itself.
        </p>

        <div className="blog-callout blog-callout-info">
           <Sparkles className="w-5 h-5 mt-1 shrink-0" />
           <div>
              <strong>Key Takeaway:</strong> TermAssist uses smart matching (BM25), not heavy AI. This makes it fast, private, and lightweight - perfect for everyday terminal use!
           </div>
        </div>
      </>
    ),
  },
  "dashboard-guide": {
    title: "The Complete Dashboard Guide: Track, Manage, and Sync Everything",
    category: "Tutorial",
    date: "Apr 15, 2026",
    readTime: "12 min",
    content: (
      <>
        <h2>What is the TermAssist Dashboard?</h2>
        <p>
          The TermAssist Dashboard is a website that helps you track your terminal usage, save your favorite commands, and manage your account. Think of it as your personal control center for TermAssist.
        </p>
        <p>
          While the CLI (terminal tool) is where you actually run commands, the dashboard is where you:
        </p>
        <ul>
          <li>See what commands you've been using</li>
          <li>Create and save custom commands</li>
          <li>View charts and statistics about your usage</li>
          <li>Manage your API token and settings</li>
        </ul>

        <h2>Before the dashboard: install the CLI</h2>
        <p>
          The website does not replace the terminal tool. Install TermAssist once on your computer with{" "}
          <code>{TERMASSIST_INSTALL_COMMAND}</code>, then use this site to sign in, create snippets, and copy your API token into <code>~/.termassist/config.json</code>.
        </p>

        <h2>Part 1: Logging Into the Dashboard</h2>

        <h3>Step 1: Go to the Login Page</h3>
        <p>
          Open your web browser and go to the TermAssist website. Click &quot;Open Dashboard&quot; or &quot;Login&quot; in the top menu.
        </p>

        <h3>Step 2: Sign In</h3>
        <p>
          You have two options:
        </p>
        <ul>
          <li><strong>Google Login</strong>: Click "Continue with Google" and select your account</li>
          <li><strong>Email Login</strong>: Enter your email and password, then click "Sign In"</li>
        </ul>

        <h3>Step 3: You're In!</h3>
        <p>
          After logging in, you'll be taken to the Dashboard Overview page. Let's explore each section!
        </p>

        <h2>Part 2: The Dashboard Overview Page</h2>
        <p>
          This is the first page you see after logging in. It shows you a summary of your TermAssist activity.
        </p>

        <h3>Welcome Message</h3>
        <p>
          At the top, you'll see "Welcome back, [Your Name]". This confirms you're logged in successfully.
        </p>

        <h3>Quick Action Buttons</h3>
        <p>
          You'll see two buttons:
        </p>
        <ul>
          <li><strong>"Review Queries"</strong>: Takes you to your command history</li>
          <li><strong>"Manage Snippets"</strong>: Takes you to your custom commands</li>
        </ul>

        <h3>Statistics Cards</h3>
        <p>
          You'll see three boxes showing important numbers:
        </p>

        <p>
          <strong>Card 1: Total Command Invocations</strong>
        </p>
        <p>
          This shows how many times you've used TermAssist in your terminal. Every time you run a command with <code>??</code>, this number goes up.
        </p>

        <p>
          <strong>Card 2: Personal Snippets</strong>
        </p>
        <p>
          This shows how many custom commands you've created and synced to your terminal.
        </p>

        <p>
          <strong>Card 3: Recent Query</strong>
        </p>
        <p>
          This shows the last question you asked TermAssist. For example: "find all python files"
        </p>

        <h3>Productivity Tips</h3>
        <p>
          Below the statistics, you'll see helpful tips like:
        </p>
        <ul>
          <li>How to set up shell aliasing for faster access</li>
          <li>How to enable telemetry to track your usage</li>
          <li>Privacy reminders about how your data is handled</li>
        </ul>
        <p>
          Click on any tip to read more about it!
        </p>

        <h3>Configuration Box</h3>
        <p>
          On the right side, you'll see a box about your API Token. This is where you can go to manage your token (we'll cover this in the Settings section).
        </p>

        <h2>Part 3: The Commands Page (Your Query History)</h2>
        <p>
          Click "Review Queries" or go to Dashboard → Commands to see this page.
        </p>

        <h3>What You'll See</h3>

        <p>
          <strong>Statistics at the Top:</strong>
        </p>
        <ul>
          <li><strong>Total Queries</strong>: The total number of commands you've run with TermAssist</li>
          <li><strong>Top Category</strong>: The type of command you use most (like "git", "docker", "find")</li>
          <li><strong>Avg Response</strong>: The average time it takes TermAssist to find a match (should be under 50ms!)</li>
        </ul>

        <p>
          <strong>The Chart:</strong>
        </p>
        <p>
          You'll see a bar chart showing your usage over the last 30 days. Each bar represents one day. Taller bars mean you used TermAssist more on that day.
        </p>
        <p>
          This helps you see patterns like "I use TermAssist more on weekdays" or "My usage is increasing over time".
        </p>

        <p>
          <strong>The Search Box:</strong>
        </p>
        <p>
          Below the chart, there's a search box. Type anything here to filter your command history. For example, if you type "git", it will only show queries related to git commands.
        </p>

        <p>
          <strong>The Query Table:</strong>
        </p>
        <p>
          This is the main part of the page. It shows a table with columns:
        </p>
        <ul>
          <li><strong>Time</strong>: When you ran the command (like "5m ago", "2h ago", "3d ago")</li>
          <li><strong>Query</strong>: What you typed (like "find python files")</li>
          <li><strong>Matched Command</strong>: The command TermAssist gave you (like <code>find . -name '*.py' -mtime -1</code>)</li>
          <li><strong>Response</strong>: How long it took to find the match (like "12ms")</li>
          <li><strong>Copy Button</strong>: A copy icon to quickly copy the command</li>
        </ul>

        <h3>How to Use This Page</h3>
        <ul>
          <li><strong>To find an old command</strong>: Use the search box to filter by keywords</li>
          <li><strong>To copy a command</strong>: Click the copy icon (two overlapping squares) next to any command</li>
          <li><strong>To see more results</strong>: Use the pagination buttons at the bottom (Page 1, 2, 3, etc.)</li>
        </ul>

        <div className="blog-callout blog-callout-info">
           <Terminal className="w-5 h-5 mt-1 shrink-0" />
           <div>
              <strong>Note:</strong> You'll only see queries if you have sync enabled in your config. If <code>sync_enabled</code> is set to <code>false</code>, this page will be empty.
           </div>
        </div>

        <h2>Part 4: The Snippets Page (Your Custom Commands)</h2>
        <p>
          Click "Manage Snippets" or go to Dashboard → Snippets to access this page.
        </p>

        <h3>What Are Snippets?</h3>
        <p>
          Snippets are custom commands that you create and save. They work just like the built-in TermAssist commands, but you define them yourself.
        </p>
        <p>
          For example, if you often deploy to a specific server, you can create a snippet for it!
        </p>

        <h3>Creating a New Snippet</h3>

        <p>
          <strong>Step 1:</strong> Click the "New Snippet" button at the top right.
        </p>

        <p>
          <strong>Step 2:</strong> A popup window will appear with these fields:
        </p>
        <ul>
          <li><strong>Label</strong>: A short description of what this command does (like "Deploy to production server")</li>
          <li><strong>Command</strong>: The actual terminal command (like <code>ssh user@production.example.com 'cd /var/www && git pull'</code>)</li>
          <li><strong>Description</strong> (optional): A longer explanation of what the command does</li>
          <li><strong>Tags</strong> (optional): Keywords to help you find this snippet later (like "deploy", "production", "server")</li>
        </ul>

        <p>
          <strong>Step 3:</strong> Fill in the Label and Command (these are required). Description and Tags are optional but helpful.
        </p>

        <p>
          <strong>Step 4:</strong> Click "Save" to create your snippet.
        </p>

        <h3>Viewing Your Snippets</h3>
        <p>
          Your snippets appear as cards in a grid. Each card shows:
        </p>
        <ul>
          <li>The label (title)</li>
          <li>The command (in pink text)</li>
          <li>Tags (if you added any)</li>
          <li>Edit and Delete buttons</li>
        </ul>

        <h3>Searching Snippets</h3>
        <p>
          Use the search box at the top to find specific snippets. You can search by:
        </p>
        <ul>
          <li>Label name</li>
          <li>Tags</li>
        </ul>

        <h3>Editing a Snippet</h3>
        <p>
          <strong>Step 1:</strong> Find the snippet you want to edit</p>
        <p>
          <strong>Step 2:</strong> Click the edit icon (pencil) on the snippet card</p>
        <p>
          <strong>Step 3:</strong> Make your changes in the popup window</p>
        <p>
          <strong>Step 4:</strong> Click "Save" to update the snippet</p>

        <h3>Deleting a Snippet</h3>
        <p>
          <strong>Step 1:</strong> Find the snippet you want to delete</p>
        <p>
          <strong>Step 2:</strong> Click the delete icon (trash can) on the snippet card</p>
        <p>
          <strong>Step 3:</strong> Confirm the deletion when prompted</p>

        <div className="blog-callout blog-callout-warning">
           <Shield className="w-5 h-5 mt-1 shrink-0 text-pink" />
           <div>
              <strong>Important:</strong> After creating or editing snippets in the dashboard, run <code>termassist sync</code> in your terminal to download them to your computer!
           </div>
        </div>

        <h2>Part 5: The Settings Page</h2>
        <p>
          Go to Dashboard → Settings to access this page.
        </p>

        <h3>Account Section</h3>
        <p>
          This shows your email address. If you signed up with Google, it shows your Google email. If you signed up with email, it shows that email.
        </p>
        <p>
          Note: You can't change your email here. If you need to change it, you must do it through your authentication provider (Google or email service).
        </p>

        <h3>CLI API Token Section</h3>
        <p>
          This is where you manage the token that connects your terminal to the dashboard.
        </p>

        <p>
          <strong>If You Don't Have a Token Yet:</strong>
        </p>
        <p>
          Click "Generate Token". A new token will be created that starts with <code>ta_</code>.
        </p>

        <p>
          <strong>If You Already Have a Token:</strong>
        </p>
        <ul>
          <li><strong>To copy it</strong>: Click the copy icon next to the token</li>
          <li><strong>To create a new one</strong>: Click "Regenerate Token". This will delete your old token and create a new one.</li>
        </ul>

        <p>
          <strong>Config File Example:</strong>
        </p>
        <p>
          Below your token, you'll see an example of what your <code>config.json</code> file should look like. Just copy this example and paste it into your config file (replacing the token if needed).
        </p>

        <h3>Sync Preferences Section</h3>
        <p>
          Here you'll see a toggle switch for "Auto-sync snippets to local CLI".
        </p>
        <ul>
          <li><strong>When enabled</strong>: TermAssist can send query data to the dashboard and download your snippets</li>
          <li><strong>When disabled</strong>: TermAssist works completely offline with no data sharing</li>
        </ul>

        <p>
          Note: This toggle in the dashboard is for your reference. The actual setting that matters is in your <code>config.json</code> file. Make sure the <code>sync_enabled</code> value in your config matches your preference.
        </p>

        <h3>Danger Zone Section</h3>
        <p>
          This section has a "Delete All Data" button. This is permanent and cannot be undone!
        </p>

        <p>
          <strong>What happens when you click this:</strong>
        </p>
        <ul>
          <li>All your query history is deleted</li>
          <li>All your custom snippets are deleted</li>
          <li>All your API tokens are deleted</li>
        </ul>

        <p>
          <strong>What doesn't happen:</strong>
        </p>
        <ul>
          <li>Your account is NOT deleted (you'd need to contact support for that)</li>
          <li>The local files on your computer are NOT deleted</li>
        </ul>

        <div className="blog-callout blog-callout-warning">
           <Shield className="w-5 h-5 mt-1 shrink-0 text-pink" />
           <div>
              <strong>Warning:</strong> Deleting your data is permanent. Once you click this button, you cannot get your data back. Only do this if you're sure!
           </div>
        </div>

        <h2>Part 6: How Everything Works Together</h2>
        <p>
          Let me show you how the CLI and Dashboard work together:
        </p>

        <h3>Scenario 1: Using TermAssist Normally</h3>
        <ol>
          <li>You type <code>?? find python files</code> in your terminal</li>
          <li>If sync is enabled, TermAssist sends this query to the dashboard API</li>
          <li>The dashboard stores it in your query history</li>
          <li>You can later view it on the Commands page</li>
        </ol>

        <h3>Scenario 2: Creating and Using Custom Snippets</h3>
        <ol>
          <li>You go to Dashboard → Snippets</li>
          <li>You create a new snippet (like "Deploy to production")</li>
          <li>You save it in the dashboard</li>
          <li>You open your terminal and type <code>termassist sync</code></li>
          <li>TermAssist downloads your new snippet</li>
          <li>Now you can use it: <code>?? deploy to production</code></li>
        </ol>

        <h3>Scenario 3: Going Completely Offline</h3>
        <ol>
          <li>You set <code>sync_enabled: false</code> in your config.json</li>
          <li>TermAssist stops sending data to the dashboard</li>
          <li>You can still use all the built-in commands</li>
          <li>You can still use previously synced custom snippets</li>
          <li>Your query history on the dashboard won't update anymore</li>
        </ol>

        <h2>Part 7: Common Questions</h2>

        <h3>Q: Do I need the dashboard to use TermAssist?</h3>
        <p>
          A: No! TermAssist works completely on its own. The dashboard is optional and only needed if you want to track your usage or create custom snippets.
        </p>

        <h3>Q: What if I don't want to share any data?</h3>
        <p>
          A: Set <code>sync_enabled: false</code> in your config.json. TermAssist will work 100% offline with no data sharing.
        </p>

        <h3>Q: Can I use TermAssist on multiple computers?</h3>
        <p>
          A: Yes! On each computer run <code>{TERMASSIST_INSTALL_COMMAND}</code>, copy the same <code>config.json</code> (or same token), then run <code>termassist sync</code> on each machine to pull your snippets.
        </p>

        <h3>Q: Why is my Commands page empty?</h3>
        <p>
          A: This means either: (1) You haven't used TermAssist yet, or (2) You have <code>sync_enabled: false</code> in your config.
        </p>

        <h3>Q: How do I update my custom snippets in the terminal?</h3>
        <p>
          A: Run <code>termassist sync</code> in your terminal (or <code>?? sync</code> if you created that shortcut). This downloads the latest snippets from the dashboard.
        </p>

        <div className="blog-callout blog-callout-info">
           <Sparkles className="w-5 h-5 mt-1 shrink-0" />
           <div>
              <strong>You're Now a Dashboard Expert!</strong> You know how to use every feature of the TermAssist dashboard. Keep exploring and making the most of your terminal workflow!
           </div>
        </div>
      </>
    ),
  },
};




export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = POSTS[slug];
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((totalScroll <= 0) ? 0 : (currentScroll / totalScroll) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!post) {
    notFound();
  }

  // Related posts logic
  const relatedPosts = Object.entries(POSTS)
    .filter(([s]) => s !== slug)
    .map(([s, p]) => ({ slug: s, ...p }))
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-bg text-text noise-overlay selection:bg-pink selection:text-white">
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-pink z-[100] transition-all duration-150 ease-out shadow-[0_0_10px_var(--color-pink)]" 
        style={{ width: `${scrollProgress}%` }}
      />
      
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-40 relative z-10">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink/5 blur-[120px] rounded-full" />
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-pink/5 blur-[120px] rounded-full" />
        </div>

        {/* Back Link */}
        <div className="animate-fade-up">
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-pink transition-all mb-16 group p-2 -ml-2 rounded-lg hover:bg-pink/5"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Knowledge Base
          </Link>
        </div>

        {/* Header Section */}
        <header className="mb-20 animate-fade-up delay-1">
          <div className="flex items-center gap-2 mb-8">
            <span className="px-3 py-1 bg-pink text-white text-[10px] font-bold rounded uppercase tracking-wider shadow-lg shadow-pink/20">
              {post.category}
            </span>
            <div className="h-[1px] w-8 bg-border" />
            <span className="text-[10px] text-muted font-bold uppercase tracking-widest">
              TermAssist Intelligence
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-[family-name:var(--font-syne)] mb-12 leading-[1.05] tracking-tighter">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-8 py-8 border-y border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center shadow-lg relative group overflow-hidden">
                <div className="absolute inset-0 bg-pink opacity-0 group-hover:opacity-10 transition-opacity" />
                <Terminal className="w-6 h-6 text-pink" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold font-[family-name:var(--font-syne)] uppercase tracking-tight">
                  TermAssist Team
                </span>
                <span className="text-[10px] text-muted font-bold uppercase tracking-widest">
                  Engineering Hub
                </span>
              </div>
            </div>

            <div className="flex items-center gap-8 text-[11px] font-bold text-muted font-[family-name:var(--font-jetbrains)] uppercase tracking-widest">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-pink/50" />
                {post.date}
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-pink/50" />
                {post.readTime}
              </div>
              <div className="h-6 w-[1px] bg-border hidden sm:block" />
              <div className="flex items-center gap-5">
                <button className="hover:text-pink transition-all hover:scale-110 active:scale-95">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="hover:text-pink transition-all hover:scale-110 active:scale-95">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <article className="lp-article animate-fade-up delay-2 selection:bg-pink/30 selection:text-white">
          {post.content}
        </article>

        {/* Related Posts Section */}
        <div className="mt-32 pt-24 border-t border-border animate-fade-up delay-3">
          <div className="flex items-center justify-between mb-12">
            <h4 className="text-3xl font-extrabold font-[family-name:var(--font-syne)] tracking-tight">
              Related <span className="text-muted">Reading</span>
            </h4>
            <Link href="/blog" className="text-[10px] font-bold uppercase tracking-widest text-pink hover:underline underline-offset-4">
              View all posts
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-8">
            {relatedPosts.map((related) => (
              <Link key={related.slug} href={`/blog/${related.slug}`} className="group">
                <Card glow className="h-full bg-surface/20 border-border group-hover:border-pink/30 p-8 transition-all duration-500">
                  <span className="text-[9px] font-bold text-pink uppercase tracking-widest mb-4 block">
                    {related.category}
                  </span>
                  <h5 className="text-xl font-bold font-[family-name:var(--font-syne)] group-hover:text-pink transition-colors mb-6 leading-tight">
                    {related.title}
                  </h5>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted group-hover:text-pink transition-colors mt-auto">
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Global CTA */}
        <Card glow className="mt-32 !p-0 overflow-hidden animate-fade-up delay-4 border-pink/10">
          <div className="grid md:grid-cols-2">
            <div className="p-10 sm:p-14 border-b md:border-b-0 md:border-r border-border bg-surface/30 backdrop-blur-sm">
               <h3 className="text-3xl font-extrabold font-[family-name:var(--font-syne)] mb-6 tracking-tight">
                  Master your terminal <span className="pink-gradient-text">today.</span>
               </h3>
               <p className="text-muted mb-10 leading-relaxed font-[family-name:var(--font-dm-sans)]">
                  Stop searching and start building. Secure your local workflow with 
                  the assistant that puts your privacy and productivity first.
               </p>
               <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/blog/quick-install-guide" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto">Install guide</Button>
                  </Link>
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button variant="ghost" size="lg" className="w-full">Dashboard</Button>
                  </Link>
               </div>
            </div>
            <div className="bg-terminal-bg/50 p-10 flex flex-col items-center justify-center relative group">
               <div className="absolute inset-0 bg-pink/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               <Terminal className="w-32 h-32 text-pink/5 mb-6 group-hover:scale-110 transition-transform duration-700" />
               <div className="text-center font-[family-name:var(--font-jetbrains)] relative z-10">
                  <div className="text-sm text-pink mb-2 font-bold">$ termassist &quot;find large files&quot;</div>
                  <div className="text-[10px] text-muted/60 uppercase tracking-widest font-bold">Local match · edit · run</div>
               </div>
            </div>
          </div>
        </Card>
      </main>

      <footer className="border-t border-border py-20 mt-32 bg-surface/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-6 h-6 text-pink" />
                    <span className="text-2xl font-bold font-[family-name:var(--font-syne)] tracking-tight">
                      term<span className="text-pink">assist</span>
                    </span>
                  </div>
                  <p className="text-sm text-muted max-w-xs leading-relaxed">
                    Engineering the future of terminal productivity with local-first AI.
                  </p>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-8 text-[11px] font-bold uppercase tracking-widest">
                 <Link href="/" className="text-muted hover:text-pink transition-colors">Home</Link>
                 <Link href="/blog" className="text-pink transition-colors underline decoration-2 underline-offset-8">Knowledge</Link>
                 <Link href="/dashboard" className="text-muted hover:text-pink transition-colors">Dashboard</Link>
                 <Link href="/auth/signup" className="text-muted hover:text-pink transition-colors">Join Now</Link>
              </div>
           </div>
           
           <div className="mt-20 pt-10 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest">
                © 2026 TermAssist. Engineered by developers.
              </p>
              <div className="flex gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                 <div className="h-4 w-12 bg-muted rounded-sm" />
                 <div className="h-4 w-12 bg-muted rounded-sm" />
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}
