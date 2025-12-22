use anchor_lang::prelude::*;

declare_id!("G3Cc3RuUQrcV7rQkm6dQzi9RTswojP9oehxxs7cQ6eG1");

#[program]
pub mod anchorpay {
    use super::*;

    pub fn initialize_escrow(
        ctx: Context<InitializeEscrow>,
        milestone_amounts: Vec<u64>,
    ) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        escrow.client = ctx.accounts.client.key();
        escrow.freelancer = ctx.accounts.freelancer.key();
        escrow.milestone_amounts = milestone_amounts.clone();
        escrow.current_milestone_index = 0;
        escrow.current_milestone_state = MilestoneState::Pending;
        escrow.bump = ctx.bumps.escrow;

        // Validate milestone amounts
        require!(escrow.milestone_amounts.len() > 0, ErrorCode::NoMilestones);
        require!(escrow.milestone_amounts.len() <= 10, ErrorCode::TooManyMilestones);

        Ok(())
    }

    pub fn submit_milestone(ctx: Context<SubmitMilestone>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        
        require!(
            escrow.current_milestone_state == MilestoneState::Pending,
            ErrorCode::InvalidStateTransition
        );

        escrow.current_milestone_state = MilestoneState::Submitted;
        msg!("Milestone {} submitted", escrow.current_milestone_index);

        Ok(())
    }

    pub fn approve_milestone(ctx: Context<ApproveMilestone>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        
        require!(
            escrow.current_milestone_state == MilestoneState::Submitted,
            ErrorCode::InvalidStateTransition
        );

        escrow.current_milestone_state = MilestoneState::Approved;
        msg!("Milestone {} approved", escrow.current_milestone_index);

        Ok(())
    }

    pub fn release_milestone(ctx: Context<ReleaseMilestone>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        
        require!(
            ctx.accounts.authority.key() == escrow.client || ctx.accounts.authority.key() == escrow.freelancer,
            ErrorCode::Unauthorized
        );

        require!(
            escrow.current_milestone_state == MilestoneState::Approved,
            ErrorCode::InvalidStateTransition
        );

        // Move to next milestone or complete escrow
        if escrow.current_milestone_index + 1 >= escrow.milestone_amounts.len() {
            // All milestones completed
            msg!("All milestones completed!");
        } else {
            escrow.current_milestone_index += 1;
            escrow.current_milestone_state = MilestoneState::Pending;
            msg!("Moving to milestone {}", escrow.current_milestone_index);
        }

        Ok(())
    }

    pub fn cancel_escrow(ctx: Context<CancelEscrow>) -> Result<()> {
        let escrow = &ctx.accounts.escrow;
        
        require!(
            escrow.current_milestone_state == MilestoneState::Pending,
            ErrorCode::CannotCancelInSubmittedState
        );

        msg!("Escrow cancelled in milestone {} (Pending state)", escrow.current_milestone_index);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(milestone_amounts: Vec<u64>)]
pub struct InitializeEscrow<'info> {
    #[account(init, payer = client, space = 8 + EscrowAccount::INIT_SPACE, seeds = [b"escrow", client.key().as_ref()], bump)]
    pub escrow: Account<'info, EscrowAccount>,
    pub client: Signer<'info>,
    /// CHECK: Freelancer is just stored, no validation needed
    pub freelancer: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitMilestone<'info> {
    #[account(mut, seeds = [b"escrow", escrow.client.as_ref()], bump = escrow.bump, has_one = freelancer)]
    pub escrow: Account<'info, EscrowAccount>,
    pub freelancer: Signer<'info>,
}

#[derive(Accounts)]
pub struct ApproveMilestone<'info> {
    #[account(mut, seeds = [b"escrow", escrow.client.as_ref()], bump = escrow.bump, has_one = client)]
    pub escrow: Account<'info, EscrowAccount>,
    pub client: Signer<'info>,
}

#[derive(Accounts)]
pub struct ReleaseMilestone<'info> {
    #[account(mut, seeds = [b"escrow", escrow.client.as_ref()], bump = escrow.bump)]
    pub escrow: Account<'info, EscrowAccount>,
    /// CHECK: Can be called by either client or freelancer
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct CancelEscrow<'info> {
    #[account(mut, seeds = [b"escrow", escrow.client.as_ref()], bump = escrow.bump, has_one = client)]
    pub escrow: Account<'info, EscrowAccount>,
    pub client: Signer<'info>,
}

#[account]
#[derive(Debug)]
pub struct EscrowAccount {
    pub client: Pubkey,
    pub freelancer: Pubkey,
    pub milestone_amounts: Vec<u64>,
    pub current_milestone_index: usize,
    pub current_milestone_state: MilestoneState,
    pub bump: u8,
}

#[derive(Clone, Debug, AnchorSerialize, AnchorDeserialize, PartialEq, Eq)]
pub enum MilestoneState {
    Pending,
    Submitted,
    Approved,
    Released,
}

#[error_code]
pub enum ErrorCode {
    #[msg("No milestones provided")]
    NoMilestones,
    #[msg("Too many milestones (max 10)")]
    TooManyMilestones,
    #[msg("Invalid state transition")]
    InvalidStateTransition,
    #[msg("Cannot cancel escrow after work is submitted")]
    CannotCancelInSubmittedState,
    #[msg("Unauthorized access")]
    Unauthorized,
}
