declare type Arg<T = any> = {
    [K in keyof T]?: any;
} & Record<string, any>;
declare type ArrayOperators<T = any> = {
    $arrInc?: {
        [K in keyof T]?: T[K] extends any[] ? T[K][number][] : T[K][];
    };
    $arrIncAll?: {
        [K in keyof T]?: T[K] extends any[] ? T[K][number][] : T[K][];
    };
    $size?: NestedValue<T, number>;
};
declare type ArrayUpdater<T = any> = {
    $push?: NestedValue<T, any>;
    $pushSet?: NestedValue<T, any>;
    $pushAll?: NestedValue<T, any>;
    $pull?: NestedValue<T, any>;
    $pullAll?: NestedValue<T, any>;
};
declare class Collection<D = Data> {
    db: ValtheraCompatible;
    collection: string;
    constructor(db: ValtheraCompatible, collection: string);
    add(data: Arg<D>, id_gen: false): Promise<D>;
    add(data: Arg<D>, id_gen?: true): Promise<D & {
        _id: string;
    }>;
    find(search?: Search<D>, options?: DbFindOpts<D>, findOpts?: FindOpts<D>, context?: VContext): Promise<D[]>;
    findOne(search?: Search<D>, findOpts?: FindOpts<D>, context?: VContext): Promise<D>;
    update(search: Search<D>, updater: Updater<D>, context?: VContext): Promise<D[]>;
    updateOne(search: Search<D>, updater: Updater<D>, context?: VContext): Promise<D | null>;
    remove(search: Search<D>, context?: VContext): Promise<D[]>;
    removeOne(search: Search<D>, context?: VContext): Promise<D | null>;
    updateOneOrAdd(search: Search<D>, updater: Updater<D>, { add_arg, context, id_gen }?: UpdateOneOrAdd<D>): Promise<VQueryT.UpdateOneOrAddResult<D>>;
    toggleOne(search: Search<D>, data?: Arg<D>, context?: VContext): Promise<VQueryT.ToggleOneResult<D>>;
    createIndex(fields: string[], opts?: IndexOpts): Promise<void>;
}
declare type ComparisonOperators<T = any> = {
    $ne?: NestedValue<T, any>;
    $gt?: NestedValue<T, number, number>;
    $lt?: NestedValue<T, number, number>;
    $gte?: NestedValue<T, number, number>;
    $lte?: NestedValue<T, number, number>;
    $between?: NestedValue<T, [
        number,
        number
    ], number>;
    $in?: {
        [K in keyof T]?: T[K] extends any[] ? T[K] : T[K][];
    };
    $nin?: {
        [K in keyof T]?: T[K] extends any[] ? T[K] : T[K][];
    };
    $idGt?: NestedValue<T, string | number, string | number>;
    $idLt?: NestedValue<T, string | number, string | number>;
    $idGte?: NestedValue<T, string | number, string | number>;
    $idLte?: NestedValue<T, string | number, string | number>;
};
declare interface Data {
    [key: string]: any;
}
declare interface DbFindOpts<T = any> {
    reverse?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: KeysMatching<T, any> | {
        field: KeysMatching<T, any>;
        asc?: boolean;
    }[];
    sortAsc?: boolean;
    min?: Record<string, KeysMatching<T, number>>;
    max?: Record<string, KeysMatching<T, number>>;
    avg?: Record<string, KeysMatching<T, number>>;
    sum?: Record<string, KeysMatching<T, number>>;
    distinct?: KeysMatching<T, any>;
    groupBy?: KeysMatching<T, any> | KeysMatching<T, any>[];
    count?: Record<string, string>;
}
declare type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
declare type FieldPath<T = any> = KeysMatching<T, any> | (string & {}) | string[];
declare interface FindOpts<T = any> {
    select?: FieldPath<T>[];
    exclude?: FieldPath<T>[];
    transform?: Function;
}
declare interface IndexDefinition {
    collection: string;
    fields: string[];
    opts?: IndexOpts;
}
declare interface IndexOpts {
    unique?: boolean;
    name?: string;
}
declare type JSPrimitiveType = "string" | "number" | "boolean" | "bigint" | "symbol" | "undefined" | "function" | "object";
declare type KeysMatching<T, V, C = V> = {
    [K in keyof T]-?: T[K] extends C ? K : never;
}[keyof T];
declare type LogicalOperators<T = any> = {
    $and?: Array<SearchOptions<T>>;
    $or?: Array<SearchOptions<T>>;
    $not?: SearchOptions<T>;
};
declare type NestedValue<T, V, C = V> = {
    [K in keyof T as T[K] extends C ? K : T[K] extends object ? K : never]?: T[K] extends C ? V : T[K] extends object ? NestedValue<T[K], V, C> : never;
};
declare type ObjectUpdater<T = any> = {
    $merge?: NestedValue<T, any>;
    $deepMerge?: NestedValue<T, any>;
};
declare type OtherOperators<T = any> = {
    $subset?: DeepPartial<T>;
};
declare type PredefinedSearchOperators<T = any> = LogicalOperators<T> & ComparisonOperators<T> & TypeAndExistenceOperators<T> & ArrayOperators<T> & StringOperators<T> & OtherOperators<T>;
declare namespace RelationTypes {
    type Path = [
        string,
        string
    ];
    type FieldPath = string[];
    interface DBS {
        [key: string]: ValtheraCompatible;
    }
    interface Relation {
        [key: string]: RelationConfig;
    }
    interface RelationConfig {
        path: Path;
        pk?: string;
        fk?: string;
        as?: string;
        select?: string[];
        dbFindOpts?: DbFindOpts;
        type?: "1" | "11" | "1n" | "nm" | "n1";
        relations?: Relation;
        through?: {
            table: string;
            db?: string;
            pk: string;
            fk: string;
        };
    }
}
declare type Search<T = any, AllowFn extends boolean = true> = AllowFn extends true ? SearchOptions<T> | SearchFunc<T> : SearchOptions<T>;
declare type SearchFunc<T = any> = (data: T, context: VContext) => boolean;
declare type SearchOptions<T = any> = PredefinedSearchOperators<T> & DeepPartial<T> & Record<string, any>;
declare type StringOperators<T = any> = {
    $regex?: NestedValue<T, RegExp | string, string>;
    $startsWith?: NestedValue<T, string, string>;
    $endsWith?: NestedValue<T, string, string>;
    $iStartsWith?: NestedValue<T, string, string>;
    $iEndsWith?: NestedValue<T, string, string>;
};
declare interface TransactionHandle {
    id: string;
    _adapterData?: unknown;
}
declare type TypeAndExistenceOperators<T = any> = {
    $exists?: NestedValue<T, boolean, any>;
    $type?: NestedValue<T, JSPrimitiveType, any>;
};
declare interface UpdateOneOrAdd<T> {
    add_arg?: Arg<T>;
    id_gen?: boolean;
    context?: VContext;
}
declare type Updater<T = any, AllowFn extends boolean = true> = AllowFn extends true ? UpdaterArg<T> | UpdaterFunc<T> : UpdaterArg<T>;
declare type UpdaterArg<T = any> = ArrayUpdater<T> & ObjectUpdater<T> & ValueUpdater<T> & DeepPartial<T> & Record<string, any>;
declare type UpdaterFunc<T = any> = (data: T, context: VContext) => Data | void;
declare interface ValtheraCompatible {
    c<T = Data>(collection: string): Collection<T>;
    getCollections(): Promise<string[]>;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    add<T = Data>(query: VQueryT.Add<T>): Promise<T>;
    find<T = Data>(query: VQueryT.Find<T>): Promise<T[]>;
    findOne<T = Data>(query: VQueryT.FindOne<T>): Promise<T | null>;
    update<T = Data>(query: VQueryT.Update<T>): Promise<T[]>;
    updateOne<T = Data>(query: VQueryT.Update<T>): Promise<T | null>;
    remove<T = Data>(query: VQueryT.Remove<T>): Promise<T[]>;
    removeOne<T = Data>(query: VQueryT.Remove<T>): Promise<T | null>;
    removeCollection(collection: string): Promise<boolean>;
    updateOneOrAdd<T = Data>(query: VQueryT.UpdateOneOrAdd<T>): Promise<VQueryT.UpdateOneOrAddResult<T>>;
    toggleOne<T = Data>(query: VQueryT.ToggleOne<T>): Promise<VQueryT.ToggleOneResult<T>>;
    createIndex(collection: string, fields: string[], opts?: IndexOpts): Promise<void>;
}
declare type ValueUpdater<T = any> = {
    $inc?: NestedValue<T, number>;
    $dec?: NestedValue<T, number>;
    $unset?: NestedValue<T, any>;
    $rename?: NestedValue<T, any>;
    $set?: NestedValue<T, any>;
};
declare interface VContext {
    [key: string]: any;
}
export declare type VQL_Fields = Record<string, boolean | number> | string[];
export declare interface VQL_OP_Add<T = any> {
    collection: string;
    data?: Arg<T>;
    id_gen?: boolean;
}
export declare interface VQL_OP_CollectionOperation {
    collection: string;
}
export declare interface VQL_OP_Find<T = any> {
    collection: string;
    search?: Search<T>;
    limit?: number;
    select?: VQL_Fields;
    options?: DbFindOpts<T>;
    searchOpts?: FindOpts<T>;
}
export declare interface VQL_OP_FindOne<T = any> {
    collection: string;
    search: Search<T>;
    select?: VQL_Fields;
    searchOpts?: FindOpts<T>;
}
export declare interface VQL_OP_Remove<T = any> {
    collection: string;
    search: Search<T>;
    select?: VQL_Fields;
}
export declare interface VQL_OP_ToggleOne<T = any> {
    collection: string;
    search: Search<T>;
    data?: Arg<T>;
    select?: VQL_Fields;
}
export declare interface VQL_OP_Update<T = any> {
    collection: string;
    search: Search<T>;
    updater: UpdaterArg<T>;
    select?: VQL_Fields;
}
export declare interface VQL_OP_UpdateOneOrAdd<T = any> {
    collection: string;
    search: Search<T>;
    updater: UpdaterArg<T>;
    add_arg?: Arg<T>;
    id_gen?: boolean;
    select?: VQL_Fields;
}
export declare type VQL_Query<T = any> = (VQL_Query_CRUD<T> | VQL_Query_Relation) & VQL_Var;
export declare interface VQL_Query_CRUD<T = any> {
    db: string;
    d: VQL_Query_CRUD_Data<T>;
}
export declare type VQL_Query_CRUD_Data<T = any> = {
    find: VQL_OP_Find<T>;
} | {
    findOne: VQL_OP_FindOne<T>;
} | {
    f: VQL_OP_FindOne<T>;
} | {
    add: VQL_OP_Add<T>;
} | {
    update: VQL_OP_Update<T>;
} | {
    updateOne: VQL_OP_Update<T>;
} | {
    remove: VQL_OP_Remove<T>;
} | {
    removeOne: VQL_OP_Remove<T>;
} | {
    updateOneOrAdd: VQL_OP_UpdateOneOrAdd<T>;
} | {
    toggleOne: VQL_OP_ToggleOne<T>;
} | {
    removeCollection: VQL_OP_CollectionOperation;
} | {
    ensureCollection: VQL_OP_CollectionOperation;
} | {
    issetCollection: VQL_OP_CollectionOperation;
} | {
    getCollections: {};
};
export declare type VQL_Query_CRUD_Keys = VQL_Query_CRUD_Data extends infer U ? U extends Record<string, unknown> ? keyof U : never : never;
export declare interface VQL_Query_Relation {
    r: {
        path: RelationTypes.Path;
        search: Search;
        relations: RelationTypes.Relation;
        many?: boolean;
        options?: DbFindOpts;
        select?: RelationTypes.FieldPath[] | Record<string, any>;
    };
}
export declare interface VQL_Var {
    var?: {
        [k: string]: any;
    };
}
export declare interface VQLError {
    err: true;
    msg: string;
    c: number;
}
export declare type VQLUQ<T = any> = VQL_Query<T> | string | ({
    query: string;
} & VQL_Var);
export declare interface VQuery<T = Data, AllowFn extends boolean = true> {
    collection?: string;
    search?: Search<T, AllowFn>;
    context?: VContext;
    dbFindOpts?: DbFindOpts<T>;
    findOpts?: FindOpts<T>;
    data?: Arg<T>;
    id_gen?: boolean;
    add_arg?: Arg<T>;
    updater?: Updater<T, AllowFn>;
    control?: VQuery_Control;
    transaction?: TransactionHandle;
    index?: IndexDefinition;
}
export declare interface VQuery_Control {
}
export declare namespace VQueryT {
    type QueryBase<T = Data> = {
        collection: string;
        control?: VQuery_Control;
        transaction?: TransactionHandle;
    };
    type Add<T = Data> = QueryBase<T> & {
        data: Arg<T>;
        id_gen?: boolean;
    };
    type Find<T = Data, AllowFn extends boolean = true> = QueryBase<T> & {
        search?: Search<T, AllowFn>;
        findOpts?: FindOpts<T>;
        dbFindOpts?: DbFindOpts<T>;
        context?: VContext;
    };
    type FindOne<T = Data, AllowFn extends boolean = true> = QueryBase<T> & {
        search: Search<T, AllowFn>;
        findOpts?: FindOpts<T>;
        context?: VContext;
    };
    type Update<T = Data, AllowFn extends boolean = true> = QueryBase<T> & {
        search: Search<T, AllowFn>;
        updater: Updater<T, AllowFn>;
        context?: VContext;
    };
    type Remove<T = Data, AllowFn extends boolean = true> = QueryBase<T> & {
        search: Search<T, AllowFn>;
        context?: VContext;
    };
    type UpdateOneOrAdd<T = Data, AllowFn extends boolean = true> = QueryBase<T> & {
        search: Search<T, AllowFn>;
        updater: Updater<T, AllowFn>;
        add_arg?: Arg<T>;
        id_gen?: boolean;
        context?: VContext;
    };
    type ToggleOne<T = Data, AllowFn extends boolean = true> = QueryBase<T> & {
        search: Search<T, AllowFn>;
        data: Arg<T>;
        context?: VContext;
    };
    interface UpdateOneOrAddResult<T> {
        data: T;
        type: "added" | "updated";
    }
    interface ToggleOneResult<T> {
        data: T;
        type: "added" | "removed";
    }
    type CreateIndex<T = Data> = QueryBase<T> & {
        index: IndexDefinition;
    };
}
export {};
