# AnchorPay – Build Order & Phases (Authoritative)

> **Purpose**
>
> This document defines the *single authoritative build order* for AnchorPay.
> It merges **repo setup**, **on-chain development**, and **UI work** into one linear plan.
>
> Follow phases **sequentially**. Do not skip ahead.

---

## How to Read This Document

* Each phase has a **goal**, **allowed work**, and **exit criteria**
* A phase is *not complete* until exit criteria are met
* If something is not listed in the current phase, **do not build it**

AnchorPay must be built **inside-out**:

> structure → state → money → safety → UI → polish

---

## Phase 0 — Environment Sanity Check

**Goal:** Ensure local Solana + Anchor tooling works.

### Tasks

* Install Solana CLI
* Install Anchor
* Verify:

  * `solana --version`
  * `anchor --version`
* Run `solana-test-validator`

### Exit Criteria

* Local validator runs
* Anchor commands work

---

## Phase 1 — Repo & Project Setup (Foundation)

**Goal:** Establish a clean, boring, reproducible monorepo structure.

This phase is about **structure and tooling only**. No business logic.

### Starting Assumptions

* pnpm monorepo already initialized
* `apps/web` exists with a base frontend scaffold

### Target Repository Structure

```
anchorpay/
├── apps/
│   └── web/                 # Existing frontend (unchanged)
│
├── programs/
│   └── anchorpay/           # Anchor program
│       ├── src/lib.rs
│       ├── tests/
│       ├── Anchor.toml
│       └── Cargo.toml
│
├── packages/
│   └── sdk/                 # Optional stub
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json               # Optional
└── README.md
```

### Tasks

1. Configure `pnpm-workspace.yaml`

```yaml
packages:
  - apps/*
  - programs/*
  - packages/*
```

2. Root `package.json` (scripts only)

```json
{
  "name": "anchorpay",
  "private": true,
  "scripts": {
    "build": "pnpm -r build",
    "dev": "pnpm -r dev",
    "test": "pnpm -r test"
  }
}
```

3. Create Anchor program

```bash
anchor init programs/anchorpay
```

4. Verify build

```bash
cd programs/anchorpay
anchor build
anchor test
```

5. Ensure `Anchor.toml` uses localnet

### Explicit Non-Goals

* No escrow logic
* No SOL transfers
* No UI changes

### Exit Criteria

* `pnpm install` works
* `anchor build` and `anchor test` pass
* Repo matches target structure exactly

---

## Phase 2 — Data Model & State Machine (No Money)

**Goal:** Define the escrow state model without moving funds.

### Allowed Work

* `MilestoneState` enum
* `EscrowAccount` struct
* Milestone indexing logic
* Validation (milestone count, sum checks)

### Forbidden

* No SOL or token transfers
* No CPI calls

### Exit Criteria

* Program compiles
* State transitions tested

---

## Phase 3 — SOL Escrow & Transfers

**Goal:** Lock and release SOL safely.

### Allowed Work

* `initialize_escrow`
* SOL transfer into PDA
* `release_milestone` (SOL)

### Forbidden

* No USDC yet
* No cancel logic

### Exit Criteria

* SOL moves correctly
* Double-spend impossible

---

## Phase 4 — Submission & Cancellation Safety

**Goal:** Prevent unfair cancellation.

### Allowed Work

* `submit_milestone`
* `cancel_escrow`
* State-based cancellation rules

### Critical Rules

* Cancel allowed only in `Pending`
* Cancel blocked after `Submitted`

### Exit Criteria

* Cancellation safety proven in tests

---

## Phase 5 — Approval & Full Milestone Loop

**Goal:** Complete the milestone lifecycle.

### Allowed Work

* `approve_milestone`
* Full loop across milestones
* Escrow close on completion

### Exit Criteria

* End-to-end milestone flow works

---

## Phase 6 — SPL Token (USDC) Support

**Goal:** Support non-SOL payments.

### Allowed Work

* Token mint handling
* ATA creation
* Token Program transfers

### Exit Criteria

* USDC behaves identically to SOL path

---

## Phase 7 — Minimal Web UI

**Goal:** Demonstrate usage (not productize).

### Allowed Work

* Wallet connect
* Create escrow UI
* Escrow detail view
* Submit / approve / release actions

### Forbidden

* No backend
* No notifications
* No database

### Exit Criteria

* Two wallets can complete a full escrow

---

## Phase 8 — Hardening & Grant Readiness

**Goal:** Make AnchorPay trustworthy and reviewable.

### Tasks

* Expand tests
* Code comments
* README alignment
* Demo recording

### Exit Criteria

* Project understandable in 5 minutes

---

## Golden Rules (Never Break)

* Finish each phase before moving on
* Simpler is always correct
* No scope creep

---

## Final Reminder

> AnchorPay succeeds by being boring, correct, and finished.
