#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env, Symbol};

const COUNTER: Symbol = symbol_short!("COUNTER");

#[contract]
pub struct IncrementContract;

#[contractimpl]
impl IncrementContract {
    /// Increment increments an internal counter, and returns the value.
    pub fn increment(env: Env) -> u32 {
        // Get the current count.
        let mut count: u32 = env.storage().instance().get(&COUNTER).unwrap_or(0);
        
        // Increment the count.
        count += 1;
        
        // Save the count.
        env.storage().instance().set(&COUNTER, &count);
        
        // Extend the TTL of the instance and the storage so it doesn't get archived
        env.storage().instance().extend_ttl(100, 100);
        
        // Return the count to the caller.
        count
    }

    /// Read returns the current counter value without incrementing.
    pub fn read(env: Env) -> u32 {
        env.storage().instance().get(&COUNTER).unwrap_or(0)
    }
}
