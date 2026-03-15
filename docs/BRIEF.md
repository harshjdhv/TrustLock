

# Product Canvas — Solana Freelance Escrow

## Product Name (Working)

**TrustEscrow**

Tagline:

> Trustless freelance payments powered by Solana.

Purpose:

> Protect freelancers and clients by locking payments in a Solana escrow smart contract until work is completed.

---

# Core Concept

The platform **does not host the work itself**.

Work can happen anywhere:

* WhatsApp
* Discord
* GitHub
* Figma
* Google Docs
* Email

The platform only handles:

```
job escrow
work submission proof
payment release
dispute resolution
```

---

# User Roles

### Client

Creates job and funds escrow.

### Freelancer

Completes work and submits proof.

### Admin

Resolves disputes.

---

# Core Flow (High Level)

```
Client creates escrow
↓
Client deposits USDC
↓
Freelancer completes work externally
↓
Freelancer submits proof link
↓
Client approves or rejects
↓
Payment released OR dispute triggered
```

---

# Smart Contract Model

Escrow account stores:

```
escrow_id
client_wallet
freelancer_wallet
amount
token_type (USDC / SOL)
status
submission_link
created_at
submitted_at
```

Statuses:

```
CREATED
FUNDED
SUBMITTED
REJECTED
DISPUTED
COMPLETED
REFUNDED
```

---

# Main Pages

Total screens:

```
Landing
Dashboard
Create Escrow
Escrow Details
Submit Work
Dispute Panel
Admin Panel
```

---

# 1 Landing Page

Purpose:

Explain product quickly.

Hero:

```
Secure Freelance Payments
Trustless escrow powered by Solana
```

Buttons:

```
Connect Wallet
How It Works
```

How it works section:

```
1 Create escrow
2 Fund payment
3 Submit work
4 Release payment
```

---

# 2 Wallet Connection

Wallet options:

```
Phantom
Solflare
Backpack
```

After connecting:

User redirected to dashboard.

---

# 3 Dashboard

Main overview.

Sections:

### Active Escrows

List of active contracts.

Card format:

```
Project Title
Amount
Counterparty
Status
Created Date
```

Example:

```
Landing Page Design
50 USDC
Freelancer: 8dj3f...
Status: FUNDED
```

---

### Timeline UI (Important)

Each escrow shows timeline:

```
Escrow Created
Escrow Funded
Work Submitted
Waiting for Client Review
Payment Released
```

Visual style:

Horizontal progress bar.

---

# 4 Create Escrow Page

Client creates job escrow.

Form:

```
Project Title
Description
Freelancer Wallet Address
Amount
Token Type
Deadline (optional)
```

Submit button:

```
Create Escrow
```

Smart contract instruction triggered:

```
create_escrow()
```

Status after creation:

```
CREATED
```

---

# 5 Fund Escrow

Client deposits funds.

Button:

```
Fund Escrow
```

Wallet confirmation required.

Smart contract:

```
fund_escrow()
```

Status:

```
FUNDED
```

Timeline updates:

```
Escrow Funded
Waiting for Work Submission
```

---

# 6 Escrow Details Page

Shows:

```
Project title
Description
Client wallet
Freelancer wallet
Escrow amount
Status
```

Below that:

Timeline.

---

# Action Buttons

Depending on role.

Client sees:

```
Approve Payment
Reject Work
Open Dispute
```

Freelancer sees:

```
Submit Work
Open Dispute
```

---

# 7 Submit Work

Freelancer submits proof.

Form:

```
Proof Link
Message
```

Example:

```
Proof link:
https://github.com/project

Message:
Completed landing page and deployed version.
```

Smart contract:

```
submit_work(link)
```

Status becomes:

```
SUBMITTED
```

Timeline updates:

```
Work Submitted
Waiting for Client Review
```

---

# 8 Client Review

Client opens escrow.

Sees:

```
Proof link
Message
Submitted time
```

Buttons:

```
Approve
Reject
Open Dispute
```

---

# Approve Flow

Client clicks approve.

Smart contract:

```
release_payment()
```

Funds transferred to freelancer.

Status:

```
COMPLETED
```

Timeline:

```
Payment Released
```

---

# Reject Flow

Client clicks reject.

Smart contract:

```
reject_work()
```

Status:

```
REJECTED
```

Freelancer sees:

```
Client requested revisions
```

Freelancer can:

```
Resubmit work
Open dispute
```

---

# Timeout Protection

If client does nothing:

```
72 hours after submission
```

Anyone can call:

```
auto_release()
```

Payment automatically released.

---

# 9 Dispute Flow

Either side clicks:

```
Open Dispute
```

Status:

```
DISPUTED
```

Message required:

```
Explain issue
```

Funds remain locked.

---

# Admin Panel

Admin sees dispute queue.

Table:

```
Escrow ID
Client
Freelancer
Amount
Reason
```

Admin options:

```
Release to Freelancer
Refund Client
Split Payment
```

Smart contract:

```
resolve_dispute()
```

---

# Token Support

Supported tokens:

```
USDC
SOL
```

Future:

```
any SPL token
```

---

# Timeline Component UX

Example:

```
● Escrow Created
● Escrow Funded
● Work Submitted
○ Client Review
○ Payment Released
```

Completed steps = green.

Pending = gray.

---

# Notifications (Optional)

Users receive alerts when:

```
Escrow funded
Work submitted
Review required
Payment released
Dispute opened
```

Delivery:

```
email
in-app
```

---

# Security Rules

Only client can:

```
approve payment
reject work
```

Only freelancer can:

```
submit work
```

Both can:

```
open dispute
```

---

# Smart Contract Instructions

Required instructions:

```
create_escrow
fund_escrow
submit_work
release_payment
reject_work
open_dispute
resolve_dispute
auto_release
refund
```

---

# Data Model (Backend)

Escrow table:

```
id
client_wallet
freelancer_wallet
amount
token
status
submission_link
created_at
updated_at
```

Dispute table:

```
escrow_id
opened_by
reason
status
resolution
```

---

# Tech Stack

Frontend:

```
Next.js
Tailwind
Solana Wallet Adapter
```

Backend:

```
Next.js API routes
Prisma
PostgreSQL
```

Blockchain:

```
Solana
Anchor
```

RPC:

```
Helius
or
QuickNode
```

---

# MVP Scope

Must include:

```
escrow creation
escrow funding
work submission
approve payment
reject work
auto release
dispute creation
admin resolution
timeline UI
```

---

# Future Features

Not required for MVP:

```
milestone payments
reputation system
public freelancer profiles
AI dispute assistance
mobile app
```

---

# Grant Pitch

Short version:

> A decentralized escrow payment platform for freelancers and clients powered by Solana. Payments are locked in smart contracts and released only when work is approved, protecting both parties from fraud.

---

# Key Advantage

```
Trustless payments
Freelancer protection
Global payments
Fast settlement
```

