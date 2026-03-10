/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PrismaFindArgs {
    where? : Record<string, unknown>;
    include? : Record<string, unknown>;
    select? : Record<string, boolean | Record<string, unknown> >;
    orderBy? : Record<string, unknown> | Record<string, unknown>[];
    skip?: number;
    cursor?: Record<string, unknown>;
    distinct?: string[] | string;
    [key: string]: unknown
}

export interface PrismaCountArgs {
    where? : Record<string, unknown>;
    include? : Record<string, unknown>;
    select? : Record<string, boolean | Record<string, unknown> >;
    orderBy? : Record<string, unknown> | Record<string, unknown>[];
    skip?: number;
    cursor?: Record<string, unknown>;
    distinct?: string[] | string;
    [key: string]: unknown
}

export interface PrismaModelDelegate {
    findmany(args?: any) : Promise<any[]>
    count(args?: any) : Promise<number>
}

export interface IQueryParams {
    searchTerm?: string;
    page?: string;
    limit?: string;
    sortyBy?: string;
    sortOrder?: 'asc' | 'desc';
    fields?: string;
    includes?: string;
    [key: string] : string | undefined
}

export interface IQueryConfig {
    searchableFields?: string[];
    filterableFields?: string[];
}