export interface PromptSettings {
    num_ctx?: number;
    temperature?: number;
}

export interface PromptRequest {
    model: string;
    prompt: string;
    options?: PromptSettings;
}

export interface PromptRequestDtoV2 {
    promptRequest: PromptRequest;
    collectionName: string;
}

export interface PromptResponseStreamDto {
    model: string;
    timeCreated: string;
    response: string;
    done: boolean;
}
