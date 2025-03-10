// Cairo语法定义
export const cairoLanguageDef = {
    keywords: [
        'fn', 'let', 'mut', 'pub', 'use', 'mod', 'struct', 'enum', 'trait', 'impl',
        'for', 'if', 'else', 'match', 'while', 'loop', 'return', 'break', 'continue',
        'const', 'static', 'type', 'ref', 'move', 'dyn', 'unsafe', 'extern', 'as',
        'felt252', 'u8', 'u16', 'u32', 'u64', 'u128', 'u256', 'u512', 'i8', 'i16', 'i32', 'i64', 'i128',
        'bool', 'true', 'false'
    ],
    typeKeywords: [
        'Array', 'Option', 'Result', 'String', 'Vec'
    ],
    operators: [
        '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
        '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
        '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
        '%=', '<<=', '>>=', '>>>='
    ],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    tokenizer: {
        root: [
            [/[a-z_$][\w$]*/, {
                cases: {
                    '@typeKeywords': 'keyword',
                    '@keywords': 'keyword',
                    '@default': 'identifier'
                }
            }],
            [/[A-Z][\w\$]*/, 'type.identifier'],
            { include: '@whitespace' },
            [/[{}()\[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            [/@symbols/, {
                cases: {
                    '@operators': 'operator',
                    '@default': ''
                }
            }],
            [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/0[xX][0-9a-fA-F]+/, 'number.hex'],
            [/\d+/, 'number'],
            [/[;,.]/, 'delimiter'],
            [/"([^"\\]|\\.)*$/, 'string.invalid'],
            [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
            [/'[^\\']'/, 'string'],
            [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
            [/'/, 'string.invalid']
        ],
        comment: [
            [/[^\/*]+/, 'comment'],
            [/\/\*/, 'comment', '@push'],
            ["\\*/", 'comment', '@pop'],
            [/[\/*]/, 'comment']
        ],
        string: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
        ],
        whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment'],
        ],
    },
};

// Cairo主题定义
export const cairoTheme = {
    base: 'vs-dark',
    inherit: true,
    rules: [
        { token: 'keyword', foreground: '569CD6' },
        { token: 'type.identifier', foreground: '4EC9B0' },
        { token: 'identifier', foreground: '9CDCFE' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'comment', foreground: '6A9955' },
    ],
    colors: {
        'editor.foreground': '#D4D4D4',
        'editor.background': '#1E1E1E',
        'editorCursor.foreground': '#FFFFFF',
        'editor.lineHighlightBackground': '#2D2D30',
        'editorLineNumber.foreground': '#858585',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
    }
};

export const cairoSnippets = {
    "Use starknet": {
        "prefix": ["starknet", "use"],
        "body": ["use starknet::"],
        "description": "Creates use starknet:: import"
    },
    "Creates const": {
        "prefix": ["const", "cst"],
        "body": ["const $1:${2|felt252, u128, u64, u32, u16, u8, bool|} = $3;"],
        "description": "Creates a constant"
    },
    "Creates a dispatcher": {
        "prefix": ["dispatcher", "I"],
        "body": ["let result = I$1Dispatcher { contract_address: $2 }"],
        "description": "Creates a dispatcher"
    },
    "Creates a constructor": {
        "prefix": ["const", "constructor"],
        "body": ["#[constructor]", "fn constructor(ref self: ContractState) {", "\t$1", "}"],
        "description": "Creates an empty constructor"
    },
    "Creates an empty array variable": {
        "prefix": "array",
        "body": ["let mut ${1:arr} = array![$2];"],
        "description": "Creates an empty array variable"
    },
    "Creates an empty array": {
        "prefix": "array",
        "body": ["array![]"],
        "description": "Creates an empty array"
    },
    "Creates storage": {
        "prefix": "storage",
        "body": ["#[storage]", "struct Storage {", "\t$1: ${2},", "}"],
        "description": "Creates the storage struct"
    },
    "Creates a struct": {
        "prefix": "struct",
        "body": ["struct $1 {", "\t$2: ${3},", "}"],
        "description": "Creates a struct"
    },
    "Creates the contract's event set": {
        "prefix": "event",
        "body": ["#[event]", "#[derive(Drop, starknet::Event)]", "enum Event {", "\t$2: $2,", "}"],
        "description": "Creates the contract's event set"
    },
    "Creates an event": {
        "prefix": "event",
        "body": ["#[derive(Drop, starknet::Event)]", "struct $1 {", "\t$2: ${3},", "}"],
        "description": "Creates an event"
    },
    "Creates a function": {
        "prefix": "fn",
        "body": ["fn $1($2: ${3}) -> ${4} {", "\t$5", "}"],
        "description": "Creates a function"
    },
    "Creates an external function": {
        "prefix": ["external, fn"],
        "body": ["fn $1(ref self: ContractState, ) {", "\t$5", "}"],
        "description": "Creates an external function"
    },
    "Creates an interface": {
        "prefix": ["interface, abi"],
        "body": ["#[starknet::interface]", "trait $1<TContractState> {", "\t$2", "}"],
        "description": "Creates a starknet interface"
    },
    "Creates a view function": {
        "prefix": ["view", "fn"],
        "body": ["fn $1(self: @ContractState, ) {", "\t$5", "}"],
        "description": "Creates a view function"
    },
    "Match": {
        "prefix": ["match"],
        "body": ["match $1 {", "\t$2 => {", "\t\t$4", "\t},", "\t$3 => {", "\t\t$5", "\t},", "}"],
        "description": "Match statement"
    },
    "Match pop_front": {
        "prefix": ["match", "pop_front"],
        "body": [
            "match arr.pop_front() {",
            "\tOption::Some($1) => {",
            "\t\t$2",
            "\t},",
            "\tOption::None => {",
            "\t\t$3",
            "\t},",
            "}"
        ],
        "description": "Match pop_front"
    },
    "Creates a trait": {
        "prefix": "trait",
        "body": ["trait $1<T> {", "\tfn $2($3: ${4}) -> ${5};", "}"],
        "description": "Creates a trait"
    },

    "Creates a ContractState trait": {
        "prefix": ["trait", "ContractState", "TContractState"],
        "body": [
            "trait $1<TContractState> {",
            "\tfn $2(ref self: TContractState, $3: ${4}) -> ${5};",
            "\tfn $6(self: @TContractState, $7: ${8}) -> ${9};",
            "}"
        ],
        "description": "Creates a trait for ContractState"
    },
    "Impl a trait": {
        "prefix": "impl",
        "body": ["impl $1<T> {", "\tfn $2($3: ${4}) -> ${5} {", "\t\t$6", "\t}", "}"],
        "description": "Creates a trait"
    },
    "Impl a starknet interface trait": {
        "prefix": ["impl", "external"],
        "body": ["#[abi(embed_v0)]", "impl $1 of $2<ContractState>{", "\t$3", "}"],
        "description": "Impl a starknet interface trait"
    },
    "Generate Trait": {
        "prefix": "generate_trait",
        "body": ["#[generate_trait]", "impl Private of PrivateTrait {", "\t$1", "}"],
        "description": "Create a generate trait impl"
    },
    "Creates an Enum object": {
        "prefix": "enum",
        "body": ["#[derive(Copy, Drop, $1)]", "enum $2 {", "\t$3: ${4},", "}"],
        "description": "Creates an enum with default derive"
    },
    "Creates a test": {
        "prefix": "test",
        "body": ["#[test]", "fn $1() {", "\t$2", "\tassert($3, '$4');", "}"],
        "description": "Creates an simple test"
    },
    "Creates a test that should panic": {
        "prefix": ["panic", "test", "should panic"],
        "body": [
            "#[test]",
            "#[should_panic(expected: ('$1', ))]",
            "fn $2() {",
            "\t$3",
            "\tassert($4, '$5');",
            "}"
        ],
        "description": "Creates a test that should panic"
    },
    "Creates an assertion": {
        "prefix": "assert",
        "body": ["assert($1, '$2');"],
        "description": "Creates an assertion"
    },
    "Creates a default contract": {
        "prefix": "contract",
        "body": [
            "#[starknet::contract]",
            "mod $1 {",
            "\t#[storage]",
            "\tstruct Storage {",
            "\t}",
            "\t#[event]",
            "\t#[derive(Drop, starknet::Event)]",
            "\tenum Event {",
            "\t}",
            "",
            "}",
            ""
        ],
        "description": "Creates a default contract"
    },
    "Creates an assertion with macro": {
        "prefix": "assert!",
        "body": ["assert!($1);"],
        "description": "Creates an assert! macro"
    },
    "Creates an equality assertion with macro": {
        "prefix": "assert_eq!",
        "body": ["assert_eq!($1, $2);"],
        "description": "Creates an inline macro for asserting equality"
    },
    "Creates an not-equality assertion with macro": {
        "prefix": "assert_ne!",
        "body": ["assert_ne!($1, $2);"],
        "description": "Creates an inline macro for asserting non-equality"
    },
    "Creates a less-than comparison assertion with macro": {
        "prefix": "assert_lt!",
        "body": ["assert_lt!($1, $2);"],
        "description": "Creates an inline macro for asserting less-than"
    },
    "Creates a less-than-or-equal comparison assertion with macro": {
        "prefix": "assert_le!",
        "body": ["assert_le!($1, $2);"],
        "description": "Creates an inline macro for asserting less-than-or-equal"
    },
    "Creates a greater-than comparison assertion with macro": {
        "prefix": "assert_gt!",
        "body": ["assert_gt!($1, $2);"],
        "description": "Creates an inline macro for asserting greater-than"
    },
    "Creates a greater-than-or-equal comparison assertion with macro": {
        "prefix": "assert_ge!",
        "body": ["assert_ge!($1, $2);"],
        "description": "Creates an inline macro for asserting greater-than-or-equal"
    },
    "Creates panic": {
        "prefix": "panic!",
        "body": ["panic!(\"$1\");"],
        "description": "Creates a panic! macro"
    },
    "Creates a String using interpolation of expressions": {
        "prefix": "format!",
        "body": ["format!(\"$1\");"],
        "description": "Creates a String using interpolation of expressions"
    },
    "Constant evaluation": {
        "prefix": "consteval_int!",
        "body": ["consteval_int!($1);"],
        "description": "Constant evaluation"
    },
    "Print the selected item with marco": {
        "prefix": "print!",
        "body": ["print!(\"$1\");"],
        "description": "Print the selected item"
    },
    "Print the selected item with a newline": {
        "prefix": "println!",
        "body": ["println!(\"$1\");"],
        "description": "Print the selected item with a newline"
    },
    "Writes formatted data into a buffer": {
        "prefix": "write!",
        "body": ["write!($1, \"$2\");"],
        "description": "Writes formatted data into a buffer"
    },
    "Write formatted data into a buffer, with a newline appended": {
        "prefix": "writeln!",
        "body": ["writeln!($1, \"$2\");"],
        "description": "Write formatted data into a buffer, with a newline appended"
    },
    "Creates a selector": {
        "prefix": "selector!",
        "body": ["selector!(\"$1\");"],
        "description": "Creates a selector"
    },
    "Declares a component usage": {
        "prefix": "component!",
        "body": ["component!(path: $1, storage: $2, event: $3);"],
        "description": "Declares a component usage"
    },
    "Get a component": {
        "prefix": "get_dep_component!",
        "body": ["get_dep_component!($1, $2);"],
        "description": "Get a component"
    },
    "Get a mutable component": {
        "prefix": "get_dep_component_mut!",
        "body": ["get_dep_component_mut!(ref $1, $2);"],
        "description": "Get a mutable component"
    }
}