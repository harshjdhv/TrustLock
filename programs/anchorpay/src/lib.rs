use anchor_lang::prelude::*;

declare_id!("G3Cc3RuUQrcV7rQkm6dQzi9RTswojP9oehxxs7cQ6eG1");

#[program]
pub mod anchorpay {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
