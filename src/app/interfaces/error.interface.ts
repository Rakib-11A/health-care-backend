
export interface TErrorSources {
    path: string;
    message: string;
}

export interface TErrorResponse {
    statusCode?: string;
    success: boolean;
    message: string;
    errorSources: TErrorSources[],
    error?: unknown
}
