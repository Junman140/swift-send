#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env};

#[derive(Clone)]
#[contracttype]
enum DataKey {
    Admin,
    Gate,
    Allow(Address),
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

fn read_gate(env: &Env) -> bool {
    env.storage()
        .persistent()
        .get::<_, bool>(&DataKey::Gate)
        .unwrap_or(false)
}

fn write_gate(env: &Env, value: bool) {
    env.storage().persistent().set(&DataKey::Gate, &value);
}

fn write_allow(env: &Env, addr: &Address, allow: bool) {
    env.storage()
        .persistent()
        .set(&DataKey::Allow(addr.clone()), &allow);
}

fn read_allow(env: &Env, addr: &Address) -> bool {
    env.storage()
        .persistent()
        .get::<_, bool>(&DataKey::Allow(addr.clone()))
        .unwrap_or(false)
}

fn emit(env: &Env, topic: &'static str, addr: Option<&Address>, state: bool) {
    let symbol = match topic {
        "gate" => symbol_short!("gate"),
        _ => symbol_short!("allow"),
    };
    if let Some(a) = addr {
        env.events()
            .publish((symbol_short!("guard"), symbol), (a, state));
    } else {
        env.events()
            .publish((symbol_short!("guard"), symbol), state);
    }
}

#[contract]
pub struct AccessGuard;

#[contractimpl]
impl AccessGuard {
    pub fn init(env: Env, admin: Address) {
        if env.storage().persistent().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        admin.require_auth();
        write_admin(&env, &admin);
        write_gate(&env, false);
        emit(&env, "gate", None, false);
    }

    pub fn set_gate(env: Env, open: bool) {
        let admin = read_admin(&env);
        admin.require_auth();
        write_gate(&env, open);
        emit(&env, "gate", None, open);
    }

    pub fn set_allow(env: Env, addr: Address, allow: bool) {
        let admin = read_admin(&env);
        admin.require_auth();
        write_allow(&env, &addr, allow);
        emit(&env, "allow", Some(&addr), allow);
    }

    pub fn check(env: Env, addr: Address) -> bool {
        read_gate(&env) && read_allow(&env, &addr)
    }
}
