export interface Data {
    [key: string]: any;
}
export interface Context {
    [key: string]: any;
}
export type Id = string;
export type LogicalOperators = {
    $and?: Array<SearchOptions>;
    $or?: Array<SearchOptions>;
    $not?: SearchOptions;
};
export type ComparisonOperators = {
    $gt?: Record<string, number>;
    $lt?: Record<string, number>;
    $gte?: Record<string, number>;
    $lte?: Record<string, number>;
    $in?: Record<string, any[]>;
    $nin?: Record<string, any[]>;
    $between?: Record<string, [
        number,
        number
    ]>;
};
export type TypeAndExistenceOperators = {
    $exists?: Record<string, boolean>;
    $type?: Record<string, string>;
};
export type ArrayOperators = {
    $arrinc?: Record<string, any[]>;
    $arrincall?: Record<string, any[]>;
    $size?: Record<string, number>;
};
export type StringOperators = {
    $regex?: Record<string, RegExp>;
    $startsWith?: Record<string, string>;
    $endsWith?: Record<string, string>;
};
export type OtherOperators = {
    $subset?: Record<string, any>;
};
export type PredefinedSearchOperators = LogicalOperators & ComparisonOperators & TypeAndExistenceOperators & ArrayOperators & StringOperators & OtherOperators;
export type SearchOptions = PredefinedSearchOperators & Arg;
export type ArrayUpdater = {
    $push?: any;
    $pushset?: any;
    $pull?: any;
    $pullall?: any;
};
export type ObjectUpdater = {
    $merge?: any;
};
export type ValueUpdater = {
    $set?: any;
    $inc?: any;
    $dec?: any;
    $unset?: any;
    $rename?: any;
};
export type UpdaterArg = ArrayUpdater & ObjectUpdater & ValueUpdater & {
    [key: string]: any;
};
export interface Arg {
    _id?: Id;
    [key: string]: any;
}
export type SearchFunc<T = any> = (data: T, context: Context) => boolean;
export type UpdaterFunc<T = any> = (data: T, context: Context) => boolean;
export type Search<T = any> = SearchOptions | SearchFunc<T>;
export type Updater<T = any> = UpdaterArg | UpdaterArg[] | UpdaterFunc<T>;
export interface DbFindOpts {
    reverse?: boolean;
    max?: number;
}
export interface FindOpts {
    select?: string[];
    exclude?: string[];
    transform?: Function;
}
export interface Transaction {
    type: "update" | "updateOne" | "updateOneOrAdd" | "remove" | "removeOne";
    search: Search;
    updater?: Updater;
    addArg?: Arg;
    idGen?: boolean;
    context?: Context;
}
export interface ValtheraCompatible {
    c(collection: string): CollectionManager;
    getCollections(): Promise<string[]>;
    checkCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    add<T = Data>(collection: string, data: Arg, id_gen?: boolean): Promise<T>;
    find<T = Data>(collection: string, search: Search, context?: Context, options?: DbFindOpts, findOpts?: FindOpts): Promise<T[]>;
    findOne<T = Data>(collection: string, search: Search, context?: Context, findOpts?: FindOpts): Promise<T | null>;
    findStream<T = Data>(collection: string, search: Search, context?: Context, findOpts?: FindOpts, limit?: number): Promise<AsyncGenerator<T>>;
    update(collection: string, search: Search, updater: Updater, context?: Context): Promise<boolean>;
    updateOne(collection: string, search: Search, updater: Updater, context?: Context): Promise<boolean>;
    remove(collection: string, search: Search, context?: Context): Promise<boolean>;
    removeOne(collection: string, search: Search, context?: Context): Promise<boolean>;
    removeCollection(collection: string): Promise<boolean>;
    transaction(collection: string, transaction: Transaction[]): Promise<boolean>;
    updateOneOrAdd(collection: string, search: Search, updater: Updater, add_arg?: Arg, context?: Context, id_gen?: boolean): Promise<boolean>;
}
declare class CollectionManager {
    private db;
    private collection;
    constructor(db: ValtheraCompatible, collection: string);
    add<T = Data>(data: Arg, id_gen?: boolean): Promise<T>;
    find<T = Data>(search: Search, context?: Context, options?: DbFindOpts, findOpts?: FindOpts): Promise<T[]>;
    findOne<T = Data>(search: Search, context?: Context, findOpts?: FindOpts): Promise<T>;
    findStream<T = Data>(search: Search, context?: Context, findOpts?: FindOpts, limit?: number): AsyncGenerator<T>;
    update(search: Search, updater: Updater, context?: Context): Promise<boolean>;
    updateOne(search: Search, updater: Updater, context?: Context): Promise<boolean>;
    remove(search: Search, context?: Context): Promise<boolean>;
    removeOne(search: Search, context?: Context): Promise<boolean>;
    updateOneOrAdd(search: Search, updater: Updater, add_arg?: Arg, context?: Context, id_gen?: boolean): Promise<boolean>;
}
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
        findOpts?: DbFindOpts;
        type?: "1" | "11" | "1n" | "nm";
        relations?: Relation;
        through?: {
            table: string;
            db?: string;
            pk: string;
            fk: string;
        };
    }
}
export type VQLQuery = {
    find: VQLFind;
    findOne: VQLFindOne;
    f: VQLFindOne;
    add: VQLAdd;
    update: VQLUpdate;
    updateOne: VQLUpdateOne;
    remove: VQLRemove;
    removeOne: VQLRemoveOne;
    updateOneOrAdd: VQLUpdateOneOrAdd;
    removeCollection: VQLCollectionOperation;
    checkCollection: VQLCollectionOperation;
    issetCollection: VQLCollectionOperation;
    getCollections: {};
};
export type VQLQueryData = {
    find: VQLFind;
} | {
    findOne: VQLFindOne;
} | {
    f: VQLFindOne;
} | {
    add: VQLAdd;
} | {
    update: VQLUpdate;
} | {
    updateOne: VQLUpdateOne;
} | {
    remove: VQLRemove;
} | {
    removeOne: VQLRemoveOne;
} | {
    updateOneOrAdd: VQLUpdateOneOrAdd;
} | {
    removeCollection: VQLCollectionOperation;
} | {
    checkCollection: VQLCollectionOperation;
} | {
    issetCollection: VQLCollectionOperation;
} | {
    getCollections: {};
};
export interface VQLRequest {
    db: string;
    d: VQLQueryData;
}
export interface VQLFind {
    collection: string;
    search?: Search;
    limit?: number;
    fields?: VQLFields;
    select?: VQLFields;
    relations?: VQLRelations;
    options?: DbFindOpts;
    searchOpts?: FindOpts;
}
export interface VQLFindOne {
    collection: string;
    search: Search;
    fields?: VQLFields;
    select?: VQLFields;
    relations?: VQLRelations;
    searchOpts?: FindOpts;
}
export interface VQLAdd {
    collection: string;
    data: Arg;
    id_gen?: boolean;
}
export interface VQLUpdate {
    collection: string;
    search: Search;
    updater: UpdaterArg;
}
export interface VQLUpdateOne {
    collection: string;
    search: Search;
    updater: UpdaterArg;
}
export interface VQLRemove {
    collection: string;
    search: Search;
}
export interface VQLRemoveOne {
    collection: string;
    search: Search;
}
export interface VQLUpdateOneOrAdd {
    collection: string;
    search: Search;
    updater: UpdaterArg;
    add_arg?: Arg;
    id_gen?: boolean;
}
export interface VQLCollectionOperation {
    collection: string;
}
export type VQLFields = Record<string, boolean | number> | string[];
export type VQLRelations = Record<string, VQLFind | VQLFindOne>;
export interface RelationQuery {
    r: {
        path: RelationTypes.Path;
        search: Search;
        relations: RelationTypes.Relation;
        many?: boolean;
        options?: DbFindOpts;
        select?: RelationTypes.FieldPath[];
    };
}
export interface VQLRef {
    ref?: string;
    var?: {
        [k: string]: any;
    };
}
export type VQLRefRequired = VQLRef & Required<Pick<VQLRef, "ref">>;
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type VQL = (VQLRequest | RelationQuery) & VQLRef;
export type VQLR = VQL | (DeepPartial<VQL> & VQLRefRequired) | VQLRefRequired;
export interface VQLError {
    err: true;
    msg: string;
    c: number;
    why?: string;
}
export type VqlQueryRaw = VQLR | string | {
    query: string;
} & VQLRef;
export {};
