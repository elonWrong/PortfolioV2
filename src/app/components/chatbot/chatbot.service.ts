import { Injectable } from '@angular/core';
import { PromptRequestDtoV2, PromptResponseStreamDto } from './chatbot.models';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatbotService {
    private readonly apiUrl = 'http://swannyapi.elonwong.com/api/v2/swanni/ragGeneration';

    sendMessageStream(prompt: string): Observable<string> {
        const request: PromptRequestDtoV2 = {
            promptRequest: {
                model: 'LLAMA31',
                prompt: prompt,
                options: {
                    temperature: 0.8,
                    num_ctx: 4096
                }
            },
            collectionName: 'BELIMO'
        };

        return new Observable<string>(subscriber => {
            console.log('Sending request to', this.apiUrl, request);
            fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            })
                .then(response => {
                    console.log('Response received:', response.status, response.statusText);
                    if (!response.ok) {
                        if (response.status === 404) {
                            subscriber.error('Endpoint not found (404). Please check the server.');
                        } else {
                            subscriber.error(`Server error: ${response.status} ${response.statusText}`);
                        }
                        return;
                    }

                    const reader = response.body?.getReader();
                    if (!reader) {
                        subscriber.error('ReadableStream not supported.');
                        return;
                    }

                    const decoder = new TextDecoder();
                    let buffer = '';

                    async function read() {
                        try {
                            const { done, value } = await reader!.read();
                            if (done) {
                                if (buffer.trim()) {
                                    parseLine(buffer);
                                }
                                console.log('Stream done');
                                subscriber.complete();
                                return;
                            }

                            buffer += decoder.decode(value, { stream: true });
                            const lines = buffer.split('\n');
                            buffer = lines.pop() || '';

                            for (const line of lines) {
                                parseLine(line);
                            }

                            read();
                        } catch (error) {
                            subscriber.error(error);
                        }
                    }

                    function parseLine(line: string) {
                        if (!line.trim()) return;
                        try {
                            const data: PromptResponseStreamDto = JSON.parse(line);
                            if (data.response) {
                                subscriber.next(data.response);
                            }
                        } catch (e) {
                            console.error('Error parsing JSON line:', e, line);
                        }
                    }

                    read();
                })
                .catch(error => {
                    subscriber.error(error);
                });

            return () => {
                // Cleanup if unsubscribed
            };
        });
    }
}
