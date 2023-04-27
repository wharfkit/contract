import {ABI, Asset, Name, Struct} from '@greymass/eosio'

export const eosioToken = ABI.from({
    actions: [
        {
            name: 'close',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Close Token Balance\nsummary: \'Close {{nowrap owner}}’s zero quantity balance\'\nicon: https://raw.githubusercontent.com/cryptokylin/eosio.contracts/v1.7.0/contracts/icons/token.png#207ff68b0406eaa56618b08bda81d6a0954543f36adc328ab3065f31a5c5d654\n---\n\n{{owner}} agrees to close their zero quantity balance for the {{symbol_to_symbol_code symbol}} token.\n\nRAM will be refunded to the RAM payer of the {{symbol_to_symbol_code symbol}} token balance for {{owner}}.',
            type: 'close',
        },
        {
            name: 'create',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Create New Token\nsummary: \'Create a new token\'\nicon: https://raw.githubusercontent.com/cryptokylin/eosio.contracts/v1.7.0/contracts/icons/token.png#207ff68b0406eaa56618b08bda81d6a0954543f36adc328ab3065f31a5c5d654\n---\n\n{{$action.account}} agrees to create a new token with symbol {{asset_to_symbol_code maximum_supply}} to be managed by {{issuer}}.\n\nThis action will not result any any tokens being issued into circulation.\n\n{{issuer}} will be allowed to issue tokens into circulation, up to a maximum supply of {{maximum_supply}}.\n\nRAM will deducted from {{$action.account}}’s resources to create the necessary records.',
            type: 'create',
        },
        {
            name: 'issue',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Issue Tokens into Circulation\nsummary: \'Issue {{nowrap quantity}} into circulation and transfer into {{nowrap to}}’s account\'\nicon: https://raw.githubusercontent.com/cryptokylin/eosio.contracts/v1.7.0/contracts/icons/token.png#207ff68b0406eaa56618b08bda81d6a0954543f36adc328ab3065f31a5c5d654\n---\n\nThe token manager agrees to issue {{quantity}} into circulation, and transfer it into {{to}}’s account.\n\n{{#if memo}}There is a memo attached to the transfer stating:\n{{memo}}\n{{/if}}\n\nIf {{to}} does not have a balance for {{asset_to_symbol_code quantity}}, or the token manager does not have a balance for {{asset_to_symbol_code quantity}}, the token manager will be designated as the RAM payer of the {{asset_to_symbol_code quantity}} token balance for {{to}}. As a result, RAM will be deducted from the token manager’s resources to create the necessary records.\n\nThis action does not allow the total quantity to exceed the max allowed supply of the token.',
            type: 'issue',
        },
        {
            name: 'open',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Open Token Balance\nsummary: \'Open a zero quantity balance for {{nowrap owner}}\'\nicon: https://raw.githubusercontent.com/cryptokylin/eosio.contracts/v1.7.0/contracts/icons/token.png#207ff68b0406eaa56618b08bda81d6a0954543f36adc328ab3065f31a5c5d654\n---\n\n{{ram_payer}} agrees to establish a zero quantity balance for {{owner}} for the {{symbol_to_symbol_code symbol}} token.\n\nIf {{owner}} does not have a balance for {{symbol_to_symbol_code symbol}}, {{ram_payer}} will be designated as the RAM payer of the {{symbol_to_symbol_code symbol}} token balance for {{owner}}. As a result, RAM will be deducted from {{ram_payer}}’s resources to create the necessary records.',
            type: 'open',
        },
        {
            name: 'retire',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Remove Tokens from Circulation\nsummary: \'Remove {{nowrap quantity}} from circulation\'\nicon: https://raw.githubusercontent.com/cryptokylin/eosio.contracts/v1.7.0/contracts/icons/token.png#207ff68b0406eaa56618b08bda81d6a0954543f36adc328ab3065f31a5c5d654\n---\n\nThe token manager agrees to remove {{quantity}} from circulation, taken from their own account.\n\n{{#if memo}} There is a memo attached to the action stating:\n{{memo}}\n{{/if}}',
            type: 'retire',
        },
        {
            name: 'transfer',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Transfer Tokens\nsummary: \'Send {{nowrap quantity}} from {{nowrap from}} to {{nowrap to}}\'\nicon: https://raw.githubusercontent.com/cryptokylin/eosio.contracts/v1.7.0/contracts/icons/transfer.png#5dfad0df72772ee1ccc155e670c1d124f5c5122f1d5027565df38b418042d1dd\n---\n\n{{from}} agrees to send {{quantity}} to {{to}}.\n\n{{#if memo}}There is a memo attached to the transfer stating:\n{{memo}}\n{{/if}}\n\nIf {{from}} is not already the RAM payer of their {{asset_to_symbol_code quantity}} token balance, {{from}} will be designated as such. As a result, RAM will be deducted from {{from}}’s resources to refund the original RAM payer.\n\nIf {{to}} does not have a balance for {{asset_to_symbol_code quantity}}, {{from}} will be designated as the RAM payer of the {{asset_to_symbol_code quantity}} token balance for {{to}}. As a result, RAM will be deducted from {{from}}’s resources to create the necessary records.',
            type: 'transfer',
        },
    ],
    ricardian_clauses: [],
    structs: [
        {
            base: '',
            fields: [
                {
                    name: 'balance',
                    type: 'asset',
                },
            ],
            name: 'account',
        },
        {
            base: '',
            fields: [
                {
                    name: 'owner',
                    type: 'name',
                },
                {
                    name: 'symbol',
                    type: 'symbol',
                },
            ],
            name: 'close',
        },
        {
            base: '',
            fields: [
                {
                    name: 'issuer',
                    type: 'name',
                },
                {
                    name: 'maximum_supply',
                    type: 'asset',
                },
            ],
            name: 'create',
        },
        {
            base: '',
            fields: [
                {
                    name: 'supply',
                    type: 'asset',
                },
                {
                    name: 'max_supply',
                    type: 'asset',
                },
                {
                    name: 'issuer',
                    type: 'name',
                },
            ],
            name: 'currency_stats',
        },
        {
            base: '',
            fields: [
                {
                    name: 'to',
                    type: 'name',
                },
                {
                    name: 'quantity',
                    type: 'asset',
                },
                {
                    name: 'memo',
                    type: 'string',
                },
            ],
            name: 'issue',
        },
        {
            base: '',
            fields: [
                {
                    name: 'owner',
                    type: 'name',
                },
                {
                    name: 'symbol',
                    type: 'symbol',
                },
                {
                    name: 'ram_payer',
                    type: 'name',
                },
            ],
            name: 'open',
        },
        {
            base: '',
            fields: [
                {
                    name: 'quantity',
                    type: 'asset',
                },
                {
                    name: 'memo',
                    type: 'string',
                },
            ],
            name: 'retire',
        },
        {
            base: '',
            fields: [
                {
                    name: 'from',
                    type: 'name',
                },
                {
                    name: 'to',
                    type: 'name',
                },
                {
                    name: 'quantity',
                    type: 'asset',
                },
                {
                    name: 'memo',
                    type: 'string',
                },
            ],
            name: 'transfer',
        },
    ],
    tables: [
        {
            index_type: 'i64',
            key_names: [],
            key_types: [],
            name: 'accounts',
            type: 'account',
        },
        {
            index_type: 'i64',
            key_names: [],
            key_types: [],
            name: 'stat',
            type: 'currency_stats',
        },
    ],
    types: [],
    variants: [],
    version: 'eosio::abi/1.1',
})

export const eosioTokenModified = ABI.from({
    actions: [
        {
            name: 'close',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Close Token Balance\nsummary: \'Close {{nowrap owner}}’s zero quantity balance\'\nicon: https://raw.githubusercontent.com/cryptokylin/eosio.contracts/v1.7.0/contracts/icons/token.png#207ff68b0406eaa56618b08bda81d6a0954543f36adc328ab3065f31a5c5d654\n---\n\n{{owner}} agrees to close their zero quantity balance for the {{symbol_to_symbol_code symbol}} token.\n\nRAM will be refunded to the RAM payer of the {{symbol_to_symbol_code symbol}} token balance for {{owner}}.',
            type: 'close',
        },
        {
            name: 'create',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Create New Token\nsummary: \'Create a new token\'\nicon: https://raw.githubusercontent.com/cryptokylin/eosio.contracts/v1.7.0/contracts/icons/token.png#207ff68b0406eaa56618b08bda81d6a0954543f36adc328ab3065f31a5c5d654\n---\n\n{{$action.account}} agrees to create a new token with symbol {{asset_to_symbol_code maximum_supply}} to be managed by {{issuer}}.\n\nThis action will not result any any tokens being issued into circulation.\n\n{{issuer}} will be allowed to issue tokens into circulation, up to a maximum supply of {{maximum_supply}}.\n\nRAM will deducted from {{$action.account}}’s resources to create the necessary records.',
            type: 'create',
        },
        {
            name: 'issue',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Issue Tokens into Circulation\nsummary: \'Issue {{nowrap quantity}} into circulation and transfer into {{nowrap to}}’s account\'\nicon: https://raw.githubusercontent.com/cryptokylin/eosio.contracts/v1.7.0/contracts/icons/token.png#207ff68b0406eaa56618b08bda81d6a0954543f36adc328ab3065f31a5c5d654\n---\n\nThe token manager agrees to issue {{quantity}} into circulation, and transfer it into {{to}}’s account.\n\n{{#if memo}}There is a memo attached to the transfer stating:\n{{memo}}\n{{/if}}\n\nIf {{to}} does not have a balance for {{asset_to_symbol_code quantity}}, or the token manager does not have a balance for {{asset_to_symbol_code quantity}}, the token manager will be designated as the RAM payer of the {{asset_to_symbol_code quantity}} token balance for {{to}}. As a result, RAM will be deducted from the token manager’s resources to create the necessary records.\n\nThis action does not allow the total quantity to exceed the max allowed supply of the token.',
            type: 'issue',
        },
        {
            name: 'open',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Open Token Balance\nsummary: \'Open a zero quantity balance for {{nowrap owner}}\'\nicon: https://raw.githubusercontent.com/cryptokylin/eosio.contracts/v1.7.0/contracts/icons/token.png#207ff68b0406eaa56618b08bda81d6a0954543f36adc328ab3065f31a5c5d654\n---\n\n{{ram_payer}} agrees to establish a zero quantity balance for {{owner}} for the {{symbol_to_symbol_code symbol}} token.\n\nIf {{owner}} does not have a balance for {{symbol_to_symbol_code symbol}}, {{ram_payer}} will be designated as the RAM payer of the {{symbol_to_symbol_code symbol}} token balance for {{owner}}. As a result, RAM will be deducted from {{ram_payer}}’s resources to create the necessary records.',
            type: 'open',
        },
        {
            name: 'retire',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Remove Tokens from Circulation\nsummary: \'Remove {{nowrap quantity}} from circulation\'\nicon: https://raw.githubusercontent.com/cryptokylin/eosio.contracts/v1.7.0/contracts/icons/token.png#207ff68b0406eaa56618b08bda81d6a0954543f36adc328ab3065f31a5c5d654\n---\n\nThe token manager agrees to remove {{quantity}} from circulation, taken from their own account.\n\n{{#if memo}} There is a memo attached to the action stating:\n{{memo}}\n{{/if}}',
            type: 'retire',
        },
        {
            name: 'transfer',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Transfer Tokens\nsummary: \'Send {{nowrap quantity}} from {{nowrap from}} to {{nowrap to}}\'\nicon: https://raw.githubusercontent.com/cryptokylin/eosio.contracts/v1.7.0/contracts/icons/transfer.png#5dfad0df72772ee1ccc155e670c1d124f5c5122f1d5027565df38b418042d1dd\n---\n\n{{from}} agrees to send {{quantity}} to {{to}}.\n\n{{#if memo}}There is a memo attached to the transfer stating:\n{{memo}}\n{{/if}}\n\nIf {{from}} is not already the RAM payer of their {{asset_to_symbol_code quantity}} token balance, {{from}} will be designated as such. As a result, RAM will be deducted from {{from}}’s resources to refund the original RAM payer.\n\nIf {{to}} does not have a balance for {{asset_to_symbol_code quantity}}, {{from}} will be designated as the RAM payer of the {{asset_to_symbol_code quantity}} token balance for {{to}}. As a result, RAM will be deducted from {{from}}’s resources to create the necessary records.',
            type: 'transfer',
        },
    ],
    ricardian_clauses: [],
    structs: [
        {
            base: '',
            fields: [
                {
                    name: 'balance',
                    type: 'asset',
                },
            ],
            name: 'account',
        },
        {
            base: '',
            fields: [
                {
                    name: 'owner',
                    type: 'name',
                },
                {
                    name: 'symbol',
                    type: 'symbol',
                },
            ],
            name: 'close',
        },
        {
            base: '',
            fields: [
                {
                    name: 'issuer',
                    type: 'name',
                },
                {
                    name: 'maximum_supply',
                    type: 'asset',
                },
            ],
            name: 'create',
        },
        {
            base: '',
            fields: [
                {
                    name: 'supply',
                    type: 'asset',
                },
                {
                    name: 'max_supply',
                    type: 'asset',
                },
                {
                    name: 'issuer',
                    type: 'name',
                },
            ],
            name: 'currency_stats',
        },
        {
            base: '',
            fields: [
                {
                    name: 'to',
                    type: 'name',
                },
                {
                    name: 'quantity',
                    type: 'asset',
                },
                {
                    name: 'memo',
                    type: 'string',
                },
            ],
            name: 'issue',
        },
        {
            base: '',
            fields: [
                {
                    name: 'owner',
                    type: 'name',
                },
                {
                    name: 'symbol',
                    type: 'symbol',
                },
                {
                    name: 'ram_payer',
                    type: 'name',
                },
            ],
            name: 'open',
        },
        {
            base: '',
            fields: [
                {
                    name: 'quantity',
                    type: 'asset',
                },
                {
                    name: 'memo',
                    type: 'string',
                },
            ],
            name: 'retire',
        },
        {
            base: '',
            fields: [
                {
                    name: 'from',
                    type: 'name',
                },
                {
                    name: 'to',
                    type: 'name',
                },
                {
                    name: 'quantity',
                    type: 'asset',
                },
                {
                    name: 'memo',
                    type: 'string',
                },
                {
                    name: 'mass_transfer',
                    type: 'name[]?',
                },
            ],
            name: 'transfer',
        },
    ],
    tables: [
        {
            index_type: 'i64',
            key_names: [],
            key_types: [],
            name: 'accounts',
            type: 'account',
        },
        {
            index_type: 'i64',
            key_names: [],
            key_types: [],
            name: 'stat',
            type: 'currency_stats',
        },
    ],
    types: [],
    variants: [],
    version: 'eosio::abi/1.1',
})

export const atomicAssets = ABI.from({
    version: 'eosio::abi/1.1',
    types: [
        {
            new_type_name: 'ATOMIC_ATTRIBUTE',
            type: 'variant_int8_int16_int32_int64_uint8_uint16_uint32_uint64_float32_float64_string_INT8_VEC_INT16_VEC_INT32_VEC_INT64_VEC_UINT8_VEC_UINT16_VEC_UINT32_VEC_UINT64_VEC_FLOAT_VEC_DOUBLE_VEC_STRING_VEC',
        },
        {
            new_type_name: 'ATTRIBUTE_MAP',
            type: 'pair_string_ATOMIC_ATTRIBUTE[]',
        },
        {
            new_type_name: 'DOUBLE_VEC',
            type: 'float64[]',
        },
        {
            new_type_name: 'FLOAT_VEC',
            type: 'float32[]',
        },
        {
            new_type_name: 'INT16_VEC',
            type: 'int16[]',
        },
        {
            new_type_name: 'INT32_VEC',
            type: 'int32[]',
        },
        {
            new_type_name: 'INT64_VEC',
            type: 'int64[]',
        },
        {
            new_type_name: 'INT8_VEC',
            type: 'bytes',
        },
        {
            new_type_name: 'STRING_VEC',
            type: 'string[]',
        },
        {
            new_type_name: 'UINT16_VEC',
            type: 'uint16[]',
        },
        {
            new_type_name: 'UINT32_VEC',
            type: 'uint32[]',
        },
        {
            new_type_name: 'UINT64_VEC',
            type: 'uint64[]',
        },
        {
            new_type_name: 'UINT8_VEC',
            type: 'uint8[]',
        },
    ],
    structs: [
        {
            name: 'FORMAT',
            base: '',
            fields: [
                {
                    name: 'name',
                    type: 'string',
                },
                {
                    name: 'type',
                    type: 'string',
                },
            ],
        },
        {
            name: 'acceptoffer',
            base: '',
            fields: [
                {
                    name: 'offer_id',
                    type: 'uint64',
                },
            ],
        },
        {
            name: 'addcolauth',
            base: '',
            fields: [
                {
                    name: 'collection_name',
                    type: 'name',
                },
                {
                    name: 'account_to_add',
                    type: 'name',
                },
            ],
        },
        {
            name: 'addconftoken',
            base: '',
            fields: [
                {
                    name: 'token_contract',
                    type: 'name',
                },
                {
                    name: 'token_symbol',
                    type: 'symbol',
                },
            ],
        },
        {
            name: 'addnotifyacc',
            base: '',
            fields: [
                {
                    name: 'collection_name',
                    type: 'name',
                },
                {
                    name: 'account_to_add',
                    type: 'name',
                },
            ],
        },
        {
            name: 'admincoledit',
            base: '',
            fields: [
                {
                    name: 'collection_format_extension',
                    type: 'FORMAT[]',
                },
            ],
        },
        {
            name: 'announcedepo',
            base: '',
            fields: [
                {
                    name: 'owner',
                    type: 'name',
                },
                {
                    name: 'symbol_to_announce',
                    type: 'symbol',
                },
            ],
        },
        {
            name: 'assets_s',
            base: '',
            fields: [
                {
                    name: 'asset_id',
                    type: 'uint64',
                },
                {
                    name: 'collection_name',
                    type: 'name',
                },
                {
                    name: 'schema_name',
                    type: 'name',
                },
                {
                    name: 'template_id',
                    type: 'int32',
                },
                {
                    name: 'ram_payer',
                    type: 'name',
                },
                {
                    name: 'backed_tokens',
                    type: 'asset[]',
                },
                {
                    name: 'immutable_serialized_data',
                    type: 'uint8[]',
                },
                {
                    name: 'mutable_serialized_data',
                    type: 'uint8[]',
                },
            ],
        },
        {
            name: 'backasset',
            base: '',
            fields: [
                {
                    name: 'payer',
                    type: 'name',
                },
                {
                    name: 'asset_owner',
                    type: 'name',
                },
                {
                    name: 'asset_id',
                    type: 'uint64',
                },
                {
                    name: 'token_to_back',
                    type: 'asset',
                },
            ],
        },
        {
            name: 'balances_s',
            base: '',
            fields: [
                {
                    name: 'owner',
                    type: 'name',
                },
                {
                    name: 'quantities',
                    type: 'asset[]',
                },
            ],
        },
        {
            name: 'burnasset',
            base: '',
            fields: [
                {
                    name: 'asset_owner',
                    type: 'name',
                },
                {
                    name: 'asset_id',
                    type: 'uint64',
                },
            ],
        },
        {
            name: 'canceloffer',
            base: '',
            fields: [
                {
                    name: 'offer_id',
                    type: 'uint64',
                },
            ],
        },
        {
            name: 'collections_s',
            base: '',
            fields: [
                {
                    name: 'collection_name',
                    type: 'name',
                },
                {
                    name: 'author',
                    type: 'name',
                },
                {
                    name: 'allow_notify',
                    type: 'bool',
                },
                {
                    name: 'authorized_accounts',
                    type: 'name[]',
                },
                {
                    name: 'notify_accounts',
                    type: 'name[]',
                },
                {
                    name: 'market_fee',
                    type: 'float64',
                },
                {
                    name: 'serialized_data',
                    type: 'uint8[]',
                },
            ],
        },
        {
            name: 'config_s',
            base: '',
            fields: [
                {
                    name: 'asset_counter',
                    type: 'uint64',
                },
                {
                    name: 'template_counter',
                    type: 'int32',
                },
                {
                    name: 'offer_counter',
                    type: 'uint64',
                },
                {
                    name: 'collection_format',
                    type: 'FORMAT[]',
                },
                {
                    name: 'supported_tokens',
                    type: 'extended_symbol[]',
                },
            ],
        },
        {
            name: 'createcol',
            base: '',
            fields: [
                {
                    name: 'author',
                    type: 'name',
                },
                {
                    name: 'collection_name',
                    type: 'name',
                },
                {
                    name: 'allow_notify',
                    type: 'bool',
                },
                {
                    name: 'authorized_accounts',
                    type: 'name[]',
                },
                {
                    name: 'notify_accounts',
                    type: 'name[]',
                },
                {
                    name: 'market_fee',
                    type: 'float64',
                },
                {
                    name: 'data',
                    type: 'ATTRIBUTE_MAP',
                },
            ],
        },
        {
            name: 'createoffer',
            base: '',
            fields: [
                {
                    name: 'sender',
                    type: 'name',
                },
                {
                    name: 'recipient',
                    type: 'name',
                },
                {
                    name: 'sender_asset_ids',
                    type: 'uint64[]',
                },
                {
                    name: 'recipient_asset_ids',
                    type: 'uint64[]',
                },
                {
                    name: 'memo',
                    type: 'string',
                },
            ],
        },
        {
            name: 'createschema',
            base: '',
            fields: [
                {
                    name: 'authorized_creator',
                    type: 'name',
                },
                {
                    name: 'collection_name',
                    type: 'name',
                },
                {
                    name: 'schema_name',
                    type: 'name',
                },
                {
                    name: 'schema_format',
                    type: 'FORMAT[]',
                },
            ],
        },
        {
            name: 'createtempl',
            base: '',
            fields: [
                {
                    name: 'authorized_creator',
                    type: 'name',
                },
                {
                    name: 'collection_name',
                    type: 'name',
                },
                {
                    name: 'schema_name',
                    type: 'name',
                },
                {
                    name: 'transferable',
                    type: 'bool',
                },
                {
                    name: 'burnable',
                    type: 'bool',
                },
                {
                    name: 'max_supply',
                    type: 'uint32',
                },
                {
                    name: 'immutable_data',
                    type: 'ATTRIBUTE_MAP',
                },
            ],
        },
        {
            name: 'declineoffer',
            base: '',
            fields: [
                {
                    name: 'offer_id',
                    type: 'uint64',
                },
            ],
        },
        {
            name: 'extended_symbol',
            base: '',
            fields: [
                {
                    name: 'sym',
                    type: 'symbol',
                },
                {
                    name: 'contract',
                    type: 'name',
                },
            ],
        },
        {
            name: 'extendschema',
            base: '',
            fields: [
                {
                    name: 'authorized_editor',
                    type: 'name',
                },
                {
                    name: 'collection_name',
                    type: 'name',
                },
                {
                    name: 'schema_name',
                    type: 'name',
                },
                {
                    name: 'schema_format_extension',
                    type: 'FORMAT[]',
                },
            ],
        },
        {
            name: 'forbidnotify',
            base: '',
            fields: [
                {
                    name: 'collection_name',
                    type: 'name',
                },
            ],
        },
        {
            name: 'init',
            base: '',
            fields: [],
        },
        {
            name: 'locktemplate',
            base: '',
            fields: [
                {
                    name: 'authorized_editor',
                    type: 'name',
                },
                {
                    name: 'collection_name',
                    type: 'name',
                },
                {
                    name: 'template_id',
                    type: 'int32',
                },
            ],
        },
        {
            name: 'logbackasset',
            base: '',
            fields: [
                {
                    name: 'asset_owner',
                    type: 'name',
                },
                {
                    name: 'asset_id',
                    type: 'uint64',
                },
                {
                    name: 'backed_token',
                    type: 'asset',
                },
            ],
        },
        {
            name: 'logburnasset',
            base: '',
            fields: [
                {
                    name: 'asset_owner',
                    type: 'name',
                },
                {
                    name: 'asset_id',
                    type: 'uint64',
                },
                {
                    name: 'collection_name',
                    type: 'name',
                },
                {
                    name: 'schema_name',
                    type: 'name',
                },
                {
                    name: 'template_id',
                    type: 'int32',
                },
                {
                    name: 'backed_tokens',
                    type: 'asset[]',
                },
                {
                    name: 'old_immutable_data',
                    type: 'ATTRIBUTE_MAP',
                },
                {
                    name: 'old_mutable_data',
                    type: 'ATTRIBUTE_MAP',
                },
                {
                    name: 'asset_ram_payer',
                    type: 'name',
                },
            ],
        },
        {
            name: 'logmint',
            base: '',
            fields: [
                {
                    name: 'asset_id',
                    type: 'uint64',
                },
                {
                    name: 'authorized_minter',
                    type: 'name',
                },
                {
                    name: 'collection_name',
                    type: 'name',
                },
                {
                    name: 'schema_name',
                    type: 'name',
                },
                {
                    name: 'template_id',
                    type: 'int32',
                },
                {
                    name: 'new_asset_owner',
                    type: 'name',
                },
                {
                    name: 'immutable_data',
                    type: 'ATTRIBUTE_MAP',
                },
                {
                    name: 'mutable_data',
                    type: 'ATTRIBUTE_MAP',
                },
                {
                    name: 'backed_tokens',
                    type: 'asset[]',
                },
                {
                    name: 'immutable_template_data',
                    type: 'ATTRIBUTE_MAP',
                },
            ],
        },
        {
            name: 'lognewoffer',
            base: '',
            fields: [
                {
                    name: 'offer_id',
                    type: 'uint64',
                },
                {
                    name: 'sender',
                    type: 'name',
                },
                {
                    name: 'recipient',
                    type: 'name',
                },
                {
                    name: 'sender_asset_ids',
                    type: 'uint64[]',
                },
                {
                    name: 'recipient_asset_ids',
                    type: 'uint64[]',
                },
                {
                    name: 'memo',
                    type: 'string',
                },
            ],
        },
        {
            name: 'lognewtempl',
            base: '',
            fields: [
                {
                    name: 'template_id',
                    type: 'int32',
                },
                {
                    name: 'authorized_creator',
                    type: 'name',
                },
                {
                    name: 'collection_name',
                    type: 'name',
                },
                {
                    name: 'schema_name',
                    type: 'name',
                },
                {
                    name: 'transferable',
                    type: 'bool',
                },
                {
                    name: 'burnable',
                    type: 'bool',
                },
                {
                    name: 'max_supply',
                    type: 'uint32',
                },
                {
                    name: 'immutable_data',
                    type: 'ATTRIBUTE_MAP',
                },
            ],
        },
        {
            name: 'logsetdata',
            base: '',
            fields: [
                {
                    name: 'asset_owner',
                    type: 'name',
                },
                {
                    name: 'asset_id',
                    type: 'uint64',
                },
                {
                    name: 'old_data',
                    type: 'ATTRIBUTE_MAP',
                },
                {
                    name: 'new_data',
                    type: 'ATTRIBUTE_MAP',
                },
            ],
        },
        {
            name: 'logtransfer',
            base: '',
            fields: [
                {
                    name: 'collection_name',
                    type: 'name',
                },
                {
                    name: 'from',
                    type: 'name',
                },
                {
                    name: 'to',
                    type: 'name',
                },
                {
                    name: 'asset_ids',
                    type: 'uint64[]',
                },
                {
                    name: 'memo',
                    type: 'string',
                },
            ],
        },
        {
            name: 'mintasset',
            base: '',
            fields: [
                {
                    name: 'authorized_minter',
                    type: 'name',
                },
                {
                    name: 'collection_name',
                    type: 'name',
                },
                {
                    name: 'schema_name',
                    type: 'name',
                },
                {
                    name: 'template_id',
                    type: 'int32',
                },
                {
                    name: 'new_asset_owner',
                    type: 'name',
                },
                {
                    name: 'immutable_data',
                    type: 'ATTRIBUTE_MAP',
                },
                {
                    name: 'mutable_data',
                    type: 'ATTRIBUTE_MAP',
                },
                {
                    name: 'tokens_to_back',
                    type: 'asset[]',
                },
            ],
        },
        {
            name: 'offers_s',
            base: '',
            fields: [
                {
                    name: 'offer_id',
                    type: 'uint64',
                },
                {
                    name: 'sender',
                    type: 'name',
                },
                {
                    name: 'recipient',
                    type: 'name',
                },
                {
                    name: 'sender_asset_ids',
                    type: 'uint64[]',
                },
                {
                    name: 'recipient_asset_ids',
                    type: 'uint64[]',
                },
                {
                    name: 'memo',
                    type: 'string',
                },
                {
                    name: 'ram_payer',
                    type: 'name',
                },
            ],
        },
        {
            name: 'pair_string_ATOMIC_ATTRIBUTE',
            base: '',
            fields: [
                {
                    name: 'key',
                    type: 'string',
                },
                {
                    name: 'value',
                    type: 'ATOMIC_ATTRIBUTE',
                },
            ],
        },
        {
            name: 'payofferram',
            base: '',
            fields: [
                {
                    name: 'payer',
                    type: 'name',
                },
                {
                    name: 'offer_id',
                    type: 'uint64',
                },
            ],
        },
        {
            name: 'remcolauth',
            base: '',
            fields: [
                {
                    name: 'collection_name',
                    type: 'name',
                },
                {
                    name: 'account_to_remove',
                    type: 'name',
                },
            ],
        },
        {
            name: 'remnotifyacc',
            base: '',
            fields: [
                {
                    name: 'collection_name',
                    type: 'name',
                },
                {
                    name: 'account_to_remove',
                    type: 'name',
                },
            ],
        },
        {
            name: 'schemas_s',
            base: '',
            fields: [
                {
                    name: 'schema_name',
                    type: 'name',
                },
                {
                    name: 'format',
                    type: 'FORMAT[]',
                },
            ],
        },
        {
            name: 'setassetdata',
            base: '',
            fields: [
                {
                    name: 'authorized_editor',
                    type: 'name',
                },
                {
                    name: 'asset_owner',
                    type: 'name',
                },
                {
                    name: 'asset_id',
                    type: 'uint64',
                },
                {
                    name: 'new_mutable_data',
                    type: 'ATTRIBUTE_MAP',
                },
            ],
        },
        {
            name: 'setcoldata',
            base: '',
            fields: [
                {
                    name: 'collection_name',
                    type: 'name',
                },
                {
                    name: 'data',
                    type: 'ATTRIBUTE_MAP',
                },
            ],
        },
        {
            name: 'setmarketfee',
            base: '',
            fields: [
                {
                    name: 'collection_name',
                    type: 'name',
                },
                {
                    name: 'market_fee',
                    type: 'float64',
                },
            ],
        },
        {
            name: 'setversion',
            base: '',
            fields: [
                {
                    name: 'new_version',
                    type: 'string',
                },
            ],
        },
        {
            name: 'templates_s',
            base: '',
            fields: [
                {
                    name: 'template_id',
                    type: 'int32',
                },
                {
                    name: 'schema_name',
                    type: 'name',
                },
                {
                    name: 'transferable',
                    type: 'bool',
                },
                {
                    name: 'burnable',
                    type: 'bool',
                },
                {
                    name: 'max_supply',
                    type: 'uint32',
                },
                {
                    name: 'issued_supply',
                    type: 'uint32',
                },
                {
                    name: 'immutable_serialized_data',
                    type: 'uint8[]',
                },
            ],
        },
        {
            name: 'tokenconfigs_s',
            base: '',
            fields: [
                {
                    name: 'standard',
                    type: 'name',
                },
                {
                    name: 'version',
                    type: 'string',
                },
            ],
        },
        {
            name: 'transfer',
            base: '',
            fields: [
                {
                    name: 'from',
                    type: 'name',
                },
                {
                    name: 'to',
                    type: 'name',
                },
                {
                    name: 'asset_ids',
                    type: 'uint64[]',
                },
                {
                    name: 'memo',
                    type: 'string',
                },
            ],
        },
        {
            name: 'withdraw',
            base: '',
            fields: [
                {
                    name: 'owner',
                    type: 'name',
                },
                {
                    name: 'token_to_withdraw',
                    type: 'asset',
                },
            ],
        },
    ],
    actions: [
        {
            name: 'acceptoffer',
            type: 'acceptoffer',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Accept an offer\nsummary: \'The offer with the id {{nowrap offer_id}} is accepted\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\nThe recipient of the offer with the id {{offer_id}} accepts the offer.\n\nThe assets from either side specified in the offer are automatically transferred to the respective other side.\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of the recipient of the offer.\n</div>',
        },
        {
            name: 'addcolauth',
            type: 'addcolauth',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Make an account authorized in a collection\nsummary: \'Add the account {{nowrap account_to_add}} to the authorized_accounts list of the collection {{nowrap collection_name}}\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\nAdds the account {{account_to_add}} to the authorized_accounts list of the collection {{collection_name}}.\n\nThis allows {{account_to_add}} to both create and edit templates and assets of this collection.\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of the collection\'s author.\n</div>',
        },
        {
            name: 'addconftoken',
            type: 'addconftoken',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Add token to supported list\nsummary: \'Adds a token that can then be used to back assets\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n<b>Description:</b>\n<div class="description">\nThe token with the symbol {{token_symbol}} from the token contract {{token_contract}} is added to the supported_tokens list.\n\nThis means that assets can then be backed with that specific token.\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of {{$action.account}}.\n</div>',
        },
        {
            name: 'addnotifyacc',
            type: 'addnotifyacc',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Add an account to a collection\'s notify list\nsummary: \'Add the account {{nowrap account_to_add}} to the notify_accounts list of the collection {{nowrap collection_name}}\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\nAdds the account {{account_to_add}} to the notify_accounts list of the collection {{collection_name}}.\n\nThis will make {{account_to_add}} get notifications directly on the blockchain when one of the following actions is performed:\n- One or more assets of the collection {{collection_name}} is transferred\n- An asset of the collection {{collection_name}} is minted\n- An asset of the collection {{collection_name}} has its mutable data changed\n- An asset of the collection {{collection_name}} is burned\n- An asset of the collection {{collection_name}} gets backed with core tokens\n- A template of the collection {{collection_name}} is created\n\n{{account_to_add}} is able to add code to their own smart contract to handle these notifications. \n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of the collection\'s author.\n\n{{account_to_add}} may not make any transactions throw when receiving a notification. This includes, but is not limited to, purposely blocking certain transfers by making the transaction throw.\n\nIt is the collection author\'s responsibility to enforce that this does not happen.\n</div>',
        },
        {
            name: 'admincoledit',
            type: 'admincoledit',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Extend collections schema\nsummary: \'Extends the schema to serialize collection data by one or more lines\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\nThe following FORMAT lines are added to the schema that is used to serialize collections data:\n{{#each collection_format_extension}}\n    - name: {{this.name}} , type: {{this.type}}\n{{/each}}\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of {{$action.account}}.\n</div>',
        },
        {
            name: 'announcedepo',
            type: 'announcedepo',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Announces a deposit\nsummary: \'{{nowrap owner}} adds the symbol {{nowrap symbol_to_announce}} to his balance table row\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\nThis action is used to add a zero value asset to the quantities vector of the balance row with the owner {{owner}}.\nIf there is no balance row with the owner {{owner}}, a new one is created.\nAdding something to a vector increases the RAM required, therefore this can\'t be done directly in the receipt of the transfer action, so using this action a zero value is added so that the RAM required doesn\'t change when adding the received quantity in the transfer action later.\n\nBy calling this action, {{payer}} pays for the RAM of the balance table row with the owner {{owner}}.\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of {{payer}}.\n</div>',
        },
        {
            name: 'backasset',
            type: 'backasset',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Backs an asset with tokens\nsummary: \'{{nowrap payer}} backs the asset with the ID {{nowrap asset_id}} with {{nowrap token_to_back}}\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\n{{payer}} backs an the asset with the ID {{asset_id}} owned by {{asset_owner}} with {{token_to_back}}.\n{{payer}} must have at least as many tokens in his balance. {{token_to_back}} will be removed from {{payer}}\'s balance.\nThe tokens backed to this asset can be retreived by burning the asset, in which case the owner at the time of the burn will receive the tokens.\n\n{{payer}} pays for the full RAM cost of the asset.\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of {{payer}}.\n</div>',
        },
        {
            name: 'burnasset',
            type: 'burnasset',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Burn an asset\nsummary: \'{{nowrap asset_owner}} burns his asset with the id {{nowrap asset_id}}\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\n{{asset_owner}} burns his asset with the id {{asset_id}}.\n\nIf there previously were core tokens backed for this asset, these core tokens are transferred to {{asset_owner}}.\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of {{asset_owner}}.\n</div>',
        },
        {
            name: 'canceloffer',
            type: 'canceloffer',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Cancel an offer\nsummary: \'The offer with the id {{nowrap offer_id}} is cancelled\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\nThe creator of the offer with the id {{offer_id}} cancels this offer. The offer is deleted from the offers table.\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of the creator of the offer.\n</div>',
        },
        {
            name: 'createcol',
            type: 'createcol',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Create collection\nsummary: \'{{nowrap author}} creates a new collection with the name {{collection_name}}\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\n{{author}} creates a new collection with the name {{collection_name}}.\n\n{{#if authorized_accounts}}The following accounts are added to the authorized_accounts list, allowing them create and edit templates and assets within this collection:\n    {{#each authorized_accounts}}\n        - {{this}}\n    {{/each}}\n{{else}}No accounts are added to the authorized_accounts list.\n{{/if}}\n\n{{#if notify_accounts}}The following accounts are added to the notify_accounts list, which means that they get notified on the blockchain of any actions related to assets and templates of this collection:\n    {{#each notify_accounts}}\n        - {{this}}\n    {{/each}}\n{{else}}No accounts are added to the notify_accounts list.\n{{/if}}\n\n{{#if allow_notify}}It will be possible to add more accounts to the notify_accounts list later.\n{{else}}It will not be possible to add more accounts to the notify_accounts list later.\n{{/if}}\n\nThe market_fee for this collection will be set to {{market_fee}}. 3rd party markets are encouraged to use this value to collect fees for the collection author, but are not required to do so.\n\n{{#if data}}The collections will be initialized with the following data:\n    {{#each data}}\n        - name: {{this.key}} , value: {{this.value}}\n    {{/each}}\n{{else}}The collection will be initialized without any data.\n{{/if}}\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of {{author}}.\n\nCreating collections with the purpose of confusing or taking advantage of others, especially by impersonating other well known brands, personalities or dapps is not allowed.\n\nIf the notify functionality is being used, the notify accounts may not make any transactions throw when receiving the notification. This includes, but is not limited to, purposely blocking certain transfers by making the transaction throw.\n\nIt is the collection author\'s responsibility to enforce that this does not happen.\n</div>',
        },
        {
            name: 'createoffer',
            type: 'createoffer',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Create an offer\nsummary: \'{{nowrap sender}} makes an offer to {{nowrap recipient}}\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\n{{sender}} makes the following offer to {{recipient}}.\n\n{{#if sender_asset_ids}}{{sender}} gives the assets with the following ids:\n    {{#each sender_asset_ids}}\n        - {{this}}\n    {{/each}}\n{{else}}{{sender}} does not give any assets.\n{{/if}}\n\n{{#if recipient_asset_ids}}{{recipient}} gives the assets with the following ids:\n    {{#each recipient_asset_ids}}\n        - {{this}}\n    {{/each}}\n{{else}}{{recipient}} does not give any assets.\n{{/if}}\n\nIf {{recipient}} accepts the offer, the assets will automatically be transferred to the respective sides.\n\n{{#if memo}}There is a memo attached to the offer stating:\n    {{memo}}\n{{else}}No memo is attached to the offer.\n{{/if}}\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of {{sender}}.\n\nCreating offers that do not serve any purpose other than spamming the recipient is not allowed.\n\n{{sender}} must not take advantage of the notification they receive when the offer is accepted or declined in a way that harms {{recipient}}.\n</div>',
        },
        {
            name: 'createschema',
            type: 'createschema',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Create a schema\nsummary: \'{{nowrap authorized_creator}} creates a new schema with the name {{nowrap schema_name}}\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\n{{authorized_creator}} creates a new schema with the name {{schema_name}}. This schema belongs to the collection {{collection_name}}\n\n{{#if schema_format}}The schema will be initialized with the following FORMAT lines that can be used to serialize template and asset data:\n    {{#each schema_format}}\n        - name: {{this.name}} , type: {{this.type}}\n    {{/each}}\n{{else}}The schema will be initialized without any FORMAT lines.\n{{/if}}\n\nOnly authorized accounts of the {{collection_name}} collection will be able to extend the schema by adding additional FORMAT lines in the future, but they will not be able to delete previously added FORMAT lines.\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of {{authorized_creator}}.\n\n{{authorized_creator}} has to be an authorized account in the collection {{collection_name}}.\n\nCreating schemas with the purpose of confusing or taking advantage of others, especially by impersonating other well known brands, personalities or dapps is not allowed.\n</div>',
        },
        {
            name: 'createtempl',
            type: 'createtempl',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Create a template\nsummary: \'{{nowrap authorized_creator}} creates a new template which belongs to the {{nowrap collection_name}} collection and uses the {{nowrap schema_name}} schema\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\n{{authorized_creator}} creates a new template which belongs to the {{collection_name}} collection.\n\nThe schema {{schema_name}} is used for the serialization of the template\'s data.\n\n{{#if transferable}}The assets within this template will be transferable\n{{else}}The assets within this template will not be transferable\n{{/if}}\n\n{{#if burnable}}The assets within this template will be burnable\n{{else}}The assets within this template will not be burnable\n{{/if}}\n\n{{#if max_supply}}A maximum of {{max_supply}} assets can ever be created within this template.\n{{else}}There is no maximum amount of assets that can be created within this template.\n{{/if}}\n\n{{#if immutable_data}}The immutable data of the template is set to:\n    {{#each immutable_data}}\n        - name: {{this.key}} , value: {{this.value}}\n    {{/each}}\n{{else}}No immutable data is set for the template.\n{{/if}}\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of {{authorized_creator}}.\n\n{{authorized_creator}} has to be an authorized account in the collection {{collection_name}}.\n</div>',
        },
        {
            name: 'declineoffer',
            type: 'declineoffer',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Decline an offer\nsummary: \'The offer with the id {{nowrap offer_id}} is declined\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\nThe recipient of the offer with the id {{offer_id}} declines the offer. The offer is deleted from the offers table.\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of the recipient of the offer.\n</div>',
        },
        {
            name: 'extendschema',
            type: 'extendschema',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Extend schema\nsummary: \'Extends the schema {{nowrap schema_name}} by adding one or more FORMAT lines\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\nThe schema {{schema_name}} belonging to the collection {{collection_name}} is extended by adding the following FORMAT lines that can be used to serialize template and asset data:\n{{#each schema_format_extension}}\n    - name: {{this.name}} , type: {{this.type}}\n{{/each}}\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of {{authorized_editor}}.\n\n{{authorized_editor}} has to be an authorized account in the collection {{collection_name}}.\n</div>',
        },
        {
            name: 'forbidnotify',
            type: 'forbidnotify',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Disallow collection notifications\nsummary: \'Sets the allow_notify value of the collection {{nowrap collection_name}} to false\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\nThe allow_notify value of the collection {{collection_name}} is set to false.\nThis means that it will not be possible to add accounts to the notify_accounts list later.\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of the collection\'s author.\n</div>',
        },
        {
            name: 'init',
            type: 'init',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Initialize config tables\nsummary: \'Initialize the tables "config" and "tokenconfig" if they have not been initialized before\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\nInitialize the tables "config" and "tokenconfig" if they have not been initialized before. If they have been initialized before, nothing will happen.\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of {{$action.account}}.\n</div>',
        },
        {
            name: 'locktemplate',
            type: 'locktemplate',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Locks a template\nsummary: \'{{nowrap authorized_editor}} locks the template with the id {{nowrap template_id}} belonging to the collection {{nowrap collection_name}}\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\n{{authorized_editor}} locks the template with the id {{template_id}} belonging to the collection {{collection_name}}.\n\nThis sets the template\'s maximum supply to the template\'s current supply, which means that no more assets referencing this template can be minted.\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of {{authorized_creator}}.\n\n{{authorized_creator}} has to be an authorized account in the collection {{collection_name}}.\n\nThe template\'s issued supply must be greater than 0.\n</div>',
        },
        {
            name: 'logbackasset',
            type: 'logbackasset',
            ricardian_contract: '',
        },
        {
            name: 'logburnasset',
            type: 'logburnasset',
            ricardian_contract: '',
        },
        {
            name: 'logmint',
            type: 'logmint',
            ricardian_contract: '',
        },
        {
            name: 'lognewoffer',
            type: 'lognewoffer',
            ricardian_contract: '',
        },
        {
            name: 'lognewtempl',
            type: 'lognewtempl',
            ricardian_contract: '',
        },
        {
            name: 'logsetdata',
            type: 'logsetdata',
            ricardian_contract: '',
        },
        {
            name: 'logtransfer',
            type: 'logtransfer',
            ricardian_contract: '',
        },
        {
            name: 'mintasset',
            type: 'mintasset',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Mint an asset\nsummary: \'{{nowrap authorized_minter}} mints an asset which will be owned by {{nowrap new_asset_owner}}\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\n{{authorized_minter}} mints an asset of the template which belongs to the {{schema_name}} schema of the {{collection_name}} collection. The asset will be owned by {{new_asset_owner}}.\n\n{{#if immutable_data}}The immutable data of the asset is set to:\n    {{#each immutable_data}}\n        - name: {{this.key}} , value: {{this.value}}\n    {{/each}}\n{{else}}No immutable data is set for the asset.\n{{/if}}\n\n{{#if mutable_data}}The mutable data of the asset is set to:\n    {{#each mutable_data}}\n        - name: {{this.key}} , value: {{this.value}}\n    {{/each}}\n{{else}}No mutable data is set for the asset.\n{{/if}}\n\n{{#if quantities_to_back}}The asset will be backed with the following tokens and {{authorized_minter}} needs to have at least that amount of tokens in their balance:\n    {{#each quantities_to_back}}\n        - {{quantities_to_back}}\n    {{/each}}\n{{/if}}\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of {{authorized_minter}}.\n\n{{authorized_minter}} has to be an authorized account in the collection that the template with the id {{template_id}} belongs to.\n\nMinting assets that contain intellectual property requires the permission of the all rights holders of that intellectual property.\n\nMinting assets with the purpose of confusing or taking advantage of others, especially by impersonating other well known brands, personalities or dapps is not allowed.\n\nMinting assets with the purpose of spamming or otherwise negatively impacing {{new_owner}} is not allowed.\n</div>',
        },
        {
            name: 'payofferram',
            type: 'payofferram',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Pays RAM for existing offer\nsummary: \'{{nowrap payer}} will pay for the RAM cost of the offer {{nowrap offer_id}}\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\n{{payer}} pays for the RAM cost of the offer {{offer_id}}. The offer itself is not modified\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of {{payer}}.\n</div>',
        },
        {
            name: 'remcolauth',
            type: 'remcolauth',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Remove an account\'s authorization in a collection\nsummary: \'Remove the account {{nowrap account_to_remove}} from the authorized_accounts list of the collection {{nowrap collection_name}}\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\nRemoves the account {{account_to_remove}} from the authorized_accounts list of the collection {{collection_name}}.\n\nThis removes {{account_to_remove}}\'s permission to both create and edit templates and assets of this collection.\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of the collection\'s author.\n</div>',
        },
        {
            name: 'remnotifyacc',
            type: 'remnotifyacc',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Remove an account from a collection\'s notfiy list\nsummary: \'Remove the account {{nowrap account_to_remove}} from the notify_accounts list of the collection {{nowrap collection_name}}\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\nRemoves the account {{account_to_remove}} from the notify_accounts list of the collection {{collection_name}}.\n\n{{account_to_remove}} will therefore no longer receive notifications for any of the actions related to the collection {{collection_name}}.\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of the collection\'s author.\n</div>',
        },
        {
            name: 'setassetdata',
            type: 'setassetdata',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Set the mutable data of an asset\nsummary: \'{{nowrap authorized_editor}} sets the mutable data of the asset with the id {{nowrap asset_id}} owned by {{nowrap asset_owner}}\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\n{{#if new_mutable_data}}{{authorized_editor}} sets the mutable data of the asset with the id {{asset_id}} owned by {{nowrap asset_owner}} to the following:\n    {{#each new_mutable_data}}\n        - name: {{this.key}} , value: {{this.value}}\n    {{/each}}\n{{else}}{{authorized_editor}} clears the mutable data of the asset with the id {{asset_id}} owned by {{asset_owner}}.\n{{/if}}\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of {{authorized_editor}}.\n\n{{authorized_editor}} has to be an authorized account in the collection that the asset with the id {{asset_id}} belongs to. (An asset belongs to the collection that the template it is within belongs to)\n</div>',
        },
        {
            name: 'setcoldata',
            type: 'setcoldata',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Set collection data\nsummary: \'Sets the data of the collection {{nowrap collection_name}}\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\n{{#if data}}Sets the data of the collection {{collection_name}} to the following\n    {{#each data}}\n        - name: {{this.key}} , value: {{this.value}}\n    {{/each}}\n{{else}}Clears the data of the collection {{collection_name}}\n{{/if}}\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of the collection\'s author.\n</div>',
        },
        {
            name: 'setmarketfee',
            type: 'setmarketfee',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Set collection market fee\nsummary: \'Sets the market fee of the collection {{nowrap collection_name}}\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\nThe market_fee for the collection {{collection_name}} will be set to {{market_fee}}. 3rd party markets are encouraged to use this value to collect fees for the collection author, but are not required to do so.\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of the collection\'s author.\n</div>',
        },
        {
            name: 'setversion',
            type: 'setversion',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Set tokenconfig version\nsummary: \'Sets the version in the tokenconfigs table to {{nowrap new_version}}\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n<b>Description:</b>\n<div class="description">\nThe version in the tokenconfigs table is set to {{new_version}}.\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of {{$action.account}}.\n</div>',
        },
        {
            name: 'transfer',
            type: 'transfer',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Transfer Assets\nsummary: \'Send one or more assets from {{nowrap from}} to {{nowrap to}}\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\n{{from}} transfers one or more assets with the following ids to {{to}}:\n{{#each asset_ids}}\n    - {{this}}\n{{/each}}\n\n{{#if memo}}There is a memo attached to the transfer stating:\n    {{memo}}\n{{else}}No memo is attached to the transfer.\n{{/if}}\n\nIf {{to}} does not own any assets, {{from}} pays the RAM for the scope of {{to}} in the assets table.\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of {{from}}.\n\nTransfers that do not serve any purpose other than spamming the recipient are not allowed.\n</div>',
        },
        {
            name: 'withdraw',
            type: 'withdraw',
            ricardian_contract:
                '---\nspec_version: "0.2.0"\ntitle: Withdraws fungible tokens\nsummary: \'{{nowrap owner}} withdraws {{token_to_withdraw}} from his balance\'\nicon: https://atomicassets.io/image/logo256.png#108AEE3530F4EB368A4B0C28800894CFBABF46534F48345BF6453090554C52D5\n---\n\n<b>Description:</b>\n<div class="description">\n{{owner}} withdraws {{token_to_withdraw}} that they previously deposited and have not yet spent otherwise.\nThe tokens will be transferred back to {{owner}} and will be deducted from {{owner}}\'s balance.\n</div>\n\n<b>Clauses:</b>\n<div class="clauses">\nThis action may only be called with the permission of {{owner}}.\n</div>',
        },
    ],
    tables: [
        {
            name: 'assets',
            index_type: 'i64',
            key_names: [],
            key_types: [],
            type: 'assets_s',
        },
        {
            name: 'balances',
            index_type: 'i64',
            key_names: [],
            key_types: [],
            type: 'balances_s',
        },
        {
            name: 'collections',
            index_type: 'i64',
            key_names: [],
            key_types: [],
            type: 'collections_s',
        },
        {
            name: 'config',
            index_type: 'i64',
            key_names: [],
            key_types: [],
            type: 'config_s',
        },
        {
            name: 'offers',
            index_type: 'i64',
            key_names: [],
            key_types: [],
            type: 'offers_s',
        },
        {
            name: 'schemas',
            index_type: 'i64',
            key_names: [],
            key_types: [],
            type: 'schemas_s',
        },
        {
            name: 'templates',
            index_type: 'i64',
            key_names: [],
            key_types: [],
            type: 'templates_s',
        },
        {
            name: 'tokenconfigs',
            index_type: 'i64',
            key_names: [],
            key_types: [],
            type: 'tokenconfigs_s',
        },
    ],
    ricardian_clauses: [],
    variants: [
        {
            name: 'variant_int8_int16_int32_int64_uint8_uint16_uint32_uint64_float32_float64_string_INT8_VEC_INT16_VEC_INT32_VEC_INT64_VEC_UINT8_VEC_UINT16_VEC_UINT32_VEC_UINT64_VEC_FLOAT_VEC_DOUBLE_VEC_STRING_VEC',
            types: [
                'int8',
                'int16',
                'int32',
                'int64',
                'uint8',
                'uint16',
                'uint32',
                'uint64',
                'float32',
                'float64',
                'string',
                'INT8_VEC',
                'INT16_VEC',
                'INT32_VEC',
                'INT64_VEC',
                'UINT8_VEC',
                'UINT16_VEC',
                'UINT32_VEC',
                'UINT64_VEC',
                'FLOAT_VEC',
                'DOUBLE_VEC',
                'STRING_VEC',
            ],
        },
    ],
})

@Struct.type('account')
export class account extends Struct {
    @Struct.field('asset')
    declare balance: Asset
}
@Struct.type('close')
export class close extends Struct {
    @Struct.field('name')
    declare owner: Name
    @Struct.field('symbol')
    declare symbol: symbol
}
@Struct.type('create')
export class create extends Struct {
    @Struct.field('name')
    declare issuer: Name
    @Struct.field('asset')
    declare maximum_supply: Asset
}

@Struct.type('currency_stats')
export class currency_stats extends Struct {
    @Struct.field('asset')
    declare supply: Asset
    @Struct.field('asset')
    declare max_supply: Asset
    @Struct.field('name')
    declare issuer: Name
}
