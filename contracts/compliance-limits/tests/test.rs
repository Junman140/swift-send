use compliance_limits::{ComplianceLimits, ComplianceLimitsClient};
use soroban_sdk::{symbol_short, testutils::{Address as _, BytesN as _}, Env};

#[test]
fn limits_flow_integration() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, ComplianceLimits);
    let client = ComplianceLimitsClient::new(&env, &contract_id);

    let admin = soroban_sdk::Address::generate(&env);
    client.init(&admin);

    let user = soroban_sdk::BytesN::random(&env);
    let starter = symbol_short!("starter");

    client.assign_tier(&user, &starter);
    let decision = client.inspect(&user, &200_i128);
    assert!(decision.allowed);

    client.record(&user, &200_i128);
    let decision = client.inspect(&user, &400_i128);
    assert!(!decision.allowed);
}
