#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env};

#[derive(Clone)]
#[contracttype]
enum DataKey {
    Admin,
    Counter,
}

fn read_admin(env: &Env) -> Address {
    env.storage()
        .persistent()
        .get::<_, Address>(&DataKey::Admin)
        .expect("not initialized")
}

fn write_admin(env: &Env, admin: &Address) {
    env.storage().persistent().set(&DataKey::Admin, admin);
}

fn read_counter(env: &Env) -> i128 {
    env.storage()
        .persistent()
        .get::<_, i128>(&DataKey::Counter)
        .unwrap_or(0)
}

fn write_counter(env: &Env, value: i128) {
    env.storage().persistent().set(&DataKey::Counter, &value);
}

fn emit(env: &Env, value: i128) {
    env.events()
        .publish((symbol_short!("counter"), symbol_short!("set")), value);
}

#[contract]
pub struct SimpleCounter;

#[contractimpl]
impl SimpleCounter {
    pub fn init(env: Env, admin: Address, start: i128) {
        if env.storage().persistent().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        admin.require_auth();
        write_admin(&env, &admin);
        write_counter(&env, start);
        emit(&env, start);
    }

    pub fn increment(env: Env, step: i128) -> i128 {
        if step <= 0 {
            panic!("step must be positive");
        }
        let admin = read_admin(&env);
        admin.require_auth();
        let value = read_counter(&env) + step;
        write_counter(&env, value);
        emit(&env, value);
        value
    }

    pub fn get(env: Env) -> i128 {
        read_counter(&env)
    }
}
