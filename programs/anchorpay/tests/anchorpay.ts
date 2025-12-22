import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Anchorpay } from "../target/types/anchorpay";
import { expect } from "chai";

describe("anchorpay", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Anchorpay as Program<Anchorpay>;
  const milestoneAmounts = [1000, 2000, 3000]; // 3 milestones

  let client: anchor.web3.Keypair;
  let freelancer: anchor.web3.Keypair;
  let escrowPda: anchor.web3.PublicKey;

  beforeEach(async () => {
    client = anchor.web3.Keypair.generate();
    freelancer = anchor.web3.Keypair.generate();
    [escrowPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), client.publicKey.toBuffer()],
      program.programId
    );

    // Airdrop SOL to client
    const signature = await program.provider.connection.requestAirdrop(
      client.publicKey,
      10 * anchor.web3.LAMPORTS_PER_SOL
    );
    await program.provider.connection.confirmTransaction(signature);
  });

  it("Initializes escrow with milestones", async () => {
    const tx = await program.methods
      .initializeEscrow(milestoneAmounts)
      .accounts({
        escrow: escrowPda,
        client: client.publicKey,
        freelancer: freelancer.publicKey,
      })
      .signers([client])
      .rpc();

    console.log("Initialize transaction signature", tx);

    // Verify the escrow account was created correctly
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPda);
    expect(escrowAccount.client.toString()).to.equal(client.publicKey.toString());
    expect(escrowAccount.freelancer.toString()).to.equal(freelancer.publicKey.toString());
    expect(escrowAccount.milestoneAmounts).to.deep.equal(milestoneAmounts);
    expect(escrowAccount.currentMilestoneIndex).to.equal(0);
    expect(escrowAccount.currentMilestoneState.pending).to.be.true;
  });

  it("Fails initialization with no milestones", async () => {
    try {
      await program.methods
        .initializeEscrow([])
        .accounts({
          escrow: escrowPda,
          client: client.publicKey,
          freelancer: freelancer.publicKey,
        })
        .signers([client])
        .rpc();
      
      expect.fail("Should have failed with no milestones");
    } catch (error) {
      expect(error.error.errorMessage).to.include("No milestones provided");
    }
  });

  it("Fails initialization with too many milestones", async () => {
    const tooManyMilestones = new Array(11).fill(1000); // 11 milestones (max is 10)

    try {
      await program.methods
        .initializeEscrow(tooManyMilestones)
        .accounts({
          escrow: escrowPda,
          client: client.publicKey,
          freelancer: freelancer.publicKey,
        })
        .signers([client])
        .rpc();
      
      expect.fail("Should have failed with too many milestones");
    } catch (error) {
      expect(error.error.errorMessage).to.include("Too many milestones");
    }
  });

  it("Submits milestone from Pending state", async () => {
    // First initialize the escrow
    await program.methods
      .initializeEscrow(milestoneAmounts)
      .accounts({
        escrow: escrowPda,
        client: client.publicKey,
        freelancer: freelancer.publicKey,
      })
      .signers([client])
      .rpc();

    // Submit the milestone
    const submitTx = await program.methods
      .submitMilestone()
      .accounts({
        escrow: escrowPda,
      })
      .signers([freelancer])
      .rpc();

    console.log("Submit milestone transaction signature", submitTx);

    // Verify state transition
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPda);
    expect(escrowAccount.currentMilestoneState.submitted).to.be.true;
  });

  it("Fails to submit milestone from non-Pending state", async () => {
    // Initialize and submit once
    await program.methods
      .initializeEscrow(milestoneAmounts)
      .accounts({
        escrow: escrowPda,
        client: client.publicKey,
        freelancer: freelancer.publicKey,
      })
      .signers([client])
      .rpc();

    await program.methods
      .submitMilestone()
      .accounts({
        escrow: escrowPda,
      })
      .signers([freelancer])
      .rpc();

    // Try to submit again (should fail - already submitted)
    try {
      await program.methods
        .submitMilestone()
        .accounts({
          escrow: escrowPda,
        })
        .signers([freelancer])
        .rpc();
      
      expect.fail("Should have failed - already submitted");
    } catch (error) {
      expect(error.error.errorMessage).to.include("Invalid state transition");
    }
  });

  it("Approves milestone from Submitted state", async () => {
    // Initialize and submit
    await program.methods
      .initializeEscrow(milestoneAmounts)
      .accounts({
        escrow: escrowPda,
        client: client.publicKey,
        freelancer: freelancer.publicKey,
      })
      .signers([client])
      .rpc();

    await program.methods
      .submitMilestone()
      .accounts({
        escrow: escrowPda,
      })
      .signers([freelancer])
      .rpc();

    // Approve the milestone
    const approveTx = await program.methods
      .approveMilestone()
      .accounts({
        escrow: escrowPda,
      })
      .signers([client])
      .rpc();

    console.log("Approve milestone transaction signature", approveTx);

    // Verify state transition
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPda);
    expect(escrowAccount.currentMilestoneState.approved).to.be.true;
  });

  it("Releases milestone and advances to next", async () => {
    // Initialize, submit, and approve
    await program.methods
      .initializeEscrow(milestoneAmounts)
      .accounts({
        escrow: escrowPda,
        client: client.publicKey,
        freelancer: freelancer.publicKey,
      })
      .signers([client])
      .rpc();

    await program.methods
      .submitMilestone()
      .accounts({
        escrow: escrowPda,
      })
      .signers([freelancer])
      .rpc();

    await program.methods
      .approveMilestone()
      .accounts({
        escrow: escrowPda,
      })
      .signers([client])
      .rpc();

    // Release the milestone
    const releaseTx = await program.methods
      .releaseMilestone()
      .accounts({
        escrow: escrowPda,
      })
      .signers([client])
      .rpc();

    console.log("Release milestone transaction signature", releaseTx);

    // Verify we moved to next milestone
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPda);
    expect(escrowAccount.currentMilestoneIndex).to.equal(1); // Moved to milestone 1
    expect(escrowAccount.currentMilestoneState.pending).to.be.true; // Back to pending
  });

  it("Cancels escrow from Pending state", async () => {
    // Initialize escrow only (still in Pending state)
    await program.methods
      .initializeEscrow(milestoneAmounts)
      .accounts({
        escrow: escrowPda,
        client: client.publicKey,
        freelancer: freelancer.publicKey,
      })
      .signers([client])
      .rpc();

    // Cancel the escrow
    const cancelTx = await program.methods
      .cancelEscrow()
      .accounts({
        escrow: escrowPda,
      })
      .signers([client])
      .rpc();

    console.log("Cancel escrow transaction signature", cancelTx);
  });

  it("Fails to cancel escrow after work is submitted", async () => {
    // Initialize and submit milestone
    await program.methods
      .initializeEscrow(milestoneAmounts)
      .accounts({
        escrow: escrowPda,
        client: client.publicKey,
        freelancer: freelancer.publicKey,
      })
      .signers([client])
      .rpc();

    await program.methods
      .submitMilestone()
      .accounts({
        escrow: escrowPda,
      })
      .signers([freelancer])
      .rpc();

    // Try to cancel (should fail)
    try {
      await program.methods
        .cancelEscrow()
        .accounts({
          escrow: escrowPda,
        })
        .signers([client])
        .rpc();
      
      expect.fail("Should have failed - cannot cancel after submission");
    } catch (error) {
      expect(error.error.errorMessage).to.include("Cannot cancel escrow after work is submitted");
    }
  });
});
