export interface FindReplaceInputs {
    source: string;
    find: string;
    replace: string;
    replaceAll: boolean;
}
export declare function validateSubscription(): Promise<void>;
export declare function getInputs(): FindReplaceInputs;
export declare function performFindReplace(inputs: FindReplaceInputs): string;
export declare function main(): Promise<void>;
