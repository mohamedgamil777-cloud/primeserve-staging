export const errorMsgs = {
    NotAuthenticated:"Not Authenticated",
    NotAuthorized:"You are Not Authorized to do this action.",
    NotFound:"Not Found",
}

export class IntentionalError extends Error {
    public readonly isIntentional = true;

    constructor(message: string) {
        super(message);
        this.name = "IntentionalError";
    }
}