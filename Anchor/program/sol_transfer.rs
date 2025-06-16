use anchor_lang::prelude::*;

declare_id!("3cSDkhgajeNvK43YCqp5sq78DNCVbf394HGBt3LaGWu4");

#[program]
pub mod my_cpisol {
    use super::*;

    pub fn transfer_sol_via_cpi(
        ctx: Context<Transfer>, 
        amount: u64
    ) -> Result<()> {
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.from.key(), 
            &ctx.accounts.to.key(), 
            amount,
        );

        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.from.to_account_info(), 
                ctx.accounts.to.to_account_info(), 
                ctx.accounts.system_program.to_account_info()
            ],
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut, signer)]
    pub from: Signer<'info>,
    #[account(mut)]
    pub to: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}
